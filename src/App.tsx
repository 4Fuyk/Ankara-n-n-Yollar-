import { useState, useEffect } from 'react';
import {
  Party,
  Province,
  Alliance,
  Difficulty,
  Ideology,
  PoliticalEvent,
  GameLog,
  GameState,
  CitizenChat,
  TbmmSession
} from './types';
import { provincesData, regions } from './data/regions';
import { politicalEvents } from './data/events';
import { tbmmSessions } from './data/tbmm';
import CreateParty from './components/CreateParty';
import MainDashboard from './components/MainDashboard';
import ElectionNight from './components/ElectionNight';
import RivalInteractionModal from './components/RivalInteractionModal';
import CitizenChatModal from './components/CitizenChatModal';
import KurultayModal from './components/KurultayModal';
import TbmmModal from './components/TbmmModal';
import SaveLoadModal from './components/SaveLoadModal';
import MultiplayerLobby from './components/MultiplayerLobby';
import { playSound } from './utils/audio';
import { Language, translations } from './utils/languages';
import { loginWithGoogle, logoutUser, onAuthStateChanged, auth } from './utils/firebase';
import { Landmark, ArrowRight, Sparkles, Trophy, Award, Volume2, VolumeX, Save, Cloud, LogIn, LogOut, Users, Globe, Sun, Moon, AlertTriangle, ExternalLink } from 'lucide-react';

const RAKIP_PARTILER: Party[] = [
  { id: '1', name: 'Adalet ve Kalkınma Partisi', shortName: 'AK Parti', leader: 'Recep Tayyip Erdoğan', color: '#ff7a00', ideology: Ideology.MUHAFAZAKAR, support: 0, budget: 15000000, isPlayer: false, allianceId: 'cumhur', relationshipWithPlayer: -20, basePopularity: 1.0, popularityTrends: [], tenureYears: 23 },
  { id: '2', name: 'Cumhuriyet Halk Partisi', shortName: 'CHP', leader: 'Özgür Özel', color: '#dc2626', ideology: Ideology.SOSYAL_DEMOKRAT, support: 0, budget: 12000000, isPlayer: false, allianceId: 'millet', relationshipWithPlayer: 10, basePopularity: 1.0, popularityTrends: [], tenureYears: 3 },
  { id: '3', name: 'Milliyetçi Hareket Partisi', shortName: 'MHP', leader: 'Devlet Bahçeli', color: '#800000', ideology: Ideology.MILLIYETCI, support: 0, budget: 5000000, isPlayer: false, allianceId: 'cumhur', relationshipWithPlayer: -15, basePopularity: 0.9, popularityTrends: [], tenureYears: 29 },
  { id: '4', name: 'Halkların Eşitliği ve Demokrasi Partisi', shortName: 'DEM Parti', leader: 'Tülay Hatimoğulları', color: '#800080', ideology: Ideology.SOSYALIST, support: 0, budget: 3000000, isPlayer: false, allianceId: null, relationshipWithPlayer: -30, basePopularity: 0.8, popularityTrends: [], tenureYears: 3 },
  { id: '5', name: 'İYİ Parti', shortName: 'İYİ Parti', leader: 'Müsavat Dervişoğlu', color: '#00ccff', ideology: Ideology.MILLIYETCI, support: 0, budget: 4000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 15, basePopularity: 0.7, popularityTrends: [], tenureYears: 2 },
  { id: '6', name: 'Yeniden Refah Partisi', shortName: 'YRP', leader: 'Fatih Erbakan', color: '#16a34a', ideology: Ideology.MUHAFAZAKAR, support: 0, budget: 2000000, isPlayer: false, allianceId: null, relationshipWithPlayer: -5, basePopularity: 0.6, popularityTrends: [], tenureYears: 8 },
  { id: '7', name: 'Zafer Partisi', shortName: 'Zafer', leader: 'Ümit Özdağ', color: '#991b1b', ideology: Ideology.MILLIYETCI, support: 0, budget: 1500000, isPlayer: false, allianceId: null, relationshipWithPlayer: 0, basePopularity: 0.5, popularityTrends: [], tenureYears: 5 },
  { id: '8', name: 'Türkiye İşçi Partisi', shortName: 'TİP', leader: 'Erkan Baş', color: '#bf1d1d', ideology: Ideology.SOSYALIST, support: 0, budget: 1000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 5, basePopularity: 0.4, popularityTrends: [], tenureYears: 9 },
  { id: '9', name: 'Saadet Partisi', shortName: 'Saadet', leader: 'Mahmut Arıkan', color: '#ea580c', ideology: Ideology.MUHAFAZAKAR, support: 0, budget: 1000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 15, basePopularity: 0.45, popularityTrends: [], tenureYears: 2 },
  { id: '14', name: 'Gelecek Partisi', shortName: 'Gelecek', leader: 'Ahmet Davutoğlu', color: '#0f766e', ideology: Ideology.MUHAFAZAKAR, support: 0, budget: 1000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 20, basePopularity: 0.4, popularityTrends: [], tenureYears: 6 },
  { id: '10', name: 'Demokrasi ve Atılım Partisi', shortName: 'DEVA', leader: 'Ali Babacan', color: '#1e3a8a', ideology: Ideology.LIBERAL, support: 0, budget: 2000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 20, basePopularity: 0.4, popularityTrends: [], tenureYears: 6 },
  { id: '11', name: 'Vatan Partisi', shortName: 'VP', leader: 'Doğu Perinçek', color: '#d97706', ideology: Ideology.MILLIYETCI, support: 0, budget: 500000, isPlayer: false, allianceId: null, relationshipWithPlayer: 0, basePopularity: 0.3, popularityTrends: [], tenureYears: 46 },
  { id: '12', name: 'Türkiye Komünist Partisi', shortName: 'TKP', leader: 'Kemal Okuyan', color: '#ff0000', ideology: Ideology.SOSYALIST, support: 0, budget: 400000, isPlayer: false, allianceId: null, relationshipWithPlayer: 10, basePopularity: 0.25, popularityTrends: [], tenureYears: 14 },
  { id: '13', name: 'Anahtar Parti', shortName: 'A Parti', leader: 'Yavuz Ağıralioğlu', color: '#0d9488', ideology: Ideology.MILLIYETCI, support: 0, budget: 2000000, isPlayer: false, allianceId: null, relationshipWithPlayer: 15, basePopularity: 0.5, popularityTrends: [], tenureYears: 2 }
];

const CITIZEN_CHATS: CitizenChat[] = [
  {
    id: 'chat_eminonu',
    location: 'İstanbul - Eminönü Tarihi Çarşı',
    groupName: 'Tarihi Çarşı Esnafları',
    problem: 'Efendim, dükkan kiraları ve hammadde fiyatları bizi çok zorluyor. Turistin cebindeki döviz her gün değişiyor ama bizim maliyetlerimiz gerçeği yansıtmıyor. Siz iktidara gelince esnafa can suyu bir destek programı sunacak mısınız, yoksa bizi kaderimize mi terk edeceksiniz?',
    choices: [
      {
        text: 'Esnafa Sıfır Faizli Kredi ve Kira Desteği Sözü Ver (-100.000 TL)',
        answer: 'Eminönü esnafı bu ülkenin bel kemiğidir! İlk 100 günümüzde esnafımıza sıfır faizli, 2 yıl ödemesiz can suyu kredisi sunacağız. Kira stopajını da sıfırlayacağız!',
        supportEffect: 1.5,
        budgetEffect: -100000,
        logMessage: 'ESNAF BULUŞMASI: Eminönü esnafıyla çay tazeleyip sıfır faizli kredi sözü verdik. Esnafın coşkulu desteğiyle oylarımız arttı!'
      },
      {
        text: 'Denetimleri Artırıp Enflasyonu Düşüreceğiz De (Bütçeyi Koru)',
        answer: 'Kalıcı çözüm rüzgarla gemi yürütmek değil, enflasyonu kalıcı olarak tek haneye düşürmektir. Fırsatçıları denetleyecek, maliyetleri istikrara kavuşturacağız.',
        supportEffect: 0.6,
        budgetEffect: 0,
        logMessage: 'ESNAF BULUŞMASI: Esnafa gerçekçi ekonomi politikalarını anlattık, enflasyon mücadelesine söz verdik.'
      }
    ]
  },
  {
    id: 'chat_cebeci',
    location: 'Ankara - Cebeci Öğrenci Kıraathanesi',
    groupName: 'Üniversite Gençliği',
    problem: 'Başkanım, KYK bursları sadece yol ve yemek parasına anca yetiyor. Kitap fiyatları uçtu, internetimiz çok vasat ve yurtlarda yer bulamıyoruz. Sizin kadrolarınızda gençliğe yönelik somut destek projeleri var mı, yoksa sadece gençlerin oylarına mı talipsiniz?',
    choices: [
      {
        text: 'Gençlik Destek Kartı ve Ücretsiz Sınırsız İnternet Sözü Ver (-80.000 TL)',
        answer: 'Gençlerimizin gözündeki sönük ışığı yeniden parlatacağız! Aylık 2.000 TL bakiye yüklenecek Gençlik Kartı ve tüm Türkiye\'de geçerli sınırsız ücretsiz internet paketi sunulacak!',
        supportEffect: 1.8,
        budgetEffect: -80000,
        logMessage: 'GENÇLİK SOHBETİ: Cebeci Kampüsü gençleriyle çay içip dertleştik. Gençlik Kartı vaadimiz üniversitelerde bayram havası estirdi!'
      },
      {
        text: 'Liyakat Getireceğiz, Gençlik İşsizliğini Çözeceğiz De (Sıfır Maliyet)',
        answer: 'Sizin asıl ihtiyacınız sadaka kartı değil, hakkınız olan liyakatli işlerdir. Dayısı olanın değil, beyni olanın kazandığı bir Türkiye kuracağız!',
        supportEffect: 1.2,
        budgetEffect: 0,
        logMessage: 'GENÇLİK SOHBETİ: Cebecide gençlere liyakat ve istihdam odaklı vizyonumuzu anlattık. Çok güçlü alkışlar aldık!'
      }
    ]
  },
  {
    id: 'chat_giresun',
    location: 'Giresun - Fındık Tarım Kooperatifi',
    groupName: 'Karadeniz Çiftçileri',
    problem: 'Ula Uşaklar! Fındık gübresi, mazotu, işçi yevmiyesi aldı başını gitti. Toprak Mahsulleri Ofisi (TMO) fındık taban fiyatını hep geç açıklıyor ve tüccarlar bizi sömürüyor. Bize ürettiğimiz fındığın asıl hakkını kim teslim edecek da?',
    choices: [
      {
        text: 'TMO Alım Garantili İki Kat Taban Fiyat Sözü Ver (-120.000 TL)',
        answer: 'Trabzon\'un ve Giresun\'un alın terini ezdirmeyeceğiz! fındık taban fiyatını çiftçinin maliyetinin tam iki katı olarak sabitleyeceğiz ve devlet alım garantisini getireceğiz!',
        supportEffect: 1.6,
        budgetEffect: -120000,
        logMessage: 'ÇİFTÇİ BULUŞMASI: Karadenizli çiftçilerle çayımızı yudumlayıp fındığa can veren taban fiyat projesini açıkladık. Karadeniz uşakları arkamızda!'
      },
      {
        text: 'Mazot ve Gübre Vergilerinde %50 İndirim Müjdele (-50.000 TL)',
        answer: 'Fındık fiyatıyla oynamak yetmez, asıl girdileri düşüreceğiz. Çiftçimize özel ÖTV\'siz mazot ve yarı fiyatına gübre desteğini hemen başlatacağız!',
        supportEffect: 1.4,
        budgetEffect: -50000,
        logMessage: 'ÇİFTÇİ BULUŞMASI: Tarımsal mazot desteği vaadimiz Giresun ve Ordu kırsalında oylarımızı fırlattı!'
      }
    ]
  },
  {
    id: 'chat_izmir_karsiyaka',
    location: 'İzmir - Karşıyaka Çarşısı',
    groupName: 'Emekliler Derneği Temsilcileri',
    problem: 'Sayın Liderimiz, biz yıllarca bu devlete hizmet etmiş emeklileriz. Bugün aldığımız emekli maaşı büyükşehirlerde bir evin kirasına yetmiyor. Kasap önünden geçerken başımızı öne eğiyoruz. Sizin hükümetinizde emekliyi gözetecek misiniz?',
    choices: [
      {
        text: 'Emekli Maaşını Asgari Ücretin Üstüne Çıkarma Sözü Ver (-150.000 TL)',
        answer: 'Emeklimizi bu duruma düşürenler utansın! Söz veriyorum, göreve geldiğimiz ay en düşük emekli aylığını asgari ücretin %110 seviyesine sabitleyeceğiz!',
        supportEffect: 2.0,
        budgetEffect: -150000,
        logMessage: 'HALK BULUŞMASI: Emeklilerle Karşıyaka Çarşı kıraathanesinde buluştuk. Maaş güncellemesi vaadimiz yaşlı teyze ve amcalarımızın dualarını topladı!'
      },
      {
        text: 'Emekliye Belediyelerde Ücretsiz Sosyal ve Kültürel Yaşam Sözü Ver (Düşük Maliyet -30k TL)',
        answer: 'Emeklilerimizin hayat şartlarını kolaylaştırmak için tüm belediyelerimizle entegre sosyal tesis, tatil ve gıda kartı indirimlerini devreye sokacağız.',
        supportEffect: 0.9,
        budgetEffect: -30000,
        logMessage: 'HALK BULUŞMASI: Karşıyaka sakini kıymetli emeklilerimize yerel yaşam kolaylığı ve indirim projelerimizi sunduk.'
      }
    ]
  }
];

