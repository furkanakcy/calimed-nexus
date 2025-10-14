import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { CheckCircleIcon, ClipboardDocumentCheckIcon, ChartBarIcon, CogIcon } from "@/components/icons"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
                Medikal Cihaz Kalibrasyonunda Güvenilir Çözüm Ortağınız
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Trical Engineering, medikal cihazların kalibrasyonu, validasyonu ve teknik servisi konusunda uzman
                kadrosuyla hizmet vermektedir.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  İletişime Geçin
                </Link>
                <Link
                  href="/hizmetler"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary rounded-md text-lg font-medium hover:bg-primary/5 transition-colors"
                >
                  Hizmetlerimiz
                </Link>
              </div>
            </div>
            <div className="relative h-[500px]">
              <img
                src="/medical-laboratory-equipment-sterile-blue-tones.jpg"
                alt="Medikal Laboratuvar Ekipmanları"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-bold text-primary mb-2">1</div>
              <h3 className="text-2xl font-bold mb-4">Uzmanlık</h3>
              <p className="text-muted-foreground text-pretty">
                15+ yıllık deneyim ile medikal cihaz kalibrasyonu ve validasyonunda sektör lideri
              </p>
            </div>
            <div>
              <div className="text-6xl font-bold text-primary mb-2">2</div>
              <h3 className="text-2xl font-bold mb-4">Teknoloji</h3>
              <p className="text-muted-foreground text-pretty">
                CaliMed Nexus SaaS platformu ile dijital kalibrasyon yönetimi ve raporlama
              </p>
            </div>
            <div>
              <div className="text-6xl font-bold text-primary mb-2">3</div>
              <h3 className="text-2xl font-bold mb-4">Güvenilirlik</h3>
              <p className="text-muted-foreground text-pretty">
                ISO standartlarına uygun, akredite laboratuvar hizmetleri ve 7/24 teknik destek
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/medical-device-innovation-technology.jpg"
                alt="Medikal Cihaz İnovasyon"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6">İnovasyon ve Teknoloji</h2>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Trical Engineering olarak, medikal sektörde dijital dönüşümün öncüsüyüz. CaliMed Nexus SaaS platformumuz
                ile kalibrasyon süreçlerinizi tamamen dijitalleştiriyoruz.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="text-primary mt-1 flex-shrink-0" />
                  <span>Bulut tabanlı kalibrasyon yönetim sistemi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="text-primary mt-1 flex-shrink-0" />
                  <span>Otomatik PDF rapor oluşturma ve dijital imza</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="text-primary mt-1 flex-shrink-0" />
                  <span>Gerçek zamanlı cihaz takibi ve bildirimler</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="text-primary mt-1 flex-shrink-0" />
                  <span>Çok-kiracılı mimari ile veri güvenliği</span>
                </li>
              </ul>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:underline"
              >
                CaliMed Nexus Hakkında Daha Fazla
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Hizmetlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Medikal cihazlarınız için kapsamlı kalibrasyon, validasyon ve teknik destek hizmetleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <ClipboardDocumentCheckIcon className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Kalibrasyon & Validasyon</h3>
              <p className="text-muted-foreground mb-6">
                Medikal cihazlarınızın ISO standartlarına uygun kalibrasyonu ve validasyonu
              </p>
              <Link href="/hizmetler" className="text-primary font-medium hover:underline">
                Detaylı Bilgi →
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <CogIcon className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Teknik Servis</h3>
              <p className="text-muted-foreground mb-6">
                7/24 teknik destek ve bakım hizmetleri ile cihazlarınızın kesintisiz çalışması
              </p>
              <Link href="/hizmetler" className="text-primary font-medium hover:underline">
                Detaylı Bilgi →
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">HVAC Raporlama</h3>
              <p className="text-muted-foreground mb-6">
                Hastane ve laboratuvar ortam koşullarının izlenmesi ve raporlanması
              </p>
              <Link href="/dashboard/hvac-reports" className="text-primary font-medium hover:underline">
                HVAC Raporlama Sistemi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">Medikal Cihazlarınız Güvende Mi?</h2>
          <p className="text-xl text-gray-300 mb-10 text-pretty">
            Düzenli kalibrasyon ve validasyon ile hasta güvenliğini sağlayın. Hemen bizimle iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-foreground rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Ücretsiz Teklif Alın
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
