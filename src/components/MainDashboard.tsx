import { useState } from 'react';
import { Party, Province, PoliticalEvent, GameLog, Region, Alliance } from '../types';
import TurkeyMap from './TurkeyMap';
import DiplomacyPanel from './DiplomacyPanel';
import LeaderChat from './LeaderChat';
import { regions } from '../data/regions';
import { playSound } from '../utils/audio';
import {
  Megaphone,
  Radio,
  Tv,
  Coins,
  ChevronRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Landmark,
  BadgeAlert,
  FolderDot,
  Coffee,
  Volume2,
  VolumeX,
  Award,
  Save,
  MessageSquare
} from 'lucide-react';

interface MainDashboardProps {
  parties: Party[];
  provinces: Province[];
  alliances: Alliance[];
  weeksRemaining: number;
  currentEvent: PoliticalEvent | null;
  logs: GameLog[];
  onNextWeek: () => void;
  onSelectRegion: (regionId: string | null) => void;
  selectedRegionId: string | null;
  onCampaignAction: (actionType: 'MITING' | 'REKLAM' | 'TV' | 'BAGIS' | 'CAY' | 'KURULTAY', targetRegionId?: string) => void;
  onResolveEvent: (choiceIndex: number) => void;
  onSatas: (tagParty: string) => void;
  onOfferAlliance: (tagParty: string) => void;
  onBreakAlliance: (allianceId: string) => void;
  onGoToElection: () => void;
  onOpenSaveLoad?: () => void;
  pollExpiryWeek: number;
  currentWeek: number;
  onBuyPoll: () => void;
  kulisChats: string[];
  chatHistories: Record<string, { sender: string; text: string; week: number }[]>;
  onUpdateState: (updater: (prev: any) => any) => void;
}

