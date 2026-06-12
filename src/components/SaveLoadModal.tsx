import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, FolderOpen, Trash2, X, Shield, Calendar, Award, Landmark, RefreshCw, CircleAlert } from 'lucide-react';
import { GameState } from '../types';
import { playSound } from '../utils/audio';

interface SaveSlot {
  slotId: number;
  isEmpty: boolean;
  savedAt?: string;
  gameState?: GameState;
  screen?: 'DASHBOARD' | 'ELECTION';
}

interface SaveLoadModalProps {
  currentGameState: GameState | null;
  currentScreen: 'HOME' | 'CREATE' | 'DASHBOARD' | 'ELECTION';
  onClose: () => void;
  onLoadGame: (savedState: GameState, screen: 'DASHBOARD' | 'ELECTION') => void;
}

export default function SaveLoadModal({
  currentGameState,
  currentScreen,
  onClose,
  onLoadGame
}: SaveLoadModalProps) {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'SAVE' | 'LOAD'>(
    currentGameState && currentScreen !== 'HOME' ? 'SAVE' : 'LOAD'
  );

  // Load slot metadata from localStorage on mount
  useEffect(() => {
    loadSlotsFromStorage();
  }, []);

  const loadSlotsFromStorage = () => {
    const loadedSlots: SaveSlot[] = [];
    for (let i = 1; i <= 5; i++) {
      const dataStr = localStorage.getItem(`secim_sim_save_slot_${i}`);
      if (dataStr) {
        try {
          const parsed = JSON.parse(dataStr);
          loadedSlots.push({
            slotId: i,
            isEmpty: false,
            savedAt: parsed.savedAt,
            gameState: parsed.gameState,
            screen: parsed.screen
          });
        } catch (e) {
          console.error(`Error parsing save slot ${i}:`, e);
          loadedSlots.push({ slotId: i, isEmpty: true });
        }
      } else {
        loadedSlots.push({ slotId: i, isEmpty: true });
      }
    }
    setSlots(loadedSlots);
  };

  // Save current state to a specific slot
  const handleSaveToSlot = (slotId: number) => {
    if (!currentGameState) return;
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

    localStorage.setItem(`secim_sim_save_slot_${slotId}`, JSON.stringify(saveObj));
    loadSlotsFromStorage();
  };

  // Load a specific slot
  const handleLoadFromSlot = (slot: SaveSlot) => {
    if (slot.isEmpty || !slot.gameState || !slot.screen) return;
    playSound.playClick();
    onLoadGame(slot.gameState, slot.screen);
    onClose();
  };

  // Delete/Clear a specific slot
  const handleDeleteSlot = (slotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound.playClick();
    if (confirm(`Slot ${slotId} içindeki kayıtlı oyunu silmek istediğinize emin misiniz?`)) {
      localStorage.removeItem(`secim_sim_save_slot_${slotId}`);
      loadSlotsFromStorage();
    }
  };

  // Helper to find the player party support in a saved state
  const getPlayerPartyInfo = (gameState?: GameState) => {
    if (!gameState) return null;
    const player = gameState.parties.find(p => p.isPlayer);
    return player || null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans"
      >
        {/* Colorful top border indicator */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-850">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-400" /> Bulutsuz Yerel Kayıt Girişimi
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Güvenli yerel kayıt sistemi (Local Storage) ile 5 slotta eşzamanlı ilerleme takibi.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Notification - No Account Required */}
        <div className="bg-blue-950/40 border-b border-blue-900/30 px-6 py-3 flex items-center gap-3 text-slate-300">
          <Shield className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-xs leading-relaxed">
            <strong className="text-blue-300">Oturum açmanıza gerek yoktur!</strong> Kayıtlarınız tarayıcınızın belleğinde saklanır. Tarayıcı önbelleğinizi temizlemediğiniz sürece dilediğiniz an kaldığınız yerden devam edebilirsiniz.
          </p>
        </div>

        {/* Tab Controls */}
        {currentGameState && currentScreen !== 'HOME' && (
          <div className="flex border-b border-slate-850 font-semibold text-xs">
            <button
              onClick={() => { playSound.playClick(); setActiveTab('SAVE'); }}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer uppercase tracking-wider ${
                activeTab === 'SAVE' 
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Oyunu Kaydet
              </span>
            </button>
            <button
              onClick={() => { playSound.playClick(); setActiveTab('LOAD'); }}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer uppercase tracking-wider ${
                activeTab === 'LOAD' 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FolderOpen className="w-4 h-4" /> Oyunu Yükle
              </span>
            </button>
          </div>
        )}

        {/* Slots Content List */}
        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
          {slots.map((slot) => {
            const playerInfo = getPlayerPartyInfo(slot.gameState);
            
            return (
              <div 
                key={slot.slotId}
                className={`group relative p-4 rounded-xl border transition-all ${
                  slot.isEmpty 
                    ? 'border-slate-800 bg-slate-950/20 text-slate-500 hover:border-slate-700' 
                    : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-950/40 hover:border-indigo-500/40 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Slot identifier / stats */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      slot.isEmpty 
                        ? 'bg-slate-800 text-slate-500' 
                        : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {slot.slotId}
                    </div>

                    <div>
                      {slot.isEmpty ? (
                        <div>
                          <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Slot {slot.slotId} - Boş Yuva</h4>
                          <p className="text-xs text-slate-600">Herhangi bir kayıtlı veri bulunmuyor.</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-200">
                              {playerInfo?.name || 'Bilinmeyen Parti'}
                            </h4>
                            <span 
                              className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                              style={{ 
                                backgroundColor: `${playerInfo?.color}15`, 
                                color: playerInfo?.color,
                                border: `1px solid ${playerInfo?.color}30`
                              }}
                            >
                              {playerInfo?.shortName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">({playerInfo?.ideology})</span>
                          </div>

                          <div className="flex items-center gap-x-4 gap-y-1 text-xs text-slate-400 flex-wrap font-mono">
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              Destek: <strong className="text-slate-200">%{playerInfo?.support?.toFixed(1) || '0.0'}</strong>
                            </span>
                            <span>•</span>
                            <span className="text-slate-400">
                              Hafta: <strong className="text-slate-200">{slot.gameState?.currentWeek || 1}/15</strong>
                            </span>
                            <span>•</span>
                            <span className="text-emerald-500 font-bold">
                              {playerInfo?.budget?.toLocaleString('tr-TR') || '0'} ₺
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            Kayıt Tarihi: {slot.savedAt}
                            <span className="bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-sans uppercase font-bold tracking-wider scale-90">
                              {slot.gameState?.difficulty}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this slot */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* SAVE Action (Only shows or is active if we want to save and we are in active game) */}
                    {currentGameState && (
                      <button
                        onClick={() => handleSaveToSlot(slot.slotId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          activeTab === 'SAVE'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/10'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Bu yuvaya mevcut oyunu kaydet"
                      >
                        <Save className="w-3.5 h-3.5" /> 
                        {slot.isEmpty ? 'Kaydet' : 'Üzerine Yaz'}
                      </button>
                    )}

                    {/* LOAD Action (Only if slot is not empty) */}
                    {!slot.isEmpty && (
                      <button
                        onClick={() => handleLoadFromSlot(slot)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-indigo-600/15 transition-all cursor-pointer flex items-center gap-1"
                        title="Kayıtlı oyunu yükle"
                      >
                        <FolderOpen className="w-3.5 h-3.5" /> Yükle
                      </button>
                    )}

                    {/* DELETE Action (Only if slot is not empty) */}
                    {!slot.isEmpty && (
                      <button
                        onClick={(e) => handleDeleteSlot(slot.slotId, e)}
                        className="p-1.5 bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-900/40 rounded-lg transition-colors cursor-pointer"
                        title="Kayıt dosyasını sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex justify-between items-center text-xs text-slate-500 px-6">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-500" /> %100 Güvenli & Çevrimdışı Bellek
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
}
