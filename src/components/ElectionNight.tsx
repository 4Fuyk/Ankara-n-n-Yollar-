import { useState, useEffect } from 'react';
import { Party, Province } from '../types';
import TurkeyMap from './TurkeyMap';
import { Play, Sparkles, Award, RefreshCw, BarChart3, HelpCircle, Trophy } from 'lucide-react';

interface ElectionNightProps {
  parties: Party[];
  provinces: Province[];
  onRestart: () => void;
}

export default function ElectionNight({ parties, provinces, onRestart }: ElectionNightProps) {
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [countingActive, setCountingActive] = useState(false);
  const [simulatedVotes, setSimulatedVotes] = useState<Record<string, number>>({});
  const [winnerProvinceMap, setWinnerProvinceMap] = useState<Record<number, string>>({});
  const [seatAllocation, setSeatAllocation] = useState<Record<string, number>>({});
  const [breakingNews, setBreakingNews] = useState<string>('Yüksek Seçim Kurulu (YSK) yayın yasağını henüz kaldırmadı.');

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);

  const playerParty = parties.find(p => p.isPlayer);

  // Initialize simulated votes on mount
  useEffect(() => {
    // Generate initial votes with a bit of random variance for election night suspense
    const initialVotes: Record<string, number> = {};
    parties.forEach(p => {
      // Small jitter around current national support
      const variance = (Math.random() * 2) - 1; // -1% to +1%
      initialVotes[p.shortName] = Math.max(0.1, p.support + variance);
    });

    // Normalize
    const total = Object.values(initialVotes).reduce((a, b) => a + b, 0);
    Object.keys(initialVotes).forEach(k => {
      initialVotes[k] = (initialVotes[k] / total) * 100;
    });

    setSimulatedVotes(initialVotes);

    // Calculate province winners
    const provinceWinners: Record<number, string> = {};
    provinces.forEach(prov => {
      let topParty = '';
      let maxVotes = -1;
      Object.entries(prov.votes).forEach(([partyName, pct]) => {
        if (pct > maxVotes) {
          maxVotes = pct;
          topParty = partyName;
        }
      });
      provinceWinners[prov.id] = topParty;
    });
    setWinnerProvinceMap(provinceWinners);

    // Calculate Seats (600 seats total in TBMM, with 7% threshold)
    const activeParties = parties.filter(p => initialVotes[p.shortName] >= 7);
    const seatRatioSum = activeParties.reduce((acc, curr) => acc + initialVotes[curr.shortName], 0);

    const seats: Record<string, number> = {};
    let allocatedSeats = 0;

    activeParties.forEach(p => {
      const shareOfOverThreshold = initialVotes[p.shortName] / seatRatioSum;
      const calculatedSeats = Math.floor(shareOfOverThreshold * 600);
      seats[p.shortName] = calculatedSeats;
      allocatedSeats += calculatedSeats;
    });

    // Distribute remaining fractional seats to the largest party
    if (allocatedSeats < 600 && activeParties.length > 0) {
      const sortedByVotes = [...activeParties].sort((a, b) => initialVotes[b.shortName] - initialVotes[a.shortName]);
      seats[sortedByVotes[0].shortName] += (600 - allocatedSeats);
    }

    setSeatAllocation(seats);
  }, [parties, provinces]);

  // Handle Sandık Açılma loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countingActive && progress < 100) {
      timer = setTimeout(() => {
        setProgress(p => {
          const next = p + Math.floor(Math.random() * 8) + 1;
          const clamped = Math.min(100, next);

          // Update breaking news dynamically based on progress
          if (clamped >= 10 && clamped < 30) {
            setBreakingNews('İlk sandık sonuçları geliyor! Doğu Anadolu ve İç Anadolu sandıkları hızla sisteme aktarılıyor.');
          } else if (clamped >= 30 && clamped < 60) {
            setBreakingNews('Büyükşehirlerde yarış kafa kafaya! İstanbul ve Ankara sandıkları açıldıkça tablo şekilleniyor.');
          } else if (clamped >= 60 && clamped < 85) {
            setBreakingNews('Açılan sandık oranı %75’i geçti. Çoğu ilde kazanan bloklar kesinleşmeye başladı.');
          } else if (clamped >= 85 && clamped < 100) {
            setBreakingNews('Nefesler tutuldu! Sandıkların %90’ından fazlası açıldı, zafer turları için açıklamalar bekleniyor.');
          } else if (clamped === 100) {
            setBreakingNews('VE SEÇİMLER TANAMLANDI! YSK kesin olmayan sonuçları açıkladı.');
          }

          return clamped;
        });
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [countingActive, progress]);

  // Find overall winner
  const getTopParty = () => {
    let topName = '';
    let max = -1;
    Object.entries(simulatedVotes).forEach(([name, votes]) => {
      const voteVal = votes as number;
      if (voteVal > max) {
        max = voteVal;
        topName = name;
      }
    });
    return parties.find(p => p.shortName === topName);
  };

  const isPlayerWinner = getTopParty()?.isPlayer || false;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-7 space-y-6 text-slate-100 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center relative py-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 bg-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse mb-2.5">
          <span>● SEÇİM GECESİ CANLI YAYINI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Türkiye Genel Seçim Sonuçları</h1>
        <p className="text-slate-400 text-xs mt-1">
          Nefesler tutuldu, 81 ilde sandıklar açılıyor ve milli irade tecelli ediyor.
        </p>
      </div>

      {/* Stats Board & Live counting ticker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Yayın Durumu / Son Gelişme</span>
            <p className="text-sm font-semibold text-amber-400 mt-1 leading-relaxed bg-amber-500/5 p-3 border-l-2 border-amber-500 rounded">
              "{breakingNews}"
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-end text-xs font-bold text-slate-400">
              <span>AÇILAN SANDIK ORANI</span>
              <span className="text-xl text-slate-200 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Start button or Status */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
          {!countingActive && progress === 0 ? (
            <>
              <div className="p-3 bg-rose-600/10 rounded-full text-rose-500 animate-bounce">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400">Sandık sayımını başlatmak ve oyları canlı görmek için tıklayın.</p>
              <button
                onClick={() => setCountingActive(true)}
                className="w-full py-2.5 px-4 font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white rounded-lg active:scale-95 transition-all shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Sayımı Başlat
              </button>
            </>
          ) : progress < 100 ? (
            <>
              <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-xs font-bold text-slate-400">YSK VERİLERİ ÇEKİLİYOR...</span>
              <span className="text-[10px] text-slate-500">Oy sayımı devam ediyor, lütfen bekleyin</span>
            </>
          ) : (
            <>
              {isPlayerWinner ? (
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full">
                  <Trophy className="w-7 h-7" />
                </div>
              ) : (
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full">
                  <Award className="w-7 h-7" />
                </div>
              )}
              <h3 className="font-extrabold text-sm">{isPlayerWinner ? 'Tebrikler, Kazandınız!' : 'Milletin İradesi Belirlendi'}</h3>
              <p className="text-[11px] text-slate-400">
                {isPlayerWinner 
                  ? 'Partinizi en yüksek oy oranına ulaştırarak tarihi bir başarı elde ettiniz!'
                  : 'Seçim yarışını tamamladınız. Sandıktan çıkan sese saygı duyarak mücadeleye devam.'}
              </p>
              <button
                onClick={onRestart}
                className="w-full py-2 bg-slate-800 hover:bg-slate-705 border border-slate-700 font-bold text-xs uppercase rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Yeni Simülasyon
              </button>
            </>
          )}
        </div>
      </div>

      {/* Map Segment (Will only render dynamic winner colors when progress > 0) */}
      <TurkeyMap
        provinces={provinces}
        parties={parties}
        selectedRegionId={null}
        onSelectRegion={() => {}}
        selectedProvinceId={selectedProvinceId}
        onSelectProvince={setSelectedProvinceId}
        electionMode={progress > 10}
      />

      {/* Live Ballots Standings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Votes Breakdown */}
        <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 mb-3">
            Genel Seçim Oy Oranları
          </h3>
          <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1 scrollable-content">
            {parties
              .map(p => ({
                ...p,
                liveVote: progress === 0 ? 0 : (simulatedVotes[p.shortName] * (progress / 100))
              }))
              .sort((a, b) => b.liveVote - a.liveVote)
              .map((party) => {
                const finalVotePct = simulatedVotes[party.shortName] || 0;
                const livePct = progress === 0 ? 0 : (finalVotePct * (progress / 100));

                return (
                  <div key={party.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                        <span className={`font-bold ${party.isPlayer ? 'text-amber-400' : 'text-slate-300'}`}>
                          {party.shortName} <span className="text-[10px] font-normal text-slate-500">({party.leader})</span>
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-200">%{livePct.toFixed(1)}</span>
                    </div>
                    {/* Progress Bar bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress === 0 ? 0 : finalVotePct}%`,
                          backgroundColor: party.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Parliamentary TBMM Seats */}
        <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 mb-3">
              Milletvekili Dağılımı (TBMM 600 Koltuk)
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              *Seçim kanunu gereği %7 ülke barajını aşabilen partiler temsil hakkı kazanır. Çoğunluk sınırı 300 sandalyedir.
            </p>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollable-content">
              {parties
                .map(p => ({
                  ...p,
                  seats: seatAllocation[p.shortName] || 0
                }))
                .sort((a, b) => b.seats - a.seats)
                .map((party) => {
                  const finalSeatsCount = progress === 100 ? party.seats : Math.floor(party.seats * (progress / 100));
                  const isThresholdPassed = (simulatedVotes[party.shortName] || 0) >= 7;

                  return (
                    <div key={party.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900 last:border-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                        <span className={`font-medium ${party.isPlayer ? 'text-amber-400' : 'text-slate-300'}`}>
                          {party.shortName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {!isThresholdPassed && (
                          <span className="text-[9px] bg-red-500/10 text-red-400 px-1 py-0.2 rounded">Baraj Altı</span>
                        )}
                        <span className="font-mono font-bold text-sm text-slate-100">{finalSeatsCount} vekil</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {progress === 100 && (
            <div className="border-t border-slate-850 pt-3 mt-4 text-center">
              <p className="text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-850 py-2 px-3 rounded-lg flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                {isPlayerWinner 
                  ? 'Şanlı Gecenin Galibi Siz Oldunuz! Hükümeti kurma göreviniz tescillendi.'
                  : 'Cumhuriyet Siyasi Hayatı Yeni Bir Döneme Kapılarını Araladı.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
