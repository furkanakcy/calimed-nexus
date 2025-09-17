# HVAC Rapor Yetkilendirme ve Hastane Seçimi - Tasarım Dokümanı

## Genel Bakış

Bu tasarım, HVAC raporlarının doğru yetkilendirme ve görünürlük kontrolü ile yönetilmesini sağlayacak sistem mimarisini tanımlar. Mevcut veritabanı yapısı üzerinde minimal değişikliklerle maksimum işlevsellik sağlanacaktır.

## Mimari

### Mevcut Durum Analizi

Mevcut veritabanı yapısında:
- `HVACReport` tablosu zaten `companyId` ve `createdById` alanlarına sahip
- `Hospital` tablosu `companyId` ile firma ilişkisi kurulmuş
- `User` tablosu rol bazlı yetkilendirme için hazır

### Gerekli Değişiklikler

1. **HVACReport tablosuna `hospitalId` alanı eklenmesi**
2. **API endpoint'lerinde yetkilendirme kontrollerinin güçlendirilmesi**
3. **Frontend'de hastane seçimi dropdown'ının eklenmesi**
4. **Rapor listeleme sayfalarında filtreleme mantığının güncellenmesi**

## Bileşenler ve Arayüzler

### 1. Veritabanı Şeması Güncellemesi

```prisma
model HVACReport {
  id               Int           @id @default(autoincrement())
  hospitalName     String        // Kaldırılacak - hospitalId'den otomatik alınacak
  hospitalId       Int           // Yeni alan - Hospital tablosuna referans
  hospital         Hospital      @relation(fields: [hospitalId], references: [id])
  reportNo         String        @unique
  measurementDate  DateTime
  testerName       String
  preparedBy       String
  approvedBy       String
  organizationName String
  logo             String?
  stamp            String?
  companyId        Int
  company          Company       @relation(fields: [companyId], references: [id])
  createdById      Int
  createdBy        User          @relation(fields: [createdById], references: [id])
  rooms            HVACRoom[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
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
  serviceOrders ServiceOrder[]
  validations   Validation[]
  plannings     Planning[]
  hvacReports   HVACReport[]  // Yeni ilişki
  createdAt    DateTime      @default(now())
}
```

### 2. API Endpoint'leri

#### 2.1 Hastane Listesi Endpoint'i
```typescript
GET /api/hospitals
Authorization: Bearer <token>
Response: Hospital[] (sadece kullanıcının firmasına ait hastaneler)
```

#### 2.2 HVAC Rapor Oluşturma Endpoint'i
```typescript
POST /api/hvac-reports
Authorization: Bearer <token>
Body: {
  hospitalId: number,
  reportNo: string,
  measurementDate: string,
  // ... diğer alanlar
}
```

#### 2.3 HVAC Rapor Listeleme Endpoint'i
```typescript
GET /api/hvac-reports
Authorization: Bearer <token>
Query Parameters:
  - hospitalId?: number (hastane filtresi)
  - startDate?: string
  - endDate?: string
Response: HVACReport[] (yetki bazlı filtrelenmiş)
```

### 3. Frontend Bileşenleri

#### 3.1 HospitalSelector Bileşeni
```typescript
interface HospitalSelectorProps {
  selectedHospitalId: number | null;
  onHospitalChange: (hospitalId: number) => void;
  companyId: number;
}

const HospitalSelector: React.FC<HospitalSelectorProps> = ({
  selectedHospitalId,
  onHospitalChange,
  companyId
}) => {
  // Firma hastanelerini getir ve dropdown oluştur
};
```

#### 3.2 Güncellenmiş HVACReportGenerator
- Hastane adı input'u kaldırılacak
- HospitalSelector bileşeni eklenecek
- Form validasyonuna hastane seçimi kontrolü eklenecek

#### 3.3 Yetkilendirme Kontrollü Rapor Listeleri
- Teknisyen: Kendi oluşturduğu raporlar
- Firma Yöneticisi: Firmanın tüm raporları
- Hastane: Sadece kendi hastanesi için oluşturulan raporlar

## Veri Modelleri

### 1. Hospital Interface
```typescript
interface Hospital {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  companyId: number;
  createdAt: string;
}
```

