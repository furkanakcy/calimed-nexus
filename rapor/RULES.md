PROJE HEDEFİ
Kullanıcıların sadece ölçüm değerlerini girdiği bir web uygulaması geliştirin. Sistem, bu değerleri kullanarak, ISO 14644-1, DIN 1946-4 ve IEST-RP-CC006.3 gibi uluslararası standartlara uygun, çok sayfalı, profesyonel bir HVAC Performans Niteleme Test Raporu (PQ Raporu) üretmeli. Rapor, örnek dosya V-2504-039_NALLIHAN_DH.xls ile görsel, yapısal ve içerik olarak birebir aynı olmalıdır.

Çıktılar:

Dinamik Excel (.xlsx)
PDF formatında rapor
Her mahal (oda) için ayrı sayfa
Toplam sayfa sayısı, girilen mahal sayısına göre otomatik güncellenmeli
🧩 1. KULLANICI ARAYÜZÜ (FRONTEND - React.js)
✅ Genel Özellikler:
Modern, mobil uyumlu arayüz (Tailwind CSS veya Material UI)
Çok adımlı form (step-by-step)
Gerçek zamanlı rapor önizlemesi
Türkçe ve İngilizce dil desteği (çeviri dosyaları ile)
📄 Sayfalar:
Ana Sayfa: "Yeni Rapor Başlat", "Geçmiş Raporlar" (isteğe bağlı)
Genel Bilgiler:
Hastane Adı
Rapor No
Ölçüm Tarihi
Testi Yapan (ad)
Raporu Hazırlayan (ad)
Onaylayan (ad)
Kuruluş Adı (örneğin: BC Laboratuvarı)
Logo ve mühür yükleme alanı (isteğe bağlı)
Mahal (Oda) Listesi:
"+" butonu ile yeni oda ekle
Her oda için:
Mahal No (örnek: 0001)
Mahal Adı (örnek: Ameliyathane 1)
Yüzey Alanı (m²)
Yükseklik (m)
Hacim (otomatik hesaplanır: Alan × Yükseklik)
Test Modu: At Rest / In Operation
Akış Biçimi: Turbulence / Laminar / Unidirectional
Mahal Sınıfı: Sınıf IB, Sınıf II, Yoğun Bakım vs.
Test Girişi (Her Oda İçin Sekmeler Halinde):
Hava Debisi ve Hava Değişim Oranı
Basınç Farkı ve Hava Akış Yönü
HEPA Filtre Sızdırmazlık Testi
Partikül Sayısı ve Temizlik Sınıfı
Dekontaminasyon / Geri Kazanım Süresi
Sıcaklık ve Nem
Gürültü ve Aydınlatma Seviyesi (isteğe bağlı)
Önizleme Sayfası:
Raporun PDF/Excel çıktısı dinamik olarak gösterilir
Sayfa numaraları (örnek: 12/74) doğru hesaplanır
İndir Sayfası:
"Excel İndir" butonu
"PDF İndir" butonu
⚙️ 2. BACKEND (Node.js + Express)
✅ Görevler:
Form verilerini al, doğrula, hesaplamaları yap, rapor üret
Excel ve PDF dosyalarını oluştur
Dosyaları kullanıcıya indirme linkiyle sun
📦 Kullanılacak Kütüphaneler:
exceljs: Dinamik Excel üretimi
pdfkit veya puppeteer: PDF üretimi (HTML → PDF)
express: API sunucusu
cors, body-parser: HTTP işlemleri
📥 3. KULLANICI GİRİŞLERİ (INPUTLAR)
A. Genel Bilgiler (Tüm Rapor İçin Sabit)
Hastane Adı
Nallıhan Devlet Hastanesi
Rapor No
V-2504-039
Ölçüm Tarihi
29/04/2025
Testi Yapan
Nurettin Karaca
Raporu Hazırlayan
Merve Yazır
Onaylayan
Sevgi Kılınç
Kuruluş
BC Laboratuvarı

B. Her Mahal İçin Girdiler

Temel Bilgiler
Mahal No
0005
Mahal Adı
Steril Depo
Yüzey Alanı (m²)
14.00
Yükseklik (m)
3.00
Hacim (m³)
Otomatik: 14 × 3 = 42.00
Test Modu
At Rest
Akış Biçimi
Turbulence
Mahal Sınıfı
Sınıf II

Test Bazlı Girişler
Hava Debisi
Hız (m/s), Filtre boyutu (mm)
Debi (m³/h), Toplam debi, Hava değişim oranı (1/saat), Min. kriter karşılaştırması
Basınç Farkı
Basınç (Pa), Referans Alan
≥6 Pa mı? → Uygundur / Uygun Değil
Hava Akış Yönü
"Temiz → Kirli" (seçimli liste)
Sonuç: Uygundur
HEPA Sızdırmazlık
Max sızıntı (%)
≤0.01% mi? → Uygundur
Partikül Sayısı
0.5 µm ve 5.0 µm değerleri (nokta nokta)
Ortalama, ISO sınıfı (ISO 14644-1’e göre), Uygunluk
Recovery Time
Süre (dk)
≤25 dk mı? → Uygundur
Sıcaklık/Nem
°C ve % değerleri
20–24°C ve 40–60% içinde mi? → Uygundur
Gürültü / Aydınlatma
dB / Lux
IEST-RP-CC006.3’e göre değerlendirme

🧮 4. OTOMATİK HESAPLAMALAR
Formüller:
javascript

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
⌄
// Hava Debisi (m³/h)
debi = hız * (filtreX/1000) * (filtreY/1000) * 3600;

// Hava Değişim Oranı (1/saat)
havaDegisim = toplamDebi / odaHacmi;

