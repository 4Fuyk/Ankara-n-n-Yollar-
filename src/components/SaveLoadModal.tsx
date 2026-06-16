import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, FolderOpen, Trash2, X, Cloud, LogIn, Sparkles, LogOut, Loader2, Calendar, Award, Landmark, HelpCircle, ShieldCheck } from 'lucide-react';
import { GameState } from '../types';
import { playSound } from '../utils/audio';
import { loginWithGoogle, logoutUser, saveGameToCloud, loadGamesFromCloud, deleteGameFromCloud } from '../utils/firebase';
import { Language, translations } from '../utils/languages';

interface SaveLoadModalProps {
  currentGameState: GameState | null;
  currentScreen: 'HOME' | 'CREATE' | 'DASHBOARD' | 'ELECTION';
  onClose: () => void;
  onLoadGame: (savedState: GameState, screen: 'DASHBOARD' | 'ELECTION') => void;
  lang: Language;
  user: any;
}

export default function SaveLoadModal({
  currentGameState,
  currentScreen,
  onClose,
  onLoadGame,
  lang,
  user
}: SaveLoadModalProps) {
  const [cloudSaves, setCloudSaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSaveName, setNewSaveName] = useState('');
  const [savingState, setSavingState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    if (user) {
      fetchCloudSaves();
    }
  }, [user]);

  const fetchCloudSaves = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await loadGamesFromCloud(user.uid);
      setCloudSaves(data || []);
    } catch (e) {
      console.error("Firebase fetch cloud saves failed:", e);
      setErrorMsg(lang === 'TR' ? 'Kayıtlar yüklenirken bir hata oluştu.' : 'Failed to retrieve cloud saves.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    playSound.playClick();
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentGameState) return;
    
    const nameToUse = newSaveName.trim() || `${lang === 'TR' ? 'Hafta' : 'Week'} ${currentGameState.currentWeek} - ${currentGameState.playerParty?.shortName || ''}`;
    setSavingState(true);
    setErrorMsg('');
    playSound.playSuccess();

    const saveObj = {
      savedAt: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      screen: currentScreen === 'ELECTION' ? 'ELECTION' : 'DASHBOARD',
      gameState: currentGameState
    };

    try {
      const saveId = `save_${Date.now()}`;
      await saveGameToCloud(user.uid, nameToUse, saveId, JSON.stringify(saveObj));
      setNewSaveName('');
      await fetchCloudSaves();
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'TR' ? 'Bulut kaydı başarısız oldu.' : 'Cloud save operation failed.');
    } finally {
      setSavingState(false);
    }
  };

  const handleLoadCampaign = (saveItem: any) => {
    playSound.playClick();
    try {
      const parsed = JSON.parse(saveItem.dataJson);
      onLoadGame(parsed.gameState, parsed.screen);
      onClose();
    } catch (e) {
      console.error("Corrupted save file parser:", e);
      alert(lang === 'TR' ? "Kayıt dosyası hasarlı veya uyumsuz." : "Save data is corrupted.");
    }
  };

  const executeDeleteCampaign = async (saveId: string) => {
    playSound.playClick();
    setLoading(true);
    setErrorMsg('');
    try {
      await deleteGameFromCloud(user.uid, saveId);
      setDeleteConfirmId(null);
      await fetchCloudSaves();
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'TR' ? 'Silme işlemi başarısız oldu.' : 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  const getSavedPartyInfo = (saveItem: any) => {
    try {
      const parsed = JSON.parse(saveItem.dataJson);
      return parsed.gameState?.parties?.find((p: any) => p.isPlayer) || null;
    } catch (e) {
      return null;
    }
  };

  const getSavedWeekInfo = (saveItem: any) => {
    try {
      const parsed = JSON.parse(saveItem.dataJson);
      return parsed.gameState?.currentWeek || 1;
    } catch (e) {
      return 1;
    }
  };

  const getSavedDifficulty = (saveItem: any) => {
    try {
      const parsed = JSON.parse(saveItem.dataJson);
      return parsed.gameState?.difficulty || 'NORMAL';
    } catch (e) {
      return 'NORMAL';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans"
        id="cloud_save_modal"
      >
        {/* Color stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-850">
          <div>
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Cloud className="w-5 h-5 text-blue-400" /> Google Cloud {lang === 'TR' ? 'Kayıt Sistemi' : 'Backup System'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'TR' ? 'Kampanya ilerlemenizi Google hesabınızla tüm cihazlarda güvenle senkronize edin.' : 'Securely backup and sync campaign state to your Google Account across any device.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {!user ? (
          /* GUEST USER CARD: PROMINENT GOOGLE SIGN IN WARNING */
          <div className="p-8 text-center space-y-6">
            <div className="inline-flex p-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-full text-blue-400 scale-110">
              <Cloud className="w-10 h-10 animate-pulse" />
            </div>
            
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-md font-bold text-slate-200">
                {lang === 'TR' ? 'Google Bulut Kaydı Aktif Değil' : 'Google Cloud Saves Offline'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'TR' 
                  ? 'Kayıtsız yerel hafıza kaldırılmıştır. Artık tüm ilerleme kayıtları Google hesabınıza güvenli ve bulut tabanlı olarak kaydedilir.' 
                  : 'We have migrated to cloud-only backups. Please log in with Google to save or load election campaigns securely.'}
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full max-w-xs py-3 px-6 font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <LogIn className="w-4 h-4" /> Google ile Giriş Yap / Sign In
            </button>
          </div>
        ) : (
          /* LOGGED IN USER INTERFACE */
          <div className="flex flex-col h-full max-h-[500px]">
            {/* User Profile Info Status Ribbon */}
            <div className="bg-slate-950/60 border-b border-slate-850 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'TR' ? 'Bağlı Hesap' : 'Logged in'}: <strong className="text-slate-200">{user.displayName || user.email}</strong>
                </span>
              </div>
              <button 
                onClick={async () => { playSound.playClick(); await logoutUser(); }}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider hover:underline"
              >
                {lang === 'TR' ? 'Çıkış Yap' : 'Log Out'}
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 text-xs text-rose-400 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Save Current State Form (Only if game is active) */}
            {currentGameState && currentScreen !== 'HOME' && currentScreen !== 'CREATE' && (
              <form onSubmit={handleSaveCampaign} className="p-6 bg-slate-950/30 border-b border-slate-850 space-y-2">
                <span className="text-[10px] uppercase font-black text-blue-400 tracking-wider block">
                  {lang === 'TR' ? 'Mevcut İlerlemeyi Buluta Kaydet' : 'Backup Ongoing Campaign'}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSaveName}
                    onChange={(e) => setNewSaveName(e.target.value)}
                    placeholder={lang === 'TR' ? 'Kayıt başlığı girin (örn: İstanbul Mitingi Sonrası)' : 'Enter save backup title...'}
                    maxLength={50}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none placeholder-slate-600 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={savingState}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 shadow-lg shadow-blue-600/10"
                  >
                    {savingState ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {lang === 'TR' ? 'Kaydet' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {/* Cloud Saves List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider block">
                {lang === 'TR' ? 'Buluttaki Kayıtlı Dosyalarınız' : 'Your Cloud Campaign Saves'}
              </span>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                  <span>{lang === 'TR' ? 'Bulut sunucusuna bağlanılıyor...' : 'Synching cloud server...'}</span>
                </div>
              ) : cloudSaves.length === 0 ? (
                <div className="py-12 text-center rounded-xl border border-dashed border-slate-850 p-4 text-slate-500">
                  <FolderOpen className="w-8 h-8 text-slate-600 mx-auto mb-2 scale-90" />
                  <p className="text-xs font-bold text-slate-400">{lang === 'TR' ? 'Hiç kayıt dosyası bulunamadı' : 'No cloud saves found'}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{lang === 'TR' ? 'Aktif bir kampanyadayken yukarıdaki formdan kayıt oluşturabilirsiniz.' : 'Create a fresh save using the format above during active gaming sessions.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cloudSaves.map((item) => {
                    const party = getSavedPartyInfo(item);
                    const week = getSavedWeekInfo(item);
                    const difficulty = getSavedDifficulty(item);
                    return (
                      <div 
                        key={item.id}
                        className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-200 truncate pr-2">
                            {item.saveName}
                          </h4>
                          
                          {party && (
                            <div className="flex items-center gap-x-3 gap-y-1 text-xs text-slate-400 flex-wrap">
                              <span 
                                className="text-[9px] font-black uppercase px-1 py-0.2 rounded font-sans"
                                style={{ backgroundColor: `${party.color}15`, color: party.color, border: `1px solid ${party.color}25` }}
                              >
                                {party.shortName}
                              </span>
                              <span className="font-semibold">{party.leader}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-amber-500 text-[11px] font-bold">%{party.support?.toFixed(1)}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400">{lang === 'TR' ? 'Hafta' : 'Week'} {week}/15</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                            <Calendar className="w-3.5 h-3.5 text-slate-600" />
                            <span>{item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleString('tr-TR') : ''}</span>
                            <span className="bg-slate-850 text-slate-400 px-1 py-0.2 rounded font-sans uppercase font-bold text-[8px]">
                              {difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 border border-slate-880 p-1 rounded-lg">
                              <span className="text-[10px] font-bold text-rose-400 shrink-0">{lang === 'TR' ? 'Silinsin mi?' : 'Delete?'}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); executeDeleteCampaign(item.id); }}
                                className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black py-0.5 px-2 rounded transition shrink-0 cursor-pointer"
                              >
                                {lang === 'TR' ? 'Evet' : 'Yes'}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black py-0.5 px-2 rounded transition shrink-0 cursor-pointer"
                              >
                                {lang === 'TR' ? 'Hayır' : 'No'}
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleLoadCampaign(item)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black py-1.5 px-3.5 rounded-lg shadow-md shrink-0 transition cursor-pointer active:scale-95"
                              >
                                {lang === 'TR' ? 'Yükle' : 'Load'}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); playSound.playClick(); setDeleteConfirmId(item.id); }}
                                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-900 text-slate-500 hover:text-rose-400 transition cursor-pointer active:scale-90"
                                title={lang === 'TR' ? 'Sil' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cloud banner sync footer message */}
            <div className="px-6 py-3 border-t border-slate-850 bg-slate-950/40 text-center select-none shrink-0">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                🛡️ GOOGLE SECURE CAMPAIGN DATA PROTECTION ENFORCED
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
