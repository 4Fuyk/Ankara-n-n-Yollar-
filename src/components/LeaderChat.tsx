import React, { useState } from 'react';
import { Party, Alliance } from '../types';
import { MessageSquare, Coffee, Trophy, TrendingDown, Users, Flame, User, ArrowRight, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { playSound } from '../utils/audio';

interface LeaderChatProps {
  parties: Party[];
  alliances: Alliance[];
  currentWeek: number;
  kulisChats: string[];
  chatHistories: Record<string, { sender: string; text: string; week: number }[]>;
  onSatas: (targetPartyShortName: string) => void;
  onOfferAlliance: (targetPartyShortName: string) => void;
  onUpdateState: (updater: (prev: any) => any) => void;
}

export default function LeaderChat({
  parties,
  alliances,
  currentWeek,
  kulisChats,
  chatHistories,
  onSatas,
  onOfferAlliance,
  onUpdateState
}: LeaderChatProps) {
  const playerParty = parties.find(p => p.isPlayer);
  const rivalParties = parties.filter(p => !p.isPlayer);
  
  const [selectedRivalId, setSelectedRivalId] = useState<string>(rivalParties[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedRival = rivalParties.find(p => p.id === selectedRivalId) || rivalParties[0];

  if (!playerParty) return null;

  // Find alliances
  const playerAlliance = alliances.find(a => a.isPlayerAlliance);
  const isAlliedWithSelected = selectedRival && playerAlliance?.parties.includes(selectedRival.id);

  const getRelationshipStatus = (rel: number) => {
    if (rel < -70) return { text: 'Kan Davalı / Uzlaşmaz', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
    if (rel < -30) return { text: 'Soğuk İlişkiler / Rakip', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' };
    if (rel > 70) return { text: 'Can Ciğer / Siyasi Dost', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (rel > 30) return { text: 'Uyumlu / Potansiyel Ortak', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' };
    return { text: 'Mesafeli / Nötr', color: 'text-slate-400 bg-slate-800/50 border-slate-700/50' };
  };

  const getChatMessages = (rivalShortName: string) => {
    return chatHistories[rivalShortName] || [
      {
        sender: selectedRival.leader,
        text: `Selamlar Sayın ${playerParty.leader}. Siyasi süreçleri ve geleceğe dair vizyonumuzu istişare etmeye her zaman açığız. Ne görüşmek istersiniz?`,
        week: 1
      }
    ];
  };

  // Keyboard typing interaction
  const handleSendTypedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isGenerating || !selectedRival) return;
    playSound.playClick();

    const textToSend = typedMessage.trim();
    setTypedMessage('');
    setIsGenerating(true);

    const shortName = selectedRival.shortName;
    const currentMessages = getChatMessages(shortName);

    // Append player's line instantly
    const updatedMessagesWithUser = [
      ...currentMessages,
      { sender: playerParty.leader, text: textToSend, week: currentWeek }
    ];

    onUpdateState(prev => ({
      ...prev,
      chatHistories: {
        ...prev.chatHistories,
        [shortName]: updatedMessagesWithUser
      }
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rivalLeader: selectedRival.leader,
          rivalShortName: selectedRival.shortName,
          rivalIdeology: selectedRival.ideology,
          relationshipWithPlayer: selectedRival.relationshipWithPlayer,
          playerLeader: playerParty.leader,
          playerPartyName: playerParty.name,
          playerPartyShortName: playerParty.shortName,
          message: textToSend,
          history: currentMessages
        })
      });

      if (!response.ok) throw new Error('API return error');
      const data = await response.json();
      const aiReply = data.response;
      const relDelta = data.relDelta || 0;

      const finalMessages = [
        ...updatedMessagesWithUser,
        { sender: selectedRival.leader, text: aiReply, week: currentWeek }
      ];

      onUpdateState(prev => {
        let updatedParties = prev.parties.map((p: Party) => {
          if (p.id === selectedRival.id) {
            return {
              ...p,
              relationshipWithPlayer: Math.max(-100, Math.min(100, p.relationshipWithPlayer + relDelta))
            };
          }
          return p;
        });

        const updatedLogs = [
          ...prev.logs,
          {
            week: prev.currentWeek,
            message: `SOHBET ODASI: ${playerParty.leader}, ${selectedRival.shortName} lideri ${selectedRival.leader} ile yazışmalı görüştü. İlişki Değişimi: ${relDelta > 0 ? '+' : ''}${relDelta}.`,
            type: relDelta > 0 ? 'success' : relDelta < 0 ? 'danger' : 'default'
          }
        ];

        return {
          ...prev,
          parties: updatedParties,
          logs: updatedLogs,
          chatHistories: {
            ...prev.chatHistories,
            [shortName]: finalMessages
          }
        };
      });

    } catch (error) {
      console.error(error);
      const offlineMessages = [
        ...updatedMessagesWithUser,
        { sender: selectedRival.leader, text: "Görüşlerinize teşekkür eder, memlekete hizmet yolunda başarılar dilerim.", week: currentWeek }
      ];
      onUpdateState(prev => ({
        ...prev,
        chatHistories: {
          ...prev.chatHistories,
          [shortName]: offlineMessages
        }
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Dialogue option interactions
  const handleDialogueOption = (optionType: 'coffee' | 'coalition' | 'critique' | 'tease' | 'alliance') => {
    if (!selectedRival) return;
    playSound.playClick();

    const shortName = selectedRival.shortName;
    const currentMessages = getChatMessages(shortName);
    let playerText = '';
    let aiText = '';
    let cost = 0;
    let relDelta = 0;
    let supportDelta = 0;
    let logMessage = '';

    if (optionType === 'coffee') {
      cost = 40000;
      playerText = `Sayın ${selectedRival.leader}, gelin birer bardak çay acı kahvemizi içip meclis dışı bir durum değerlendirmesi yapalım.`;
      
      if (selectedRival.relationshipWithPlayer > -25) {
        aiText = `Davetiniz için teşekkürler Sayın ${playerParty.leader}. Kahvenin 40 yıl hatırı vardır derler. Memleket meselelerini centilmence konuşmak iyi geldi.`;
        relDelta = 10;
        playSound.playTeaClink();
      } else {
        aiText = `Mevcut siyasi gerilimler ve hakkımızdaki asılsız açıklamalarınız sürerken sizinle içecek hiçbir kahvemiz yoktur Sayın ${playerParty.leader}.`;
        relDelta = -5;
      }
    } else if (optionType === 'coalition') {
      cost = 60000;
      playerText = `Gelecek hükümet döneminde vizyoner bir koalisyon yönetimine veya meclis içi ortak yasa desteğine nasıl bakarsınız Sayın Başkan?`;
      
      if (selectedRival.relationshipWithPlayer > 30 || playerParty.ideology === selectedRival.ideology) {
        aiText = `Yönetim felsefelerimiz ve ilkelerimiz büyük ölçüde örtüşüyor. Sandıklardan çıkacak sonuca göre milletin hayrı için elimizi taşın altına koyarız.`;
        relDelta = 12;
      } else {
        aiText = `Bizim ideolojik çizgimiz ile sizin partinizin vaatleri çelişiyor. Şu an için bir koalisyon fikri tabanımızı incitebilir, odak noktamız tek başımıza iktidar olmak.`;
        relDelta = -2;
      }
    } else if (optionType === 'critique') {
      cost = 100000;
      playerText = `Mevcut kutuplaşmalara ve haksızlıklara karşı çıkıp iktidar partisinin yanlış politikalarına karşı ortak bir deklarasyon yayınlayalım!`;
      
      if (selectedRival.shortName === 'AK Parti') {
        aiText = `Kendi kendimizi mi eleştireceğiz? Devlet ciddiyetiyle bağdaşmayan, son derece tuhaf ve yakışıksız bir teklif Sayın ${playerParty.leader}.`;
        relDelta = -25;
      } else if (selectedRival.relationshipWithPlayer > -30) {
        aiText = `Haklısınız. Milletin cebini yakan bu hayat pahalılığına ve adaletsizliklere karşı ayrı kulvarlarda da olsak aynı itirazları yükseltmek demokratik bir görevdir.`;
        relDelta = 8;
        supportDelta = 0.4;
      } else {
        aiText = `Basın üzerinden kendi priminizi yapmak için bizi yanınıza meze etmeye çalışmayın. Biz kendi muhalefetimizi kendi dilimizle yapacak güçteyiz.`;
        relDelta = -5;
      }
    } else if (optionType === 'tease') {
      cost = 0;
      playerText = `${selectedRival.shortName} son haftalarda halkın beklentilerinden çok uzaklaştı, anketlerde eriyorsunuz. Kendinize çeki düzen vermelisiniz.`;
      aiText = `Anket manipülasyonlarıyla ayakta duranların bize akıl vermesi tam bir komedi! Seçmenimiz size sandıkta gereken en güzel cevabı tokat gibi vuracaktır.`;
      relDelta = -15;
      supportDelta = 0.2; // small support boost for aggressive stand
    } else if (optionType === 'alliance') {
      // Trigger formal alliance offer
      onOfferAlliance(selectedRival.shortName);
      return;
    }

    if (playerParty.budget < cost) {
      alert(`Bu diplomatik masraf için partinizin bütçesi yetersiz! (Gereken: ${cost.toLocaleString('tr-TR')} ₺)`);
      return;
    }

    // Build the updated messages
    const updatedMessages = [
      ...currentMessages,
      { sender: playerParty.leader, text: playerText, week: currentWeek },
      { sender: selectedRival.leader, text: aiText, week: currentWeek }
    ];

    // Trigger state update
    onUpdateState(prev => {
      let updatedParties = prev.parties.map((p: Party) => {
        if (p.isPlayer) {
          return { ...p, budget: p.budget - cost };
        }
        if (p.id === selectedRival.id) {
          return {
            ...p,
            relationshipWithPlayer: Math.max(-100, Math.min(100, p.relationshipWithPlayer + relDelta))
          };
        }
        return p;
      });

      // Handle support boosts if any
      let updatedProvinces = prev.provinces;
      if (supportDelta > 0) {
        const playerShort = playerParty.shortName;
        updatedProvinces = prev.provinces.map((prov: any) => {
          const votes = { ...prov.votes };
          const oldVal = votes[playerShort] || 0;
          votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + supportDelta));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== playerShort) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== playerShort && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (supportDelta * (votes[k] / otherSum)));
            }
          });
          return { ...prov, votes };
        });
      }

      // Append logs
      const updatedLogs = [
        ...prev.logs,
        {
          week: prev.currentWeek,
          message: `GÖRÜŞME ODASI: ${playerParty.leader}, ${selectedRival.shortName} lideri ${selectedRival.leader} ile özel kanalda temas kurdu. İlişki Değişimi: ${relDelta > 0 ? '+' : ''}${relDelta}.`,
          type: relDelta >= 0 ? 'success' : 'danger'
        }
      ];

      return {
        ...prev,
        parties: updatedParties,
        provinces: updatedProvinces,
        logs: updatedLogs,
        chatHistories: {
          ...prev.chatHistories,
          [shortName]: updatedMessages
        }
      };
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in" id="leader_chat_chamber">
      {/* 1. RIVALS SIDEBAR - 4 Cols */}
      <div className="xl:col-span-4 bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-400" /> Siyasi Liderler Portföyü
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Özel görüşme başlatmak ve nabız yoklamak için bir lider seçin.
          </p>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollable-content flex-1">
          {rivalParties.map(r => {
            const relStatus = getRelationshipStatus(r.relationshipWithPlayer);
            const isSelected = r.id === selectedRivalId;
            return (
              <button
                key={r.id}
                onClick={() => { playSound.playClick(); setSelectedRivalId(r.id); }}
                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-950/20 border-blue-500/50 shadow-inner' 
                    : 'bg-slate-950/30 border-slate-850 hover:border-slate-800'
                }`}
              >
                <div 
                  className="w-2.5 h-10 rounded-full shrink-0" 
                  style={{ backgroundColor: r.color }} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-200 truncate">{r.shortName} - {r.leader}</span>
                    {r.allianceId && (
                      <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1 py-0.2 rounded font-black whitespace-nowrap">
                        BLOKTA
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Eko: {r.ideology}</span>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-850/30 text-[9px] font-bold">
                    <span className={relStatus.color.split(' ')[0]}>{relStatus.text}</span>
                    <span className="text-slate-400">İlişki: {r.relationshipWithPlayer > 0 ? '+' : ''}{r.relationshipWithPlayer}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Player Budget status wrapper inside sidebar */}
        <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Partinizin Kasa Bütçesi</span>
          <strong className="text-emerald-400 text-sm font-sans">
            {playerParty.budget.toLocaleString('tr-TR')} ₺
          </strong>
        </div>
      </div>

      {/* 2. CHAT CHAMEBER - 5 Cols */}
      <div className="xl:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col overflow-hidden shadow-xl h-[530px]">
        {/* Chat header spotlight */}
        <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ backgroundColor: selectedRival.color }}
            />
            <div>
              <h4 className="font-extrabold text-xs text-slate-100 flex items-center gap-1">
                {selectedRival.leader} <span className="text-[10px] text-slate-500 font-medium">({selectedRival.name})</span>
              </h4>
              <span className="text-[9px] text-slate-400 font-sans block mt-0.5">
                İdeoloji: <strong>{selectedRival.ideology}</strong> • Durum: <strong>{getRelationshipStatus(selectedRival.relationshipWithPlayer).text}</strong>
              </span>
            </div>
          </div>
          {isAlliedWithSelected && (
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black">
              İTTİFAK ORTAĞINIZ
            </span>
          )}
        </div>

        {/* Chat Scroll container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20 scrollable-content">
          {getChatMessages(selectedRival.shortName).map((msg, i) => {
            const isMe = msg.sender === playerParty.leader;
            return (
              <div 
                key={i} 
                className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-[9px] text-slate-500 font-bold mb-1 px-1">{msg.sender}</span>
                <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[8px] text-slate-600 mt-0.5 font-sans">Kurultay Haftası: {msg.week}</span>
              </div>
            );
          })}
          {isGenerating && (
            <div className="flex flex-col items-start mr-auto max-w-[85%] animate-pulse">
              <span className="text-[9px] text-slate-500 font-bold mb-1 px-1">{selectedRival.leader}</span>
              <div className="bg-slate-850 text-slate-400 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[10px] font-bold italic">Lider cevap düşünüyor...</span>
              </div>
            </div>
          )}
        </div>

        {/* Real-time keyboard writing input */}
        <form onSubmit={handleSendTypedMessage} className="p-2.5 bg-slate-950 border-t border-b border-slate-850/60 flex gap-2 shrink-0">
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            disabled={isGenerating}
            placeholder={`${selectedRival.leader} ile klavyeden doğrudan yazışın...`}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isGenerating || !typedMessage.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            {isGenerating ? (
              <span className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Gönder
              </>
            )}
          </button>
        </form>

        {/* Action Interaction buttons */}
        <div className="p-3 bg-slate-950 border-t border-slate-850 space-y-2">
          <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">İSTİŞARE VE DİPLOPMASİ EYLEMLERİ</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDialogueOption('coffee')}
              className="flex items-center justify-between gap-1 text-[11px] font-bold p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer active:scale-95"
            >
              <span className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-amber-500" /> Çay/Kahve Ismarla</span>
              <span className="text-[8px] text-emerald-500 font-sans">-40K ₺</span>
            </button>
            <button
              onClick={() => handleDialogueOption('coalition')}
              className="flex items-center justify-between gap-1 text-[11px] font-bold p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer active:scale-95"
            >
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-400" /> İş Birliği Nabzı</span>
              <span className="text-[8px] text-emerald-500 font-sans">-60K ₺</span>
            </button>
            <button
              onClick={() => handleDialogueOption('critique')}
              className="flex items-center justify-between gap-1 text-[11px] font-bold p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer active:scale-95"
            >
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Ortak Bildiri</span>
              <span className="text-[8px] text-emerald-500 font-sans">-100K ₺</span>
            </button>
            <button
              onClick={() => handleDialogueOption('tease')}
              className="flex items-center justify-between gap-1 text-[11px] font-bold p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer active:scale-95"
            >
              <span className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-orange-400" /> Politik Eleştiri</span>
              <span className="text-[8px] text-slate-500 font-sans">BEDAVA</span>
            </button>
          </div>

          <button
            onClick={() => handleDialogueOption('alliance')}
            disabled={isAlliedWithSelected}
            className="w-full mt-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Users className="w-4 h-4" /> Resmî Seçim İttifakı Teklif Et (100K ₺ Masraf)
          </button>
        </div>
      </div>

      {/* 3. KULIS GOSSIP BOARD - 3 Cols */}
      <div className="xl:col-span-3 bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col gap-3 shadow-xl h-[530px]">
        <div className="border-b border-slate-800 pb-3 shrink-0">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Ankara Kulisleri & Siyasi Dedikodular
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Diğer siyasi liderlerin kendi aralarında yaptığı görüşmeler ve gizli mutabakatlar.
          </p>
        </div>

        {/* Scroll list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollable-content">
          {[...kulisChats].reverse().map((gossip, idx) => (
            <div 
              key={idx}
              className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-indigo-950/50 transition-colors"
            >
              <div className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                {gossip}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-2 bg-slate-950/60 border border-slate-855 rounded-xl shrink-0">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block text-center">
            📡 CANLI KULİS AKIŞI AKTİF
          </span>
        </div>
      </div>
    </div>
  );
}