const INITIAL_ALLIANCES: Alliance[] = [
  { id: 'cumhur', name: 'Cumhur İttifakı', parties: ['1', '3'], isPlayerAlliance: false },
  { id: 'millet', name: 'Millet İttifakı', parties: ['2'], isPlayerAlliance: false }
];

export default function App() {
  const [screen, setScreen] = useState<'HOME' | 'CREATE' | 'MULTIPLAYER_LOBBY' | 'DASHBOARD' | 'ELECTION'>('HOME');
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showAuthHelpModal, setShowAuthHelpModal] = useState(false);
  const [lang, setLang] = useState<Language>('TR');
  const [user, setUser] = useState<any | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Subscribe to Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    playSound.playClick();
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Authorization failure: ", e);
      setShowAuthHelpModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout failure: ", e);
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    playerParty: null,
    difficulty: Difficulty.NORMAL,
    weeksRemaining: 52,
    parties: [],
    alliances: [],
    provinces: [],
    currentEvent: null,
    activeRivalInteraction: null,
    activeCitizenChat: null,
    activeKurultay: null,
    activeTbmmSession: null,
    logs: [],
    kulisChats: [],
    chatHistories: {},
    currentWeek: 1,
    pollExpiryWeek: 1,
    isElectionStarted: false,
    selectedRegionId: null,
    allianceProposals: [],
    gameEnded: false,
    electionResults: null
  });

  // Base Demographics Political Alignment Loyals mapping
  const baseLoyalty: Record<string, Record<string, number>> = {
    muhafazakar: { 'AK Parti': 0.48, 'YRP': 0.16, 'Saadet': 0.08, 'Gelecek': 0.08, 'MHP': 0.12, 'CHP': 0.08 },
    milliyetci: { 'MHP': 0.30, 'Zafer': 0.20, 'İYİ Parti': 0.12, 'A Parti': 0.12, 'AK Parti': 0.10, 'CHP': 0.06, 'VP': 0.04, 'Gelecek': 0.06 },
    sosyalDemokrat: { 'CHP': 0.72, 'İYİ Parti': 0.12, 'TİP': 0.06, 'DEVA': 0.04, 'Gelecek': 0.02, 'AK Parti': 0.04 },
    sosyalist: { 'DEM Parti': 0.70, 'TİP': 0.12, 'TKP': 0.08, 'CHP': 0.08, 'AK Parti': 0.02 },
    liberal: { 'DEVA': 0.25, 'Gelecek': 0.12, 'CHP': 0.25, 'İYİ Parti': 0.18, 'AK Parti': 0.12, 'MHP': 0.08 }
  };

  // Helper mapping from Ideology selection to Demographic Key
  const categoryKeyMap: Record<string, string> = {
    [Ideology.SOSYAL_DEMOKRAT]: 'sosyalDemokrat',
    [Ideology.MUHAFAZAKAR]: 'muhafazakar',
    [Ideology.MILLIYETCI]: 'milliyetci',
    [Ideology.LIBERAL]: 'liberal',
    [Ideology.SOSYALIST]: 'sosyalist'
  };

  const handleStartGame = (playerData: {
    liderAd: string;
    partiAd: string;
    kisaAd: string;
    renk: string;
    ideoloji: Ideology;
    difficulty: Difficulty;
  }) => {
    // 1. Create player party
    const startingBudget = 
      playerData.difficulty === Difficulty.KOLAY ? 10000000 :
      playerData.difficulty === Difficulty.NORMAL ? 3000000 : 500000;

    const mainDemoKey = categoryKeyMap[playerData.ideoloji];

    const player: Party = {
      id: 'player',
      name: playerData.partiAd,
      shortName: playerData.kisaAd,
      leader: playerData.liderAd,
      color: playerData.renk,
      ideology: playerData.ideoloji,
      support: 0, // Computed dynamically based on provincial averages
      budget: startingBudget,
      isPlayer: true,
      allianceId: null,
      relationshipWithPlayer: 100,
      basePopularity: 1.0,
      popularityTrends: [],
      tenureYears: 1
    };

    const updatedParties = [...RAKIP_PARTILER.map(p => ({ ...p, popularityTrends: [] })), player];

    // 2. Initialize provincial votes dynamically with base loyalty profiles
    const provinces: Province[] = provincesData.map(prov => {
      const votes: Record<string, number> = {};
      
      // Determine player's starting alignment capture based on difficulty
      const playerDemoCaptureRatio = 
        playerData.difficulty === Difficulty.KOLAY ? 0.12 :
        playerData.difficulty === Difficulty.NORMAL ? 0.035 : 0.012;

      const playerCrossCaptureRatio = 
        playerData.difficulty === Difficulty.KOLAY ? 0.03 :
        playerData.difficulty === Difficulty.NORMAL ? 0.008 : 0.002;

      // Allocate vote percentages based on demographics
      updatedParties.forEach(pt => {
        votes[pt.shortName] = 0;
      });

      // Compute weighted alignments
      Object.entries(prov.demographics).forEach(([demoKey, demoRatio]) => {
        const categories = baseLoyalty[demoKey] || {};
        
        // Sum category distributions excluding player
        let remainingProportion = 1.0;
        
        if (demoKey === mainDemoKey) {
          votes[player.shortName] += (demoRatio * playerDemoCaptureRatio * 100);
          remainingProportion -= playerDemoCaptureRatio;
        } else {
          votes[player.shortName] += (demoRatio * playerCrossCaptureRatio * 100);
          remainingProportion -= playerCrossCaptureRatio;
        }

        Object.entries(categories).forEach(([shortName, categoryLoyalty]) => {
          if (votes[shortName] !== undefined) {
            votes[shortName] += (demoRatio * categoryLoyalty * remainingProportion * 100);
          }
        });
      });

      // Normalize to 100% just in case of decimals jitter
      const sum = Object.values(votes).reduce((a, b) => (a as number) + (b as number), 0) as number;
      Object.keys(votes).forEach(k => {
        votes[k] = (votes[k] / sum) * 100;
      });

      return {
        ...prov,
        votes
      };
    });

    // 3. Compute dynamic national starting support aggregate for each party
    const totalNationalVoters = provinces.reduce((acc, curr) => acc + curr.voterCount, 0);
    
    updatedParties.forEach(pt => {
      let absoluteVotes = 0;
      provinces.forEach(prov => {
        const provShare = prov.votes[pt.shortName] || 0;
        absoluteVotes += (provShare / 100) * prov.voterCount;
      });
      pt.support = (absoluteVotes / totalNationalVoters) * 100;
      pt.popularityTrends = [pt.support];
    });

    setGameState({
      playerParty: player,
      difficulty: playerData.difficulty,
      weeksRemaining: 52,
      parties: updatedParties,
      alliances: INITIAL_ALLIANCES.map(a => ({ ...a })),
      provinces,
      currentEvent: null,
      activeRivalInteraction: null,
      activeCitizenChat: null,
      logs: [
        { week: 1, message: `${playerData.partiAd} (${playerData.kisaAd}) resmi olarak kuruldu ve genel kongrede ${playerData.liderAd} genel başkan seçildi.`, type: 'success' },
        { week: 1, message: 'Seçim süreci resmen başladı! 52 hafta sonra sandıklar kurulacak.', type: 'info' }
      ],
      kulisChats: [
        "📺 SİYASET KULİSİ: 81 ilde teşkilatlanma çalışmalarını hızlandıran tüm partiler Ankara kulislerinde temaslara başladı."
      ],
      chatHistories: {},
      currentWeek: 1,
      pollExpiryWeek: playerData.difficulty === Difficulty.KOLAY ? 99 : 1,
      isElectionStarted: false,
      selectedRegionId: null,
      allianceProposals: [],
      gameEnded: false,
      electionResults: null
    });

    setScreen('DASHBOARD');
  };

  const handleStartMultiplayerCampaign = (myPartyData: any, otherPartiesData: any[], code: string) => {
    const player: Party = {
      id: 'player',
      name: myPartyData.name,
      shortName: myPartyData.shortName,
      leader: myPartyData.leader,
      color: myPartyData.color,
      ideology: myPartyData.ideology,
      support: 0,
      budget: 3000000,
      isPlayer: true,
      allianceId: null,
      relationshipWithPlayer: 100,
      basePopularity: 1.0,
      popularityTrends: [],
      tenureYears: 1
    };

    const customParties: Party[] = otherPartiesData.map((op, i) => ({
      id: op.id || `op_${i}`,
      name: op.name,
      shortName: op.shortName,
      leader: op.leader,
      color: op.color,
      ideology: op.ideology as Ideology,
      support: 0,
      budget: 3000000,
      isPlayer: false,
      allianceId: null,
      relationshipWithPlayer: 0,
      basePopularity: 1.0,
      popularityTrends: []
    }));

    const builtInCandidates = RAKIP_PARTILER.filter(p => 
      !customParties.some(cp => cp.shortName === p.shortName) && p.shortName !== player.shortName
    );

    const updatedParties = [player, ...customParties];
    while (updatedParties.length < 5 && builtInCandidates.length > 0) {
      const nextCandidate = builtInCandidates.shift();
      if (nextCandidate) {
        updatedParties.push({ ...nextCandidate, popularityTrends: [] });
      }
    }

    const mainDemoKey = categoryKeyMap[player.ideology] || 'sosyalDemokrat';
    const provinces: Province[] = provincesData.map(prov => {
      const votes: Record<string, number> = {};
      const playerDemoCaptureRatio = 0.05;
      const playerCrossCaptureRatio = 0.01;

      updatedParties.forEach(pt => {
        votes[pt.shortName] = 0;
      });

      Object.entries(prov.demographics).forEach(([demoKey, demoRatio]) => {
        const categories = baseLoyalty[demoKey] || {};
        let remainingProportion = 1.0;
        
        if (demoKey === mainDemoKey) {
          votes[player.shortName] += (demoRatio * playerDemoCaptureRatio * 100);
          remainingProportion -= playerDemoCaptureRatio;
        } else {
          votes[player.shortName] += (demoRatio * playerCrossCaptureRatio * 100);
          remainingProportion -= playerCrossCaptureRatio;
        }

        Object.entries(categories).forEach(([shortName, categoryLoyalty]) => {
          let targetShortName = shortName;
          if (shortName === 'AK Parti' && customParties.some(p => p.shortName === 'AK Parti')) targetShortName = customParties.find(p => p.shortName === 'AK Parti')!.shortName;
          else if (shortName === 'CHP' && customParties.some(p => p.shortName === 'CHP')) targetShortName = customParties.find(p => p.shortName === 'CHP')!.shortName;
          else if (shortName === 'MHP' && customParties.some(p => p.shortName === 'MHP')) targetShortName = customParties.find(p => p.shortName === 'MHP')!.shortName;

          if (votes[targetShortName] !== undefined) {
            votes[targetShortName] += (demoRatio * categoryLoyalty * remainingProportion * 100);
          } else {
            const fallbackKey = updatedParties.find(pt => !pt.isPlayer)?.shortName || player.shortName;
            votes[fallbackKey] += (demoRatio * categoryLoyalty * remainingProportion * 100);
          }
        });
      });

      const sum = Object.values(votes).reduce((a, b) => (a as number) + (b as number), 0) as number;
      Object.keys(votes).forEach(k => {
        votes[k] = sum > 0 ? (votes[k] / sum) * 100 : 20;
      });

      return {
        ...prov,
        votes
      };
    });

    const totalNationalVoters = provinces.reduce((acc, curr) => acc + curr.voterCount, 0);
    updatedParties.forEach(pt => {
      let absoluteVotes = 0;
      provinces.forEach(prov => {
        const provShare = prov.votes[pt.shortName] || 0;
        absoluteVotes += (provShare / 100) * prov.voterCount;
      });
      pt.support = (absoluteVotes / totalNationalVoters) * 100;
      pt.popularityTrends = [pt.support];
    });

    setGameState({
      playerParty: player,
      difficulty: Difficulty.NORMAL,
      weeksRemaining: 52,
      parties: updatedParties,
      alliances: INITIAL_ALLIANCES.map(a => ({ ...a })),
      provinces,
      currentEvent: null,
      activeRivalInteraction: null,
      activeCitizenChat: null,
      logs: [
        { week: 1, message: `${myPartyData.name} (${myPartyData.shortName}) gerçek zamanlı çok oyunculu kanallarda kuruldu! Lobi Kodu: ${code}`, type: 'success' },
        { week: 1, message: 'Seçim süreci başladı! Diğer liderlerin haftalık ilerlemelerini sağ panelden canlı izleyin.', type: 'info' }
      ],
      kulisChats: [
        `📺 MULTIPLAYER KULİS: ${code} kodlu odada canlı rekabet ve diplomasi kanalları tesis edildi.`
      ],
      chatHistories: {},
      currentWeek: 1,
      pollExpiryWeek: 1,
      isElectionStarted: false,
      selectedRegionId: null,
      allianceProposals: [],
      gameEnded: false,
      electionResults: null,
      lobbyCode: code,
      isMultiplayer: true
    });

    setScreen('DASHBOARD');
  };

  // Helper to re-aggregate global national averages after changes
  const updateGlobalPartiesSupport = (provincesList: Province[], partiesList: Party[]): Party[] => {
    const totalNationalVoters = provincesList.reduce((acc, curr) => acc + curr.voterCount, 0);
    return partiesList.map(pt => {
      let absoluteVotes = 0;
      provincesList.forEach(prov => {
        const provShare = prov.votes[pt.shortName] || 0;
        absoluteVotes += (provShare / 100) * prov.voterCount;
      });
      const currentSupport = (absoluteVotes / totalNationalVoters) * 100;
      return {
        ...pt,
        support: currentSupport,
        popularityTrends: [...pt.popularityTrends, currentSupport]
      };
    });
  };

  // Turn advance logic
  const handleNextWeek = () => {
    playSound.playNextWeek();
    if (gameState.weeksRemaining <= 0) {
      setScreen('ELECTION');
      return;
    }

    setGameState(prev => {
      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      let newLogs = [...prev.logs];

      const currentWeek = 53 - prev.weeksRemaining;

      // 1. Simulate dynamic AI competitor moves (Rallies, local visits, TV shows, politcial polemic attacks, digital blitz)
      const activeCompetitors = updatedParties.filter(p => !p.isPlayer);
      const playerParty = updatedParties.find(p => p.isPlayer);
      
      // Select 2 active political rivals to perform dynamic operations this week
      const shuffled = [...activeCompetitors].sort(() => 0.5 - Math.random());
      const rivalsMoving = shuffled.slice(0, 2);

      rivalsMoving.forEach(selectedRival => {
        const actionRand = Math.random();
        
        if (actionRand < 0.25) {
          // --- Action A: Regional Mass Rally (Bölge Mitingi) ---
          const regionList = ['marmara', 'ege', 'icanadolu', 'karadeniz', 'akdeniz', 'doguanadolu', 'guneydogu'];
          const targetRegion = regionList[Math.floor(Math.random() * regionList.length)];
          const targetRegionName = regions.find(r => r.id === targetRegion)?.name || 'Anadolu';
          const gainAmount = (Math.random() * 0.7) + 0.3; // %0.3 - %1.0 support gain in that region

          updatedProvinces = updatedProvinces.map(prov => {
            if (prov.regionId === targetRegion) {
              const currentShares = { ...prov.votes };
              currentShares[selectedRival.shortName] = Math.min(100, (currentShares[selectedRival.shortName] || 0) + gainAmount);
              
              let leftoverSum = 0;
              Object.entries(currentShares).forEach(([k, v]) => {
                if (k !== selectedRival.shortName) leftoverSum += v as number;
              });

              Object.keys(currentShares).forEach(k => {
                if (k !== selectedRival.shortName && leftoverSum > 0) {
                  currentShares[k] = Math.max(0.1, currentShares[k] - (gainAmount * (currentShares[k] / leftoverSum)));
                }
              });
              return { ...prov, votes: currentShares };
            }
            return prov;
          });

          newLogs.push({
            week: currentWeek,
            message: `${selectedRival.shortName} lideri ${selectedRival.leader}, ${targetRegionName} Bölgesi genelinde binlerce kişinin katıldığı gövde gösterisi tadında devasa bir miting düzenledi!`,
            type: 'info'
          });

        } else if (actionRand < 0.50) {
          // --- Action B: Strategic Province Visit (İl Ziyareti) ---
          const randomProvIndex = Math.floor(Math.random() * updatedProvinces.length);
          const targetProvince = updatedProvinces[randomProvIndex];
          const gainAmount = (Math.random() * 2.5) + 1.5; // %1.5 - %4.0 powerful localized support boost!

          updatedProvinces = updatedProvinces.map(prov => {
            if (prov.id === targetProvince.id) {
              const currentShares = { ...prov.votes };
              currentShares[selectedRival.shortName] = Math.min(100, (currentShares[selectedRival.shortName] || 0) + gainAmount);

              let leftoverSum = 0;
              Object.entries(currentShares).forEach(([k, v]) => {
                if (k !== selectedRival.shortName) leftoverSum += v as number;
              });

              Object.keys(currentShares).forEach(k => {
                if (k !== selectedRival.shortName && leftoverSum > 0) {
                  currentShares[k] = Math.max(0.1, currentShares[k] - (gainAmount * (currentShares[k] / leftoverSum)));
                }
              });
              return { ...prov, votes: currentShares };
            }
            return prov;
          });

          newLogs.push({
            week: currentWeek,
            message: `${selectedRival.shortName} Genel Başkanı ${selectedRival.leader}, bizzat ${targetProvince.name} ilinde esnafla çay içip dert dinleyerek yoğun bir seçim mesaisi harcadı.`,
            type: 'info'
          });

        } else if (actionRand < 0.70) {
          // --- Action C: Nationwide Prime-Time TV Debate (TV Canlı Yayını) ---
          const gainAmount = (Math.random() * 0.2) + 0.1; // %0.1 - %0.3 general nationwide bump

          updatedProvinces = updatedProvinces.map(prov => {
            const currentShares = { ...prov.votes };
            currentShares[selectedRival.shortName] = Math.min(100, (currentShares[selectedRival.shortName] || 0) + gainAmount);

            let leftoverSum = 0;
            Object.entries(currentShares).forEach(([k, v]) => {
              if (k !== selectedRival.shortName) leftoverSum += v as number;
            });

            Object.keys(currentShares).forEach(k => {
              if (k !== selectedRival.shortName && leftoverSum > 0) {
                currentShares[k] = Math.max(0.1, currentShares[k] - (gainAmount * (currentShares[k] / leftoverSum)));
              }
            });
            return { ...prov, votes: currentShares };
          });

          newLogs.push({
            week: currentWeek,
            message: `${selectedRival.shortName} lideri ${selectedRival.leader}, ulusal televizyon kanalında çıktığı canlı yayında gündemi sarsan vaatlerle seçmen nezdinde prestij tazeledi.`,
            type: 'info'
          });

        } else if (actionRand < 0.90) {
          // --- Action D: Sataşma / Offensive Polemic Speeches ---
          // Choose someone to target
          const candidatesToAttack = updatedParties.filter(p => p.id !== selectedRival.id);
          const targetParty = candidatesToAttack[Math.floor(Math.random() * candidatesToAttack.length)];
          const attackGain = (Math.random() * 0.4) + 0.1;

          updatedProvinces = updatedProvinces.map(prov => {
            const currentShares = { ...prov.votes };
            const deduction = Math.min(currentShares[targetParty.shortName] || 0.1, attackGain);
            
            currentShares[targetParty.shortName] = Math.max(0.1, (currentShares[targetParty.shortName] || 0) - deduction);
            currentShares[selectedRival.shortName] = Math.min(100, (currentShares[selectedRival.shortName] || 0) + deduction);
            
            return { ...prov, votes: currentShares };
          });

          if (playerParty && targetParty.id === playerParty.id) {
            newLogs.push({
              week: currentWeek,
              message: `YÜKSEK GERİLİM: ${selectedRival.shortName} lideri ${selectedRival.leader}, partinizin kurucusu ${playerParty.leader} için 'politika üretemiyorlar' diyerek doğrudan size sataştı!`,
              type: 'warning'
            });
          } else {
            newLogs.push({
              week: currentWeek,
              message: `POLİTİK POLEMİK: ${selectedRival.shortName} lideri ${selectedRival.leader}, rakibi ${targetParty.shortName} genel merkezi ve lideri ${targetParty.leader} için oldukça imalı bir eleştiri yöneltti.`,
              type: 'info'
            });
          }

        } else {
          // --- Action E: Social Media Youth Blitz (Sosyal Medya Kampanyası) ---
          const gainAmount = (Math.random() * 0.35) + 0.1;

          updatedProvinces = updatedProvinces.map(prov => {
            const digitalBias = (prov.demographics.sosyalist + prov.demographics.sosyalDemokrat) * 1.5;
            const finalGain = gainAmount * (digitalBias > 0 ? digitalBias : 1.0);

            const currentShares = { ...prov.votes };
            currentShares[selectedRival.shortName] = Math.min(100, (currentShares[selectedRival.shortName] || 0) + finalGain);

            let leftoverSum = 0;
            Object.entries(currentShares).forEach(([k, v]) => {
              if (k !== selectedRival.shortName) leftoverSum += v as number;
            });

            Object.keys(currentShares).forEach(k => {
              if (k !== selectedRival.shortName && leftoverSum > 0) {
                currentShares[k] = Math.max(0.1, currentShares[k] - (finalGain * (currentShares[k] / leftoverSum)));
              }
            });
            return { ...prov, votes: currentShares };
          });

          newLogs.push({
            week: currentWeek,
            message: `${selectedRival.shortName} kurmayları, sosyal mecralar üzerinden yayınlanan 'Yarını İnşa Et' mini belgeseli ile genç kitlelerde trend oldu.`,
            type: 'info'
          });
        }
      });

      // 2. Decrement weeks remaining
      const nextWeeksRemaining = prev.weeksRemaining - 1;

      // --- Dynamic AI Coalition System (15% chance per week) ---
      let updatedAlliances = [...prev.alliances];
      if (Math.random() < 0.15 && nextWeeksRemaining > 2) {
        // Find competitor parties without an alliance
        const unalignedCompetitors = updatedParties.filter(p => !p.isPlayer && !p.allianceId);
        if (unalignedCompetitors.length >= 2) {
          // Find two compatible ones (ideally sharing similar ideology, or random from pool)
          let partnerA = unalignedCompetitors[0];
          let partnerB = unalignedCompetitors[1];
          let foundPair = false;

          // Try to search for matched ideologies first
          for (let i = 0; i < unalignedCompetitors.length; i++) {
            for (let j = i + 1; j < unalignedCompetitors.length; j++) {
              if (unalignedCompetitors[i].ideology === unalignedCompetitors[j].ideology) {
                partnerA = unalignedCompetitors[i];
                partnerB = unalignedCompetitors[j];
                foundPair = true;
                break;
              }
            }
            if (foundPair) break;
          }

          // Form alliance
          const allianceNames = [
            'Milli Cephe İttifakı',
            'Demokrasi Güç Birliği',
            'Sosyalist Sol İttifakı',
            'Anadolu Birliği Koalisyonu',
            'Vatan ve Hürriyet İttifakı',
            'Adalet Platformu'
          ];
          const newAllianceName = allianceNames[Math.floor(Math.random() * allianceNames.length)] + ` (${partnerA.shortName} - ${partnerB.shortName})`;
          const newAllianceId = `ai_all_${partnerA.shortName.toLowerCase()}_${partnerB.shortName.toLowerCase()}`;

          // Add alliance
          const newAllianceObj = {
            id: newAllianceId,
            name: newAllianceName,
            parties: [partnerA.id, partnerB.id],
            isPlayerAlliance: false
          };

          // Update party reference inside updatedParties list
          updatedParties = updatedParties.map(p => {
            if (p.id === partnerA.id || p.id === partnerB.id) {
              return { ...p, allianceId: newAllianceId };
            }
            return p;
          });

          // Check if already exist in list of alliances to prevent duplicates
          if (!updatedAlliances.some(a => a.id === newAllianceId)) {
            updatedAlliances.push(newAllianceObj);
            
            newLogs.push({
              week: currentWeek,
              message: `İTTİFAK DEPREMİ: ${partnerA.shortName} lideri ${partnerA.leader} ile ${partnerB.shortName} lideri ${partnerB.leader}, seçim barajını aşmak ve güçlerini birleştirmek amacıyla '${newAllianceName}' adı altında yeni bir seçim koalisyonu kurduklarını resmen ilan ettiler!`,
              type: 'success'
            });
          }
        }
      }

      // --- Dynamic Rival Interaction System (25% chance per week) ---
      let triggeredInteraction = null;
      if (Math.random() < 0.25 && nextWeeksRemaining > 2 && !prev.activeRivalInteraction) {
        // Pick a random competitor
        const candidateSenders = updatedParties.filter(p => !p.isPlayer);
        if (candidateSenders.length > 0) {
          const sender = candidateSenders[Math.floor(Math.random() * candidateSenders.length)];
          const rel = sender.relationshipWithPlayer;

          if (rel < -10) {
             // Taunt Dialogue
            const taunts = [
              {
                msg: `Sosyal medyadaki içi boş söylemlerinizi takip ediyoruz. Sizin henüz bir muhtarlık bile kazanmamışken Türkiye'yi yönetme iddiasında bulunmanız tam bir fıkra konusu!`,
                opts: [
                  { text: `"Milletimizin asıl derdi geçim, sizin derdiniz ise sosyal medyada polemik. Biz sadece millete hesap veririz!" de ve sustur.`, action: 'retaliate', budgetEffect: -40000, relationshipEffect: -15, supportEffect: 1.3 },
                  { text: `"Bir fıkra arıyorsanız kendi seçim vaatlerinize bakın. Kazanacağımız belediyeler ve meclis sandalyeleri size en iyi cevabı verecek!" de ve boy ölçüş.`, action: 'retaliate', budgetEffect: -60000, relationshipEffect: -20, supportEffect: 1.5 },
                  { text: 'Gülümseyerek geçiştir, "Biz meydanlarda konuşacağız, sosyal medyada değil" açıklaması yap.', action: 'ignore', budgetEffect: 0, relationshipEffect: 5, supportEffect: 0.2 }
                ]
              },
              {
                msg: `Seçim programınızı inceledik ve son derece sığ bulduk. Devlet ciddiyetinden uzak bu tarz vaatlerle koca milleti kandırmanıza izin vermeyeceğiz!`,
                opts: [
                  { text: `"Sığ dediğiniz programımızda milletin refahı, emeklinin hakkı, esnafın can suyu var. Sizin bundan herhalde haberiniz yok!" diyerek kapak yap.`, action: 'retaliate', budgetEffect: -50000, relationshipEffect: -18, supportEffect: 1.4 },
                  { text: `"Devlet ciddiyetini, milleti borç batağına sürükleyenlerden öğrenecek değiliz! Programımız halkın ta kendisidir!" de ve kürsüde gürle.`, action: 'retaliate', budgetEffect: -80000, relationshipEffect: -25, supportEffect: 1.6 },
                  { text: 'Sessiz kalıp sükunetin gücünü kullan, "Milletimiz kimin ciddi olduğunu sandıkta tasdik edecek" de.', action: 'ignore', budgetEffect: 0, relationshipEffect: 5, supportEffect: 0.1 }
                ]
              }
            ];
            const chosenTaunt = taunts[Math.floor(Math.random() * taunts.length)];
            triggeredInteraction = {
              id: `int_${sender.shortName.toLowerCase()}_${currentWeek}`,
              senderPartyId: sender.id,
              type: 'taunt' as const,
              message: chosenTaunt.msg,
              options: chosenTaunt.opts
            };
          } else if (rel >= -10 && rel <= 35) {
            // Request/Cooperation Dialogue
            const requests = [
              {
                msg: `Bölgelerde yaptığımız anket maliyetleri çok yüksek. Gelin bu hafta tarafsız bir anket şirketiyle ortak bir çalışma finanse edelim ve illerdeki asıl gücümüzü el ele vererek ölçelim. (Ücret: 200.000 TL)`,
                opts: [
                  { text: 'Teklifi Kabul Et ve Anketi Yap (-200k TL)', action: 'accept', budgetEffect: -200000, relationshipEffect: 20, supportEffect: 1.5 },
                  { text: 'Bütçe Yetersiz Diyerek Reddet', action: 'decline', budgetEffect: 0, relationshipEffect: -5, supportEffect: 0 }
                ]
              },
              {
                msg: `Halkımızın adalete ve liyakate olan inancını güçlendirmek için tarafsız mecralarda yayınlanmak üzere ortak bir basın bildirisine imza atalım. İlan bedelini paylaşırız. (Maliyet: 100.000 TL)`,
                opts: [
                  { text: 'Ortak Deklarasyona Katıl (-100k TL)', action: 'accept', budgetEffect: -100000, relationshipEffect: 15, supportEffect: 1.0 },
                  { text: 'Nazikçe Reddet', action: 'decline', budgetEffect: 0, relationshipEffect: -5, supportEffect: 0 }
                ]
              }
            ];
            // If sender is VP (Perinçek), give custom Doğu Perinçek dialogue!
            if (sender.shortName === 'VP') {
              requests.push({
                msg: `Milli üretimi ayağa kaldırmak ve emperyalizme karşı durmak için hazırladığımız 'Üretim Devrimi ve Ortak Kurtuluş Deklarasyonu'nu birlikte imzalayalım. Bu millet el ele üretecektir!`,
                opts: [
                  { text: 'Ortak Bildiriyi İmzala', action: 'accept', budgetEffect: 0, relationshipEffect: 25, supportEffect: 0.8 },
                  { text: 'Zamanımız Yok Diyerek Geri Çevir', action: 'decline', budgetEffect: 0, relationshipEffect: -10, supportEffect: 0 }
                ]
              });
            }
            // If sender is TKP (Okuyan), custom Communist dialogue!
            if (sender.shortName === 'TKP') {
              requests.push({
                msg: `Tüttürdüğünüz hayalleri bırakın, memleketin asıl emekçileri, sömürülen fabrika işçileri açlık sınırında. Gelin işçi sendikalarının direniş fonuna ortaklaşa 150.000 TL bağışta bulunarak dayanışmayı büyütelim!`,
                opts: [
                  { text: 'Bağış Fonuna Destek Ol (-150k TL)', action: 'accept', budgetEffect: -150000, relationshipEffect: 25, supportEffect: 1.2 },
                  { text: 'Emek Vurgusunu Göz Ardı et / Reddet', action: 'decline', budgetEffect: 0, relationshipEffect: -10, supportEffect: 0 }
                ]
              });
            }
            // If sender is A Parti (Yavuz), custom A Parti dialogue!
            if (sender.shortName === 'A Parti') {
              requests.push({
                msg: `Türk siyasetine yepyeni bir temiz sayfa açmak için buradayız. Kurduğumuz Anahtar Parti ile sizin demokratik duruşunuz örtüşüyor. Gelin bu hafta ortak bir dijital kampanya örgütleyelim, masrafları paylaşalım. (Maliyet: 150.000 TL)`,
                opts: [
                  { text: 'Ortak Dijital Kampanyaya Katıl (-150k TL)', action: 'accept', budgetEffect: -150000, relationshipEffect: 20, supportEffect: 1.3 },
                  { text: 'Reddet', action: 'decline', budgetEffect: 0, relationshipEffect: -5, supportEffect: 0 }
                ]
              });
            }

            const chosenReq = requests[Math.floor(Math.random() * requests.length)];
            triggeredInteraction = {
              id: `int_${sender.shortName.toLowerCase()}_${currentWeek}`,
              senderPartyId: sender.id,
              type: 'request' as const,
              message: chosenReq.msg,
              options: chosenReq.opts
            };
          } else {
            // Praise Dialogue
            triggeredInteraction = {
              id: `int_${sender.shortName.toLowerCase()}_${currentWeek}`,
              senderPartyId: sender.id,
              type: 'praise' as const,
              message: `Son dönemdeki mitinglerinizdeki sağduyulu ve devletçi vakurluğunuzu yakından takip ediyoruz. Türkiye'nin geleceğinde her zaman sizin gibi vizyoner kurmaylara ihtiyaç var!`,
              options: [
                { text: 'Teşekkür Et ve Samimi Karşılık Ver', action: 'thank', budgetEffect: 0, relationshipEffect: 15, supportEffect: 0.5 },
                { text: 'Mesafeyi Koru, Bağımsız Kalacağız De', action: 'ignore', budgetEffect: 0, relationshipEffect: -5, supportEffect: 0 }
              ]
            };
          }
        }
      }

      // 3. Occasionally trigger breaking news political event (30% chance)
      let nextEvent: PoliticalEvent | null = null;
      if (Math.random() < 0.32 && nextWeeksRemaining > 2) {
        // Pick an unplayed event
        const unanswered = politicalEvents.filter(e => !prev.logs.some(l => l.message.includes(e.title)));
        if (unanswered.length > 0) {
          nextEvent = unanswered[Math.floor(Math.random() * unanswered.length)];
        }
      }

      // 3.5. Trigger recurring TBMM session if scheduled for this week
      const upcomingWeek = currentWeek + 1;
      const tbmmSessionForWeek = tbmmSessions.find(s => s.week === upcomingWeek);
      let nextTbmmSession: TbmmSession | null = null;
      if (tbmmSessionForWeek) {
        nextTbmmSession = tbmmSessionForWeek;
        newLogs.push({
          week: upcomingWeek,
          message: `TBMM GENEL KURULU OLAĞANÜSTÜ TOPLANTISI: Milletvekilleriniz "${tbmmSessionForWeek.billTitle}" yasa tasarısı oylaması için Ankara meclis Genel Kurul salonunda yerlerini aldı!`,
          type: 'info'
        });
      }

      // 4. Update core totals
      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      // Generate political gossip for the coming week
      const gossipPool = [
        "🤝 [MHP] Devlet Bahçeli ve [AK Parti] Recep Tayyip Erdoğan, Cumhur İttifakı'nın deprem bölgesindeki ortak seçim programını netleştirmek için basına kapalı görüştüler.",
        "☕ [CHP] Özgür Özel, [DEM Parti] Genel Lideri ile Çankaya'da baş başa bir çay içip 'demokrasi normları' üzerine fikir alışverişinde bulundu.",
        "⚡ [Zafer] Ümit Özdağ, sosyal medyada [CHP] dış politikasına yönelik sert eleştiriler yönelterek 'milli çizgiden ödün veriliyor' iddiasında bulundu.",
        "🗣️ [YRP] Fatih Erbakan, 'Bizim duruşumuz nettir; faiz lobilerine şirin gözükmeye çalışanlarla masaya oturmayız' diyerek bağımsız duruşunu tazeledi.",
        "💬 [DEVA] Ali Babacan, ekonomik darboğaza dair hazırladıkları kalkınma raporunu [İYİ Parti] genel merkez yetkililerine bizzat sundu.",
        "🚪 [DEM Parti] kurmayları, olası seçim ittifakları çerçevesinde sol sosyalist bileşenlerle Ankara'da dar kapsamlı bir istişare toplantısı icra etti.",
        "👀 Meclis kulislerinde [MHP] ile [İYİ Parti] milletvekillerinin bir anayasa maddesi üzerinde ortak hareket etmek amacıyla el sıkıştığı dedikodusu yayıldı.",
        "🎭 [CHP] ve [DEVA] kurmaylarının 'ortak belediyecilik ve liyakat' esaslı bir mutabakat taslağı hazırladığı, ancak liderlerin henüz onay vermediği sızdırıldı.",
        "📍 [Saadet] Temel Karamollaoğlu ile [Gelecek] Ahmet Davutoğlu, TBMM'deki ortak grup çalışmalarından duydukları memnuniyeti dile getirerek 'özgül ağırlığımız artıyor' dediler.",
        "🤔 Siyasi analizciler, [YRP] ve [AK Parti] tabanları arasında son zamlardaki hassasiyet nedeniyle bir miktar seçmen kayması yaşandığını iddia ediyor.",
        "💣 [Zafer] Ümit Özdağ ile [DEM Parti] sözcüleri arasında canlı yayında 'anayasanın değiştirilemez maddeleri' üzerine çok şiddetli bir tartışma patlak verdi!",
        "🤝 [İYİ Parti] Müsavat Dervişoğlu, milliyetçi ve merkez sağ seçmenin konsolide edilmesi amacıyla yerel teşkilatlara 'hazır olun' genelgesi gönderdi."
      ];
      
      const randomGossip = gossipPool[Math.floor(Math.random() * gossipPool.length)];
      const updatedKulisChats = [...prev.kulisChats, `Hafta ${currentWeek + 1} - ${randomGossip}`];

      return {
        ...prev,
        weeksRemaining: nextWeeksRemaining,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        alliances: updatedAlliances,
        currentEvent: nextEvent,
        activeRivalInteraction: triggeredInteraction !== null ? triggeredInteraction : prev.activeRivalInteraction,
        activeTbmmSession: nextTbmmSession || null,
        logs: newLogs,
        kulisChats: updatedKulisChats,
        currentWeek: currentWeek + 1
      };
    });
  };

  // Handle PR actions
  const handleCampaignAction = (actionType: 'MITING' | 'REKLAM' | 'TV' | 'BAGIS' | 'CAY' | 'KURULTAY', targetRegionId?: string) => {
    setGameState(prev => {
      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      let newLogs = [...prev.logs];

      const RALLY_COST = 500000;
      const AD_COST = 250000;
      const TV_COST = 150000;
      const CAY_COST = 15000;
      const CONGRESS_COST = 1000000;

      if (actionType === 'KURULTAY') {
        if (player.budget < CONGRESS_COST) return prev;
        
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget - CONGRESS_COST };
          return pt;
        });

        // Trigger procedural select sound
        playSound.playSuccess();

        return {
          ...prev,
          parties: updatedParties,
          activeKurultay: true
        };
      }

      if (actionType === 'MITING' && targetRegionId) {
        if (player.budget < RALLY_COST) return prev;

        // Cost deductions
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget - RALLY_COST };
          return pt;
        });

        const targetReg = regions.find(r => r.id === targetRegionId);
        
        // Massive swing in that region
        const baseSwing = prev.difficulty === Difficulty.KOLAY ? 3.0 : (prev.difficulty === Difficulty.NORMAL ? 1.8 : 0.8);
        const randomSwing = baseSwing + (Math.random() * 1.5);

        updatedProvinces = updatedProvinces.map(prov => {
          if (prov.regionId === targetRegionId) {
            const votes = { ...prov.votes };
            const oldVal = votes[player.shortName] || 0;
            votes[player.shortName] = Math.min(100, oldVal + randomSwing);

            // Deduct
            let otherSum = 0;
            Object.entries(votes).forEach(([k, v]) => {
              if (k !== player.shortName) otherSum += v as number;
            });

            Object.keys(votes).forEach(k => {
              if (k !== player.shortName && otherSum > 0) {
                votes[k] = Math.max(0.1, votes[k] - (randomSwing * (votes[k] / otherSum)));
              }
            });

            return { ...prov, votes };
          }
          return prov;
        });

         newLogs.push({
          week: prev.currentWeek,
          message: `SICAK KARŞILAMA: ${player.leader}, ${targetReg?.name || 'Marmara'} miting meydanında coşkulu bir kalabalığa seslendi! "Milletle el ele, aydınlık yarınlara!" sözü büyük alkış topladı. Oylarımız bölge genelinde %${randomSwing.toFixed(1)} yükseldi.`,
          type: 'success'
        });

      } else if (actionType === 'REKLAM') {
        if (player.budget < AD_COST) return prev;

        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget - AD_COST };
          return pt;
        });

        // National swing across all 81 provinces
        const baseSwing = prev.difficulty === Difficulty.KOLAY ? 1.0 : (prev.difficulty === Difficulty.NORMAL ? 0.6 : 0.2);
        
        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[player.shortName] || 0;
          votes[player.shortName] = Math.min(100, oldVal + baseSwing);

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== player.shortName) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== player.shortName && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (baseSwing * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });

        newLogs.push({
          week: prev.currentWeek,
          message: 'Tüm sosyal medya kanallarında, YouTube’da ve yerel billboardlarda büyük reklam kampanyası yayınlandı! Ulusal genel destek yükselişte.',
          type: 'success'
        });

      } else if (actionType === 'TV') {
        if (player.budget < TV_COST) return prev;

        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget - TV_COST };
          return pt;
        });

        // 75% positive outcome, 25% gaffe/blunder
        const isSuccessful = Math.random() < 0.76;
        let change = 0;

        if (isSuccessful) {
          change = prev.difficulty === Difficulty.KOLAY ? 1.5 : (prev.difficulty === Difficulty.NORMAL ? 1.0 : 0.4);
          newLogs.push({
            week: prev.currentWeek,
            message: `${player.leader} katıldığı ana haber canlı yayınındaki soruları mükemmel yanıtlayarak takdir topladı!`,
            type: 'success'
          });
        } else {
          change = prev.difficulty === Difficulty.KOLAY ? -0.2 : (prev.difficulty === Difficulty.NORMAL ? -0.5 : -1.0);
          newLogs.push({
            week: prev.currentWeek,
            message: `${player.leader} canlı yayında ekonomiyle ilgili bir gafa imza attı. Sosyal medyada polemik konusu oldu!`,
            type: 'warning'
          });
        }

        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[player.shortName] || 0;
          votes[player.shortName] = Math.max(0.1, Math.min(100, oldVal + change));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== player.shortName) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== player.shortName && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (change * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });

      } else if (actionType === 'BAGIS') {
        const donationAmt = 300000;
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget + donationAmt };
          return pt;
        });

        // Tiny voter support decrease to simulate fundraising friction
        const penalty = -0.15;

        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          votes[player.shortName] = Math.max(0.1, (votes[player.shortName] || 0) + penalty);
          
          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== player.shortName) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== player.shortName && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (penalty * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });

        newLogs.push({
          week: prev.currentWeek,
          message: 'Küçük destekçilerden ve iş dünyası taraftarlarından kampanya fonuna 300.000 ₺ bağış toplandı.',
          type: 'success'
        });
      } else if (actionType === 'CAY') {
        if (player.budget < CAY_COST) return prev;

        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) return { ...pt, budget: pt.budget - CAY_COST };
          return pt;
        });

        const randomChat = CITIZEN_CHATS[Math.floor(Math.random() * CITIZEN_CHATS.length)];

        return {
          ...prev,
          parties: updatedParties,
          activeCitizenChat: randomChat
        };
      }

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  const handleBuyPoll = () => {
    setGameState(prev => {
      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      const cost = 150000;
      if (player.budget < cost) {
        alert("Yetersiz Bütçe! Seçim anketi yaptırmak için 150.000 ₺ bütçeniz olmalıdır.");
        return prev;
      }

      const updatedParties = prev.parties.map(p => {
        if (p.isPlayer) {
          return { ...p, budget: p.budget - cost };
        }
        return p;
      });

      const newLogs = [
        ...prev.logs,
        {
          week: prev.currentWeek,
          message: `📊 SEÇİM ANKETİ SATIN ALINDI: Geniş kapsamlı kamuoyu araştırma raporu teslim edildi. Haritadaki oy dağılımı 2 hafta boyunca görünür olacak. (-150.000 ₺)`,
          type: 'info' as const
        }
      ];

      playSound.playSuccess();

      return {
        ...prev,
        parties: updatedParties,
        pollExpiryWeek: prev.currentWeek + 2,
        logs: newLogs
      };
    });
  };

  // Resolve events with results
  const handleResolveEvent = (choiceIndex: number) => {
    setGameState(prev => {
      const event = prev.currentEvent;
      if (!event) return prev;

      const choice = event.choices[choiceIndex];
      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      // Update Player budget
      updatedParties = updatedParties.map(pt => {
        if (pt.isPlayer) {
          return {
            ...pt,
            budget: Math.max(0, pt.budget + choice.butceEtkisi)
          };
        }
        return pt;
      });

      // Apply national swing for player and categories
      const factor = choice.oyEtkisi; // e.g. 1.08 represents average multiplier or we can add flat swing
      const playerShort = player.shortName;

      // Apply demographic demographicSwings if present
      updatedProvinces = updatedProvinces.map(prov => {
        const votes = { ...prov.votes };
        const oldVal = votes[playerShort] || 0;
        
        // Multiplier swing
        let changeAmount = oldVal * (factor - 1.0);
        
        // Boost change based on matching demographic weights in this province
        if (choice.demographicSwings) {
          Object.entries(choice.demographicSwings).forEach(([demoKey, demoSwingRatio]) => {
            const importance = prov.demographics[demoKey as keyof typeof prov.demographics] || 0;
            const ratio = demoSwingRatio as number;
            // Add custom contribution
            changeAmount += (importance * ratio * 15);
          });
        }

        votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + changeAmount));

        // Proportional subtract from others
        let otherSum = 0;
        Object.entries(votes).forEach(([k, v]) => {
          if (k !== playerShort) otherSum += v as number;
        });

        Object.keys(votes).forEach(k => {
          if (k !== playerShort && otherSum > 0) {
            votes[k] = Math.max(0.1, votes[k] - (changeAmount * (votes[k] / otherSum)));
          }
        });

        return { ...prov, votes };
      });

      // Adjust competitor relationships
      if (choice.relationshipEffects) {
        updatedParties = updatedParties.map(pt => {
          const relationDelta = choice.relationshipEffects?.[pt.shortName];
          if (relationDelta !== undefined) {
            return {
              ...pt,
              relationshipWithPlayer: Math.max(-100, Math.min(100, pt.relationshipWithPlayer + relationDelta))
            };
          }
          return pt;
        });
      }

      newLogs.push({
        week: prev.currentWeek,
        message: `KRİZ YÖNETİMİ: ${player.leader}, "${event.title}" konusundaki kararlı ve yapıcı tavrıyla seçmenin takdirini kazandı.`,
        type: 'success'
      });

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        currentEvent: null, // Clear the modal/event state
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Resolve citizen chat choices
  const handleResolveCitizenChat = (choiceIndex: number) => {
    setGameState(prev => {
      const chat = prev.activeCitizenChat;
      if (!chat) return prev;

      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      const choice = chat.choices[choiceIndex];
      if (!choice) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      const playerShort = player.shortName;

      // 1. Budget effect
      if (choice.budgetEffect !== 0) {
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) {
            return {
              ...pt,
              budget: Math.max(0, pt.budget + choice.budgetEffect)
            };
          }
          return pt;
        });
      }

      // 2. Support effect (spread across all provinces)
      if (choice.supportEffect !== 0) {
        const boost = choice.supportEffect;
        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[playerShort] || 0;
          votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + boost));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== playerShort) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== playerShort && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (boost * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });
      }

      // 3. Log the action
      newLogs.push({
        week: prev.currentWeek,
        message: choice.logMessage,
        type: 'success'
      });

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        activeCitizenChat: null,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Resolve rival direct interactions
  const handleRivalInteractionChoice = (choiceIndex: number) => {
    setGameState(prev => {
      const interaction = prev.activeRivalInteraction;
      if (!interaction) return prev;

      const player = prev.parties.find(p => p.isPlayer);
      const sender = prev.parties.find(p => p.id === interaction.senderPartyId);
      if (!player || !sender) return prev;

      const option = interaction.options?.[choiceIndex];
      if (!option) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      const playerShort = player.shortName;

      // 1. Budget effect
      if (option.budgetEffect) {
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) {
            return {
              ...pt,
              budget: Math.max(0, pt.budget + (option.budgetEffect || 0))
            };
          }
          return pt;
        });
      }

      // 2. Relationship effect
      if (option.relationshipEffect) {
        updatedParties = updatedParties.map(pt => {
          if (pt.id === sender.id) {
            return {
              ...pt,
              relationshipWithPlayer: Math.max(-100, Math.min(100, pt.relationshipWithPlayer + (option.relationshipEffect || 0)))
            };
          }
          return pt;
        });
      }

      // 3. Support effect (flat vote share modifier across all provinces)
      if (option.supportEffect) {
        const boost = option.supportEffect;
        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[playerShort] || 0;
          votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + boost));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== playerShort) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== playerShort && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (boost * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });
      }

      // 4. Log the action
      let actionLogMsg = '';
      if (option.action === 'retaliate') {
        actionLogMsg = `YÜKSEK GERİLİM: ${player.leader}, ${sender.shortName} lideri ${sender.leader}'in sözlerine deklare ettiği sert yanıtla meydan okudu!`;
      } else if (option.action === 'accept') {
        actionLogMsg = `ORTAK BİLDİRİ: ${player.leader} ve ${sender.shortName} lideri ${sender.leader}, ortak stratejik adımlar atarak ittifak sinyalleri verdi.`;
      } else if (option.action === 'decline') {
        actionLogMsg = `TEKLİF REDDİ: ${player.leader}, ${sender.shortName} partisinden gelen ortaklık davetini geri çevirdi.`;
      } else if (option.action === 'ignore') {
        actionLogMsg = `SESSİZ SİYASET: ${player.leader}, ${sender.shortName} liderinin kışkırtıcı çıkışlarını itidal göstererek yanıtsız bıraktı.`;
      } else {
        actionLogMsg = `YANIT: ${player.leader}, ${sender.shortName} lideri ${sender.leader} ile diplomatik temas kurarak süreci yönetti.`;
      }

      newLogs.push({
        week: prev.currentWeek,
        message: actionLogMsg,
        type: option.action === 'retaliate' ? 'warning' : 'success'
      });

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        activeRivalInteraction: null,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Resolve TBMM Legislative Sessions choices
  const handleResolveTbmmSession = (choiceIndex: number) => {
    setGameState(prev => {
      const session = prev.activeTbmmSession;
      if (!session) return prev;

      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      const option = session.options[choiceIndex];
      if (!option) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      const playerShort = player.shortName;

      // 1. Budget impact
      if (option.budgetEffect !== 0) {
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) {
            return {
              ...pt,
              budget: Math.max(0, pt.budget + option.budgetEffect)
            };
          }
          return pt;
        });
      }

      // 2. Relationship impact
      if (option.relationshipDelta) {
        updatedParties = updatedParties.map(pt => {
          const delta = option.relationshipDelta[pt.shortName];
          if (delta !== undefined && !pt.isPlayer) {
            return {
              ...pt,
              relationshipWithPlayer: Math.max(-100, Math.min(100, pt.relationshipWithPlayer + delta))
            };
          }
          return pt;
        });
      }

      // 3. Support effect (flat vote share modifier across all provinces)
      if (option.supportEffect !== 0) {
        const boost = option.supportEffect;
        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[playerShort] || 0;
          votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + boost));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== playerShort) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== playerShort && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (boost * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });
      }

      // 4. Log the output
      newLogs.push({
        week: prev.currentWeek,
        message: `TBMM GENEL KURULU OYLAMA SONUCU: "${session.billTitle}" oylamasında ${player.shortName} meclis grubu "${option.action === 'YES' ? 'KABUL' : option.action === 'NO' ? 'RET' : 'ÇEKİMSER'}" oyu kullandı. ${option.outcomeTitle}.`,
        type: option.action === 'YES' ? 'warning' : option.action === 'NO' ? 'danger' : 'info'
      });

      newLogs.push({
        week: prev.currentWeek,
        message: `Lider Konuşması: "${option.slogan}"`,
        type: 'success'
      });

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        activeTbmmSession: null,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Resolve Party Congress (Kurultay) selections and benefits
  const handleResolveKurultay = (
    pathwayTitle: string,
    speechText: string,
    supportBoost: number,
    budgetGain: number,
    relationshipDeltas: Record<string, number>
  ) => {
    setGameState(prev => {
      const player = prev.parties.find(p => p.isPlayer);
      if (!player) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      const playerShort = player.shortName;

      // 1. Budget increase
      if (budgetGain > 0) {
        updatedParties = updatedParties.map(pt => {
          if (pt.isPlayer) {
            return {
              ...pt,
              budget: pt.budget + budgetGain
            };
          }
          return pt;
        });
      }

      // 2. Relationship offsets
      if (relationshipDeltas) {
        updatedParties = updatedParties.map(pt => {
          const delta = relationshipDeltas[pt.shortName];
          if (delta !== undefined && !pt.isPlayer) {
            return {
              ...pt,
              relationshipWithPlayer: Math.max(-100, Math.min(100, pt.relationshipWithPlayer + delta))
            };
          }
          return pt;
        });
      }

      // 3. National Voter Support boost in all provinces of Turkey!
      if (supportBoost > 0) {
        updatedProvinces = updatedProvinces.map(prov => {
          const votes = { ...prov.votes };
          const oldVal = votes[playerShort] || 0;
          votes[playerShort] = Math.max(0.1, Math.min(100, oldVal + supportBoost));

          let otherSum = 0;
          Object.entries(votes).forEach(([k, v]) => {
            if (k !== playerShort) otherSum += v as number;
          });

          Object.keys(votes).forEach(k => {
            if (k !== playerShort && otherSum > 0) {
              votes[k] = Math.max(0.1, votes[k] - (supportBoost * (votes[k] / otherSum)));
            }
          });

          return { ...prov, votes };
        });
      }

      // 4. Detailed Congress Logging
      newLogs.push({
        week: prev.currentWeek,
        message: `BÜYÜK KURULTAY TAMAMLANDI! ${player.shortName} delegeleri genel başkan seçiminde ${player.leader} ismini tek aday oy birliğiyle onayladı. Seçilen Kurultay Hattı: ${pathwayTitle}.`,
        type: 'success'
      });

      if (speechText.trim()) {
        newLogs.push({
          week: prev.currentWeek,
          message: `Genel Başkan Manifesto Konuşması: "${speechText.length > 100 ? speechText.slice(0, 100) + '...' : speechText}"`,
          type: 'info'
        });
      }

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        activeKurultay: null,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Convert Congress pathway selections to tangible assets and swings
  const handleSelectKurultayPath = (pathId: string) => {
    let pathwayTitle = '';
    let speechText = '';
    let supportBoost = 0;
    let budgetGain = 0;
    let relationshipDeltas: Record<string, number> = {};

    if (pathId === 'birlik') {
      pathwayTitle = 'Birlik ve Dayanışma Kurultayı';
      speechText = 'Ülkemizin kutuplaşma gerilimleri durulmak zorundadır. Gelin canlar bir olalım, kırgınlıkları rafa kaldırıp kucaklaşalım!';
      supportBoost = 0.8;
      budgetGain = 0;
      relationshipDeltas = {
        'AK Parti': 15, 'CHP': 15, 'MHP': 15, 'DEM Parti': 15,
        'Saadet': 15, 'Gelecek': 15, 'İYİ Parti': 15, 'YRP': 15, 'DEVA': 15
      };
    } else if (pathId === 'degisim') {
      pathwayTitle = 'Değişim ve Reform Kurultayı';
      speechText = 'Eski prangaları söküp atıyoruz! Türkiye yeni ve cesur zihinlerle, hür irade ve liyakatle gelecektir!';
      supportBoost = 1.5;
      budgetGain = 0;
      relationshipDeltas = { 'CHP': 15, 'DEVA': 12, 'Saadet': 10, 'Gelecek': 10, 'TİP': 10 };
    } else if (pathId === 'sahlanis') {
      pathwayTitle = 'Milli Şahlanış Kurultayı';
      speechText = 'Gök bayrağın, şahsiyetli dış politikanın ve yerli üretimin arkasındayız. İstiklalimiz vatansever milli ruh ile şahlanacaktır!';
      supportBoost = 1.5;
      budgetGain = 0;
      relationshipDeltas = { 'MHP': 15, 'Zafer': 15, 'Saadet': 10, 'Gelecek': 10, 'A Parti': 12, 'AK Parti': -10 };
    } else if (pathId === 'teknoloji') {
      pathwayTitle = 'Ekonomi ve Teknoloji Kurultayı';
      speechText = 'Laf üreten siyasetçilere rasyonel verileri sunun; yandaş holdinge değil, yüksek Ar-Ge ve teknoloji üreten genç beyinlere kaynak aktaracağız!';
      supportBoost = 1.2;
      budgetGain = 500000;
      relationshipDeltas = { 'DEVA': 15, 'İYİ Parti': 10, 'Saadet': 8, 'Gelecek': 8 };
    } else if (pathId === 'emek') {
      pathwayTitle = 'Emek ve Sosyal Adalet Kurultayı';
      speechText = 'Çalışanların, sendikal hakların ve her bir asgari ücretli canımızın döktüğü alın terinin bekçisiyiz. Rant odaklarına karşı sosyal adaleti kuracağız!';
      supportBoost = 1.3;
      budgetGain = 0;
      relationshipDeltas = { 'TİP': 20, 'CHP': 12, 'DEM Parti': 12, 'AK Parti': -12 };
    } else if (pathId === 'dis_politika') {
      pathwayTitle = 'Yurtta Sulh, Cihanda Sulh Kurultayı';
      speechText = 'Şeffaf diplomasi, komşu ülkeler ile barışçıl ticaret ve ulu önderimizin düsturu ile uluslararası barış köprülerini tesis ediyoruz!';
      supportBoost = 1.1;
      budgetGain = 0;
      relationshipDeltas = {
        'AK Parti': 12, 'CHP': 15, 'MHP': 10, 'DEM Parti': 10,
        'YRP': 10, 'DEVA': 12, 'Saadet': 10, 'Gelecek': 10, 'İYİ Parti': 10
      };
    } else if (pathId === 'genclik') {
      pathwayTitle = 'Gençlik ve Gelecek Kurultayı';
      speechText = 'Biz gençlere internet yasakları değil, özgürlük vadetmek için buradayız! Festivalleri, bilimi ve hür düşünceyi serbest kılacağız!';
      supportBoost = 1.6;
      budgetGain = 0;
      relationshipDeltas = { 'İYİ Parti': 12, 'CHP': 12, 'Zafer': 12, 'DEVA': 12 };
    } else if (pathId === 'cevre_tarim') {
      pathwayTitle = 'Yeşil Kalkınma ve Tarım Kurultayı';
      speechText = 'Topraklarimizi betonlaştiranlara inat, Anadolu sularini ve yeşil ormanları asırlık tohumlarımızla koruyacak, çiftçimize mazot desteği vereceğiz!';
      supportBoost = 1.2;
      budgetGain = 200000;
      relationshipDeltas = { 'Saadet': 15, 'CHP': 10, 'DEVA': 10, 'YRP': 10 };
    }

    handleResolveKurultay(pathwayTitle, speechText, supportBoost, budgetGain, relationshipDeltas);
  };

  // Diplomacy action: Sataş (Criticize rival)
  const handleSatas = (targetShort: string) => {
    setGameState(prev => {
      const player = prev.parties.find(p => p.isPlayer);
      const rival = prev.parties.find(p => p.shortName === targetShort);
      if (!player || !rival) return prev;

      let updatedProvinces = prev.provinces.map(p => ({ ...p, votes: { ...p.votes } }));
      let updatedParties = prev.parties.map(p => ({ ...p }));
      const newLogs = [...prev.logs];

      // Player gains 0.3%, Target loses 0.5% in central demographic regions
      const baseSwing = prev.difficulty === Difficulty.KOLAY ? 0.6 : (prev.difficulty === Difficulty.NORMAL ? 0.3 : 0.1);

      updatedProvinces = updatedProvinces.map(prov => {
        const votes = { ...prov.votes };
        votes[player.shortName] = Math.min(100, (votes[player.shortName] || 0) + baseSwing);
        votes[targetShort] = Math.max(0.1, (votes[targetShort] || 0) - (baseSwing * 1.5));

        // Distribute
        const sum = Object.values(votes).reduce((a, b) => (a as number) + (b as number), 0) as number;
        Object.keys(votes).forEach(k => {
          votes[k] = (votes[k] / sum) * 100;
        });

        return { ...prov, votes };
      });

      // Hurt friendship relationship indicator
      updatedParties = updatedParties.map(pt => {
        if (pt.shortName === targetShort) {
          return {
            ...pt,
            relationshipWithPlayer: Math.max(-100, pt.relationshipWithPlayer - 25)
          };
        }
        return pt;
      });

      newLogs.push({
        week: prev.currentWeek,
        message: `${player.leader}, ${targetShort} ve lideri ${rival.leader} hakkında sert bir basın açıklaması yaptı! "Haklarımızı savunacağız!"`,
        type: 'warning'
      });

      const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

      return {
        ...prev,
        provinces: updatedProvinces,
        parties: finalPartiesList,
        logs: newLogs
      };
    });
  };

  // Diplomacy action: Offer Alliance / Joint statement
  const handleOfferAlliance = (targetShort: string) => {
    const cost = 100000;
    const playerParty = gameState.parties.find(p => p.isPlayer);
    const target = gameState.parties.find(p => p.shortName === targetShort);
    if (!playerParty || !target) return;

    if (playerParty.budget < cost) {
      alert(`Diplomatik kurye ve görüşme masrafları için paranız yetersiz! (Gereken: ${cost.toLocaleString('tr-TR')} ₺)`);
      return;
    }

    // Check compatibility likelihood (Relationship above 25 makes it high success probability, ideologic similarity adds +15)
    let chance = target.relationshipWithPlayer;
    if (playerParty.ideology === target.ideology) chance += 20;

    const success = Math.random() * 100 < chance;

    setGameState(prev => {
      let updatedParties = prev.parties.map(p => ({ ...p }));
      let updatedAlliances = prev.alliances.map(a => ({ ...a, parties: [...a.parties] }));
      const newLogs = [...prev.logs];

      // Deduct budget
      updatedParties = updatedParties.map(pt => {
        if (pt.isPlayer) return { ...pt, budget: pt.budget - cost };
        return pt;
      });

      if (success) {
        // Form or expand player alliance!
        let playerAlliance = updatedAlliances.find(a => a.isPlayerAlliance);
        
        if (playerAlliance) {
          if (!playerAlliance.parties.includes(target.id)) {
            playerAlliance.parties.push(target.id);
          }
        } else {
          // Ask player for custom coalition name!
          let customName = null;
          try {
            customName = window.prompt(
              "Kurmak istediğiniz Seçim İttifakı / Koalisyonuna bir isim verin (Örn: Millet İttifakı, Ata İttifakı, Emek ve Özgürlük İttifakı):",
              `${playerParty.shortName} Siyasi Güç Birliği İttifakı`
            );
          } catch (e) {}
          const finalName = customName && customName.trim() ? customName.trim() : `${playerParty.shortName} Demokrasi İttifakı`;

          // Create new one!
          playerAlliance = {
            id: 'player_bloc',
            name: finalName,
            parties: [playerParty.id, target.id],
            isPlayerAlliance: true
          };
          updatedAlliances.push(playerAlliance);
        }

        // Raise relationship
        updatedParties = updatedParties.map(pt => {
          if (pt.shortName === targetShort) {
            return {
              ...pt,
              allianceId: playerAlliance.id,
              relationshipWithPlayer: Math.min(100, pt.relationshipWithPlayer + 30)
            };
          }
          if (pt.isPlayer) {
            return {
              ...pt,
              allianceId: playerAlliance.id
            };
          }
          return pt;
        });

        // Pull their votes slightly closer containing shared voters pool boost (+1.5% national voter shift!)
        let updatedProvinces = prev.provinces.map(prov => {
          const votes = { ...prov.votes };
          votes[playerParty.shortName] = Math.min(100, (votes[playerParty.shortName] || 0) + 0.8);
          votes[targetShort] = Math.min(100, (votes[targetShort] || 0) + 0.5);

          const sum = Object.values(votes).reduce((a, b) => (a as number) + (b as number), 0) as number;
          Object.keys(votes).forEach(k => {
            votes[k] = (votes[k] / sum) * 100;
          });

          return { ...prov, votes };
        });

        newLogs.push({
          week: prev.currentWeek,
          message: `TARİHİ ANLAŞMA: ${playerParty.leader} ile ${target.shortName} lideri ${target.leader} el sıkıştı! "${playerAlliance.name}" ittifakı gururla ilan edildi.`,
          type: 'success'
        });

        const finalPartiesList = updateGlobalPartiesSupport(updatedProvinces, updatedParties);

        return {
          ...prev,
          provinces: updatedProvinces,
          parties: finalPartiesList,
          alliances: updatedAlliances,
          logs: newLogs
        };

      } else {
        newLogs.push({
          week: prev.currentWeek,
          message: `${target.shortName} lideri ${target.leader}, ortak ittifak masası davetimize soğuk yanıt verdi ve teklifi reddetti.`,
          type: 'error'
        });

        return {
          ...prev,
          parties: updatedParties,
          logs: newLogs
        };
      }
    });
  };

  // Break existing player alliance
  const handleBreakAlliance = (allianceId: string) => {
    setGameState(prev => {
      const updatedAlliances = prev.alliances.filter(a => a.id !== allianceId);
      const newLogs = [...prev.logs];

      const updatedParties = prev.parties.map(pt => {
        if (pt.allianceId === allianceId) {
          return {
            ...pt,
            allianceId: null,
            relationshipWithPlayer: Math.max(-50, pt.relationshipWithPlayer - 35) // relationship penalties
          };
        }
        return pt;
      });

      newLogs.push({
        week: prev.currentWeek,
        message: 'Ortak seçim ittifakınız koalisyon içindeki anlaşmazlıklar nedeniyle tek taraflı feshedildi!',
        type: 'error'
      });

      return {
        ...prev,
        parties: updatedParties,
        alliances: updatedAlliances,
        logs: newLogs
      };
    });
  };

  const handleRestart = () => {
    setScreen('HOME');
  };

  const handleLoadGame = (savedState: GameState, screen: 'DASHBOARD' | 'ELECTION') => {
    setGameState(savedState);
    setScreen(screen);
    playSound.playSuccess();
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col items-center justify-start p-4 md:p-8 antialiased selection:bg-blue-500/30 selection:text-blue-100 transition-colors duration-200`}>
      
      {/* Background radial slate accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none blur-3xl z-0" />

      {/* GLOBAL UPPER HEADER (PROMINENT SIGN IN AND STATUS BAR) */}
      <header className="w-full max-w-6xl relative z-20 mb-4 bg-slate-900/60 backdrop-blur-md border border-slate-850 px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/10 shrink-0">
            <Landmark className="w-5 h-5 text-slate-100" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
              Ankara'nın Yolları 🇹🇷
            </h2>
            <span className="text-[10px] text-slate-500 font-bold block">TÜRKİYE SEÇİMLERİ SİMÜLASYONU</span>
          </div>
        </div>

        {/* Right Side: Google Login, Theme toggles and levels */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end shrink-0 w-full sm:w-auto">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 px-3 py-1.5 rounded-xl">
              {user.photoURL ? (
                <img referrerPolicy="no-referrer" src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full border border-indigo-500/40" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/20 uppercase">
                  {user.displayName?.slice(0, 1) || 'L'}
                </div>
              )}
              <div className="text-left hidden xs:block">
                <span className="text-[10px] text-slate-200 font-extrabold max-w-[120px] block truncate">{user.displayName || 'Lider'}</span>
                <span className="text-[8px] text-emerald-400 block font-bold uppercase tracking-wider">● Bulut Senkronize</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-slate-850 text-rose-400 hover:text-rose-300 transition shrink-0 cursor-pointer"
                title="Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer active:scale-95 transition flex items-center gap-1.5 uppercase font-sans tracking-wide shrink-0 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-200" /> Google Giriş
            </button>
          )}

          {/* Theme switcher Toggle */}
          <button
            onClick={() => { playSound.playClick(); setTheme(theme === 'dark' ? 'light' : 'dark'); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/60 cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
            title={theme === 'dark' ? 'Açık Mod' : 'Karanlık Mod'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* Language switcher Toggle */}
          <button
            onClick={() => { playSound.playClick(); setLang(lang === 'TR' ? 'EN' : 'TR'); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-755 text-slate-300 text-xs font-black rounded-lg transition-colors border border-slate-700/60 cursor-pointer shrink-0"
          >
            {lang === 'TR' ? 'EN' : 'TR'}
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl relative z-10 py-4">
        
        {/* State Routing Screen */}
        {screen === 'HOME' && (
          <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-6 mt-16">
            
            {/* Visual Header */}
            <div className="space-y-3">
              <div className="inline-flex p-4 bg-blue-600/10 rounded-full text-blue-500 mb-1">
                <Landmark className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent uppercase tracking-wider">
                ANKARA'NIN YOLLARI
              </h1>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Bütçenizi yönetin, ittifaklar kurun, krizleri aşın ve Türkiye haritasında seçim gecesinin kıyasıya heyecanını yaşayın!
              </p>
            </div>

            {/* Premium CTA Buttons - Split Campaign Pathways */}
            <div className="w-full space-y-3 pt-4">
              
              {/* 1. Tek Oyunculu Kampanya */}
              <button
                onClick={() => { playSound.playClick(); setScreen('CREATE'); }}
                className="w-full py-3.5 px-6 font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl active:scale-[0.98] transition shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4 text-blue-300 animate-pulse" /> {lang === 'TR' ? 'TEK OYUNCULU SEÇİM KAMPANYASI' : 'SINGLE PLAYER SEÇİM CAMPAIGN'}
              </button>

              {/* 2. Çok Oyunculu Lobi */}
              <button
                onClick={() => { playSound.playClick(); setScreen('MULTIPLAYER_LOBBY'); }}
                className="w-full py-3.5 px-6 font-bold text-xs tracking-wider uppercase bg-slate-850 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-xl active:scale-[0.98] transition border border-indigo-500/20 cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Users className="w-4 h-4 text-indigo-455" /> {lang === 'TR' ? 'ÇOK OYUNCULU SEÇİM LOBİSİ (CANLI)' : 'MULTIPLAYER LOBBY (LIVE)'}
              </button>

              {/* 3. Bulut kayıtları ve yükleme */}
              <button
                onClick={() => { playSound.playClick(); setShowSaveLoad(true); }}
                className="w-full py-3 px-6 font-semibold text-xs tracking-wider uppercase bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-slate-300 hover:text-white rounded-xl active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Cloud className="w-4 h-4 text-blue-450" /> {lang === 'TR' ? 'BULUT KAYITLARINI YÖNET' : 'MANAGE CLOUD SAVES'}
              </button>

            </div>

            {/* Version Tickers */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold border-t border-slate-850 pt-5 w-full justify-center">
              <span>SÜRÜM v3.0.0</span>
              <span>•</span>
              <span>TÜRKİYE SEÇİMLERİ SİMÜLATÖRÜ</span>
            </div>
          </div>
        )}

        {screen === 'MULTIPLAYER_LOBBY' && (
          <MultiplayerLobby
            user={user}
            lang={lang}
            onBack={handleRestart}
            onStartCampaign={handleStartMultiplayerCampaign}
          />
        )}

        {screen === 'CREATE' && (
          <CreateParty onStart={handleStartGame} />
        )}

        {screen === 'DASHBOARD' && (
          <>
            <MainDashboard
              parties={gameState.parties}
              provinces={gameState.provinces}
              alliances={gameState.alliances}
              weeksRemaining={gameState.weeksRemaining}
              currentEvent={gameState.currentEvent}
              logs={gameState.logs}
              onNextWeek={handleNextWeek}
              onSelectRegion={(regionId) => setGameState(prev => ({ ...prev, selectedRegionId: regionId }))}
              selectedRegionId={gameState.selectedRegionId}
              onCampaignAction={handleCampaignAction}
              onResolveEvent={handleResolveEvent}
              onSatas={handleSatas}
              onOfferAlliance={handleOfferAlliance}
              onBreakAlliance={handleBreakAlliance}
              onGoToElection={() => setScreen('ELECTION')}
              onOpenSaveLoad={() => setShowSaveLoad(true)}
              pollExpiryWeek={gameState.pollExpiryWeek}
              currentWeek={gameState.currentWeek}
              onBuyPoll={handleBuyPoll}
              kulisChats={gameState.kulisChats}
              chatHistories={gameState.chatHistories}
              onUpdateState={setGameState}
              lang={lang}
              setLang={setLang}
              user={user}
              onLogin={handleGoogleLogin}
              onLogout={handleLogout}
              difficulty={gameState.difficulty}
              lobbyCode={gameState.lobbyCode}
              isMultiplayer={gameState.isMultiplayer}
            />
            {gameState.activeRivalInteraction && (
              <RivalInteractionModal
                interaction={gameState.activeRivalInteraction}
                parties={gameState.parties}
                onChoose={handleRivalInteractionChoice}
              />
            )}
            {gameState.activeCitizenChat && (
              <CitizenChatModal
                chat={gameState.activeCitizenChat}
                onChoice={handleResolveCitizenChat}
              />
            )}
            {gameState.activeKurultay && gameState.parties.find(p => p.isPlayer) && (
              <KurultayModal
                playerParty={gameState.parties.find(p => p.isPlayer)!}
                onSelectPath={handleSelectKurultayPath}
                onClose={() => setGameState(prev => ({ ...prev, activeKurultay: false }))}
              />
            )}
            {gameState.activeTbmmSession && gameState.parties.find(p => p.isPlayer) && (
              <TbmmModal
                playerParty={gameState.parties.find(p => p.isPlayer)!}
                session={gameState.activeTbmmSession}
                onChoice={handleResolveTbmmSession}
              />
            )}
          </>
        )}

        {showSaveLoad && (
          <SaveLoadModal
            currentGameState={screen !== 'HOME' && screen !== 'CREATE' ? gameState : null}
            currentScreen={screen}
            onClose={() => setShowSaveLoad(false)}
            onLoadGame={handleLoadGame}
            lang={lang}
            user={user}
          />
        )}

        {showAuthHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="auth_help_modal">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">
                {lang === 'TR' ? 'Google Giriş Yardımı' : 'Google Sign-In Help'}
              </h3>
              
              <div className="text-xs text-slate-300 leading-relaxed text-left space-y-2">
                <p>
                  {lang === 'TR' ? (
                    <>
                      Mobil tarayıcıların güvenlik politikaları nedeniyle, oyun bir <strong>iframe (önizleme çerçevesi)</strong> içerisinden oynandığında Google giriş ekranı boş sayfa (<code>about:blank</code>) olarak kalabilir.
                    </>
                  ) : (
                    <>
                      Mobile browser privacy features block Google Auth popups inside <strong>iframes</strong>, which often leaves a blank <code>about:blank</code> page.
                    </>
                  )}
                </p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-black text-indigo-400 block tracking-wider">
                    {lang === 'TR' ? '💡 Kesin ve Basit Çözüm:' : '💡 Easy Solution:'}
                  </span>
                  <p className="text-[11px] text-slate-200">
                    {lang === 'TR' ? (
                      'Oyunu doğrudan kendi başına tam sayfa olarak yeni bir sekmede açarak oynayın. Böylece Google girişi saniyeler içinde tamamlanacaktır!'
                    ) : (
                      'Simply open the game directly in a fresh browser tab to complete the Google login smoothly in seconds!'
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={window.location.href}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer uppercase text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'TR' ? 'Oyun\'u Yeni Sekmede Aç' : 'Open Game in New Tab'}
                </a>
                
                <button
                  onClick={() => setShowAuthHelpModal(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs py-2 px-4 rounded-xl border border-slate-700/60 transition cursor-pointer"
                >
                  {lang === 'TR' ? 'Kapat' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'ELECTION' && (
          <ElectionNight
            parties={gameState.parties}
            provinces={gameState.provinces}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Elegant Footer attribution */}
      <footer className="w-full max-w-6xl text-center text-[10px] text-slate-600 border-t border-slate-900 py-6 mt-16 space-y-1 relative z-10 select-none">
        <p>Ankara'nın Yolları © 2026. Tüm Hakları Saklıdır.</p>
        <p>Yüksek Seçim Kurulu (YSK) standartlarına uygun sanal simülasyon algoritması.</p>
      </footer>
    </div>
  );
}
