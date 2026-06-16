import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route first
  app.post("/api/chat", async (req, res) => {
    try {
      const { 
        rivalLeader, 
        rivalShortName, 
        rivalIdeology, 
        relationshipWithPlayer, 
        playerLeader, 
        playerPartyName, 
        playerPartyShortName, 
        message, 
        history 
      } = req.body;

      if (!message || !rivalLeader) {
        return res.status(400).json({ error: "Eksik parametre." });
      }

      // Check if GEMINI_API_KEY is available
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY not found, serving simulated response.");
        const fallback = getSimulatedResponse(rivalShortName, rivalLeader, playerLeader, message, relationshipWithPlayer);
        return res.json({ response: fallback, relDelta: 0 });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare conversation history
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.sender === playerLeader ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      // Append latest message
      formattedHistory.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction: `Siz Türk siyasetindeki ${rivalShortName} partisi genel başkanı ${rivalLeader} rolündesiniz. Rol yapma kapsamında tamamen bu kişiliğe bürünün.
Siyasal İdeolojiniz veya Sloganız: ${rivalIdeology}.
Sizinle iletişim kuran kişi: Rakip parti genel başkanı ve cumhurbaşkanı adayı Sayın ${playerLeader} (${playerPartyName} - ${playerPartyShortName}).
Sizinle olan mevcut diplomasi ilişkisi derecesi: ${relationshipWithPlayer} puan (-100 ile +100 arası. Eksi ise düşmanca/soğuk, artı ise çok dostane/müttefik).

Kurallar:
1. Kesinlikle kendi canlandırdığınız politik liderin özgün siyasi üslubunun, konuşma tarzının, meşhur jargonlarının ve siyasi duruşunun dışına çıkmayın.
2. "reply": Vereceğiniz cevap çok kısa, öz ve net olmalı (en fazla 2 veya 3 cümle). Doğrudan bir sohbet gibi yazın. Markdown veya yapay zeka olduğunuza dair hiçbir meta ibare eklemeyin.
3. "relDelta": Oyuncunun yazdığı mesaja (ve geçmişe) göre aranızdaki ilişki puanını nasıl değiştireceğinizi belirleyin. Eğer oyuncu saygılı, destekleyici veya ortaklık teklif eden sıcak bir dille konuşuyorsa pozitif (+1 ile +8 arası), eğer agresif, eleştiren, laf sokan veya itham eden bir dille konuşuyorsa negatif (-1 ile -12 arası), nötr ise 0 döndürün.`,
          temperature: 0.85,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: "Verdiğiniz Türkçe lider yanıtı (En fazla 2-3 cümle)",
              },
              relDelta: {
                type: Type.INTEGER,
                description: "Görüşmenin seyrine göre ilişki değişimi (Örn: -5, 0, 3, vb.)",
              }
            },
            required: ["reply", "relDelta"]
          }
        }
      });

      let jsonStr = response.text || "";
      let parsed = { reply: "", relDelta: 0 };
      try {
        parsed = JSON.parse(jsonStr.trim());
      } catch (e) {
        console.warn("JSON parse error, trying manual extract on text:", jsonStr);
        parsed = { reply: jsonStr, relDelta: 0 };
      }

      return res.json({ response: parsed.reply || "Görüşleriniz için teşekkür ederim.", relDelta: parsed.relDelta || 0 });

    } catch (error: any) {
      console.error("Gemini API error:", error);
      const fallback = getSimulatedResponse(req.body.rivalShortName, req.body.rivalLeader, req.body.playerLeader, req.body.message, req.body.relationshipWithPlayer);
      return res.json({ response: fallback, relDelta: 0 });
    }
  });

  // Simulated Fallback Generator (custom response logic for rich feedback even offline)
  function getSimulatedResponse(party: string, leader: string, player: string, msg: string, rel: number): string {
    const textLC = msg.toLowerCase();
    const isFriendly = rel > 15;
    const isHostile = rel < -15;

    // A collection of general phrases to append or use randomly so responses are dynamic
    const genericFriendlyCHP = [
      `Sayın ${player}, demokrasinin yeniden inşası sürecindeki yapıcı önerilerinizi çok kıymetli buluyorum.`,
      `Cumhuriyetimizin kurucu ilkeleri ışığında, sizlerin bu samimi adımlarına ortak bir akılla yaklaşmayı borç biliriz Sayın Lider.`,
      `Ziyadesiyle memnun oldum Sayın ${player}. Ortak geleceğimiz için diyalog kanallarını açık tutmak hayati önemdedir.`
    ];

    const genericHostileCHP = [
      `Siyasi rant kapısı arayanların, bizim demokratik çizgimize yönelttikleri asılsız iddialara halkımız sandıkta hak ettiği yanıtı verecektir Sayın ${player}.`,
      `Muhalefet yapmayı sadece çamur atmak sanan zihniyetle konuşacak hiçbir saniyemiz yoktur. Yolumuz halkın yoludur.`,
      `Sizin bu üslubunuz ve partinizin vaatleri, demokrasiden ne kadar uzak olduğunuzun en somut göstergesidir Sayın ${player}.`
    ];

    const genericNeutralCHP = [
      `Biz CHP olarak, cumhuriyetimizin temel değerleri doğrultusunda kendi yolumuzda kararlılıkla ilerliyoruz Sayın ${player}.`,
      `Önerinizi yetkili kurullarımızda değerlendireceğiz. Politikamız her zaman adaleti ve eşitliği savunmaktır.`,
      `Sayın ${player}, Meclis çatısı altında memleket yararına her türlü makul konuyu istişare etmeye elbette açığız.`
    ];

    const genericFriendlyAKP = [
      `Ortak milli menfaatlerimiz doğrultusunda her zaman vatanperver adımların en büyük destekçisiyiz Sayın ${player}. Davetiniz için teşekkür ederim.`,
      `Bakınız Sayın ${player}, devleti yönetmek ciddiyet ister. Bu ciddiyete ortak olma arzunuzu memnuniyetle karşılıyoruz.`,
      `Milletimizin birliği ve beraberliği için her vatan evladıyla aynı masada buluşmaktan asla hicap duymayız, bilakis gurur duyarız.`
    ];

    const genericHostileAKP = [
      `Siz ancak konuşursunuz, hayal satarsınız; biz ise 22 yıldır olduğu gibi sadece ve sadece icraat üretiriz Sayın ${player}.`,
      `Milletimiz, geçmişinizde ülkemize hangi yaraya merhem olduğunuzu çok iyi biliyor. Bize ders vermeye kalkmayın!`,
      `Karanlık ittifakların arkasına saklanarak siyaset ürettiğini sananlar, aziz milletimizin tokat gibi cevabıyla sandıkta karşılaşacaktır.`
    ];

    const genericNeutralAKP = [
      `Milletimiz için en hayırlısı neyse biz her zaman o doğrultuda kararlar alıp yolumuza devam ederiz Sayın ${player}.`,
      `Büyük Türkiye vizyonumuz doğrultusunda çalışmalarımızı durmaksızın sürdürüyoruz. Tüm siyasi partilere çalışmalarında başarılar dileriz.`,
      `Hükümetimiz, devletimizin ali menfaatlerini korumak için gece gündüz çalışmaktadır. Sizin de bu çabayı takdir etmenizi bekleriz.`
    ];

    const genericFriendlyMHP = [
      `Söz konusu milli bekamız olduğunda, vatan sevgisinde birleşen yüreklerle omuz omuza durmaktan gurur duyarız Sayın ${player}.`,
      `Milli duruşunuza ve gösterdiğiniz fevkalade nezakete teşekkür eder, siyasi hayatınızda muvaffakiyetler dilerim.`,
      `Biz 'Önce ülkem ve milletim' deriz. Bu düsturumuza saygı gösterdiğiniz ölçüde sizinle her türlü milli meseleyi konuşuruz.`
    ];

    const genericHostileMHP = [
      `Milliyetçi Hareket Partisi'nin milli ve sarsılmaz iradesini, sinsi planlarla sınamaya kalkanlar hüsranın en büyüğünü yaşayacaktır!`,
      `Bize akıl vermeye cüret edenler, önce kendi çizgilerinin ve kirli ortaklıklarının hesabını millete vermelidir Sayın ${player}!`,
      `Ne söylediğinizin bizim nezdimizde hiçbir kıymeti harbiyesi yoktur! Tavrımız çelikten bir kale gibidir, aşamazsınız!`
    ];

    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (party === "AK Parti") {
      if (textLC.includes("ekonomi") || textLC.includes("zam") || textLC.includes("para") || textLC.includes("enflasyon")) {
        return `Bakınız Sayın ${player}, biz 22 yıldır bu ülkeyi nereden nereye getirdik. Küresel ekonomik krizi vatandaşımıza en az şekilde yansıtacak tedbirleri her zamanki gibi yine biz alıyoruz; siz merak etmeyin, hayal de satmayın.`;
      }
      if (textLC.includes("ittifak") || textLC.includes("koalisyon") || textLC.includes("ortak") || textLC.includes("gelin")) {
        return isFriendly 
          ? `Biz milletimizin, devletimizin menfaati neredeyse orada oluruz Sayın ${player}. Vatan sevgisini ön plana alan her tür samimi temas ve diyaloğa her zaman açığız.`
          : `Bizim Cumhur İttifakı gibi kaya gibi sağlam bir davanın ve iradenin ortağıyız. İlkeleri belirsiz, çizgisi kaypak ittifaklarla bizim masada buluşacak hiçbir şeyimiz yoktur.`;
      }
      if (isFriendly) return getRandomElement(genericFriendlyAKP);
      if (isHostile) return getRandomElement(genericHostileAKP);
      return getRandomElement(genericNeutralAKP);
    }

    if (party === "CHP") {
      if (textLC.includes("ekonomi") || textLC.includes("fakir") || textLC.includes("emekli") || textLC.includes("işçi")) {
        return `Milyonlarca vatandaşımız ve cefakar asgari ücretlimiz bu iktidarın kötü ekonomi yönetimi yüzünden derin bir yoksulluğa sürüklendi. Biz iktidara geldiğimiz ilk gün bu düzeni kökten değiştireceğiz Sayın ${player}!`;
      }
      if (textLC.includes("ittifak") || textLC.includes("ortak") || textLC.includes("birlikte")) {
        return isFriendly
          ? `Demokratik bir Türkiye inşası için adil şartlar altında ortak bir zeminde buluşmak bizim siyasi ahlakımızın bir gereğidir. Temaslarımızı sıklaştırmalıyız.`
          : `Cumhuriyetimizin ve demokrasimizin temel normlarından ödün veren yapılarla suni bir birlikteliğe asla girmeyiz. Biz kendi güçlü ittifakımızı zaten halkımızla kurduk.`;
      }
      if (isFriendly) return getRandomElement(genericFriendlyCHP);
      if (isHostile) return getRandomElement(genericHostileCHP);
      return getRandomElement(genericNeutralCHP);
    }

    if (party === "MHP") {
      if (textLC.includes("ittifak") || textLC.includes("koalisyon")) {
        return `Milliyetçi Hareket Partisi'nin kararı nettir, liderinin çizgisi bellidir, o çizgi de tavizsiz Cumhur İttifakı'dır! Bunun ötesinde sinsi ve karanlık arayışlar içinde olanlar sadece hüsran bulur!`;
      }
      if (isFriendly) return getRandomElement(genericFriendlyMHP);
      if (isHostile) return getRandomElement(genericHostileMHP);
      return `Mevzu bahis vatansa, milletimizin bekası ise gerisi teferruattır Sayın ${player}. Biz 'önce ülkem ve milletim' deriz, sizin gibi çıkarlar deryasında yüzmeyiz!`;
    }

    if (party === "YRP") {
      const answers = [
        `Milletimiz artık ne betoncu ne de heykelci zihniyete inanıyor Sayın ${player}! Biz Millî Görüş davasını ve hakiki adil ekonomik düzeni tesis etmek için dimdik ayaktayız.`,
        `Göz boyayan vaatlerle bu aziz milleti aldatamazsınız Sayın ${player}. Biz ahlaklı ve adaletli siyaset iddiamızla gümbür gümbür geliyoruz.`,
        `Sizin vaatlerinizde milletin refahı ve maneviyatı yok. Biz merhum Erbakan hocamızın sanayileşme ve kalkınma hamlesini getirecek yegane gücüz.`
      ];
      return getRandomElement(answers);
    }

    if (party === "DEM Parti") {
      const answers = [
        `Biz barışçıl, demokratik ve üçüncü yol iddiamızı koruyoruz Sayın ${player}. Eşit yurttaşlık ve adil yaşam haklarında buluşabilen her siyasi iradeyle centilmence konuşuruz.`,
        `Toplumsal barışı ve yerel demokrasiyi savunan her yapıyla ilkelerimiz zemininde dürüstçe diyaloğa açığız Sayın ${player}.`,
        `Demokrasinin ve insan haklarının temel ilkelerini göz ardı eden yaklaşımların bizim nezdimizde bir karşılığı yoktur.`
      ];
      return getRandomElement(answers);
    }

    if (party === "Zafer") {
      const answers = [
        `Sayın ${player}, bizim kırmızı çizgimiz nettir ve asla değişmez: Türkiye sığınmacı işgalinden derhal kurtulacak! 13 milyon sığınmacıyı gerekirse zorla geri gönderecek tek irade biziz.`,
        `Bize gelip maval okumayın Sayın Lider. Bizim önceliğimiz sığınmacıları göndermek ve vatanımızı geri almaktır. Bu konuda taviz verecek hiçbir masada olmayız.`,
        `Atatürk milliyetçiliği çizgisinde, sığınmacı krizini çözmek isteyen her hakiki vatanseverle konuşacak politikalarımız mevcuttur.`
      ];
      return getRandomElement(answers);
    }

    const genericOthers = [
      `Sayın ${player}, ${party} olarak Türkiye'nin ali menfaatlerini savunmayı ve milletimizin refahını artırmayı her şeyin üstünde tutuyoruz. Görüşünüz için yine de teşekkür ederim.`,
      `Memleket için dürüst siyaset ve şeffaf adalet anlayışımızdan asla taviz vermeden yolumuza devam ediyoruz Sayın ${player}.`,
      `Fikirlerinizi dinledik, lakin bizim kendi programımız ve ilkelerimiz halkımızın yararına olan tek reçetedir.`
    ];
    // Default general response
    return getRandomElement(genericOthers);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
