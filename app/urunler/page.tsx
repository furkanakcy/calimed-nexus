"use client"

import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, X } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-foreground to-foreground/95 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Ürünlerimiz</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Medikal cihaz kalibrasyonu ve HVAC test süreçleri için geliştirdiğimiz yenilikçi çözümler
            </p>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Product 1: CaliMed Nexus */}
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  SaaS Platform
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold">CaliMed Nexus</h2>
                <p className="text-lg text-muted-foreground">
                  Medikal servis firmaları için kapsamlı kalibrasyon yönetim platformu. Cihaz takibi, raporlama ve müşteri yönetimini tek çatı altında toplar.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors w-fit"
                >
                  Platforma Giriş
                  <ArrowRight size={18} />
                </Link>
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-xl border mt-8">
                <div className="aspect-[4/3] w-full">
                  <img 
                    src="/calimed-nexus-dashboard-preview.jpg" 
                    alt="CaliMed Nexus Platform" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Product 2: AeroHood-610 */}
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Donanım Çözümü
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold">TriCal AeroHood-610</h2>
                <p className="text-lg text-muted-foreground">
                  Hastane ve laboratuvar ortamları için profesyonel hava debisi ölçüm cihazı. CaliMed Nexus ile tam entegrasyon.
                </p>
                <Link
                  href="#aerohood-details"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors w-fit"
                >
                  Detayları İncele
                  <ArrowRight size={18} />
                </Link>
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-xl border mt-8">
                <div className="aspect-[4/3] w-full">
                  <img 
                    src="/tricaldevice-front.jpeg" 
                    alt="TriCal AeroHood-610 Cihazı" 
                    className="w-full h-full object-contain bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AeroHood-610 Details */}
      <section id="aerohood-details" className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">TriCal AeroHood-610</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hastane ve laboratuvar ortamları için özel olarak tasarlanmış profesyonel hava debisi ölçüm cihazı
            </p>
          </div>

          {/* Product Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-4">
              <div 
                className="relative h-80 rounded-xl overflow-hidden shadow-xl group cursor-pointer bg-gray-50"
                onClick={() => setSelectedImage("/tricaldevice-front.jpeg")}
              >
                <img 
                  src="/tricaldevice-front.jpeg" 
                  alt="TriCal AeroHood-610 Ana Görünüm" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                    Büyütmek için tıklayın
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="relative h-32 rounded-lg overflow-hidden shadow-lg group cursor-pointer bg-gray-50"
                  onClick={() => setSelectedImage("/tricaldevice-side.jpeg")}
                >
                  <img 
                    src="/tricaldevice-side.jpeg" 
                    alt="AeroHood-610 Yan Görünüm" 
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                      Büyüt
                    </div>
                  </div>
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold">456.2</div>
                      <div className="text-xs">CFM STABLE</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-end pr-2 pb-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium">
                      Canlı Ekran
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Teknik Özellikler</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Ölçüm Aralığı</span>
                    <span className="text-muted-foreground">0.01 - 99.99 m/s</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Doğruluk</span>
                    <span className="text-muted-foreground">±3% ±0.01 m/s</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Çalışma Sıcaklığı</span>
                    <span className="text-muted-foreground">0°C - 50°C</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Nem Aralığı</span>
                    <span className="text-muted-foreground">5% - 95% RH</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Pil Ömrü</span>
                    <span className="text-muted-foreground">8+ saat sürekli kullanım</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Bağlantı</span>
                    <span className="text-muted-foreground">Bluetooth, USB-C</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Ekran</span>
                    <span className="text-muted-foreground">3.5" Renkli LCD</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Ağırlık</span>
                    <span className="text-muted-foreground">2.1 kg</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Öne Çıkan Özellikler</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Gerçek zamanlı veri aktarımı ve CaliMed Nexus entegrasyonu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Otomatik kalibrasyon ve sıfırlama fonksiyonları</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Yüksek çözünürlüklü renkli dokunmatik ekran</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Dayanıklı alüminyum gövde ve IP65 koruma sınıfı</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Çoklu ölçüm modu: Hız, debi, sıcaklık, nem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>Taşınabilir tasarım ve ergonomik kullanım</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Model Karşılaştırması</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-4">Özellik</th>
                    <th className="text-center py-4 px-4 bg-primary/5">AeroHood-610</th>
                    <th className="text-center py-4 px-4">Standart Cihazlar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">CaliMed Nexus Entegrasyonu</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Tam Entegre</td>
                    <td className="py-3 px-4 text-center">✗ Manuel Veri Girişi</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Otomatik Raporlama</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Otomatik PDF/Excel</td>
                    <td className="py-3 px-4 text-center">✗ Manuel Hazırlama</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Gerçek Zamanlı İzleme</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Bluetooth Bağlantı</td>
                    <td className="py-3 px-4 text-center">✗ Sadece Yerel Ekran</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Kalibrasyon Takibi</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Otomatik Hatırlatma</td>
                    <td className="py-3 px-4 text-center">✗ Manuel Takip</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Veri Depolama</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Bulut Tabanlı</td>
                    <td className="py-3 px-4 text-center">✗ Yerel Hafıza</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Fiyat Avantajı</td>
                    <td className="py-3 px-4 text-center bg-primary/5">✓ Rekabetçi</td>
                    <td className="py-3 px-4 text-center">Yüksek</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CaliMed Nexus Platform Details */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">CaliMed Nexus Platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Medikal servis firmalarının tüm operasyonlarını dijitalleştiren kapsamlı yönetim platformu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cihaz Yönetimi</h3>
              <p className="text-muted-foreground">
                Tüm medikal cihazlarınızı tek platformda takip edin. Kalibrasyon geçmişi, bakım kayıtları ve performans analizleri.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Müşteri Portföyü</h3>
              <p className="text-muted-foreground">
                Müşteri bilgileri, sözleşme yönetimi, randevu planlama ve iletişim geçmişini merkezi olarak yönetin.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Otomatik Raporlama</h3>
              <p className="text-muted-foreground">
                Profesyonel PDF ve Excel raporları otomatik olarak oluşturun. Dijital imza ve e-posta entegrasyonu.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">HVAC Entegrasyonu</h3>
              <p className="text-muted-foreground">
                TriCal AeroHood-610 ile tam entegrasyon. Gerçek zamanlı veri aktarımı ve otomatik rapor oluşturma.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Mobil Erişim</h3>
              <p className="text-muted-foreground">
                Sahada çalışırken mobil cihazlarınızdan platforma erişin. Offline çalışma ve senkronizasyon desteği.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Analitik & İstatistik</h3>
              <p className="text-muted-foreground">
                İş performansınızı analiz edin. Gelir raporları, müşteri memnuniyeti ve operasyonel verimlilik metrikleri.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
            >
              Ücretsiz Deneme Başlat
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="TriCal AeroHood-610 Büyük Görünüm"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">TriCal AeroHood-610</div>
              <div className="text-xs opacity-75">Profesyonel Hava Debisi Ölçüm Cihazı</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}