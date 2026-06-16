import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Server, Play, Send, Plus, Key, ArrowLeft, Loader2, Sparkles, LogIn, Check, Crown, MessageSquare, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';
import { Language, translations } from '../utils/languages';
import { Ideology } from '../types';
import { 
  createMultiplayerLobby, 
  joinMultiplayerLobby, 
  listenToLobbyMembers, 
  listenToLobbyDoc, 
  listenToLobbyChat, 
  sendLobbyChatMessage, 
  updateLobbyMemberParty, 
  startLobbyGame,
  loginWithGoogle
} from '../utils/firebase';

interface MultiplayerLobbyProps {
  user: any;
  lang: Language;
  onBack: () => void;
  onStartCampaign: (myPartyData: any, otherParties: any[], lobbyCode: string) => void;
}

export default function MultiplayerLobby({
  user,
  lang,
  onBack,
  onStartCampaign
}: MultiplayerLobbyProps) {
  const [lobbyCode, setLobbyCode] = useState('');
  const [activeLobbyCode, setActiveLobbyCode] = useState<string | null>(null);
  
  // Lobby state
  const [lobbyDoc, setLobbyDoc] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  
  // Actions states
  const [partyName, setPartyName] = useState('');
  const [shortName, setShortName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [selectedIdeology, setSelectedIdeology] = useState<Ideology>(Ideology.SOSYAL_DEMOKRAT);
  const [isReady, setIsReady] = useState(false);

  // Status logs
  const [errorText, setErrorText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Unsubscribe pointers
  const [listeners, setListeners] = useState<(() => void)[]>([]);

  const t = translations[lang];

  // Clean listeners on unmount
  useEffect(() => {
    return () => {
      listeners.forEach(unsub => unsub());
    };
  }, [listeners]);

  // Handle detection of game kickoff (status -> CAMPAIGN)
  useEffect(() => {
    if (lobbyDoc && lobbyDoc.status === 'CAMPAIGN') {
      playSound.playSuccess();
      
      // Look up my own party info
      const me = members.find(m => m.uid === user?.uid);
      const myPartyInfo = {
        name: me?.partyName || 'Halk Partisi',
        shortName: me?.shortName || 'HP',
        color: me?.color || '#3b82f6',
        ideology: me?.ideology || Ideology.SOSYAL_DEMOKRAT,
        leader: me?.playerName || 'Seçmen Lideri'
      };

      // Map other structural players
      const otherParties = members
        .filter(m => m.uid !== user?.uid)
        .map(m => ({
          id: m.uid,
          name: m.partyName || `${m.playerName} Partisi`,
          shortName: m.shortName || m.playerName.slice(0, 3).toUpperCase(),
          leader: m.playerName,
          color: m.color || '#ec4899',
          ideology: m.ideology || Ideology.SOSYAL_DEMOKRAT,
          support: m.support || 10,
          budget: m.budget || 3000000
        }));

      // Fire launch callback
      if (activeLobbyCode) {
        onStartCampaign(myPartyInfo, otherParties, activeLobbyCode);
      }
    }
  }, [lobbyDoc, members, user, activeLobbyCode]);

  const handleLogin = async () => {
    playSound.playClick();
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateLobby = async () => {
    if (!user) return;
    playSound.playClick();
    setActionLoading(true);
    setErrorText('');

    // Generate random code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      await createMultiplayerLobby(code, user);
      setupLobbyListeners(code);
    } catch (err: any) {
      console.error(err);
      setErrorText(lang === 'TR' ? 'Lobi kurulurken sunucu hatası oluştu.' : 'Server error creating lobby.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinLobby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !lobbyCode.trim()) return;
    playSound.playClick();
    setActionLoading(true);
    setErrorText('');
    
    const code = lobbyCode.toUpperCase().trim();

    try {
      await joinMultiplayerLobby(code, user);
      setupLobbyListeners(code);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("LOBBY_NOT_FOUND")) {
        setErrorText(lang === 'TR' ? 'Lobi bulunamadı! Kodu kontrol edin.' : 'Lobby not found! Verify your code.');
      } else if (err.message && err.message.includes("CAMPAIGN_ALREADY_STARTED")) {
        setErrorText(lang === 'TR' ? 'Bu seçim kampanyası zaten başladı!' : 'This campaign has already launched!');
      } else {
        setErrorText(lang === 'TR' ? 'Lobiye katılırken bir hata oluştu.' : 'An error occurred joining the lobby.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const setupLobbyListeners = (code: string) => {
    // Teardown previous ones
    listeners.forEach(unsub => unsub());
    
    setActiveLobbyCode(code);

    const unsubDoc = listenToLobbyDoc(code, (docData) => {
      setLobbyDoc(docData);
    });

    const unsubMembers = listenToLobbyMembers(code, (memberList) => {
      setMembers(memberList);
    });

    const unsubChat = listenToLobbyChat(code, (chatData) => {
      setChatMessages(chatData);
    });

    setListeners([unsubDoc, unsubMembers, unsubChat]);
  };

  const handleSyncMyChoices = async (updatedFields: any) => {
    if (!activeLobbyCode || !user) return;
    try {
      await updateLobbyMemberParty(activeLobbyCode, user.uid, updatedFields);
    } catch (err) {
      console.error("Failed to sync my choices: ", err);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLobbyCode || !newMsg.trim() || !user) return;
    try {
      const nickname = user.displayName || 'Bilinmeyen Aday';
      await sendLobbyChatMessage(activeLobbyCode, nickname, newMsg.trim());
      setNewMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!activeLobbyCode) return;
    playSound.playSuccess();
    try {
      await startLobbyGame(activeLobbyCode);
    } catch (err) {
      console.error("Lobby launch failed: ", err);
    }
  };

  const colorsList = ['#dc2626', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#4b5563'];

  // Calculate if everyone is ready
  const canStart = members.length >= 2 && members.every(m => m.ready || m.isHost);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" id="multiplayer_lobby_panel">
      {/* Back to main menu header link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playSound.playClick(); onBack(); }}
          className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-xl transition flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> {lang === 'TR' ? 'Ana Menüye Dön' : 'Return Home'}
        </button>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl">
          🌐 REALTIME MULTIPLAYER SERVICE ACTIVE
        </span>
      </div>

      {!user ? (
        /* PROMINENT GUEST LOGIN WALL */
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-10 text-center space-y-6 shadow-2xl">
          <div className="inline-flex p-5 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-full text-indigo-400 scale-110">
            <Users className="w-10 h-10 animate-transition" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
              {lang === 'TR' ? 'ÇOK OYUNCULU MOD' : 'MULTIPLAYER CAMPAIGN LOBBY'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'TR' 
                ? 'Canlı seçim arenasındaki diğer gerçek oyuncularla lobi kurup kozlarınızı paylaşmak için Google hesabınızla giriş yapmanız gerekmektedir.' 
                : 'Connect with rival party leaders worldwide. Live lobbies require your Google account reference for continuous real-time sync.'}
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="py-3 px-8 font-black text-xs tracking-wider uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <LogIn className="w-4 h-4" /> Google ile Giriş Yap / Sign In
          </button>
        </div>
      ) : !activeLobbyCode ? (
        /* SELECTION COMPONENT: CREATE OR JOIN LOBBY */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Create Custom Lobby */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-3">
              <div className="p-3 w-fit bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-100 uppercase tracking-wide">
                {lang === 'TR' ? 'Yeni Lobi Kur' : 'Create Live Lobby'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'TR' 
                  ? 'Kendi odanızı oluşturarak bir davet kodu elde edersiniz. Diğer gerçek adayları bu lobi koduna davet edip seçim heyecanını birlikte yaşayabilirsiniz.' 
                  : 'Start a customizable multiplayer session. Get an access code and invite friends to test their political prowess.'}
              </p>
            </div>

            {errorText && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            <button
              onClick={handleCreateLobby}
              disabled={actionLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-300" />}
              {lang === 'TR' ? 'LOBİ OLUŞTUR' : 'LAUNCH NEW LOBBY'}
            </button>
          </div>

          {/* Box 2: Join Existing room */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-3">
              <div className="p-3 w-fit bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-100 uppercase tracking-wide">
                {lang === 'TR' ? 'Lobiye Katıl' : 'Join lobby code'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'TR' 
                  ? 'Size gönderilen 4 haneli benzersiz odaya katılma kodunu girerek diğer adayların beklediği aktif seçim lobisine anında bağlanın.' 
                  : 'Enter the 4-digit token generated by your friendly rival to instantly join their synchronized multiplayer queue.'}
              </p>
            </div>

            <form onSubmit={handleJoinLobby} className="space-y-3">
              <input
                type="text"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase().slice(0, 4))}
                placeholder={lang === 'TR' ? 'Lobi Kodunu Girin (örn: H9KD)' : 'Enter Code (e.g., F5TD)'}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm font-black text-center text-slate-100 uppercase tracking-widest placeholder-slate-650 focus:outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={actionLoading || !lobbyCode.trim()}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-850 disabled:text-slate-500 text-slate-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-750 flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-emerald-400" />}
                {lang === 'TR' ? 'LOBİYE GİRİŞ YAP' : 'JOIN CURRENT ROOM'}
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* INSIDE ACTIVE MULTIPLAYER LOBBY SCREEN */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LHS: Players Profile configurations - 5 cols */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Crown className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wide">
                  {lang === 'TR' ? 'Adaylık Profil Seçimi' : 'Candidacy Profile Settings'}
                </h3>
              </div>

              {/* Input for Party Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {lang === 'TR' ? 'Parti Adı' : 'Party Name'}
                </label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 36);
                    setPartyName(val);
                    handleSyncMyChoices({ partyName: val });
                  }}
                  placeholder={lang === 'TR' ? 'Demokrasi Yolcuları Partisi' : 'Progressive Vanguard'}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none"
                />
              </div>

              {/* Input for Party Short Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {lang === 'TR' ? 'Parti Kısaltması' : 'Short Name'}
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().slice(0, 5);
                    setShortName(val);
                    handleSyncMyChoices({ shortName: val });
                  }}
                  placeholder="DYP"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none"
                />
              </div>

              {/* Color list selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {lang === 'TR' ? 'Kampanya Rongi' : 'Campaign Theme Color'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        handleSyncMyChoices({ color: c });
                      }}
                      className="w-6 h-6 rounded-full transition cursor-pointer active:scale-90 flex items-center justify-center relative shadow-inner"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ideology Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {lang === 'TR' ? 'Parti İdeolojisi' : 'Party Ideology'}
                </label>
                <select
                  value={selectedIdeology}
                  onChange={(e) => {
                    const val = e.target.value as Ideology;
                    setSelectedIdeology(val);
                    handleSyncMyChoices({ ideology: val });
                  }}
                  className="w-full bg-slate-950 border border-slate-850 text-xs font-semibold rounded-xl p-2.5 focus:outline-none text-slate-200"
                >
                  <option value={Ideology.SOSYAL_DEMOKRAT}>{lang === 'TR' ? 'Sosyal Demokrat' : 'Social Democrat'}</option>
                  <option value={Ideology.MUHAFAZAKAR}>{lang === 'TR' ? 'Muhafazakar' : 'Conservative'}</option>
                  <option value={Ideology.MILLIYETCI}>{lang === 'TR' ? 'Milliyetçi' : 'Nationalist'}</option>
                  <option value={Ideology.LIBERAL}>{lang === 'TR' ? 'Liberal' : 'Liberal'}</option>
                  <option value={Ideology.SOSYALIST}>{lang === 'TR' ? 'Sosyalist' : 'Socialist'}</option>
                </select>
              </div>

              {/* User Ready Checklist button */}
              {!(members.find(m => m.uid === user.uid)?.isHost) && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !isReady;
                    setIsReady(next);
                    playSound.playClick();
                    handleSyncMyChoices({ ready: next });
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
                    isReady 
                      ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                  }`}
                >
                  {isReady ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isReady ? (lang === 'TR' ? 'SEÇİME HAZIRIM!' : 'READY TO CHALLENGE') : (lang === 'TR' ? 'BEN HAZIRIM' : 'MARK INDICATION READY')}
                </button>
              )}
            </div>

            {/* Quick explanation banner */}
            <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-400/90 leading-relaxed font-semibold">
                {lang === 'TR' 
                  ? 'BİLGİ: Gerçek zamanlı çok oyunculu senkronizasyon devreye alınmıştır. Her bir tur boyunca yaptığınız hamleler lobiye bağlı diğer liderle anlık paylaşılır!' 
                  : 'Notice: Synchronized real-time turn engines active. Match data including popularity index, action choices and finance flow is cross-replicated.'}
              </div>
            </div>
          </div>

          {/* RHS: Active Users List & Live Chat - 7 cols */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Lobby code ribbon & Participants list card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-400" /> {lang === 'TR' ? 'LOBİ ADAYLARI' : 'LOBBY CANDIDATES'}
                  </h4>
                  <p className="text-[10px] text-slate-500">{lang === 'TR' ? 'Seçime katılmak üzere lobide hazır bekleyen liderler.' : 'Active politicians currently queued in the lobby.'}</p>
                </div>
                
                {/* LOBY ACCESS TOKEN CODE DISPLAY */}
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center flex items-center gap-1.5 shrink-0 shadow-inner">
                  <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{lang === 'TR' ? 'LOBİ KODU:' : 'LOBBY TOKEN:'}</span>
                  <strong className="text-sm font-black text-indigo-400 select-all tracking-wider">{activeLobbyCode}</strong>
                </div>
              </div>

              {/* Members Grid list */}
              <div className="space-y-2.5">
                {members.map((m) => (
                  <div 
                    key={m.uid} 
                    className="flex items-center justify-between bg-slate-950/50 border border-slate-850 px-4 py-3 rounded-xl hover:border-slate-800 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color || '#4b5563' }} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-200">
                            {m.playerName}
                          </span>
                          {m.isHost && (
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1 rounded uppercase tracking-wider border border-indigo-500/10 flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5" /> Host
                            </span>
                          )}
                        </div>
                        {m.partyName ? (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {m.partyName} <strong className="text-slate-500 font-bold">({m.shortName})</strong> • {m.ideology}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">
                            {lang === 'TR' ? 'Parti kuruluyor...' : 'Customizing party...'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ready state indicators */}
                    <div>
                      {m.isHost ? (
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-black px-2 py-0.5 rounded-lg border border-emerald-500/10 uppercase tracking-widest">
                          {lang === 'TR' ? 'YÖNETİCİ' : 'HOST'}
                        </span>
                      ) : m.ready ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2.5 py-0.5 rounded-lg border border-emerald-500/10 uppercase tracking-widest flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> HAZIR
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-800 text-slate-400 font-black px-2.5 py-0.5 rounded-lg uppercase tracking-widest">
                          BEKLİYOR
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Play kickoff button for host */}
              {members.find(m => m.uid === user.uid)?.isHost && (
                <div className="pt-2 border-t border-slate-850">
                  <button
                    onClick={handleLaunchCampaign}
                    disabled={!canStart}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/90 disabled:text-slate-300 disabled:border-slate-700 border border-transparent text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/10 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-emerald-200" />
                    {lang === 'TR' ? 'SEÇİM KAMPANYASINI BAŞLAT!' : 'KICKOFF MULTIPLAYER CAMPAIGN!'}
                  </button>
                  {!canStart && (
                    <p className="text-[9px] text-slate-500 mt-2 text-center font-semibold">
                      {lang === 'TR' 
                        ? '* Seçime başlamak için katılımcı tüm adayların profilini tamamlayıp "HAZIR" olması gerekmektedir (Min 2 aday).' 
                        : '* At least 2 candidate entries with fully optimized profile parameters set to "READY" are required to start.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Live Real-time Chat Box inside Lobby */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col h-[280px]">
              <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2.5 mb-3 shrink-0">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">
                  {lang === 'TR' ? 'LOBİ ORTAK SOHBETİ' : 'LOBBY CHAT STREAM'}
                </h4>
              </div>

              {/* Messages container list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 text-[10px] italic font-semibold">
                    {lang === 'TR' ? 'Sohbet liderlerin tartışmasına hazır...' : 'Ready for political debate...'}
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={msg.id || i} className="text-xs">
                      <span className="font-black text-indigo-400 pr-1.5">{msg.sender}:</span>
                      <span className="text-slate-300 font-semibold">{msg.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Typing input form */}
              <form onSubmit={handleSendChat} className="flex gap-2 mt-3 pt-3 border-t border-slate-850 shrink-0">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={lang === 'TR' ? 'Adaylara selam verin, ittifak teklif edin...' : 'Chat with other live candidates...'}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition"
                  maxLength={100}
                  required
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 shadow-lg shadow-indigo-600/10 cursor-pointer active:scale-90 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
