# 🏥 CaliMed Nexus – Multi-Tenant Medikal Yönetim Sistemi

> "Her firma, kendi veri dünyasında, kendi ekibiyle, kendi hastaneleriyle çalışır."

---

## 🎯 Genel Amaç

Medikal cihaz servis firmaları için, firma bazlı (multi-tenant), kullanıcı yönetimi, hastane takibi, cihaz yaşam döngüsü, kalibrasyon, raporlama ve veritabanı izolasyonu sağlayan tam entegre bir SaaS platformu oluşturmak.

---

## 🏗️ Teknik Mimarisi

| Katman | Teknoloji |
|-------|----------|
| Frontend | React.js + Vite + Tailwind CSS + React Router |
| Backend | Node.js + Express.js |
| Veritabanı | PostgreSQL + Prisma ORM |
| Kimlik Doğrulama | JWT (JSON Web Token) + bcrypt |
| Raporlama | Puppeteer (PDF) |
| Sunucu | Vercel (Frontend), Render / AWS (Backend) |
| Güvenlik | RBAC, Audit Log, CORS, Veri İzolasyonu |

---

## 📁 Klasör Yapısı

calimed-nexus/
│
├── client/               → React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   → Yeniden kullanılabilir bileşenler
│   │   ├── pages/        → Ana sayfalar
│   │   ├── services/     → API çağrıları
│   │   ├── context/      → Auth ve firma bilgisi
│   │   └── App.jsx
│
├── server/               → Node.js backend
│   ├── controllers/      → İş mantığı
│   ├── routes/           → API yolları
│   ├── middleware/       → Auth, RBAC
│   ├── prisma/           → Veritabanı şeması
│   └── server.js
│
├── reports/              → PDF raporlar (oluşturulunca)
├── .env.example
├── README.md
└── rules.md

---

## 🧱 Veritabanı Modeli (Prisma)

// prisma/schema.prisma

model Company {
  id           Int           @id @default(autoincrement())
  name         String        @unique
  email        String        @unique
  password     String
  logo         String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  users        User[]
  hospitals    Hospital[]
  devices      Device[]
  calibrations Calibration[]
}

model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  password     String
  role         String        // 'admin', 'technician', 'hospital'
  companyId    Int
  company      Company       @relation(fields: [companyId], references: [id])
  calibrations Calibration[]
  createdAt    DateTime      @default(now())
}

model Hospital {
  id           Int           @id @default(autoincrement())
  name         String
  address      String?
  phone        String?
  email        String?
  companyId    Int
  company      Company       @relation(fields: [companyId], references: [id])
  devices      Device[]
  calibrations Calibration[]
  createdAt    DateTime      @default(now())
}

model Device {
  id           Int           @id @default(autoincrement())
  serialNo     String        @unique
  type         String        // 'ekg', 'ventilator'
  model        String
  brand        String
  hospitalId   Int
  hospital     Hospital      @relation(fields: [hospitalId], references: [id])
  companyId    Int
  company      Company       @relation(fields: [companyId], references: [id])
  calibrations Calibration[]
  createdAt    DateTime      @default(now())
}

model Calibration {
  id                Int           @id @default(autoincrement())
  deviceId          Int
  device            Device        @relation(fields: [deviceId], references: [id])
  technicianId      Int
  technician        User          @relation(fields: [technicianId], references: [id])
  hospitalId        Int
  hospital          Hospital      @relation(fields: [hospitalId], references: [id])
  companyId         Int
  company           Company       @relation(fields: [companyId], references: [id])
  date              DateTime      @default(now())
  environmentTemp   Float?
  environmentHumidity Float?
  status            String        // 'geçti', 'geçmedi'
  results           TestResult[]
  report            Report?
  createdAt         DateTime      @default(now())
}

model TestResult {
  id              Int           @id @default(autoincrement())
  calibrationId   Int
  calibration     Calibration   @relation(fields: [calibrationId], references: [id])
  testName        String
  measuredValue   Float
  expectedValue   Float
  tolerance       Float
  passed          Boolean
}

model Report {
  id              Int           @id @default(autoincrement())
  calibrationId   Int           @unique
  calibration     Calibration   @relation(fields: [calibrationId], references: [id])
  pdfUrl          String
  digitalSignature String?      // base64
  timestamp       DateTime      @default(now())
}

---

## 🔐 Kimlik Doğrulama ve Erişim Kontrolü (RBAC)

### Roller
- admin: Firma yöneticisi (tüm erişim)
- technician: Teknisyen (görevler, kalibrasyon, rapor oluştur)
- hospital: Hastane yetkilisi (cihazları gör, rapor indir, servis talebi)

### Kurallar
- Her kullanıcı giriş yaptığında, JWT ile companyId ve role alınır.
- Tüm API’lerde middleware/auth.js ile kullanıcı doğrulanır.
- middleware/rbac.js ile işlem izni kontrol edilir.
- Veri izolasyonu: Her sorguda WHERE companyId = req.user.companyId eklenir.

---

## 🌐 API Endpoints (Node.js + Express)

