import React from 'react';
import { motion } from 'motion/react';
import { Landmark, Sparkles, Star, Users, Briefcase, Award, Zap } from 'lucide-react';
import { Party } from '../types';
import { playSound } from '../utils/audio';

interface KurultayModalProps {
  playerParty: Party;
  onSelectPath: (pathId: string) => void;
  onClose: () => void;
}

export default function KurultayModal({ playerParty, onSelectPath, onClose }: KurultayModalProps) {
  React.useEffect(() => {
    // Play a grand welcoming gong and active crowd chanting/cheering when organizing the congress
    playSound.playGong();
    playSound.playKurultayCrowd();
  }, []);

  const allPaths = [
    {
      id: 'birlik',
      title: 'Birlik ve Dayanışma Kurultayı',
      tagline: 'Gelin Canlar Bir Olalım',
      description: 'Liderliğinizi pekiştirerek tüm muhalif ve iktidar partileriyle ilişkileri yumuşatın. Tam uzlaşı ve barış rüzgarları estirin.',
      benefits: 'Tüm siyasi partilerle ilişki seviyesi +15 puan artar. İttifak masası davetleriniz çok daha kolay kabul görür.',
      icon: <Users className="w-6 h-6 text-emerald-400 animate-pulse" />,
      themeColor: 'border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-950/20 bg-emerald-950/5',
      badgeColor: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'degisim',
      title: 'Değişim ve Reform Kurultayı',
      tagline: 'Gelecek Özgürlükle Gelecek',
      description: 'Sosyal demokrat, liberal ve seküler kitlelerin ana adresi olun. Siyasette köklü vizyon değişimi vaat edin.',
      benefits: 'Sosyal Demokrat ve Liberal seçmen dilimlerinde oy oranınız %1.5 artış gösterir, medya ilginiz zirveye ulaşır.',
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      themeColor: 'border-cyan-500/30 hover:border-cyan-500 hover:shadow-cyan-950/20 bg-cyan-950/5',
      badgeColor: 'bg-cyan-500/10 text-cyan-400'
    },
    {
      id: 'sahlanis',
      title: 'Milli Şahlanış Kurultayı',
      tagline: 'Yerli, Milli ve Güçlü Yarınlar',
      description: 'Anadolu’nun muhafazakar ve milliyetçi oylarına talip olun. Tarihsel ve yerli duruşunuzla köklü tabana seslenin.',
      benefits: 'Muhafazakar ve Milliyetçi seçmen dilimlerinde %1.5 support sıçraması elde ederek rakiplerinizin seçmen tabanını eritin.',
      icon: <Star className="w-6 h-6 text-amber-400" />,
      themeColor: 'border-amber-500/30 hover:border-amber-500 hover:shadow-amber-950/20 bg-amber-950/5',
      badgeColor: 'bg-amber-500/10 text-amber-400'
    },
    {
      id: 'teknoloji',
      title: 'Ekonomi ve Teknoloji Kurultayı',
      tagline: 'Bilim, Akıl ve Refah Çağı',
      description: 'Ekonomiyi ayağa kaldıracak, rasyonel ve modern bir kalkınma manifestosu açıklayın. İş dünyasını partinize çekin.',
      benefits: 'Genel destek %+1.2 yükselir ve teknokrat delegelerin desteğiyle 500.000 ₺ ek bağış doğrudan kasanıza geri kazandırılır.',
      icon: <Briefcase className="w-6 h-6 text-pink-400" />,
      themeColor: 'border-pink-500/30 hover:border-pink-500 hover:shadow-pink-950/20 bg-pink-950/5',
      badgeColor: 'bg-pink-500/10 text-pink-400'
    },
    {
      id: 'emek',
      title: 'Emek ve Sosyal Adalet Kurultayı',
      tagline: 'Alın Teri Kutsaldır',
      description: 'Emeğin, sendikaların ve her bir asgari ücretli canımızın sesi olun. Gelir adaletini ve taban haklarını en yüksek sesle savunun.',
      benefits: 'Sosyalist ve Sosyal Demokrat oylarını domine edin. TİP, DEM ve CHP ile ilişkileriniz güçlenir ama iktidar cephesi sertleşir.',
      icon: <Users className="w-6 h-6 text-red-400" />,
      themeColor: 'border-red-500/30 hover:border-red-500 hover:shadow-red-950/20 bg-red-950/5',
      badgeColor: 'bg-red-500/10 text-red-400'
    },
    {
      id: 'dis_politika',
      title: 'Küresel Diplomasi Kurultayı',
      tagline: 'Barış ve Güvenlik',
      description: 'Uluslararası saygınlık, sınır güvenliği ve rasyonel mülteci vizyonunuzu ilan edin. Seçmene güven telkin edin.',
      benefits: 'Bütün partilerle diplomatik temas ve ilişkileriniz +10 ila +15 puan civarı yükselerek ittifak gücünüzü artırır.',
      icon: <Landmark className="w-6 h-6 text-blue-400" />,
      themeColor: 'border-blue-500/30 hover:border-blue-500 hover:shadow-blue-950/20 bg-blue-950/5',
      badgeColor: 'bg-blue-500/10 text-blue-400'
    },
    {
      id: 'genclik',
      title: 'Gençlik ve Hürriyet Kurultayı',
      tagline: 'Gençlik Gelecektir',
      description: 'Gençlerin özgürce yaşayacağı, dijital kısıtlamaların kalktığı ve festivallerin hür olduğu sansürsüz Türkiye vizyonu sunun.',
      benefits: 'Tüm Türkiye genelinde destek oranınız doğrudan %+1.6 fırlar. Özellikle ilk defa oy kullanacak gençlerin sevgisini kazanın.',
      icon: <Zap className="w-6 h-6 text-violet-400" />,
      themeColor: 'border-violet-500/30 hover:border-violet-500 hover:shadow-violet-950/20 bg-violet-950/5',
      badgeColor: 'bg-violet-500/10 text-violet-400'
    },
    {
      id: 'cevre_tarim',
      title: 'Yeşil Kalkınma ve Tarım Kurultayı',
      tagline: 'Toprak ve Hayat',
      description: 'Betonlaşmaya dur deyin, asırlık Anadolu tarımını modern kooperatiflerle canlandırın ve gıda bağımsızlığı vaat edin.',
      benefits: 'Çiftçilerin ve Anadolu halkının büyük desteğini toplayın. Hazineden tarım delege desteğiyle 200.000 ₺ doğrudan hibe alın.',
      icon: <Star className="w-6 h-6 text-emerald-400" />,
      themeColor: 'border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-950/20 bg-emerald-950/5',
      badgeColor: 'bg-emerald-500/10 text-emerald-400'
    }
  ];

  const paths = React.useMemo(() => {
    return [...allPaths].sort(() => Math.random() - 0.5).slice(0, 4);
  }, []);

  const handleSelect = (id: string) => {
    playSound.playSuccess();
    onSelectPath(id);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900 text-slate-100 flex flex-col shadow-2xl shadow-indigo-950/10"
      >
        {/* Arena Header Spotlight */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-800 to-indigo-950 px-6 py-5 flex items-center justify-between border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          {/* Animated beam spotlight effect */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 animate-pulse"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 blink-pulse shadow-lg">
              <Landmark className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-300 block">OLAĞANÜSTÜ BÜYÜK KONGRE</span>
              <h2 className="text-lg font-extrabold text-blue-50 leading-snug flex items-center gap-1.5 uppercase">
                {playerParty.shortName} ULUSAL KURULTAYI
              </h2>
            </div>
          </div>

          <button
            onClick={() => { playSound.playClick(); onClose(); }}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

        {/* Scrollable contents */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 scrollable-content">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-200 flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-amber-400" /> Ankara Arena'da Kürsü Sizin!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Binlerce delege, parti kurmaylarınız ve Türkiye genelinden gelen heyecanlı destekçi kitleleri sloganlar eşliğinde sizi bekliyor. Yapacağınız manifesto açıklaması, bu seçimin kaderini kökten belirleyecek. 
              Lütfen kurultayınızın ana felsefesini seçin:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paths.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(p.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${p.themeColor} hover:shadow-xl group`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl group-hover:bg-slate-950 transition-colors">
                      {p.icon}
                    </div>
                    <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${p.badgeColor}`}>
                      {p.tagline}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-100 text-sm group-hover:text-blue-300 transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-850/50 flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">KURULTAY VAADİ VE ETKİSİ</span>
                  <p className="text-[11px] font-bold text-slate-300 leading-relaxed font-sans">
                    ✨ {p.benefits}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="flex-shrink-0 bg-slate-950 border-t border-slate-850 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Kongre Maliyeti: <strong className="text-slate-300">-1.000.000 ₺</strong>
          </span>
          <span>Bütün delegeleriniz ve Türkiye basını sizden gelecek sözleri bekliyor!</span>
        </div>
      </motion.div>
    </div>
  );
}
