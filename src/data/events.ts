import { PoliticalEvent } from '../types';

export const politicalEvents: PoliticalEvent[] = [
  {
    id: 'inflasyon',
    title: 'Enflasyon ve Hayat Pahalılığı Krizi',
    description: 'Son açıklanan enflasyon rakamları halkın tepkisini çekti. Marketlerdeki gıda fiyatları sürekli katlanıyor ve asgari ücret eriyor. Kampanya lideri olarak bu duruma nasıl tepki vereceksiniz?',
    category: 'EKONOMİ',
    choices: [
      {
        text: 'İktidarın ekonomi modelini çok sert eleştirin, asgari ücretin ve emekli maaşlarının anında iki katına çıkarılmasını talep edin.',
        effectText: 'Sosyal Demokrat ve sol oyları artar. Bütçeden miting giderleri düşer. İktidar partileriyle aranız soğur.',
        oyEtkisi: 1.08,
        butceEtkisi: -150000,
        demographicSwings: { sosyalDemokrat: 0.05, sosyalist: 0.04, muhafazakar: -0.02 },
        relationshipEffects: { 'AK Parti': -15, 'CHP': 5, 'MHP': -10 }
      },
      {
        text: 'Döviz spekülatörlerine ve zincir market fahiş fiyatlarına vurgu yapın, devlet destekli sıkı denetim ve yerli üretim seferberliği önerin.',
        effectText: 'Muhafazakar ve milliyetçi seçmenden destek alırsınız. İktidar ile ilişkiler hafifçe düzelir.',
        oyEtkisi: 1.04,
        butceEtkisi: -50000,
        demographicSwings: { muhafazakar: 0.03, milliyetci: 0.02 },
        relationshipEffects: { 'AK Parti': 10, 'MHP': 8, 'Zafer': -5 }
      },
      {
        text: 'Serbest piyasa kurallarının tam uygulanmasını, Merkez Bankası bağımsızlığını ve yabancı sermaye yatırımını savunan kapsamlı bir liberal program açıklayın.',
        effectText: 'Liberal ve eğitimli kentli oyları artar. İş dünyası ve finans çevrelerinden fon yardımı alırsınız.',
        oyEtkisi: 1.03,
        butceEtkisi: 400000,
        demographicSwings: { liberal: 0.06, sosyalist: -0.03 },
        relationshipEffects: { 'DEVA': 15, 'CHP': -2 }
      }
    ]
  },
  {
    id: 'sinir_otesi',
    title: 'Sınır Ötesinde Yeni Askeri Operasyon Sinyali',
    description: 'Cumhurbaşkanlığı, güney sınırlarında terör koridorunu engellemek amacıyla yeni bir kara harekatı için hazırlıkların tamamlandığını duyurdu. Muhalefet ve iktidar blokları kutuplaşmış durumda.',
    category: 'DIŞ_POLİTİKA',
    choices: [
      {
        text: '"Devletimizin ve askerimizin yanındayız!" diyerek tam destek açıklayın ve mecliste evet oyu vereceğinizi duyurun.',
        effectText: 'Milliyetçi ve muhafazakar oylarda yüksek artış. Sol ve Kürt seçmenler arasında tepki çeker.',
        oyEtkisi: 1.07,
        butceEtkisi: -80000,
        demographicSwings: { milliyetci: 0.06, muhafazakar: 0.03, sosyalist: -0.05 },
        relationshipEffects: { 'AK Parti': 15, 'MHP': 20, 'DEM Parti': -25, 'Zafer': 12 }
      },
      {
        text: 'Operasyonu desteklemekle birlikte meclis denetimi, şeffaflık ve mülteci geri dönüş planı içeren şartlı bir destek politikası izleyin.',
        effectText: 'Merkez sağ ve seküler milliyetçiler arasında kabul görür. Dengeli bir durum.',
        oyEtkisi: 1.02,
        butceEtkisi: -20000,
        demographicSwings: { liberal: 0.03, milliyetci: 0.01 },
        relationshipEffects: { 'İYİ Parti': 12, 'CHP': 5 }
      },
      {
        text: '"Savaşa hayır, barış hemen şimdi!" sloganıyla askeri operasyonlara karşı çıkın ve bütçenin silaha değil kalkınmaya harcanmasını savunun.',
        effectText: 'Sol, sosyalist ve DEM Parti seçmeninde muazzam sempati. Milliyetçi oylarda sert düşüş.',
        oyEtkisi: 0.98, // can be risky depending on base values, but gives huge boost in certain demographics
        butceEtkisi: -10000,
        demographicSwings: { sosyalist: 0.08, milliyetci: -0.08, muhafazakar: -0.04 },
        relationshipEffects: { 'DEM Parti': 25, 'TİP': 20, 'MHP': -30, 'AK Parti': -25, 'Zafer': -25 }
      }
    ]
  },
  {
    id: 'sosyal_medya',
    title: 'Sosyal Medyaya Erişim Engeli Kararı',
    description: 'Popüler bir sosyal medya platformu, "milli güvenlik ve kamu düzeninin korunması" gerekçesiyle BTK tarafından aniden erişime kapatıldı. Genç kitleler ve dijital içerik üreticileri ayakta.',
    category: 'MEDYA',
    choices: [
      {
        text: 'VPN açarak sansüre meydan okuyan bir video çekin. Gençlere özgür ve engelsiz internet sözü verin.',
        effectText: 'Gençler, liberaller ve seküler seçmenler arasında popülariteniz patlar. Bütçe harcaması yoktur.',
        oyEtkisi: 1.06,
        butceEtkisi: 0,
        demographicSwings: { sosyalDemokrat: 0.04, liberal: 0.05 },
        relationshipEffects: { 'CHP': 8, 'AK Parti': -15, 'MHP': -12 }
      },
      {
        text: '"Ulus devletlerin egemenlik hakkı ve çocukların korunması esastır" diyerek platformların Türk yasalarına uyması gerektiğini savunun.',
        effectText: 'Muhafazakar ve devletçi ailelerin oyları artar. Genç seçmenin tepkisini çekersiniz.',
        oyEtkisi: 1.02,
        butceEtkisi: 0,
        demographicSwings: { muhafazakar: 0.04, liberal: -0.02 },
        relationshipEffects: { 'AK Parti': 12, 'MHP': 10, 'DEM Parti': -8 }
      }
    ]
  },
  {
    id: 'sokak_hayvanlari',
    title: 'Sokak Hayvanları Yasası Mecliste',
    description: 'Sokakta yaşayan sahipsiz köpeklerin "uyutulması" (itlaf edilmesi) veya barınaklara kapatılmasını içeren yasa tasarısı büyük tartışma yarattı. Hayvan hakları savunucuları ile sokak güvenliği isteyen aileler karşı karşıya.',
    category: 'GÜNDEM',
    choices: [
      {
        text: '"Hiçbir can dostumuz öldürülemez!" diyerek yasayı tamamen reddedin. Kısırlaştırma ve modern barınaklar için yerel yönetimlerin fonlamasını savunun.',
        effectText: 'Seküler, şehirli ve hayvansever kitlelerden ciddi oy akışı sağlanır. Belediyelerin fon bütçesi azalacağı için maliyet.',
        oyEtkisi: 1.05,
        butceEtkisi: -120000,
        demographicSwings: { sosyalDemokrat: 0.04, liberal: 0.02 },
        relationshipEffects: { 'CHP': 10, 'TİP': 15, 'AK Parti': -10 }
      },
      {
        text: 'Evlatlarımızın ve sokakların güvenliğini her şeyin üstünde tutun. Köpek popülasyonunun hızla sokaklardan toplatılmasını savunun.',
        effectText: 'Muhafazakar, milliyetçi ve banliyö kitlelerinden destek. Hayvansever kulüpleri protesto düzenler.',
        oyEtkisi: 1.03,
        butceEtkisi: -40000,
        demographicSwings: { muhafazakar: 0.03, milliyetci: 0.02, sosyalDemokrat: -0.02 },
        relationshipEffects: { 'AK Parti': 8, 'MHP': 8, 'Zafer': 12 }
      }
    ]
  },
  {
    id: 'gocmen_sorunu',
    title: 'Mülteci ve Sığınmacı Krizi Tartışması',
    description: 'Sınır geçişleri ve geçici koruma altındaki sığınmacıların kayıtsız istihdamı yeniden ülke gündeminin 1 numaralı maddesi oldu. Halkın büyük çoğunluğu huzursuz.',
    category: 'GÜNDEM',
    choices: [
      {
        text: '"Tüm sığınmacıları en geç 2 yıl içinde, uluslararası hukuka ve insan onuruna uygun olarak memleketlerine geri göndereceğiz!" kampanyası başlatın.',
        effectText: 'Muazzam seviyede milliyetçi ve seküler tepki oyları kazanırsınız. Sınır güvenliği kampanyası maliyetlidir.',
        oyEtkisi: 1.09,
        butceEtkisi: -200000,
        demographicSwings: { milliyetci: 0.08, sosyalDemokrat: 0.03, sosyalist: -0.04 },
        relationshipEffects: { 'Zafer': -15, 'İYİ Parti': 12, 'AK Parti': -20 } // Zafer reacts negatively since you steal their spotlight
      },
      {
        text: 'Sınır güvenliğini maksimuma çıkarmayı, sığınmacıların getto oluşturmasını önlemeyi ve Avrupa Birliği ile imzalanan geri kabul anlaşmasını iptal etmeyi savunun.',
        effectText: 'Devletçi ve merkez sağ oyları artar. AK Parti tabanında tereddüt yaratır.',
        oyEtkisi: 1.05,
        butceEtkisi: -100000,
        demographicSwings: { milliyetci: 0.04, liberal: 0.02 },
        relationshipEffects: { 'İYİ Parti': 15, 'CHP': 6 }
      },
      {
        text: 'Entegrasyon süreçleri yürütülmesini, çocukların eğitim hakkını ve kaçak binalarla fabrikalardaki ucuz sığınmacı emeği sömürüsünün engellenmesini vurgulayın.',
        effectText: 'Sol ve insan hakları odaklı seçmende yükseliş. İnsani tavır takdir edilir.',
        oyEtkisi: 1.02,
        butceEtkisi: -50000,
        demographicSwings: { sosyalist: 0.05, milliyetci: -0.04 },
        relationshipEffects: { 'DEM Parti': 12, 'TİP': 15 }
      }
    ]
  },
  {
    id: 'deprem_hazirligi',
    title: 'Büyük Marmara Depremi Uyarısı ve Kentsel Dönüşüm',
    description: 'Bilim insanları Marmara Bölgesi için kırmızı alarm vermeye devam ediyor. Kentsel dönüşüm kira fiyatlarını artırırken, riskli binaların sayısı hala çok yüksek.',
    category: 'KRİZ',
    choices: [
      {
        text: 'Deprem bütçesini 5 katına çıkarma, müteahhit çetelerinden hesap sorma ve dar gelirlilere tamamen ücretsiz depreme dayanıklı konut projeleri sunma sözü verin.',
        effectText: 'Marmara başta olmak üzere tüm ülkede seçmende güven inşa edilir. Büyük bir reklam kampanyası gerektirir.',
        oyEtkisi: 1.07,
        butceEtkisi: -250000,
        demographicSwings: { sosyalDemokrat: 0.04, sosyalist: 0.03, liberal: 0.01 },
        relationshipEffects: { 'CHP': 8, 'AK Parti': -10 }
      },
      {
        text: 'Yabancı yatırımcıları ve yerli inşaat holdinglerini kapsayan "Vergi Teşviki ile Hızlı Kentsel Dönüşüm" modelini savunun.',
        effectText: 'İnşaat ve sanayi odalarından partinize büyük miktarda bağış gelir.',
        oyEtkisi: 1.02,
        butceEtkisi: 500000,
        demographicSwings: { liberal: 0.04, sosyalist: -0.02 },
        relationshipEffects: { 'AK Parti': 8, 'DEVA': 10 }
      }
    ]
  },
  {
    id: 'eyt_ve_emekliler',
    title: 'Emeklilerin Büyük Ankara Mitingi',
    description: 'Yüz binlerce emekli, maaşlarının açlık sınırının altında kalmasından dolayı Ankara Tandoğan meydanında devasa bir miting düzenledi. Muhalefet liderleri kürsüde.',
    category: 'SOSYAL',
    choices: [
      {
        text: 'Mitinge bizzat katılarak emeklileri kürsüden selamlayın. En düşük emekli maaşını asgari ücret eşitleme sözü verin.',
        effectText: 'Emekli nüfusun yoğun olduğu şehirlerde (Zonguldak, Izmir, Bartın vb.) oylarınız sıçrar.',
        oyEtkisi: 1.06,
        butceEtkisi: -80000,
        demographicSwings: { sosyalDemokrat: 0.03, muhafazakar: 0.02 },
        relationshipEffects: { 'CHP': 8, 'AK Parti': -15, 'MHP': -10 }
      },
      {
        text: 'Erken emekliliğin ve popülist vaatlerin hazineye büyük yük getirdiğini vurgulayın. Ekonomide istikrar için yapısal reformları ve istihdamı savunun.',
        effectText: 'Genç işsizler ve sermaye sahiplerinden destek alınır. Emekliler öfkelenir.',
        oyEtkisi: 0.97,
        butceEtkisi: 250000,
        demographicSwings: { liberal: 0.04, muhafazakar: -0.03, sosyalDemokrat: -0.03 },
        relationshipEffects: { 'DEVA': 12, 'AK Parti': 5 }
      }
    ]
  },
  {
    id: 'universiteler',
    title: 'Barınma Krizi ve Üniversite Öğrencilerinin Eylemleri',
    description: 'Büyükşehirlerdeki kira artışları ve KYK yurtlarındaki yetersiz kapasite/kötü yemek kalitesi sebebiyle üniversite öğrencileri parklarda "Barınamıyoruz" nöbetleri başlattı.',
    category: 'SOSYAL',
    choices: [
      {
        text: 'Öğrenci evlerine kira desteği ve KYK yurtlarının ücretsiz hale getirilmesi için belediyelerinizde hemen adım atın ve ulusal öğrenci fonu vaat edin.',
        effectText: 'Genç seçmenin kalbini kazanırsınız. Büyük oy artışı.',
        oyEtkisi: 1.05,
        butceEtkisi: -100000,
        demographicSwings: { sosyalDemokrat: 0.04, sosyalist: 0.04, liberal: 0.02 },
        relationshipEffects: { 'TİP': 12, 'CHP': 6 }
      },
      {
        text: 'Bu eylemlerin provokatif olduğunu ve arkasında marjinal grupların bulunduğunu belirterek devlete karşı saygılı olunması çağrısı yapın.',
        effectText: 'Muhafazakar ve milliyetçi yaşlı seçmenden onay alırsınız. Genç oylar erir.',
        oyEtkisi: 1.01,
        butceEtkisi: 0,
        demographicSwings: { muhafazakar: 0.04, milliyetci: 0.02, sosyalDemokrat: -0.04 },
        relationshipEffects: { 'AK Parti': 12, 'MHP': 8, 'TİP': -15 }
      }
    ]
  },
  {
    id: 'super_kupa',
    title: 'Süper Kupa Finalinin Yurt Dışı Tartışması',
    description: 'Galatasaray ve Fenerbahçe arasındaki Süper Kupa finalinin Suudi Arabistan\'da oynanması planlanırken, Atatürk posterlerine ve İstiklal Marşı\'na izin verilmediği iddiasıyla takımlar maça çıkmadı. Ülkede milliyetçi ve Atatürkçü rüzgarlar esiyor.',
    category: 'SOSYAL',
    choices: [
      {
        text: '"Atatürk ve İstiklal Marşı bizim kırmızı çizgimizdir!" diyerek milli gururu savunup federasyon yönetimini ve sorumluları istifaya davet edin.',
        effectText: 'Milliyetçi ve Sosyal Demokrat oylarda adeta patlama yaşanır. Halkın takdirini kazanırsınız.',
        oyEtkisi: 1.08,
        butceEtkisi: -30000,
        demographicSwings: { milliyetci: 0.05, sosyalDemokrat: 0.04 },
        relationshipEffects: { 'CHP': 10, 'Zafer': 10, 'İYİ Parti': 12, 'AK Parti': -10 }
      },
      {
        text: '"Olayı diplomatik bir krize dönüştürmeyelim, ülkemizin dış ilişkileri ve turizm gelirleri de önemlidir" diyerek daha itidalli bir dil kullanın.',
        effectText: 'Muhafazakar diplomatik çevrelerin desteği. Seküler seçmen son derece öfkelenir.',
        oyEtkisi: 0.96,
        butceEtkisi: 150000,
        demographicSwings: { muhafazakar: 0.03, milliyetci: -0.05, sosyalDemokrat: -0.05 },
        relationshipEffects: { 'AK Parti': 15, 'MHP': 5, 'Zafer': -15 }
      }
    ]
  },
  {
    id: 'vergi_paketi',
    title: 'Yeni Vergi Paketi ve KDV Artışları',
    description: 'Bütçe açığını kapatmak gerekçesiyle lüks tüketim, akaryakıt, telefon harçları ve KDV oranlarında rekor artışlara gidildi. Esnaf ve vatandaşlar dertli.',
    category: 'EKONOMİ',
    choices: [
      {
        text: 'Tüm esnaf odalarını ziyaret edip vergi yükünün zengin holdinglere yüklenmesini savunun. "Liyakatsiz bütçeye dur diyeceğiz!" kampanyası yapın.',
        effectText: 'Esnaftan ve orta sınıftan büyük oy desteği. Broşür dağıtımı maliyetlidir.',
        oyEtkisi: 1.05,
        butceEtkisi: -110000,
        demographicSwings: { liberal: 0.03, sosyalDemokrat: 0.03, muhafazakar: 0.01 },
        relationshipEffects: { 'CHP': 6, 'İYİ Parti': 8, 'AK Parti': -15 }
      },
      {
        text: 'Deprem harcamaları ve EYT bütçe yüklerini hatırlatıp, bu zor günlerde devletimizin arkasında durmalı ve tasarrufa kendimizden başlamalıyız deyin.',
        effectText: 'Hükümet medyasında takdir edilirsiniz ve geniş yayın hakkı alırsınız.',
        oyEtkisi: 1.01,
        butceEtkisi: 200000, // media support indirectly increases party funding
        demographicSwings: { muhafazakar: 0.03, liberal: -0.02 },
        relationshipEffects: { 'AK Parti': 15, 'MHP': 10 }
      }
    ]
  }
];