| Endpoint | Yöntem | Açıklama | Rol |
|--------|--------|--------|-----|
| POST /api/companies/register | POST | Yeni firma kaydı | Herkes |
| POST /api/auth/login | POST | Giriş yap | Kayıtlı kullanıcı |
| GET /api/users | GET | Firma kullanıcılarını listele | admin |
| POST /api/users | POST | Yeni kullanıcı ekle | admin |
| GET /api/hospitals | GET | Firma hastanelerini listele | admin, technician |
| POST /api/hospitals | POST | Yeni hastane ekle | admin |
| GET /api/devices | GET | Cihazları listele | admin, technician, hospital |
| POST /api/devices | POST | Yeni cihaz ekle | admin |
| POST /api/calibrations | POST | Kalibrasyon başlat | technician |
| GET /api/calibrations | GET | Kalibrasyonları listele | admin, technician |
| POST /api/reports/generate/:id | POST | Rapor oluştur ve kaydet | technician, admin |
| GET /api/reports/:id | GET | Raporu indir | admin, technician, hospital |

---

## 🖼️ Kullanıcı Arayüzü (UI) Ekranları

### 1. pages/RegisterCompany.jsx
- Şirket adı, e-posta, şifre
- "Kayıt Ol" butonu
- Logo yükle (isteğe bağlı)

### 2. pages/Login.jsx
- 3 sekme: Firma Yöneticisi, Teknisyen, Hastane
- "Demo kullanıcı ile dene" butonu

### 3. pages/Admin/Dashboard.jsx
- İstatistik kartları
- Hızlı erişim: Kullanıcı ekle, hastane ekle
- Görev takibi

### 4. pages/Admin/Users.jsx
- Kullanıcı listesi (ad, e-posta, rol)
- "Yeni Kullanıcı" butonu
- Rol seçimi (teknisyen/hastane)

### 5. pages/Admin/Hospitals.jsx
- Hastane listesi
- "Yeni Hastane" formu
- Harita entegrasyonu (isteğe bağlı)

### 6. pages/Technician/CalibrationWizard.jsx
- Cihaz seç → Bağlan → Test başlat → Rapor oluştur
- Gerçek zamanlı grafik (EKG, ventilatör)

### 7. pages/Hospital/Devices.jsx
- Sadece kendi hastanesinin cihazları
- Rapor indir butonu
- "Yeni Servis Talebi" formu

### 8. components/ReportViewer.jsx
- PDF önizleme
- Dijital imza alanı (canvas)
- İndir / Paylaş butonu

---

## 🧩 Kullanıcı Akışı

### 1. Firma Kayıt
- MedikalTek kayıt olur → giriş yapar

### 2. Kullanıcı Ekle
- Yönetici, 2 teknisyen ve 1 hastane yetkilisi ekler

### 3. Hastane ve Cihaz Ekle
- "Acıbadem Hastanesi" ekler
- Bu hastaneye 1 EKG cihazı ekler

### 4. Kalibrasyon
- Teknisyen, görev alır → kalibrasyon yapar → rapor oluşturur

### 5. Başka Firma Girişi
- BioServis giriş yapar → sadece kendi verilerini görür

---

## 📄 Raporlama

- Raporlar Puppeteer ile PDF olarak oluşturulur
- Dosya adı: CAL-{yıl}-{sıra}.pdf (örneğin: CAL-2025-001.pdf)
- Yerel: reports/ klasörüne kaydedilir
- Veritabanı: Report tablosuna pdfUrl, digitalSignature, timestamp ile kaydedilir
- Sadece ilgili firma ve kullanıcılar erişebilir

---

## 🧾 Güvenlik ve İzleme

- Audit Log: Tüm işlemler loglanır (kim, ne, ne zaman)
- E-posta Bildirim: Yeni görev, rapor tamamlandı
- CORS: Sadece https://calimed.com ve http://localhost izinli
- Yedekleme: Otomatik günlük veritabanı yedekleme

---

## 📦 Kurulum Talimatları

# 1. Projeyi klonla
git clone https://github.com/kullanici/calimed-nexus.git
cd calimed-nexus

# 2. Frontend kur
cd client
npm install
npm run dev

# 3. Backend kur
cd ../server
npm install
npx prisma init
npx prisma migrate dev --name init
node server.js

> Frontend: http://localhost:5173
> Backend: http://localhost:5000

---

## 🧪 Test Senaryoları

1. Firma kayıt: MedikalTek → giriş yap
2. 2 teknisyen, 1 hastane ekle
3. "Acıbadem Hastanesi" ekle
4. EKG cihazı ekle
5. Teknisyen, kalibrasyon yap → rapor oluştur
6. BioServis ile giriş yap → sadece kendi verilerini gör

---

## 📥 Teslimatlar

1. client/ – React frontend
2. server/ – Node.js backend
3. prisma/schema.prisma – Veritabanı modeli
4. reports/ – PDF raporlar
5. README.md – Kurulum kılavuzu
6. rules.md – Bu dosya

---

## 🚀 qwen-cli Uyumu

qwen_cli_compatible: true
project_type: saas-medical
output: html-tailwind-react
backend: node-express-prisma
auth: jwt-rbac
multi_tenant: true

---

## 📄 Lisans

MIT License – Özgür kullanım, ticari kullanım serbest.

---

## 📢 İletişim

- Email: contact@calimed.com
- Web: https://calimed.com
- GitHub: https://github.com/calimed/calimed-nexus