export default function MainDashboard({
  parties,
  provinces,
  alliances,
  weeksRemaining,
  currentEvent,
  logs,
  onNextWeek,
  onSelectRegion,
  selectedRegionId,
  onCampaignAction,
  onResolveEvent,
  onSatas,
  onOfferAlliance,
  onBreakAlliance,
  onGoToElection,
  onOpenSaveLoad,
  pollExpiryWeek,
  currentWeek,
  onBuyPoll,
  kulisChats,
  chatHistories,
  onUpdateState
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<'MAP' | 'DIPLOMACY' | 'CHAT' | 'HISTORY'>('MAP');
  const [showRallyModal, setShowRallyModal] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(playSound.enabled);

  const playerParty = parties.find(p => p.isPlayer);
  if (!playerParty) return null;

  const playerAlliance = alliances.find(a => a.isPlayerAlliance);

  // Helper cost checks
  const RALLY_COST = 500000;
  const AD_COST = 250000;
  const TV_COST = 150000;
  const CAY_COST = 15000;
  const CONGRESS_COST = 1000000;

  const toggleSound = () => {
    playSound.enabled = !playSound.enabled;
    setSoundEnabled(playSound.enabled);
    playSound.playClick();
  };

  const handleRallyClick = () => {
    if (playerParty.budget < RALLY_COST) {
      alert(`Miting düzenlemek için bütçeniz yetersiz! (Gereken: ${RALLY_COST.toLocaleString('tr-TR')} ₺)`);
      return;
    }
    setShowRallyModal(true);
  };

  const executeRally = (regionId: string) => {
    onCampaignAction('MITING', regionId);
    setShowRallyModal(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-slate-100 animate-fade-in">
      {/* 1. Header Stats Panel */}
      <header className="bg-slate-900 border border-slate-850 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div
            className="w-4 h-14 rounded-full"
            style={{ backgroundColor: playerParty.color }}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-100 tracking-tight">{playerParty.name}</h1>
              <span className="text-xs bg-slate-800 text-slate-400 font-extrabold px-2 py-0.5 rounded tracking-wider">
                {playerParty.shortName}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${playerParty.color}15`, color: playerParty.color }}
              >
                {playerParty.ideology}
              </span>
              
              {/* Grand Synthesized Sound control toggle */}
              <button
                onClick={toggleSound}
                className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer select-none ml-2"
                title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Ses Açık</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[9px] uppercase font-bold tracking-wider text-rose-500">Sessiz</span>
                  </>
                )}
              </button>

              {/* Game Save/Load state trigger button */}
              {onOpenSaveLoad && (
                <button
                  onClick={() => { playSound.playClick(); onOpenSaveLoad(); }}
                  className="flex items-center gap-1.5 p-1 px-2.5 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-400 hover:text-indigo-200 rounded-lg border border-indigo-900/30 hover:border-indigo-700/50 transition-all cursor-pointer select-none ml-2"
                  title="Oyunu Kaydet / Yükle"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase font-bold tracking-wider">KAYDET/YÜKLE</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lider: <strong className="text-slate-200">{playerParty.leader}</strong> 
              <span className="text-slate-500 ml-1.5 text-[10px] bg-slate-800/80 px-1 py-0.5 rounded border border-slate-700/50">Görevde: {playerParty.tenureYears || 1} Yıl</span>
            </p>
          </div>
        </div>

        {/* Dynamic Realtime Counters */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-slate-950/60 border border-slate-850 p-2.5 sm:p-3 rounded-xl block text-center">
            <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Kasa / Bütçe</span>
            <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
              {playerParty.budget.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-850 p-2.5 sm:p-3 rounded-xl block text-center">
            <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Mevcut Oy</span>
            <span className="text-sm font-extrabold text-blue-400 mt-0.5 block flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> %{playerParty.support.toFixed(1)}
            </span>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/25 p-2.5 sm:p-3 rounded-xl block text-center relative">
            <span className="block text-[9px] text-rose-400 uppercase font-bold tracking-wider animate-pulse">Kalan Süre</span>
            <span className="text-sm font-black text-slate-105 mt-0.5 block">
              {weeksRemaining} Hafta
            </span>
          </div>
        </div>
      </header>

      {/* 2. Critical Action Console */}
      <section className="bg-slate-900 border border-slate-850 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Siyasi Kampanya İcra Komitesi
          </h3>
          <span className="text-[10px] text-slate-500 italic">Eğilimleri lehinize çevirmek için bütçe kullanın</span>
        </div>

        {/* Action Grid buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <button
            onClick={handleRallyClick}
            disabled={currentEvent !== null}
            className="group flex flex-col items-center justify-center p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Megaphone className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-200 mt-2">Bölgesel Miting</span>
            <span className="text-[10px] text-rose-400 font-mono mt-1">-{RALLY_COST.toLocaleString('tr-TR')} ₺</span>
          </button>

          <button
            onClick={() => onCampaignAction('REKLAM')}
            disabled={currentEvent !== null || playerParty.budget < AD_COST}
            className="group flex flex-col items-center justify-center p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Radio className="w-5 h-5 text-indigo-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-200 mt-2">Medya Reklamı</span>
            <span className="text-[10px] text-rose-400 font-mono mt-1">-{AD_COST.toLocaleString('tr-TR')} ₺</span>
          </button>

          <button
            onClick={() => onCampaignAction('TV')}
            disabled={currentEvent !== null || playerParty.budget < TV_COST}
            className="group flex flex-col items-center justify-center p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Tv className="w-5 h-5 text-pink-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-200 mt-2">Canlı TV Programı</span>
            <span className="text-[10px] text-rose-400 font-mono mt-1">-{TV_COST.toLocaleString('tr-TR')} ₺</span>
          </button>

          <button
            onClick={() => onCampaignAction('CAY')}
            disabled={currentEvent !== null || playerParty.budget < CAY_COST}
            className="group flex flex-col items-center justify-center p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] border-amber-500/20 hover:border-amber-500/50"
          >
            <Coffee className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform group-hover:animate-bounce-slow" />
            <span className="text-xs font-bold text-slate-200 mt-2">Halkla Çay</span>
            <span className="text-[10px] text-amber-400 font-mono mt-1">-{CAY_COST.toLocaleString('tr-TR')} ₺</span>
          </button>

          <button
            onClick={() => onCampaignAction('BAGIS')}
            disabled={currentEvent !== null}
            className="group flex flex-col items-center justify-center p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Coins className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-200 mt-2">Bağış Girişimi</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">+300.000 ₺</span>
          </button>

          <button
            onClick={() => onCampaignAction('KURULTAY')}
            disabled={currentEvent !== null || playerParty.budget < CONGRESS_COST}
            className="group flex flex-col items-center justify-center p-3 bg-slate-955/50 hover:bg-slate-950 border border-slate-850 hover:border-indigo-700/60 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] border-indigo-500/20 hover:border-indigo-500/50"
          >
            <Award className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform group-hover:animate-pulse" />
            <span className="text-xs font-bold text-slate-200 mt-2">Büyük Kurultay</span>
            <span className="text-[10px] text-indigo-400 font-mono mt-1">-{CONGRESS_COST.toLocaleString('tr-TR')} ₺</span>
          </button>
        </div>
      </section>

      {/* 3. CENTER STAGE - DYNAMIC EVENTS CRISIS BOARD */}
      {currentEvent && (
        <section className="bg-slate-950 border-2 border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden animate-pulse-slow">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 bg-rose-600 px-3 py-1 rounded-br-lg text-[10px] font-black uppercase tracking-wider text-white">
            SON DAKİKA GELİŞMESİ
          </div>

          <div className="space-y-4 pt-3.5">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <BadgeAlert className="text-rose-500 w-6 h-6 shrink-0" />
              {currentEvent.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 border border-slate-850/70 rounded-xl">
              {currentEvent.description}
            </p>

            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nasıl Bir Siyasi Yol İzleyeceksiniz?</p>
              <div className="flex flex-col gap-2">
                {currentEvent.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => onResolveEvent(idx)}
                    className="w-full text-left p-3.5 text-xs sm:text-sm bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 text-blue-400" /> {choice.text}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium pl-6">{choice.effectText}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. MAIN INTERACTIVE SPLIT: Map & Statistics / Diplomacy / Game Activity Log */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Big Columns (Switchable tabs: Map, Diplomacy, History, Chat) */}
        <div className={`${activeTab === 'CHAT' ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
          <div className="flex border-b border-slate-800 gap-1 bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`flex-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'MAP' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Türkiye Haritası
            </button>
            <button
              onClick={() => setActiveTab('DIPLOMACY')}
              className={`flex-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'DIPLOMACY' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diplomasi Entegrasyonu
            </button>
            <button
              onClick={() => setActiveTab('CHAT')}
              className={`flex-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'CHAT' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Özel Görüşme / Sohbet
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`flex-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'HISTORY' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Haberler ({logs.length})
            </button>
          </div>

          <div className="outline-none">
            {activeTab === 'MAP' && (
              <TurkeyMap
                provinces={provinces}
                parties={parties}
                selectedRegionId={selectedRegionId}
                onSelectRegion={onSelectRegion}
                selectedProvinceId={selectedProvinceId}
                onSelectProvince={setSelectedProvinceId}
                pollExpiryWeek={pollExpiryWeek}
                currentWeek={currentWeek}
                onBuyPoll={onBuyPoll}
              />
            )}

            {activeTab === 'DIPLOMACY' && (
              <DiplomacyPanel
                parties={parties}
                alliances={alliances}
                onSatas={onSatas}
                onOfferAlliance={onOfferAlliance}
                onBreakAlliance={onBreakAlliance}
              />
            )}

            {activeTab === 'CHAT' && (
              <LeaderChat
                parties={parties}
                alliances={alliances}
                currentWeek={currentWeek}
                kulisChats={kulisChats}
                chatHistories={chatHistories}
                onSatas={onSatas}
                onOfferAlliance={onOfferAlliance}
                onUpdateState={onUpdateState}
              />
            )}

            {activeTab === 'HISTORY' && (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Haftalık Siyasi Gelişmeler Günlüğü</h3>
                    <p className="text-[11px] text-slate-500">Seçim kampanyanız süresince gerçekleşen hamleler ve olaylar</p>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollable-content">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-600 italic">Henüz bir siyasi kayıt girilmedi.</div>
                  ) : (
                    [...logs]
                      .reverse()
                      .map((log, index) => {
                        let logClass = 'bg-slate-950/30 border-slate-900 text-slate-300';
                        if (log.type === 'success') logClass = 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300';
                        if (log.type === 'warning') logClass = 'bg-amber-500/5 border-amber-500/10 text-amber-300';
                        if (log.type === 'error') logClass = 'bg-rose-500/5 border-rose-500/10 text-rose-300';

                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-xl text-xs space-y-0.5 flex items-start gap-2.5 leading-relaxed ${logClass}`}
                          >
                            <span className="font-mono bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider shrink-0 mt-0.5">
                              H.{(log.week)}
                            </span>
                            <span className="font-medium">{log.message}</span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column (Realtime Poll / Standings & Weeks Actions) - HIDE IF IN CHAT TAB to let chat expand full width */}
        {activeTab !== 'CHAT' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center justify-between">
                <span>Güncel Seçmen Anketi (Genel Destek)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">YSK Simulasyonu</span>
              </h3>

              <div className="space-y-3">
                {parties
                  .sort((a, b) => b.support - a.support)
                  .map((party) => {
                    const isPlayerInAlliance = playerAlliance?.parties.includes(party.id) || false;

                    return (
                      <div key={party.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: party.color }} />
                            <span className={`font-bold ${party.isPlayer ? 'text-amber-400' : 'text-slate-300'}`}>
                              {party.shortName}
                            </span>
                            {party.isPlayer && (
                              <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 py-0.2 rounded font-extrabold shadow-sm">
                                Siz
                              </span>
                            )}
                            {!party.isPlayer && isPlayerInAlliance && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-black uppercase">Müttefik</span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-slate-200">%{party.support.toFixed(1)}</span>
                        </div>
                        {/* Sub text */}
                        <div className="text-[10px] text-slate-500 pl-4 flex items-center gap-1.5 justify-between w-full">
                          <span>{party.leader}</span>
                          <span className="text-[9px] text-slate-600 font-medium">({party.tenureYears || 1} yıl)</span>
                        </div>
                        {/* Bar indicator */}
                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${party.support}%`,
                              backgroundColor: party.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Turn action button */}
              <div className="pt-2 border-t border-slate-850">
                {weeksRemaining > 0 ? (
                  <button
                    disabled={currentEvent !== null}
                    onClick={onNextWeek}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 enabled:active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20"
                  >
                    Sonraki Haftaya Geç ⏭
                  </button>
                ) : (
                  <button
                    onClick={onGoToElection}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 animate-pulse"
                  >
                    <Landmark className="w-4 h-4 fill-white animate-spin" /> Sandıkları Aç / Seçime Git!
                  </button>
                )
                }
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. REGIONAL RALLY MODAL SELECTOR */}
      {showRallyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scale-up text-slate-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-blue-400" />
                Miting Bölgesi Seçin
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Rallinin yapılacağı coğrafi bölgeyi belirtin. O bölgedeki illerin tamamında oylarınızda ciddi artış sağlanacaktır.
              </p>
            </div>

            <div className="space-y-1.5">
              {regions.map((reg) => {
                const totalVoters = provinces.filter(p => p.regionId === reg.id).reduce((acc, curr) => acc + curr.voterCount, 0);

                return (
                  <button
                    key={reg.id}
                    onClick={() => executeRally(reg.id)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <span className="text-xs font-bold block">{reg.name}</span>
                      <span className="text-[10px] text-slate-500 block">Seçmen Sayısı: {(totalVoters / 1000000).toFixed(1)}M</span>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">Seç</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowRallyModal(false)}
                className="flex-1 py-1.5 px-4 bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-300 hover:text-white"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
