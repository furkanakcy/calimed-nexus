# HVAC Rapor Yetkilendirme ve Hastane Seçimi - Gereksinimler

## Giriş

Bu özellik, HVAC raporlarının doğru yetkilendirme ve görünürlük kontrolü ile yönetilmesini sağlar. Teknisyenler rapor oluştururken hastane listesinden seçim yapabilecek, oluşturulan raporlar ilgili firma ve hastane tarafından görüntülenebilecektir.

## Gereksinimler

### Gereksinim 1: Teknisyen Hastane Seçimi

**Kullanıcı Hikayesi:** Teknisyen olarak, HVAC raporu oluştururken kendi firmamın çalıştığı hastaneler arasından seçim yapabilmek istiyorum, böylece raporu doğru hastaneye atayabilirim.

#### Kabul Kriterleri

1. WHEN teknisyen HVAC raporu oluşturma sayfasını açtığında THEN sistem teknisyenin bağlı olduğu firmanın hastanelerini dropdown listesinde gösterecek
2. WHEN teknisyen hastane seçimi yaptığında THEN seçilen hastane bilgisi raporda kaydedilecek
3. IF firmaya bağlı hastane yoksa THEN sistem uygun bir uyarı mesajı gösterecek
4. WHEN teknisyen raporu kaydettiğinde THEN rapor seçilen hastane ile ilişkilendirilecek

### Gereksinim 2: Firma Rapor Görünürlüğü

**Kullanıcı Hikayesi:** Firma yöneticisi olarak, teknisyenlerimin oluşturduğu tüm HVAC raporlarını görebilmek istiyorum, böylece firmamın tüm çalışmalarını takip edebilirim.

#### Kabul Kriterleri

1. WHEN firma yöneticisi rapor listesini görüntülediğinde THEN kendi firmasının teknisyenleri tarafından oluşturulan tüm HVAC raporları listelenecek
2. WHEN firma yöneticisi bir raporu seçtiğinde THEN raporun detaylarını ve hangi hastane için yapıldığını görebilecek
3. IF rapor başka bir firmaya aitse THEN o rapor listede görünmeyecek
4. WHEN firma yöneticisi rapor filtrelediğinde THEN hastane bazında filtreleme yapabilecek

### Gereksinim 3: Hastane Rapor Görünürlüğü

**Kullanıcı Hikayesi:** Hastane kullanıcısı olarak, kendi hastanemiz için oluşturulan HVAC raporlarını görebilmek istiyorum, böylece tesisatımızın durumunu takip edebilirim.

#### Kabul Kriterleri

1. WHEN hastane kullanıcısı rapor listesini görüntülediğinde THEN sadece kendi hastanesi için oluşturulan HVAC raporları görünecek
2. WHEN hastane kullanıcısı bir raporu açtığında THEN raporun tüm detaylarını görebilecek
3. IF rapor başka bir hastane için oluşturulmuşsa THEN o rapor listede görünmeyecek
4. WHEN hastane kullanıcısı rapor indirdiğinde THEN PDF formatında raporu indirebilecek

### Gereksinim 4: Veri Güvenliği ve Yetkilendirme

**Kullanıcı Hikayesi:** Sistem yöneticisi olarak, HVAC raporlarının sadece yetkili kişiler tarafından görüntülenebilmesini istiyorum, böylece veri güvenliğini sağlayabilirim.

#### Kabul Kriterleri

1. WHEN bir kullanıcı rapor erişimi talep ettiğinde THEN sistem kullanıcının yetkisini kontrol edecek
2. IF kullanıcı yetkisiz ise THEN sistem erişimi engelleyecek ve uygun hata mesajı gösterecek
3. WHEN rapor oluşturulduğunda THEN sistem otomatik olarak firma ve hastane ilişkisini kuracak
4. WHEN rapor silindiğinde THEN sistem sadece yetkili kullanıcıların silme işlemi yapmasına izin verecek

### Gereksinim 5: Hastane Listesi Yönetimi

**Kullanıcı Hikayesi:** Firma yöneticisi olarak, çalıştığımız hastanelerin listesini yönetebilmek istiyorum, böylece teknisyenlerim doğru hastaneleri seçebilsin.

#### Kabul Kriterleri

1. WHEN firma yöneticisi hastane yönetim sayfasını açtığında THEN firmaya bağlı tüm hastaneler listelenecek
2. WHEN firma yöneticisi yeni hastane eklediğinde THEN hastane teknisyen seçim listesinde görünecek
3. IF hastane pasif edilirse THEN teknisyen seçim listesinde görünmeyecek ama mevcut raporlar etkilenmeyecek
4. WHEN hastane bilgileri güncellendiğinde THEN değişiklikler tüm ilgili raporlarda yansıyacak