### 2. Güncellenmiş HVACReport Interface
```typescript
interface HVACReport {
  id: number;
  hospitalId: number;
  hospital: Hospital;
  reportNo: string;
  measurementDate: string;
  testerName: string;
  preparedBy: string;
  approvedBy: string;
  organizationName: string;
  logo?: string;
  stamp?: string;
  companyId: number;
  company: Company;
  createdById: number;
  createdBy: User;
  rooms: HVACRoom[];
  createdAt: string;
  updatedAt: string;
}
```

### 3. Authorization Context
```typescript
interface AuthorizationRules {
  canViewReport: (report: HVACReport, user: User) => boolean;
  canEditReport: (report: HVACReport, user: User) => boolean;
  canDeleteReport: (report: HVACReport, user: User) => boolean;
  getVisibleHospitals: (user: User) => Hospital[];
}
```

## Hata Yönetimi

### 1. Yetkilendirme Hataları
- **401 Unauthorized**: Geçersiz token
- **403 Forbidden**: Yetkisiz erişim denemesi
- **404 Not Found**: Rapor bulunamadı veya erişim yetkisi yok

### 2. Validasyon Hataları
- **400 Bad Request**: Geçersiz hastane seçimi
- **409 Conflict**: Aynı rapor numarası zaten mevcut

### 3. Frontend Hata Yönetimi
```typescript
const handleError = (error: ApiError) => {
  switch (error.status) {
    case 403:
      showNotification('Bu raporu görüntüleme yetkiniz bulunmuyor.', 'error');
      break;
    case 404:
      showNotification('Rapor bulunamadı.', 'error');
      break;
    default:
      showNotification('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
  }
};
```

## Test Stratejisi

### 1. Birim Testleri
- Yetkilendirme fonksiyonları
- Hastane seçimi validasyonu
- Rapor filtreleme mantığı

### 2. Entegrasyon Testleri
- API endpoint'leri yetkilendirme testleri
- Veritabanı ilişki testleri
- Frontend-backend entegrasyonu

### 3. Kullanıcı Kabul Testleri
- Teknisyen rapor oluşturma senaryoları
- Firma yöneticisi rapor görüntüleme senaryoları
- Hastane kullanıcısı rapor erişimi senaryoları

## Güvenlik Önlemleri

### 1. API Güvenliği
- JWT token validasyonu
- Rol bazlı erişim kontrolü
- SQL injection koruması
- Rate limiting

### 2. Frontend Güvenliği
- XSS koruması
- CSRF token kullanımı
- Hassas verilerin localStorage'da saklanmaması

### 3. Veri Güvenliği
- Rapor verilerinin şifrelenmesi
- Audit log kayıtları
- Veri yedekleme stratejisi

## Performans Optimizasyonları

### 1. Veritabanı Optimizasyonları
- `hospitalId` ve `companyId` alanlarında index oluşturma
- Rapor listeleme sorguları için composite index'ler
- Pagination implementasyonu

### 2. Frontend Optimizasyonları
- Hastane listesi caching
- Lazy loading için React.memo kullanımı
- Debounced search implementasyonu

### 3. API Optimizasyonları
- Response caching
- Gzip compression
- Minimal veri transferi için field selection

## Deployment Stratejisi

### 1. Veritabanı Migration
```sql
-- 1. HVACReport tablosuna hospitalId alanı ekleme
ALTER TABLE "HVACReport" ADD COLUMN "hospitalId" INTEGER;

-- 2. Mevcut raporlar için hospitalId güncelleme (hospitalName'e göre)
UPDATE "HVACReport" 
SET "hospitalId" = (
  SELECT h.id 
  FROM "Hospital" h 
  WHERE h.name = "HVACReport"."hospitalName" 
  AND h."companyId" = "HVACReport"."companyId"
  LIMIT 1
);

-- 3. Foreign key constraint ekleme
ALTER TABLE "HVACReport" 
ADD CONSTRAINT "HVACReport_hospitalId_fkey" 
FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id");

-- 4. hospitalName alanını kaldırma (opsiyonel)
-- ALTER TABLE "HVACReport" DROP COLUMN "hospitalName";
```

### 2. Aşamalı Deployment
1. **Faz 1**: Backend API güncellemeleri
2. **Faz 2**: Frontend bileşen güncellemeleri
3. **Faz 3**: Veritabanı migration
4. **Faz 4**: Eski kod temizliği

### 3. Rollback Planı
- Veritabanı backup'ları
- Feature flag'ler ile eski sisteme dönüş
- Gradual rollout stratejisi