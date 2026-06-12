import { TbmmSession } from '../types';

export const tbmmSessions: TbmmSession[] = [
  {
    id: 'T-101',
    week: 6,
    billTitle: 'Deprem ve Doğal Afet Özel Yardım Vergi Paketi',
    billDescription: 'Hükümet, beklenen büyük Marmara depremine hazırlık ve afetten etkilenen bölgelerin inşası amacıyla, 100 bin ₺ üzeri kredi kartı limiti olanlardan ve büyük sermaye sahiplerinden ek vergi toplanmasını öngören bir kanun teklifi sundu. Muhalefet ve iş dünyası ikiye bölünmüş durumda.',
    options: [
      {
        text: 'Hükümet teklifine KABUL oyu verin: "Mevzu bahis afet hazırlığıysa, siyasi hesap yapmadan devletimizin yanındayız!"',
        action: 'YES',
        outcomeTitle: 'Afet Vergisi Kabul Edildi',
        outcomeDescription: 'Halkın bir kısmı sorumluluk duygunuzu takdir etti. Muhafazakar tabanda popülariteniz arttı ancak liberal iş dünyası ve orta sınıf seçmenden tepki aldınız.',
        supportEffect: 0.8,
        budgetEffect: -100000,
        slogan: 'Ortak acılarda siyaset olmaz, devletimizin ve milletimizin yanındayız!',
        relationshipDelta: { 'AK Parti': 15, 'MHP': 12, 'CHP': -10, 'DEVA': -18 }
      },
      {
        text: 'Teklife RET oyu verin ve sert muhalefet yapın: "Halk zaten vergiler altında eziliyor. Önce saray harcamalarını ve lüks araç ihalelerini kısın!"',
        action: 'NO',
        outcomeTitle: 'Devlet Bütçe Tasarısına Sert Ret',
        outcomeDescription: 'Orta sınıf, seküler kentliler ve sol seçmende popülariteniz tavan yaptı. CHP ile yakınlaştınız lakin milliyetçi bloklar tarafından "devlet karşıtlığı" ile itham edildiniz.',
        supportEffect: 1.5,
        budgetEffect: 0,
        slogan: 'Dolaylı vergilerle halkın cebine el atmayı bırakın, israfı kesin!',
        relationshipDelta: { 'AK Parti': -15, 'CHP': 15, 'DEM Parti': 10, 'MHP': -12 }
      },
      {
        text: 'Meclis kürsüsünde ÇEKİMSER kalarak alternatif yasa teklifi hazırlayın: "Yasa tasarısı revize edilmeli, vergi halktan değil holdinglerden alınmalıdır."',
        action: 'ABSTAIN',
        outcomeTitle: 'Tasarının Revizayonu Talebi',
        outcomeDescription: 'Dengeli ve rasyonel tavrınız merkez seçmenden ve kararsızlardan büyük beğeni topladı. Gelecek ve Saadet partilerinden destek açıklamaları geldi.',
        supportEffect: 1.0,
        budgetEffect: -30000,
        slogan: 'Ne halkı ezdireceğiz ne de afet hazırlığını aksatacağız. Adaletli vergi istiyoruz!',
        relationshipDelta: { 'Saadet': 15, 'Gelecek': 15, 'DEVA': 12, 'AK Parti': 2 }
      }
    ]
  },
  {
    id: 'T-102',
    week: 14,
    billTitle: 'Sokak Hayvanları ve Güvenli Sokaklar Reformu',
    billDescription: 'Kamuoyunda fırtınalar koparan yasa tasarısı mecliste. Tasarı, sahipsiz sokak köpeklerinin toplatılmasını, barınak kapasitelerinin artırılmasını ve sahiplendirilmeyen tehlikeli ırkların uyutulmasını içermektedir. Genç nüfus ve hayvan hakları dernekleri meclis önünde eylemler düzenliyor.',
    options: [
      {
        text: 'Sıkı tedbir ve toplatılmaya KABUL oyu verin: "Çocuklarımızın ve sokaklarımızın güvenliği kırmızı çizgimizdir!"',
        action: 'YES',
        outcomeTitle: 'Sokakların Güvenliği Önceliğimiz',
        outcomeDescription: 'Aileler ve muhafazakar/milliyetçi seçmenler çocuk haklarını ve sokak güvenliğini önceleyen bu kararınızı sevinçle karşıladı. Sol ve çevreci gruplar ise çok öfkeli.',
        supportEffect: 1.2,
        budgetEffect: -50000,
        slogan: 'Sokaklar sahipsiz başıboş köpeklerin değil, evlatlarımızın oyun alanıdır!',
        relationshipDelta: { 'AK Parti': 12, 'MHP': 15, 'Zafer': 18, 'CHP': -15, 'TİP': -20 }
      },
      {
        text: 'Kanun tasarısına kesinlikle RET oyu verin: "Yaşam hakkı kutsaldır, hiçbir canlıyı barınak adı altında katledemezsiniz!"',
        action: 'NO',
        outcomeTitle: 'Katliam Yasasına Karşı Duruş',
        outcomeDescription: 'Hayvanseverler, gençler, sanatçılar ve seküler demokrat kesimler partinizi ayakta alkışladı. CHP ve DEM Parti ile tam ortaklık çizgisine geldiniz.',
        supportEffect: 1.6,
        budgetEffect: -80000, // Barınak kampanyalarına sembolik destek
        slogan: 'Öldüren değil yaşatan, barınakları cennete çeviren bütçeyi savunun!',
        relationshipDelta: { 'CHP': 15, 'DEM Parti': 12, 'TİP': 20, 'AK Parti': -18, 'MHP': -15 }
      },
      {
        text: 'Kürsüde "Kısırlaştırma ve Büyükşehir Fonu" çağrısıyla yapıcı ortak yol sunun.',
        action: 'ABSTAIN',
        outcomeTitle: 'Kısırlaştırma Seferberliği Uzlaşısı',
        outcomeDescription: 'Hırçın kutuplaşmaların yaşandığı mecliste tek rasyonel çıkışı sizin yaptığınız konuşma oldu. "Hem canları koruyacağız hem de sokakları güvenli kılacağız" teziniz her kesimden beğeni topladı.',
        supportEffect: 1.1,
        budgetEffect: -25000,
        slogan: 'Katliama hayır, başıboşluğa hayır! Büyükşehir fonlarıyla topyekün kısırlaştırma seferberliği tek çözümdür.',
        relationshipDelta: { 'İYİ Parti': 15, 'DEVA': 12, 'Saadet': 10, 'Gelecek': 10 }
      }
    ]
  },
  {
    id: 'T-103',
    week: 24,
    billTitle: 'Dezenformasyon ve İnternet Medyası Düzenleme Kanunu',
    billDescription: 'İktidar bloğu, sosyal medyada asılsız haber yayanlara ve dezenformasyon yapanlara 3 yıla kadar hapis cezası getiren, sosyal ağ sağlayıcılarına ise bant daraltma cezaları öngören yeni ceza yasa tasarısını komisyondan geçirdi. Muhalefet bunu "sansür yasası" olarak nitelendiriyor.',
    options: [
      {
        text: 'Milli güvenlik ve siber vatan gerekçesiyle KABUL oyu deklare edin.',
        action: 'YES',
        outcomeTitle: 'Siber Vatan Düzenlemesi Desteklendi',
        outcomeDescription: 'Devlet hassasiyeti olan milliyetçi ve muhafazakar kesimlerde güven tazelediniz fakat genç seçmenler ve bağımsız gazeteciler partinizi terk etmeye başladı.',
        supportEffect: 0.5,
        budgetEffect: 0,
        slogan: 'İnternet mecrası yalan terörünün ve ajan provokatörlerin cirit sahası olamaz!',
        relationshipDelta: { 'AK Parti': 15, 'MHP': 15, 'CHP': -18, 'DEM Parti': -20, 'TİP': -15 }
      },
      {
        text: 'Özgür internet ve basın özgürlüğü için RET oyu kullanın ve sansürü protesto edin.',
        action: 'NO',
        outcomeTitle: 'Sansür Yasasına Meclis Direnişi',
        outcomeDescription: 'Gençler, sosyal medya fenomenleri ve bağımsız basın partinize akın etti. Oy oranınız yükseldi. İnternette trendlere girdiniz!',
        supportEffect: 1.8,
        budgetEffect: -30000,
        slogan: 'Gençlerimizin sesini kısamazsınız! Klavyelere kelepçe, fikirlere pranga vurulamaz!',
        relationshipDelta: { 'CHP': 15, 'İYİ Parti': 12, 'DEVA': 10, 'AK Parti': -18, 'MHP': -18 }
      },
      {
        text: 'Ortak akıl önerisiyle komisyona geri iade edilmesini talep edin.',
        action: 'ABSTAIN',
        outcomeTitle: 'Maddelerin Revizyonu ve Ertelemesi',
        outcomeDescription: '"Dezenformasyon önlenmeli ancak ifade özgürlüğü güvenceye alınmalı" şeklindeki dengeli şerhiniz, akılcı siyaseti öne çıkardı ve saygınlığınızı artırdı.',
        supportEffect: 1.0,
        budgetEffect: 0,
        slogan: 'Milli güvenliği de koruyacağız, hür düşünceyi de yaşatacağız. Muğlak maddeler düzeltilmeli!',
        relationshipDelta: { 'İYİ Parti': 10, 'Saadet': 10, 'Gelecek': 10, 'VP': 10 }
      }
    ]
  },
  {
    id: 'T-104',
    week: 36,
    billTitle: 'Seçim Barajının %3’e Düşürülmesi ve İttifak Yasası',
    billDescription: 'Türk siyasi hayatındaki baraj tartışmaları tekrar mecliste. Küçük partilerin mecliste temsil hakkı kazanması ve koalisyon kurma kolaylıklarının getirilmesi için barajın %7\'den %3\'e çekilmesini sunan bir tasarı oylanıyor.',
    options: [
      {
        text: 'Teklif lehine KABUL oyu verin: "Milli İradenin mecliste tam temsili demokrasinin gereğidir!"',
        action: 'YES',
        outcomeTitle: 'Demokrasi Temsili ve Barajın İndirilmesi',
        outcomeDescription: 'Saadet, Gelecek, DEVA, TİP gibi tüm baraj sınırındaki partiler size minnettar kaldı. Çok ortaklı ittifak kapıları sonuna kadar aralandı.',
        supportEffect: 1.1,
        budgetEffect: 0,
        slogan: 'Her ses değerlidir, %7 barajı oligarşik bir engeldir. Demokrasi baraj tanımaz!',
        relationshipDelta: { 'Saadet': 20, 'Gelecek': 20, 'DEVA': 15, 'TİP': 15, 'AK Parti': -10, 'MHP': -10 }
      },
      {
        text: 'Teklife RET oyu verin: "Yönetimde istikrar ve siyasi istikrar için baraj korunmalıdır!"',
        action: 'NO',
        outcomeTitle: 'Yönetimde İstikrar İlkesi Savunuldu',
        outcomeDescription: 'Büyük partiler ve muhafazakar seçmen kararlılığınızı "devlet ciddiyeti" olarak gördü Ancak küçük partilerle olan diplomatik ilişkileriniz ağır yara aldı.',
        supportEffect: 0.6,
        budgetEffect: 0,
        slogan: 'Siyasetin parça pinçik edilip istikrarsız koalisyon yıllarına geri dönülmesine izin veremeyiz!',
        relationshipDelta: { 'AK Parti': 12, 'MHP': 12, 'CHP': -10, 'Saadet': -15, 'Gelecek': -15 }
      },
      {
        text: '"Dar Bölge ya da Tercihli Oy" sistemi önergesiyle kürsü konuşması gerçekleştirin.',
        action: 'ABSTAIN',
        outcomeTitle: 'Tercihli Seçim ve Reform Önerisi',
        outcomeDescription: 'Meclise sunduğunuz dar bölge seçim önerisi büyük yankı buldu. Vizyoner ve derin siyaset uzmanı imajınız pekişti.',
        supportEffect: 1.0,
        budgetEffect: -40000,
        slogan: 'Sadece baraj değil, lider sultasını yıkan tercihli milletvekilliği sistemi getirilmelidir!',
        relationshipDelta: { 'İYİ Parti': 12, 'CHP': 6, 'DEVA': 10 }
      }
    ]
  },
  {
    id: 'T-105',
    week: 44,
    billTitle: 'Yerli Savunma Sanayii Geliştirme ve Ek Finansman Yasası',
    billDescription: 'Milli savunma teknolojileri (İHA, SİHA, savaş uçakları) Ar-Ge projeleri için savunma bütçesine ek olarak, sıfır motorlu taşıt alımlarında ve gayrimenkul satışlarında binde 1 oranında ek "Savunma ve Güvenlik Fonu" kesintisi yapılması yasa teklifi ile oylamaya sunuldu.',
    options: [
      {
        text: 'Milli teknoloji hamlesi uğruna KABUL oyu kullanın: "İstiklal ve istikbalimizin teminatı olan orduya destek borcumuzdur!"',
        action: 'YES',
        outcomeTitle: 'Milli Savunma Sanayii Fonu Yasalaştı',
        outcomeDescription: 'Milliyetçi-vatansever seçmenden ve savunma sanayii çalışanlarından tam not aldınız. Ancak ekonomik daralmadan yakınan vergi mükellefleri tepki koydu.',
        supportEffect: 1.4,
        budgetEffect: -100000,
        slogan: 'Gök vatanımızı, siber vatanımızı korumak için ordumuzun ve milli teknolojinin arkasındayız!',
        relationshipDelta: { 'AK Parti': 15, 'MHP': 18, 'Zafer': 15, 'VP': 15, 'DEM Parti': -25 }
      },
      {
        text: 'ÖTV bükücü vergilendirmeye RET oyu verin: "Savunmanın bütçesi vatandaştan değil, sarayın lüks bütçesinden aktarılsın!"',
        action: 'NO',
        outcomeTitle: 'Ek Savunma Kesintilerine Meclis Seti',
        outcomeDescription: 'Hayat pahalılığından bıkmış milyonlar ve sol seçmen çizgisi bu çıkışınızı coşkuyla karşıladı. "Ordumuz gözbebeğimizdir ama bunun faturası asgari ücretliye kesilemez" argümanınız halkta karşılık buldu.',
        supportEffect: 1.5,
        budgetEffect: 0,
        slogan: 'Savunma sanayiini hepimiz destekliyoruz ama israf bütçeleri dururken vatandaşa yeni haraç yüklenmesine hayır!',
        relationshipDelta: { 'CHP': 15, 'TİP': 15, 'DEM Parti': 15, 'AK Parti': -18, 'MHP': -18 }
      },
      {
        text: '"Tasarruf Önceliği ve Meclis Denetimi" şartıyla şerh koyarak çekimser kalın.',
        action: 'ABSTAIN',
        outcomeTitle: 'Denetimli Savunma Bütçesi Önerisi',
        outcomeDescription: 'Akılcı ve şeffaf bütçe savunuculuğunuz bürokrasi ve merkez sağ partilerde büyük saygı gördü.',
        supportEffect: 0.9,
        budgetEffect: -20000,
        slogan: 'Milli savunma fonu kurulsun ancak Sayıştay denetimine tabi tutulsun ve tasarruflarla finanse edilsin!',
        relationshipDelta: { 'İYİ Parti': 15, 'DEVA': 12, 'Saadet': 8 }
      }
    ]
  }
];
