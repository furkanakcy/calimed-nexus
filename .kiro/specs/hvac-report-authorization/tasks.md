# HVAC Rapor Yetkilendirme ve Hastane Seçimi - Implementasyon Planı

## Görev Listesi

- [x] 1. Veritabanı şeması güncellemesi
  - HVACReport tablosuna hospitalId alanı ekleme
  - Hospital tablosuna hvacReports ilişkisi ekleme
  - Migration script'i oluşturma
  - _Gereksinimler: 1.1, 2.1, 3.1, 4.1_

- [ ] 2. Backend API endpoint'lerini güncelleme
  - [x] 2.1 Hastane listesi endpoint'i oluşturma
    - GET /api/hospitals endpoint'i implementasyonu
    - Firma bazlı filtreleme mantığı
    - Yetkilendirme kontrolü ekleme
    - _Gereksinimler: 1.1, 5.1_

  - [x] 2.2 HVAC rapor oluşturma endpoint'ini güncelleme
    - hospitalId parametresi ekleme
    - hospitalName alanını kaldırma
    - Hastane-firma ilişki validasyonu
    - _Gereksinimler: 1.2, 1.4_

  - [x] 2.3 HVAC rapor listeleme endpoint'ini güncelleme
    - Rol bazlı filtreleme mantığı (teknisyen, firma, hastane)
    - Hospital join işlemi ekleme
    - Yetkilendirme kontrollerini güçlendirme
    - _Gereksinimler: 2.1, 2.2, 3.1, 3.2, 4.1_

- [ ] 3. Frontend bileşenlerini oluşturma ve güncelleme
  - [x] 3.1 HospitalSelector bileşeni oluşturma
    - Dropdown bileşeni implementasyonu
    - Firma hastanelerini getiren API çağrısı
    - Loading ve error state'leri
    - _Gereksinimler: 1.1, 5.2_

  - [x] 3.2 HVACReportGenerator bileşenini güncelleme
    - Hastane adı input'unu kaldırma
    - HospitalSelector bileşenini entegre etme
    - Form validasyonunu güncelleme
    - Hastane seçimi zorunlu hale getirme
    - _Gereksinimler: 1.2, 1.3, 1.4_

  - [x] 3.3 Teknisyen rapor listesi sayfasını güncelleme
    - Hastane bilgisini rapor listesinde gösterme
    - Hastane bazlı filtreleme seçeneği ekleme
    - HVAC raporları için hastane bilgisi görüntüleme
    - _Gereksinimler: 2.1, 2.4_

- [ ] 4. Firma yöneticisi rapor görünürlüğü implementasyonu
  - [x] 4.1 Admin dashboard'a HVAC rapor listesi ekleme
    - Firma bazlı HVAC rapor listesi bileşeni
    - Hastane ve teknisyen bazlı filtreleme
    - Rapor detay görüntüleme özelliği
    - _Gereksinimler: 2.1, 2.2, 2.3, 2.4_

  - [ ] 4.2 Rapor analiz sayfasını güncelleme
    - HVAC raporları için istatistik kartları
    - Hastane bazlı performans metrikleri
    - Grafik ve chart entegrasyonları
    - _Gereksinimler: 2.1, 2.2_

- [ ] 5. Hastane kullanıcısı rapor görünürlüğü implementasyonu
  - [x] 5.1 Hastane dashboard'ına HVAC rapor bölümü ekleme
    - Sadece kendi hastanesi için oluşturulan raporları listeleme
    - Rapor detay görüntüleme ve indirme özellikleri
    - Tarih bazlı filtreleme seçenekleri
    - _Gereksinimler: 3.1, 3.2, 3.3, 3.4_

  - [ ] 5.2 Hastane ServiceRequest bileşenini güncelleme
    - HVAC rapor talep etme özelliği ekleme
    - Mevcut HVAC raporlarını görüntüleme linki
    - Rapor durumu takip sistemi
    - _Gereksinimler: 3.1, 3.4_

- [ ] 6. Yetkilendirme ve güvenlik kontrolleri implementasyonu
  - [ ] 6.1 API middleware'lerini güncelleme
    - Rapor erişim yetkilendirme fonksiyonları
    - Rol bazlı endpoint koruma
    - Error handling ve logging
    - _Gereksinimler: 4.1, 4.2, 4.3, 4.4_

  - [ ] 6.2 Frontend yetkilendirme kontrolleri
    - Rapor görüntüleme yetki kontrolü
    - Conditional rendering için hook'lar
    - Unauthorized erişim için redirect mantığı
    - _Gereksinimler: 4.1, 4.2_

- [ ] 7. Hastane yönetimi özellikleri implementasyonu
  - [ ] 7.1 Firma yöneticisi hastane yönetim sayfası
    - Hastane listesi görüntüleme
    - Yeni hastane ekleme formu
    - Hastane bilgilerini güncelleme
    - Hastane aktif/pasif durumu yönetimi
    - _Gereksinimler: 5.1, 5.2, 5.3, 5.4_

  - [ ] 7.2 Hastane CRUD operasyonları
    - Hastane oluşturma API endpoint'i
    - Hastane güncelleme API endpoint'i
    - Hastane silme/pasifleştirme endpoint'i
    - Validation ve error handling
    - _Gereksinimler: 5.1, 5.2, 5.3, 5.4_

- [ ] 8. Veritabanı migration ve data cleanup
  - [x] 8.1 Migration script'lerini çalıştırma
    - hospitalId alanı ekleme migration'ı
    - Mevcut verileri güncelleme script'i
    - Foreign key constraint'leri ekleme
    - _Gereksinimler: 1.1, 1.4_

  - [ ] 8.2 Eski kod temizliği
    - hospitalName alanı kullanımını kaldırma
    - Gereksiz API endpoint'lerini temizleme
    - Unused import'ları kaldırma
    - _Gereksinimler: 1.1, 1.4_

- [ ] 9. Test implementasyonu ve doğrulama
  - [ ] 9.1 Backend testlerini yazma
    - API endpoint unit testleri
    - Yetkilendirme fonksiyon testleri
    - Database integration testleri
    - _Gereksinimler: Tüm gereksinimler_

  - [ ] 9.2 Frontend testlerini yazma
    - Component unit testleri
    - User interaction testleri
    - Authorization flow testleri
    - _Gereksinimler: Tüm gereksinimler_

- [ ] 10. Sistem entegrasyonu ve final testler
  - [x] 10.1 End-to-end test senaryoları
    - Teknisyen rapor oluşturma flow'u
    - Firma yöneticisi rapor görüntüleme flow'u
    - Hastane kullanıcısı rapor erişimi flow'u
    - _Gereksinimler: Tüm gereksinimler_

  - [ ] 10.2 Performance ve güvenlik testleri
    - API response time testleri
    - Yetkilendirme bypass denemesi testleri
    - Large dataset ile performans testleri
    - _Gereksinimler: 4.1, 4.2, 4.3, 4.4_