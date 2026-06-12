import React, { useState } from 'react';
import { Difficulty, Ideology, PortraitConfig } from '../types';
import { Sparkles, Landmark, User, Shield, Check, Palette } from 'lucide-react';
import LeaderPortrait from './LeaderPortrait';

interface CreatePartyProps {
  onStart: (data: {
    liderAd: string;
    partiAd: string;
    kisaAd: string;
    renk: string;
    ideoloji: Ideology;
    difficulty: Difficulty;
    portrait: PortraitConfig;
  }) => void;
}

export default function CreateParty({ onStart }: CreatePartyProps) {
  const [liderAd, setLiderAd] = useState('');
  const [partiAd, setPartiAd] = useState('');
  const [kisaAd, setKisaAd] = useState('');
  const [renk, setRenk] = useState('#2563eb');
  const [ideoloji, setIdeoloji] = useState<Ideology>(Ideology.SOSYAL_DEMOKRAT);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);

  // Portrait Customization States
  const [hairType, setHairType] = useState<PortraitConfig['hairType']>('classic');
  const [hairColor, setHairColor] = useState('#4b5563');
  const [glassesType, setGlassesType] = useState<PortraitConfig['glassesType']>('none');
  const [mustacheType, setMustacheType] = useState<PortraitConfig['mustacheType']>('none');
  const [skinTone, setSkinTone] = useState('#fed7aa');
  const [suitColor, setSuitColor] = useState('#1e293b');
  const [tieColor, setTieColor] = useState('#2563eb');
  const [expression, setExpression] = useState<PortraitConfig['expression']>('confident');

  const predefinedColors = [
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#ea580c', // Orange
    '#8b5cf6', // Violet
    '#0d9488', // Teal
    '#db2777', // Pink
    '#eab308', // Yellow
    '#0f172a', // Charcoal Slate
  ];

  // Colors specialized for avatars
  const skinTones = ['#ffedd5', '#fed7aa', '#fde047', '#fbcfe8', '#e2e8f0'];
  const hairColors = ['#111827', '#4b5563', '#a1a1aa', '#b45309', '#d97706', '#d1d5db'];
  const suitColors = ['#0f172a', '#1e293b', '#1e3a8a', '#14532d', '#581c87', '#374151'];
  const tieColors = ['#dc2626', '#ea580c', '#2563eb', '#16a34a', '#8b5cf6', '#eab308', '#000000'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liderAd.trim() || !partiAd.trim() || !kisaAd.trim()) return;
    onStart({
      liderAd: liderAd.trim(),
      partiAd: partiAd.trim(),
      kisaAd: kisaAd.trim().toUpperCase(),
      renk,
      ideoloji,
      difficulty,
      portrait: {
        hairType,
        hairColor,
        glassesType,
        mustacheType,
        skinTone,
        suitColor,
        tieColor,
        expression
      }
    });
  };

  const currentPortrait: PortraitConfig = {
    hairType,
    hairColor,
    glassesType,
    mustacheType,
    skinTone,
    suitColor,
    tieColor,
    expression
  };

  return (
    <div id="create-party-screen" className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in text-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-full text-blue-400 mb-3">
          <Landmark className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Siyasi Arenaya Adım Atın
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Karakterinizi ve portrenizi oluşturun, partinizi kurun ve Türkiye seçimlerine hazırlanın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: Leader and Party Details Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Lider & Parti Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Lider Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={liderAd}
                  onChange={(e) => setLiderAd(e.target.value)}
                  placeholder="Örn: Serkan Yılmaz"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-slate-100 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Parti Tam Adı
                </label>
                <input
                  type="text"
                  required
                  value={partiAd}
                  onChange={(e) => setPartiAd(e.target.value)}
                  placeholder="Örn: Büyük Atılım Partisi"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-slate-100 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Kısa Ad & Renk Seçici */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Parti Kısa Adı
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={kisaAd}
                  onChange={(e) => setKisaAd(e.target.value)}
                  placeholder="BAP"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm font-bold text-center tracking-wider text-slate-100 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Parti Kurumsal Rengi
                </label>
                <div className="flex flex-wrap gap-2 items-center p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                  {predefinedColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setRenk(c)}
                      className="w-7 h-7 rounded-lg relative cursor-pointer active:scale-95 transition-transform"
                      style={{ backgroundColor: c }}
                    >
                      {renk === c && (
                        <span className="absolute inset-0 flex items-center justify-center text-white bg-black/25 rounded-lg">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                    <input
                      type="color"
                      value={renk}
                      onChange={(e) => {
                        setRenk(e.target.value);
                        setTieColor(e.target.value); // Sync tie with party color context
                      }}
                      className="absolute inset-x-0 inset-y-0 w-12 h-12 -translate-x-1 -translate-y-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* İdeoloji Seçimi */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Temel İdeoloji ve Vizyon
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.values(Ideology).map((ideol) => (
                  <button
                    key={ideol}
                    type="button"
                    onClick={() => setIdeoloji(ideol)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                      ideoloji === ideol
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ideol}
                  </button>
                ))}
              </div>
            </div>

            {/* Zorluk Derecesi */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Zorluk Seviyesi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: Difficulty.KOLAY,
                    label: 'Kolay',
                    desc: '10M ₺ Bütçe, %5 başlangıç oy desteği, medya desteği.',
                    border: 'border-emerald-500/20 hover:border-emerald-500/40',
                    active: 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  },
                  {
                    id: Difficulty.NORMAL,
                    label: 'Normal',
                    desc: '3M ₺ Bütçe, %1.5 başlangıç oy desteği, dengeli ilişkiler.',
                    border: 'border-blue-500/20 hover:border-blue-500/40',
                    active: 'bg-blue-500/10 border-blue-500 text-blue-400'
                  },
                  {
                    id: Difficulty.ZOR,
                    label: 'Zor (Efsane)',
                    desc: '500Bin ₺ Bütçe, %0.5 başlangıç oy desteği, ambargolu medya.',
                    border: 'border-rose-500/20 hover:border-rose-500/40',
                    active: 'bg-rose-500/10 border-rose-500 text-rose-400'
                  }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 text-left rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                      difficulty === d.id ? d.active : `bg-slate-950/50 text-slate-400 ${d.border}`
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{d.label}</div>
                    <div className="text-[11px] opacity-80">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Portrait/Face Generator (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/50 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between gap-5 shadow-inner">
            <div className="text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-400" /> Lider Karikatür Çizimi (2D)
              </span>
              
              <div className="flex justify-center py-4 bg-slate-900/50 rounded-xl border border-slate-850 relative group">
                <LeaderPortrait
                  portrait={currentPortrait}
                  size={120}
                  className="transition-transform group-hover:scale-105 duration-200"
                />
                <span className="absolute bottom-2 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800 text-[10px] font-mono text-slate-400">
                  {liderAd || 'Görünüm Önizleme'}
                </span>
              </div>
            </div>

            {/* Customizer Option Categories */}
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 text-xs scrollable-content">
              
              {/* Hair Selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Saç Tarzı ve Rengi:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'classic', label: 'Klasik' },
                    { id: 'parted', label: 'Yandan' },
                    { id: 'full', label: 'Gür' },
                    { id: 'wavy', label: 'Dalgalı' },
                    { id: 'shaved', label: 'Seyrek/Kel' }
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHairType(h.id as PortraitConfig['hairType'])}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        hairType === h.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-350'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
                {/* Hair Color Palette */}
                <div className="flex gap-1.5 items-center mt-1">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setHairColor(color)}
                      className="w-5 h-5 rounded-full relative border border-slate-700 cursor-pointer active:scale-90 transition-transform"
                      style={{ backgroundColor: color }}
                    >
                      {hairColor === color && <span className="absolute inset-0 bg-white/30 rounded-full border border-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facial Hair / Mustache Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-405 block">Sakal & Bıyık Modeli (Siyasi Tarz):</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'none', label: 'Sinek Kaydı' },
                    { id: 'thin', label: 'Trim Siyasetçi' },
                    { id: 'political', label: 'Gür Hilal' },
                    { id: 'thick', label: 'Gür Sakal-Bıyık' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMustacheType(m.id as PortraitConfig['mustacheType'])}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        mustacheType === m.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-350'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glasses Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-405 block">Gözlük Tipi:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'none', label: 'Yok' },
                    { id: 'classic', label: 'Dikdörtgen' },
                    { id: 'round', label: 'Yuvarlak' },
                    { id: 'bold', label: 'Kalın Siyah' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGlassesType(g.id as PortraitConfig['glassesType'])}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        glassesType === g.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-350'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Demographics / Skin Tone */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-405 block">Cilt Tonu:</span>
                <div className="flex gap-2 items-center">
                  {skinTones.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setSkinTone(tone)}
                      className="w-6 h-6 rounded-lg relative border border-slate-800 cursor-pointer active:scale-90 transition-transform"
                      style={{ backgroundColor: tone }}
                    >
                      {skinTone === tone && <span className="absolute inset-0 bg-white/20 border-2 border-indigo-500 rounded-lg" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfits (Suit & Tie) */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-405 block mb-1">Takım Elbise Rengi:</span>
                  <div className="flex gap-2 items-center">
                    {suitColors.map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setSuitColor(sc)}
                        className="w-5 h-5 rounded relative border border-slate-800 cursor-pointer"
                        style={{ backgroundColor: sc }}
                      >
                        {suitColor === sc && <span className="absolute inset-0 border-2 border-white rounded" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-405 block mb-1">Kravat Rengi:</span>
                  <div className="flex gap-2 items-center">
                    {tieColors.map((tc) => (
                      <button
                        key={tc}
                        type="button"
                        onClick={() => setTieColor(tc)}
                        className="w-5 h-5 rounded relative border border-slate-800 cursor-pointer"
                        style={{ backgroundColor: tc }}
                      >
                        {tieColor === tc && <span className="absolute inset-x-0 inset-y-0 border border-white rounded" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Character Expression */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-405 block">Duruş / İfade:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'confident', label: 'Özgüvenli' },
                    { id: 'serious', label: 'Makaralar Sıkı' },
                    { id: 'happy', label: 'Gülümseyen' },
                    { id: 'neutral', label: 'Ciddi/Nötr' }
                  ].map((expr) => (
                    <button
                      key={expr.id}
                      type="button"
                      onClick={() => setExpression(expr.id as PortraitConfig['expression'])}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        expression === expr.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-355'
                      }`}
                    >
                      {expr.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={!liderAd.trim() || !partiAd.trim() || !kisaAd.trim()}
          className="w-full mt-4 py-3.5 px-6 font-bold text-sm text-center uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 pointer-events-auto"
        >
          Kurucu Lider Olarak Yarışa Katıl!
        </button>
      </form>
    </div>
  );
}
