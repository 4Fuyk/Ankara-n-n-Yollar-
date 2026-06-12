import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CitizenChat } from '../types';
import { Coffee, MapPin, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface CitizenChatModalProps {
  chat: CitizenChat | null | undefined;
  onChoice: (choiceIndex: number) => void;
}

export default function CitizenChatModal({ chat, onChoice }: CitizenChatModalProps) {
  useEffect(() => {
    if (!chat) return;

    // Initial warm tea stir teaspoon clink
    playSound.playTeaClink();
  }, [chat]);

  if (!chat) return null;

  return (
    <div id="citizen-chat-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 380 }}
        className="w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900 text-slate-100 flex flex-col shadow-2xl shadow-amber-950/10"
      >
        {/* Steam Banner Header */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 px-6 py-4 flex items-center justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
          
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="p-2 bg-white/15 rounded-lg border border-white/10 relative overflow-hidden group">
              {/* Tea Steam Animations */}
              <div className="absolute inset-x-0 bottom-full flex justify-center gap-1 opacity-65 group-hover:opacity-100">
                <span className="w-0.5 h-3 bg-amber-200/60 rounded-full animate-steam-1"></span>
                <span className="w-0.5 h-4 bg-amber-100/60 rounded-full animate-steam-2"></span>
                <span className="w-0.5 h-3 bg-amber-200/60 rounded-full animate-steam-3"></span>
              </div>
              <Coffee className="w-5 h-5 text-amber-200 relative z-10" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-200 block">HALKLA ÇAY SOHBETİ & TEMAS</span>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" /> {chat.location}
              </h2>
            </div>
          </div>

          <div className="text-[10px] font-mono text-amber-100 bg-black/30 border border-white/10 rounded-full px-2.5 py-0.5 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Canlı Görüşme
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 scrollable-content">
          {/* Conversation Hub */}
          <div className="p-6 bg-slate-950/40 border-b border-slate-800">
            <div className="flex items-center gap-2.5 mb-3 text-amber-400/90 font-black tracking-wider uppercase text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{chat.groupName} Sesleniyor</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative">
              <div className="absolute right-3.5 top-3.5">
                <HelpCircle className="w-8 h-8 text-slate-800" />
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium pr-8">
                "{chat.problem}"
              </p>
            </div>
          </div>

          {/* Answers Panel */}
          <div className="p-6 space-y-3">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              YOL HARİTANIZ & VERİLECEK CEVAP
            </h4>

            <div className="flex flex-col gap-2.5">
              {chat.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  id={`citizen-choice-${idx}`}
                  whileHover={{ scale: 1.012, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onChoice(idx)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/60 hover:border-amber-600/50 transition-all cursor-pointer flex flex-col gap-1.5 text-slate-250 hover:shadow-lg hover:shadow-amber-950/5 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-slate-200 leading-snug group-hover:text-amber-300 transition-colors">
                      {choice.text}
                    </span>
                    <div className="p-1 bg-slate-900 rounded border border-slate-750 group-hover:border-amber-700/50">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  <p className="text-[11px] font-serif text-slate-400 italic pl-2 border-l border-slate-700 group-hover:border-amber-500/40">
                    Liderinizin Sesi: "{choice.answer}"
                  </p>

                  {/* Micro effects info */}
                  <div className="mt-1 flex items-center gap-2">
                    {choice.supportEffect !== 0 && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Olası Destek {choice.supportEffect > 0 ? '+' : ''}%{choice.supportEffect}
                      </span>
                    )}
                    {choice.budgetEffect !== 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        choice.budgetEffect > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        Masraf {choice.budgetEffect > 0 ? '+' : ''}{(choice.budgetEffect / 1000).toLocaleString('tr-TR')}k ₺
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
