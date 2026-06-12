import { Party, Alliance } from '../types';
import { Sparkles, MessageSquare, Handshake, Heart, ShieldAlert, BadgeInfo } from 'lucide-react';
import { playSound } from '../utils/audio';

interface DiplomacyPanelProps {
  parties: Party[];
  alliances: Alliance[];
  onSatas: (targetPartyShortName: string) => void;
  onOfferAlliance: (targetPartyShortName: string) => void;
  onBreakAlliance: (allianceId: string) => void;
}

export default function DiplomacyPanel({
  parties,
  alliances,
  onSatas,
  onOfferAlliance,
  onBreakAlliance
}: DiplomacyPanelProps) {
  const playerParty = parties.find(p => p.isPlayer);
  const rivalParties = parties.filter(p => !p.isPlayer);

  if (!playerParty) return null;

  // Helper: Find if a party is in an alliance with the player
  const playerAlliance = alliances.find(a => a.isPlayerAlliance);
  const isPartofPlayerAlliance = (partyId: string) => {
    return playerAlliance?.parties.includes(partyId) || false;
  };

  const getRelationshipColor = (rel: number) => {
    if (rel < -40) return 'text-rose-500';
    if (rel > 40) return 'text-emerald-500';
    return 'text-slate-400';
  };

  const getRelationshipText = (rel: number) => {
    if (rel < -70) return 'Kan Davalı / Aşırı Düşman';
    if (rel < -30) return 'Gergin İlişkiler / Muhalif';
    if (rel > 70) return 'Can Ciğer / Siyasi Kardeşlik';
    if (rel > 30) return 'Sıcak Temas / Destekçi';
    return 'Nötr / Mesafeli';
  };

  const getIdeologyCompatibilityTips = (targetIdeology: string) => {
    if (playerParty.ideology === targetIdeology) return 'İdeolojik Uyum Tam: İttifak olasılığı yüksek!';
    return 'Farklı İdeoloji: Masaya oturmak için bütçe desteği gerekebilir.';
  };

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col gap-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Handshake className="w-5 h-5 text-emerald-400" />
          Siyasi Diplomasi ve İttifak Masası
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Rakiplerinizle koalisyon kurun, ortak deklarasyon yayınlayın veya onları polemiklerle yıpratarak tabanınızı sıkılaştırın.
        </p>
      </div>

      {playerAlliance && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              Aktif Seçim İttifakınız
            </h3>
            <p className="text-sm font-bold text-slate-200">{playerAlliance.name}</p>
            <div className="text-xs text-slate-400">
              Üye Partiler:{' '}
              {playerAlliance.parties
                .map((pid) => parties.find((p) => p.id === pid)?.shortName)
                .join(', ')}
            </div>
          </div>
          <button
            onClick={() => onBreakAlliance(playerAlliance.id)}
            className="w-full sm:w-auto text-xs font-bold py-2 px-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            İttifakı Dağıt
          </button>
        </div>
      )}

      {/* Competitor Grid */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollable-content">
        {rivalParties.map((rival) => {
          const relation = rival.relationshipWithPlayer;
          const isAllied = isPartofPlayerAlliance(rival.id);

          return (
            <div
              key={rival.id}
              className="bg-slate-950/30 border border-slate-850 hover:border-slate-800 rounded-xl p-4 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Party Profile - 5 Cols */}
                <div className="lg:col-span-5 flex items-start gap-3">
                  <div
                    className="w-3.5 h-12 rounded-full shadow-sm shrink-0"
                    style={{ backgroundColor: rival.color }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-200">{rival.shortName}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                        {rival.ideology}
                      </span>
                      {isAllied && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold shadow-sm">
                          İTTİFAKTA
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Lider: {rival.leader}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                      <BadgeInfo className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-500 truncate max-w-xs">{getIdeologyCompatibilityTips(rival.ideology)}</span>
                    </div>
                  </div>
                </div>

                {/* Relationship Stat - 3 Cols */}
                <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-center min-w-[120px] bg-slate-950/20 lg:bg-transparent p-3 lg:p-0 rounded-xl border border-slate-850/50 lg:border-none">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">İlişki Seviyesi</span>
                  <span className={`text-xs font-bold mt-1 block ${getRelationshipColor(relation)}`}>
                    {relation > 0 ? '+' : ''}
                    {relation} ({getRelationshipText(relation)})
                  </span>

                  {/* Visual Relationship slide */}
                  <div className="w-full lg:w-36 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden relative">
                    <div
                      className={`h-full absolute left-1/2 transition-all duration-300 ${
                        relation >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{
                        width: `${Math.abs(relation) / 2}%`,
                        left: relation >= 0 ? '50%' : `${50 - Math.abs(relation) / 2}%`
                      }}
                    />
                  </div>
                </div>

                {/* Diplomacy Buttons - 4 Cols */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row gap-2 w-full lg:justify-end">
                  <button
                    onClick={() => { playSound.playClick(); onSatas(rival.shortName); }}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-1 text-xs py-2 px-3 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-400 rounded-lg transition-all cursor-pointer active:scale-95 text-center whitespace-nowrap font-semibold"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Polemiğe Gir
                  </button>

                  {!isAllied && (
                    <button
                      disabled={isAllied || (playerAlliance !== undefined && !isPartofPlayerAlliance(rival.id))}
                      onClick={() => { playSound.playSelect(); onOfferAlliance(rival.shortName); }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1 text-xs py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-400 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-center whitespace-nowrap font-semibold"
                    >
                      <Handshake className="w-3.5 h-3.5" /> İttifak Öner
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
