import { useState, MouseEvent, TouchEvent } from 'react';
import { Region, Province, Party } from '../types';
import { regions } from '../data/regions';
import { Landmark, MapPin, Users, Award, Info, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import TurkeyMapComponent from 'react-turkey-map';

interface TurkeyMapProps {
  provinces: Province[];
  parties: Party[];
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string | null) => void;
  selectedProvinceId: number | null;
  onSelectProvince: (provId: number | null) => void;
  electionMode?: boolean; // If true, colors provinces based on actual winner, otherwise displays target campaigns
  pollExpiryWeek?: number;
  currentWeek?: number;
  onBuyPoll?: () => void;
}

export default function TurkeyMap({
  provinces,
  parties,
  selectedRegionId,
  onSelectRegion,
  selectedProvinceId,
  onSelectProvince,
  electionMode = false,
  pollExpiryWeek = 0,
  currentWeek = 1,
  onBuyPoll
}: TurkeyMapProps) {
  const [hoveredPlate, setHoveredPlate] = useState<string | null>(null);

  // Helper: Get leading party inside a single province
  const getProvinceWinner = (prov: Province) => {
    let topParty = '';
    let maxPct = -1;
    Object.entries(prov.votes).forEach(([party, pct]) => {
      if (pct > maxPct) {
        maxPct = pct;
        topParty = party;
      }
    });
    return parties.find(p => p.shortName === topParty) || null;
  };

  // Helper: Get leading party in a region
  const getRegionWinner = (regionId: string) => {
    const regionProvinces = provinces.filter(p => p.regionId === regionId);
    if (regionProvinces.length === 0) return null;

    const aggregates: Record<string, number> = {};
    parties.forEach(p => { aggregates[p.shortName] = 0; });

    regionProvinces.forEach(prov => {
      const totalVotesInProv = prov.voterCount;
      Object.entries(prov.votes).forEach(([partyName, pct]) => {
        if (aggregates[partyName] !== undefined) {
          aggregates[partyName] += (pct / 100) * totalVotesInProv;
        }
      });
    });

    let topParty = '';
    let maxVotes = -1;
    Object.entries(aggregates).forEach(([party, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        topParty = party;
      }
    });

    return parties.find(p => p.shortName === topParty) || null;
  };

  const hasActivePoll = electionMode || (pollExpiryWeek !== undefined && currentWeek < pollExpiryWeek);

  // Build reactive colorData and tooltipData dynamically for all 81 provinces
  const colorData: Record<string, string> = {};
  const tooltipData: Record<string, string> = {};
  const playerParty = parties.find(p => p.isPlayer);

  provinces.forEach(prov => {
    const plateStr = String(prov.id).padStart(2, '0');

    if (!hasActivePoll) {
      // Gray/dark slate fog of war
      colorData[plateStr] = '#1e293b';
      tooltipData[plateStr] = `${prov.name} - Detay için anket satın alınmalıdır`;
    } else {
      const winnerParty = getProvinceWinner(prov);
      const playerVotes = playerParty ? (prov.votes[playerParty.shortName] || 0) : 0;
      const winnerVotes = winnerParty ? (prov.votes[winnerParty.shortName] || 0) : 0;

      // Color by leading party's color
      colorData[plateStr] = winnerParty ? winnerParty.color : '#475569';

      // Highlight selected province with a bright gold stroke/color if applicable
      if (selectedProvinceId === prov.id) {
        colorData[plateStr] = winnerParty ? winnerParty.color : '#eab308';
      }

      if (winnerParty) {
        if (winnerParty.isPlayer) {
          tooltipData[plateStr] = `Kazandığınız İl (%${winnerVotes.toFixed(1)})`;
        } else {
          tooltipData[plateStr] = `Lider: ${winnerParty.shortName} (%${winnerVotes.toFixed(1)}) | Sizin: %${playerVotes.toFixed(1)}`;
        }
      } else {
        tooltipData[plateStr] = `Sizin Desteğiniz: %${playerVotes.toFixed(1)}`;
      }
    }
  });

  // Handle click or touch on map container using event bubbling
  const handleMapInteraction = (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement;
    if (target && target.tagName?.toLowerCase() === 'path') {
      const parent = target.parentNode as SVGElement;
      if (parent) {
        const plate = parent.getAttribute('data-plate');
        if (plate) {
          const plateId = parseInt(plate, 10);
          const foundProvince = provinces.find(p => p.id === plateId);
          if (foundProvince) {
            event.preventDefault();
            event.stopPropagation();
            playSound.playClick();
            onSelectProvince(foundProvince.id);
            onSelectRegion(foundProvince.regionId);
          }
        }
      }
    }
  };

  // Province details for highlighting
  const currentSelectedProvinceObj = provinces.find(p => p.id === selectedProvinceId);
  const selectedProvinceWinner = currentSelectedProvinceObj ? getProvinceWinner(currentSelectedProvinceObj) : null;

  const currentRegionObj = selectedRegionId ? regions.find(r => r.id === selectedRegionId) : null;
  const currentRegionWinner = selectedRegionId ? getRegionWinner(selectedRegionId) : null;

  // Render detailed region provinces
  const filteredProvinces = selectedRegionId
    ? provinces.filter(p => p.regionId === selectedRegionId)
    : [];

  const sortedProvinces = [...filteredProvinces].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-500 animate-pulse" />
            Türkiye Siyasi Haritası (81 İl)
          </h2>
          <p className="text-slate-400 text-xs">
            {electionMode 
              ? 'Seçim sandığı sonuçları. İl bazında kazanan partiye göre renklendirilmiştir.'
              : 'Detaylı 81 il analiz paneli. İstediğiniz ile veya bölgeye tıklayarak detay ve seçim kampanyası kurgulayın.'}
          </p>
        </div>
        {(selectedRegionId || selectedProvinceId) && (
          <button
            onClick={() => {
              onSelectRegion(null);
              onSelectProvince(null);
            }}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:text-white rounded-lg transition-all cursor-pointer font-bold"
          >
            Tüm Türkiye'yi Göster
          </button>
        )}
      </div>

      {/* Dynamic Survey Status Indicator */}
      {!hasActivePoll && !electionMode ? (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/10 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/35 text-indigo-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">KAMUOYU GÖZLEMİ KAPALI</span>
            <h3 className="text-xs font-extrabold text-slate-100 mt-1">81 İl Seçmen Eğilimleri & Detaylı Anket Raporu Yok</h3>
            <p className="text-slate-400 text-[10px] max-w-xl">
              İllerin oy dağılımını, demografik ittifak bağlarını ve rakiplerinizin güncel güç dengelerini analiz etmek için profesyonel bir kamuoyu araştırması satın almalısınız. Satın alınan anket 2 hafta boyunca haritayı güncel verilerle görünür kılar.
            </p>
          </div>
          {onBuyPoll && (
            <button
              onClick={() => { playSound.playClick(); onBuyPoll(); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-lg border border-indigo-500 active:scale-97 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              📊 Anket Satın Al (150.000 ₺)
            </button>
          )}
        </div>
      ) : (
        !electionMode && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Seçim Anketi Aktif: Güncel 81 il oy verileri ve demografik analizler listeleniyor.</span>
            </div>
            {pollExpiryWeek < 90 && (
              <span className="text-[9px] text-slate-450 uppercase font-mono bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
                Geçerlilik: Hafta {pollExpiryWeek - 1} Sonu
              </span>
            )}
          </div>
        )
      )}

      {/* SVG Interactive Map Wrapper with custom inline css override injects */}
      <div 
        className="relative w-full turkey-interactive-map-container overflow-hidden bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex justify-center items-center shadow-inner"
        onClick={handleMapInteraction}
        onTouchStart={handleMapInteraction}
      >
        <style>{`
          .turkey-interactive-map-container svg {
            width: 100% !important;
            height: auto !important;
            max-height: 480px;
            user-select: none;
            overflow: visible;
          }
          .turkey-interactive-map-container svg path {
            stroke: #090d16 !important;
            stroke-width: 1.5px !important;
            stroke-linejoin: round !important;
            stroke-linecap: round !important;
            shape-rendering: geometricPrecision !important;
            vector-effect: non-scaling-stroke !important;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            cursor: pointer;
          }
          .turkey-interactive-map-container svg path:hover {
            filter: brightness(1.2) saturate(1.1) drop-shadow(0 0 6px rgba(255,255,255,0.4)) !important;
            stroke: #ffffff !important;
            stroke-width: 2px !important;
            z-index: 50 !important;
          }
        `}</style>
        <div className="w-full">
          <TurkeyMapComponent
            colorData={colorData}
            tooltipData={tooltipData}
            showTooltip={true}
          />
        </div>

        {/* Selected Highlight Overlay */}
        {currentSelectedProvinceObj && (
          <div className="hidden md:block absolute top-4 left-4 bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 text-xs w-60 pointer-events-none backdrop-blur shadow-2xl animate-fade-in space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h4 className="font-bold text-indigo-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {currentSelectedProvinceObj.name} ({String(currentSelectedProvinceObj.id).padStart(2, '0')})
              </h4>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                {currentRegionObj?.name || 'Bölge'}
              </span>
            </div>
            {hasActivePoll ? (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-550">Kayıtlı Seçmen:</span>
                  <span className="font-semibold text-slate-300">
                    {currentSelectedProvinceObj.voterCount.toLocaleString('tr-TR')}
                  </span>
                </div>
                {selectedProvinceWinner && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-550">Galip Güç:</span>
                    <span className="font-bold px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${selectedProvinceWinner.color}20`, color: selectedProvinceWinner.color }}>
                      {selectedProvinceWinner.shortName} (%{(currentSelectedProvinceObj.votes[selectedProvinceWinner.shortName] || 0).toFixed(1)})
                    </span>
                  </div>
                )}
                {playerParty && (
                  <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5">
                    <span className="text-slate-550">Sizin Desteğiniz:</span>
                    <span className="font-bold text-slate-200" style={{ color: playerParty.color }}>
                      %{(currentSelectedProvinceObj.votes[playerParty.shortName] || 0).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-indigo-300 font-medium py-1.5 leading-relaxed">
                ℹ️ Gerçek oy verilerini görebilmek için aktif seçim anketiniz bulunmalıdır.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Province Details & Localized PR Console */}
      {currentSelectedProvinceObj ? (
        <div className="space-y-4 animate-fade-in bg-slate-950/20 border border-slate-850 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-2.5">
            <div>
              <div className="text-slate-450 text-[10px] font-bold uppercase tracking-widest">Seçilen İl Odak Noktası</div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                {currentSelectedProvinceObj.name} Seçmen Analiz Raporu
              </h3>
            </div>
          </div>

          {hasActivePoll ? (
            <>
              <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-400">Demografik Yapı: muhafazakar %{Math.round(currentSelectedProvinceObj.demographics.muhafazakar * 100)}, milliyetçi %{Math.round(currentSelectedProvinceObj.demographics.milliyetci * 100)}, sosyal Demokrat %{Math.round(currentSelectedProvinceObj.demographics.sosyalDemokrat * 105)}, liberal %{Math.round(currentSelectedProvinceObj.demographics.liberal * 100)}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {Object.entries(currentSelectedProvinceObj.votes)
                  .sort((a, b) => b[1] - a[1])
                  .map(([shortName, pct]) => {
                    const party = parties.find(p => p.shortName === shortName);
                    if (!party) return null;
                    const isPlayer = party.isPlayer;

                    return (
                      <div key={shortName} className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs truncate max-w-[80px]" style={{ color: party.color }}>{shortName}</span>
                          {isPlayer && <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-1 rounded">Siz</span>}
                        </div>
                        <div className="text-lg font-black mt-1 text-slate-100">%{pct.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{party.leader}</div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="py-4 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/10">
              <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                🔒 Bu ildeki detaylı oy dengeleri ve partilerin karşılıklı üstünlükleri gizlenmiştir. <strong>Seçim Anketi</strong> satın alarak verileri açabilirsiniz.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Selected Region Details */}
      {selectedRegionId && currentRegionObj ? (
        <div className="space-y-4 animate-fade-in border-t border-slate-800 pt-5">
          <div className="flex items-center justify-between bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-200">{currentRegionObj.name} Bölgesi ({sortedProvinces.length} İl)</h3>
                <p className="text-[11px] text-slate-500">Miting düzenlemek oyları bölge genelinde kalıcı olarak etkiler</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-slate-500">Bölge Genel Seçmeni</div>
              <div className="font-extrabold text-slate-300 flex items-center gap-1 mt-0.5 justify-end">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                {provinces.filter(p => p.regionId === selectedRegionId).reduce((acc, curr) => acc + curr.voterCount, 0).toLocaleString('tr-TR')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollable-content">
            {sortedProvinces.map((prov) => {
              const winner = getProvinceWinner(prov);
              const playerVotes = prov.votes[parties.find(p => p.isPlayer)?.shortName || ''] || 0;
              const isSelected = selectedProvinceId === prov.id;

              return (
                <div
                  key={prov.id}
                  onClick={() => onSelectProvince(prov.id)}
                  className={`border rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-650/10' 
                      : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-450 px-1.5 py-0.5 rounded mr-1.5">
                        {String(prov.id).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{prov.name}</span>
                    </div>
                    {winner && (
                      <span
                        className="text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: `${winner.color}15`, color: winner.color }}
                      >
                        {winner.shortName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-2.5 pt-2 border-t border-slate-900/60">
                    <div className="text-[11px] flex justify-between text-slate-400">
                      <span>Lider ({hasActivePoll ? winner?.shortName : '🔒'}):</span>
                      <span className="font-bold text-slate-200">
                        {hasActivePoll ? `%${prov.votes[winner?.shortName || '']?.toFixed(1) || '0.0'}` : '🔒 %--'}
                      </span>
                    </div>

                    <div className="text-[11px] flex justify-between text-slate-400">
                      <span>Partiniz:</span>
                      <span
                        className="font-bold"
                        style={{ color: parties.find(p => p.isPlayer)?.color }}
                      >
                        {hasActivePoll ? `%${playerVotes.toFixed(1)}` : '🔒 %--'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/20 p-4 border border-slate-850 rounded-xl text-center">
          <div className="p-2 border-r border-slate-850/60 last:border-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Toplam Seçmen Sayısı</span>
            <span className="text-sm font-black mt-1 block tracking-wider">54.345.120</span>
          </div>
          <div className="p-2 border-r border-slate-850/60 last:border-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ülke Seçim Barajı</span>
            <span className="text-xs font-extrabold text-indigo-400 mt-1 block flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> %7.0 Barajı
            </span>
          </div>
          <div className="p-2 border-r border-slate-850/60 last:border-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Seçim Gündemi</span>
            <span className="text-xs font-bold text-amber-500 mt-1 block truncate">Enflasyon & Geçim Sıkıntısı</span>
          </div>
          <div className="p-2 last:border-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ana Karargah</span>
            <span className="text-sm font-bold text-teal-400 mt-1 block">TBMM Ankara</span>
          </div>
        </div>
      )}
    </div>
  );
}
