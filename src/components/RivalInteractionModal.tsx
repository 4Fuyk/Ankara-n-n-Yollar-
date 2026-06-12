import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Party } from '../types';
import LeaderPortrait from './LeaderPortrait';
import { Shield, Sparkles, AlertCircle, TrendingUp, Handshake } from 'lucide-react';

interface RivalInteractionModalProps {
  interaction: {
    id: string;
    senderPartyId: string;
    type: 'request' | 'taunt' | 'praise';
    message: string;
    options?: {
      text: string;
      action: string;
      budgetEffect?: number;
      relationshipEffect?: number;
      supportEffect?: number;
    }[];
  } | null | undefined;
  parties: Party[];
  onChoose: (optionIndex: number) => void;
}

export default function RivalInteractionModal({
  interaction,
  parties,
  onChoose
}: RivalInteractionModalProps) {
  if (!interaction) return null;

  const senderParty = parties.find(p => p.id === interaction.senderPartyId);
  if (!senderParty) return null;

  const getThemeColors = () => {
    switch (interaction.type) {
      case 'taunt':
        return {
          bg: 'bg-red-950/95 border-red-700/80',
          titleColor: 'text-red-400',
          icon: <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" />,
          title: 'POLİTİK SATAŞMA & LAF ATMA'
        };
      case 'praise':
        return {
          bg: 'bg-emerald-950/95 border-emerald-700/80',
          titleColor: 'text-emerald-400',
          icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
          title: 'DESTEKleyici BEYANATLAR'
        };
      case 'request':
      default:
        return {
          bg: 'bg-indigo-950/95 border-indigo-700/80',
          titleColor: 'text-indigo-400',
          icon: <Handshake className="w-5 h-5 text-indigo-400" />,
          title: 'DOSTANE TALEP & İŞBİRLİĞİ TEKLİFİ'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl border-2 shadow-2xl ${theme.bg} text-slate-100 flex flex-col`}
      >
        {/* Top Header */}
        <div className="flex-shrink-0 flex items-center gap-2.5 px-6 py-4 border-b border-white/10 bg-black/30">
          {theme.icon}
          <h2 className={`text-xs font-black tracking-widest uppercase ${theme.titleColor}`}>
            {theme.title}
          </h2>
        </div>

        {/* Scrollable container for the rest */}
        <div className="overflow-y-auto flex-1 scrollable-content">
          {/* Character Hub */}
          <div className="p-6 pb-4 flex flex-col sm:flex-row items-center gap-5 border-b border-white/5 bg-slate-900/40">
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <LeaderPortrait
                partyShortName={senderParty.shortName}
                leaderName={senderParty.leader}
                size={82}
                className="relative border-4 border-slate-700"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-lg text-white">
                {senderParty.leader}
              </h3>
              <span
                className="inline-block mt-1.5 px-2 bg-white/10 border border-white/20 text-[10px] font-bold uppercase rounded tracking-widest"
                style={{ color: senderParty.color }}
              >
                {senderParty.name} ({senderParty.shortName})
              </span>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Liderlik Süresi: <span className="text-slate-200 font-bold">{senderParty.tenureYears || 1} Yıl</span> | İlişki: 
                <span className={`ml-1 font-bold ${
                  senderParty.relationshipWithPlayer > 20 ? 'text-emerald-400' : 
                  senderParty.relationshipWithPlayer < -10 ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {senderParty.relationshipWithPlayer > 0 ? `+${senderParty.relationshipWithPlayer}` : senderParty.relationshipWithPlayer}
                </span>
              </p>
            </div>
          </div>

          {/* Message Panel */}
          <div className="p-6 py-5 bg-gradient-to-b from-slate-950/20 to-slate-900/30">
            <div className="relative pl-4 border-l-4 border-indigo-500/50">
              <p className="text-sm font-medium italic text-slate-200 leading-relaxed font-sans">
                "{interaction.message}"
              </p>
            </div>
          </div>

          {/* Action Options in BitLife format */}
          <div className="p-6 pt-0 flex flex-col gap-2.5">
            {interaction.options?.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onChoose(idx)}
                className="w-full text-left p-4 rounded-xl bg-slate-800/65 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition duration-150 flex items-center justify-between text-xs font-semibold"
              >
                <span className="text-slate-100 pr-3">{option.text}</span>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {option.budgetEffect !== undefined && option.budgetEffect !== 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      option.budgetEffect > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {option.budgetEffect > 0 ? '+' : ''}{(option.budgetEffect / 1000).toLocaleString()}k TL
                    </span>
                  )}
                  {option.relationshipEffect !== undefined && option.relationshipEffect !== 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      option.relationshipEffect > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      İlişki {option.relationshipEffect > 0 ? '+' : ''}{option.relationshipEffect}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
