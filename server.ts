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

  // Google Cloud OAuth configuration & URL generator route
  app.get("/api/auth/google/config", (req, res) => {
    res.json({
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID || ""
    });
  });

  app.get("/api/auth/google/url", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(400).json({ error: "Google Client ID is not configured." });
    }

    const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${host}/api/auth/google/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      prompt: 'select_account'
    });

    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  });

  // Google Cloud OAuth callback to exchange authorization code for real idTokens
  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code is missing.");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).send("Google OAuth secrets are not configured in system environment.");
    }

    const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${host}/api/auth/google/callback`;

    try {
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("code", code as string);
      params.append("redirect_uri", redirectUri);
      params.append("grant_type", "authorization_code");

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error("Token exchange failed:", errText);
        return res.status(500).send(`Token exchange failed: ${errText}`);
      }

      const tokenData: any = await tokenResponse.json();

      res.send(`
        <html>
          <head>
            <title>Giriş Yapılıyor / Signing In</title>
            <meta charset="utf-8" />
          </head>
          <body style="background: #0f172a; color: #f1f5f9; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; margin: 0; padding: 20px; box-sizing: border-box;">
            <div style="text-align: center; max-width: 400px; background: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);">
              <div style="display: inline-block; width: 48px; height: 48px; background: #22c55e; border-radius: 50%; color: white; line-height: 48px; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center;">✓</div>
              <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold; color: #f8fafc;">Giriş Başarılı!</h2>
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">Kampanya ve bulut kayıtlarınız başarıyla bağlandı. Bu pencere otomatik olarak kapanacaktır.</p>
              <h2 style="margin: 30px 0 10px 0; font-size: 20px; font-weight: bold; color: #f8fafc; border-top: 1px solid #334155; padding-top: 20px;">Authenticated!</h2>
              <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5;">Election profiles synchronized. This window will close automatically.</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: "GOOGLE_OAUTH_SUCCESS",
                  idToken: ${JSON.stringify(tokenData.id_token)},
                  accessToken: ${JSON.stringify(tokenData.access_token)}
                }, "*");
                window.close();
              } else {
                window.location.href = "/";
              }
            </script>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Callback route error:", error);
      res.status(500).send(`Authentication error: ${error?.message || String(error)}`);
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