// Numune Nokta Sayısı (ISO 14644-1)
noktaSayisi = Math.max(4, Math.round(Math.sqrt(10 * alan)));

// ISO Sınıfı Belirleme (0.5 µm için)
function getISOClass(ortalama) {
if (ortalama <= 3520) return "ISO 7";
if (ortalama <= 352000) return "ISO 8";
return "ISO 9";
}
📄 5. RAPOR ÇIKTISI FORMATI
Her Sayfanın Yapısı (Excel ve PDF'de):

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
MAHAL NO : 0005         AKIŞ BİÇİMİ : TURBULANCE         YÜZEY ALANI : 14.00 m²
MAHAL ADI: STERİL DEPO   TEST MODU : AT REST              YÜKSEKLİK : 3.00 m

+-------------------------------------------------------------+
| NO | TEST ADI                     | KRİTER       | SONUÇ     |
+-------------------------------------------------------------+
| 3  | Basınç Farkı                 | ≥ 6 Pa       | 7 Pa      |
|    |                              |              | UYGUNDUR  |
+-------------------------------------------------------------+
| 4  | Hava Akış Yönü               | Temiz→Kirli  | Gözlem    |
|    |                              |              | UYGUNDUR  |
+-------------------------------------------------------------+
| 5  | HEPA Sızdırmazlık            | ≤ %0.01      | %0.008    |
|    |                              |              | UYGUNDUR  |
+-------------------------------------------------------------+
| 6  | Partikül Sayısı (0.5 µm)     | ISO Class 7  | ISO 7     |
|    |                              |              | UYGUNDUR  |
+-------------------------------------------------------------+
| 9  | Recovery Time                | ≤ 25 dk      | 24 dk     |
|    |                              |              | UYGUNDUR  |
+-------------------------------------------------------------+

TESTİ YAPAN: Nurettin Karaca        RAPORU HAZIRLAYAN: Merve Yazır
ONAYLAYAN: Sevgi Kılınç             TARİH: 29/04/2025
[LOGO]                             [MÜHÜR]                   Sayfa 12/74
📂 6. DOSYA YAPISI (Proje Klasör Yapısı)

1
2
3
4
5
6
7
8
9
10
11
12
13
14
cleanroom-report/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── backend/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── templates/
│   └── cleanroom-template.xlsx
└── package.json
🌐 7. TEKNOLOJİLER
Frontend
React.js + Tailwind CSS
Backend
Node.js + Express
Excel Üretimi
exceljs
PDF Üretimi
puppeteer
(HTML → PDF)
Hosting
Vercel (Frontend), Render (Backend)

📄 8. STANDARTLAR VE REFERANSLAR
ISO 14644-1: Temiz odalar – Hava temizlik sınıflandırması
DIN 1946-4: Hastane binalarında havalandırma teknolojisi
IEST-RP-CC006.3: Cleanroom gürültü ve aydınlatma testleri
Numune alma yüksekliği: 1,2 m
Recovery test süresi: ≤ 25 dakika
Basınç farkı kriteri: ≥ 6 Pa
✅ 9. KABUL KRİTERLERİ (AUTOMATED VALIDATION)
Basınç Farkı
≥ 6 Pa
Uygundur
HEPA Sızdırmazlık
≤ %0.01
Uygundur
Recovery Time
≤ 25 dk
Uygundur
Partikül (0.5 µm)
≤ ISO 7
ISO 7 → Uygundur
Sıcaklık
20–24 °C
22.5 → Uygundur
Nem
40–60%
55% → Uygundur

Tüm testler "Uygundur" ise → Nihai Değerlendirme: "Sistem, referans standartlara UYGUNDUR."

📤 10. ÇIKTI FORMATLARI
Excel (.xlsx):
Her mahal için ayrı sayfa
Hücre birleştirme, font (Arial Narrow), boyut (10 pt), kenarlık
Sayfa numarası: X/Y (toplam mahale göre)
PDF:
Excel çıktısı gibi aynı yapı
Logo ve mühür görsel olarak eklenir
Sayfa boyutu: A4
Kenar boşlukları: 1 cm
🧪 11. TEST SENARYOLARI
Kullanıcı 1 oda girer → Rapor 1 sayfa üretir.
Kullanıcı 10 oda girer → Rapor 10 sayfa + toplu özeti (isteğe bağlı).
Partikül sayısı ISO 7 sınırını aşarsa → "Uygun Değil".
Basınç farkı 5 Pa ise → "Uygun Değil".
🚀 12. EK ÖZELLİKLER (İleri Seviye - İsteğe Bağlı)
Kullanıcı girişi ve rapor kaydetme
Birden fazla proje yönetimi
Şablon yükleme (farklı hastane formatları)
E-imza entegrasyonu
CSV ile toplu veri yükleme
📅 13. GELİŞTİRME ZAMAN ÇİZELGESİ
1
Frontend: Form tasarımı, kullanıcı akışı
2
Backend: Hesaplamalar, Excel üretimi
3
PDF üretimi, test, düzeltmeler
4
Deploy, demo, belgelendirme

📁 14. TESLİM EDİLECEKLER
Tam kaynak kodu (GitHub reposu)
Deploy edilmiş demo linki (Vercel + Render)
Kullanım kılavuzu (PDF)
Örnek Excel ve PDF çıktılar
Logo ve mühür yükleme rehberi
📬 15. BAŞLAMAK İÇİN GEREKENLER
Lütfen aşağıdaki bilgileri sağlayın:

Proje adı (örnek: CleanRoomReport)
Şirket logonuz (PNG/JPG)
Mühür resminiz (PNG/JPG, şeffaf arka plan)
Varsa mevcut Excel şablonunuzun temiz versiyonu