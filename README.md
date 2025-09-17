# 🏥 CaliMed Nexus - Medical Device Calibration Platform

Modern, multi-tenant medikal cihaz kalibrasyon ve servis yönetim platformu.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd cali_med
```

2. **Backend kurulumu**
```bash
cd server
npm install
```

3. **Veritabanı kurulumu**
```bash
# PostgreSQL'de veritabanı oluşturun
createdb calimed_nexus

# .env dosyasını düzenleyin
cp .env.example .env
# DATABASE_URL ve JWT_SECRET'i güncelleyin

# Prisma migration
npx prisma db push
npx prisma generate

# Demo verileri yükleyin
npm run seed
```

4. **Frontend kurulumu**
```bash
cd ..
npm install
```

### Çalıştırma

1. **Backend'i başlatın**
```bash
cd server
npm start
# Server http://localhost:5000 adresinde çalışacak
```

2. **Frontend'i başlatın**
```bash
npm run dev
# Frontend http://localhost:5173 adresinde çalışacak
```

## 🎯 Demo Kullanıcıları

### Admin (Firma Yöneticisi)
- **Email:** admin@calimed.com
- **Şifre:** demo123
- **Yetkiler:** Tüm sistem yönetimi

### Teknisyen
- **Email:** teknisyen@calimed.com
- **Şifre:** demo123
- **Yetkiler:** Kalibrasyon yapma, rapor oluşturma

### Hastane
- **Email:** hospital@calimed.com
- **Şifre:** demo123
- **Yetkiler:** Cihaz görüntüleme, servis talebi

## 🏗️ Teknoloji Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React (icons)

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs
- CORS

## 📁 Proje Yapısı

```
cali_med/
├── src/                    # Frontend kaynak kodları
│   ├── components/         # React bileşenleri
│   │   ├── dashboards/     # Dashboard bileşenleri
│   │   └── calibration/    # Kalibrasyon bileşenleri
│   ├── contexts/           # React Context'ler
│   └── App.tsx            # Ana uygulama
├── server/                 # Backend kaynak kodları
│   ├── prisma/            # Veritabanı şeması
│   ├── server.js          # Express server
│   └── seed.js            # Demo veriler
└── README.md
```

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Role-based access control (RBAC)
- Multi-tenant veri izolasyonu
- Şifre hashleme (bcryptjs)
- CORS koruması

## 🎨 Özellikler

### ✅ Tamamlanan
- Multi-tenant mimari
- 3 farklı kullanıcı rolü (Admin, Teknisyen, Hastane)
- JWT authentication
- Responsive dashboard'lar
- Kalibrasyon sihirbazı
- Demo sistem

### 🔄 Geliştirme Aşamasında
- PDF rapor oluşturma
- Gerçek cihaz bağlantısı
- E-posta bildirimleri
- Dosya yükleme
- Gelişmiş filtreleme

## 🐛 Sorun Giderme

### Port zaten kullanımda hatası
```bash
# Port 5000'i kullanan process'i bulun ve sonlandırın
lsof -ti:5000 | xargs kill -9
```

### Veritabanı bağlantı hatası
```bash
# PostgreSQL servisinin çalıştığından emin olun
sudo systemctl start postgresql

# Veritabanının var olduğunu kontrol edin
psql -l | grep calimed_nexus
```

### Prisma hatası
```bash
# Prisma client'ı yeniden oluşturun
cd server
npx prisma generate
npx prisma db push
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'da sorun bildirin
2. Logs'ları kontrol edin (browser console + server terminal)
3. Demo kullanıcıları ile test edin

## 📄 Lisans

MIT License - Özgür kullanım ve ticari kullanım serbest.