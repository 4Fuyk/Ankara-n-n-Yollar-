# 🌐 Ankara'nın Yolları - Web Sitesi Kurulum ve Yayına Alma Rehberi

Ankara'nın Yolları Türkiye Seçim Simülasyonu oyununuz artık tamamen bitti ve pürüzsüzce çalışıyor! Bu harika oyunu arkadaşlarınızla paylaşmak, kendi alan adınızda (domain) veya ücretsiz olarak internette yayınlamak istiyorsanız, aşağıdaki popüler ve ücretsiz yöntemleri uygulayabilirsiniz.

---

## 🛠️ Seçenek 1: Vercel ile 2 Dakikada Ücretsiz Yayına Alma (En Kolay Yöntem)

**Vercel**, modern web sitelerini barındırmak için kullanılan, tamamen ücretsiz, son derece hızlı ve güvenli bir bulut platformudur.

### Adım Adım Kurulum:
1. Bir **GitHub** hesabı açın (yoksa).
2. Projenizin tüm kodlarını bilgisayarınıza bilgisayardan indirip bir GitHub deposuna (repository) yükleyin.
3. [Vercel](https://vercel.com) web sitesine gidin ve GitHub hesabınızla giriş yapın.
4. Girdikten sonra sağ üstteki **"Add New" -> "Project"** seçeneğini seçin.
5. GitHub deponuzu seçin ve **"Import"** butonuna tıklayın.
6. Karşınıza gelen ayar ekranında hiçbir değişiklik yapmanıza gerek yoktur, çünkü Vercel projenin **Vite** tabanlı bir React projesi olduğunu otomatik algılayacaktır.
7. Alttaki kırmızı **"Deploy"** butonuna basın.
8. **20-30 saniye içinde** siteniz hazır olacak ve Vercel size `ankaranin-yollari.vercel.app` gibi tamamen ücretsiz, güvenli (SSL'li) özel bir link verecektir.

---

## ⚡ Seçenek 2: Netlify ile Klasör Sürükleyerek Yayına Alma (Kodsuz En Pratik Yol)

Hiç kod depolama siteleriyle (GitHub vb.) uğraşmak istemiyorsanız, sadece projenin çıktısını sürükleyerek sitenizi kurabilirsiniz.

### Adım Adım Kurulum:
1. Bilgisayarınızda projenin ana klasöründe terminalden `npm run build` komutunu çalıştırarak sitenizin çalıştırılabilir versiyonunu derleyin. (Bu işlem sonucunda projenizde `dist` adında statik bir klasör oluşur).
2. [Netlify Drop](https://app.netlify.com/drop) adresine girin.
3. Bilgisayarınızda oluşan bu **`dist`** klasörünü fareyle tutup oradaki upload kutusuna sürükleyip bırakın.
4. Saniyeler içinde siteniz online olacak ve size yayında olan sitenizin özel linkini verecektir!

---

## 🔗 Kendi Özel Alan Adınızı (.com, .net gibi) Bağlama

Vercel veya Netlify üzerinde yayınladığınız web sitenize kendi satın aldığınız bir alan adını (örneğin `secimoyunu.com`) ücretsiz olarak bağlayabilirsiniz:
- Vercel/Netlify panelinde **"Settings" -> "Domains"** bölümüne gidin.
- Satın aldığınız alan adını yazın.
- Size verecekleri **A Record** veya **CNAME** DNS ayarlarını, alan adınızı satın aldığınız firmanın (Godaddy, Turhost vb.) paneline girerek kaydedin.
- Maksimum 1-2 saat içinde siteniz kendi alan adınızda yayına girecektir!

---

### İyi Çalışmalar ve Başarılar! 🗳️
Ankara'nın Yolları seçim simülasyonunu dilediğiniz gibi özelleştirmeye devam edebilir, yayınlayarak oyuncu kitlenizi genişletebilirsiniz!
