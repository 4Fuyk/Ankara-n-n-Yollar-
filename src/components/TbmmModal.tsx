import React from 'react';
import { motion } from 'motion/react';
import { Landmark, Scale, Milestone, MessageSquareCode, Award, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Party, TbmmSession } from '../types';
import { playSound } from '../utils/audio';

interface TbmmModalProps {
  playerParty: Party;
  session: TbmmSession;
  onChoice: (choiceIdx: number) => void;
}

export default function TbmmModal({ playerParty, session, onChoice }: TbmmModalProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Play a formal gong when entering parliament!
    playSound.playGong();
  }, []);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    playSound.playSelect();
  };

  const handleVote = () => {
    if (selectedIdx === null) return;
    playSound.playSuccess();
    onChoice(selectedIdx);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-2 border-red-500/20 bg-slate-900 text-slate-100 flex flex-col shadow-2xl shadow-red-950/10"
      >
        {/* TBMM Grand Emblem Header */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-red-700 via-red-800 to-red-950 px-6 py-5 flex items-center justify-between border-b border-red-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 blink-pulse">
              <Landmark className="w-6 h-6 text-red-200" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-red-300 block">TÜRKİYE BÜYÜK MİLLET MECLİSİ (TBMM)</span>
              <h2 className="text-base font-extrabold text-red-50 leading-tight uppercase font-sans tracking-wide">
                GENEL KURUL HAREKETLİLİĞİ
              </h2>
            </div>
          </div>

          <div className="text-right z-10 shrink-0">
            <span className="text-[10px] font-mono px-2 py-1 bg-red-950/60 text-red-400 border border-red-500/20 rounded-full font-bold">
              YASA TASARISI GÜNDEMİ
            </span>
          </div>
        </div>

        {/* Famous Quote Ribbon */}
        <div className="flex-shrink-0 bg-slate-950/90 py-2 border-b border-slate-850 text-center select-none">
          <span className="text-[11px] font-sans font-black tracking-[0.18em] text-red-500/80 uppercase">
            "EGEMENLİK KAYITSIZ ŞARTSIZ MİLLETİNDİR!"
          </span>
        </div>

        {/* Outer Contents scroll */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 scrollable-content">
          <div className="bg-slate-950/40 border border-slate-850 p-4 sm:p-5 rounded-2xl space-y-3 relative overflow-hidden ring-1 ring-white/5">
            <div className="flex items-center gap-2 text-red-400 font-extrabold uppercase text-[11px] tracking-wider">
              <Scale className="w-4 h-4 text-red-400" />
              <span>Teklif No: {session.id} | Meclis Gündem Özeti</span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-100 font-sans tracking-tight">
              {session.billTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {session.billDescription}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {playerParty.leader} Olarak Meclis Grubunuza Talimatınız
            </h4>

            <div className="flex flex-col gap-2.5">
              {session.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                let colorClass = 'bg-slate-800 border-slate-700/60 hover:bg-slate-750 hover:border-slate-600';
                if (isSelected) colorClass = 'bg-red-950/20 border-red-500/50 shadow-md shadow-red-950/10';

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-start ${colorClass}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {option.action === 'YES' ? (
                        <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      ) : option.action === 'NO' ? (
                        <XCircle className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                      ) : (
                        <HelpCircle className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-xs font-bold text-slate-200">
                          {option.text}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-black uppercase text-red-400 font-mono">
                            SEÇİLDİ
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-serif text-slate-400 italic">
                        "{option.slogan}"
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex-shrink-0 bg-slate-950 border-t border-slate-850 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            {selectedIdx !== null ? (
              <span className="text-slate-400 flex items-center gap-1">
                ⚡ Seçiminizin ardından diplomatik ilişkiler ve oylar güncellenecektir.
              </span>
            ) : (
              <span>Lütfen meclis grubunuz adına verilecek oyu veya tavrı kararlaştırın.</span>
            )}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedIdx === null}
            className="w-full sm:w-auto font-bold text-xs uppercase tracking-widest py-3 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 flex items-center justify-center gap-2"
          >
            Meclis Oyunu Kullan <Milestone className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
