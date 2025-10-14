import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle2, FileText, Wrench, Wind, Target, Eye } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Hizmetlerimiz</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Medikal cihazlar için kapsamlı kalibrasyon, validasyon ve teknik servis çözümleriyle sağlık sektörüne
              güvenilir destek sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Service 1 */}
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Kalibrasyon & Validasyon Hizmetleri</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Medikal cihazlar için düzenli bakım, performans doğrulama ve raporlama süreçleri sunuyoruz.
                Cihazlarınızın her zaman güvenilir ve yasal standartlara uygun çalışmasını sağlıyoruz.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">PDF raporlama ve dijital imza desteği</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Yasal uygunluk ve standart sertifikasyonları</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Düzenli bakım ve performans takibi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Detaylı cihaz geçmişi kayıtları</span>
                </li>
              </ul>
            </div>

            {/* Service 1 Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/precision-measurement-calibration-equipment.jpg"
                alt="Medikal Cihaz Kalibrasyonu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Service 2 Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden lg:order-3 shadow-xl">
              <img
                src="/medical-professional-examining-equipment-laborator.jpg"
                alt="Medikal Cihaz Teknik Servisi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Service 2 */}
            <div className="lg:order-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Wrench className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Teknik Servis Desteği</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Saha ve laboratuvar bazlı servis çözümleriyle medikal cihazlarınızın kesintisiz çalışmasını sağlıyoruz.
                Hızlı müdahale ve uzman ekibimizle yanınızdayız.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">7/24 acil müdahale hizmeti</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Saha ve laboratuvar bazlı servis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Cihaz geçmişi ve arıza takibi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Orijinal yedek parça tedariki</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HVAC Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Wind className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-4">HVAC Raporlama Sistemleri</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                HVAC doğrulama ve test sonuçlarını raporlayan sistemler geliştiriyoruz. Hastane ve laboratuvar
                ortamlarında hava kalitesi ve iklim kontrolünün sürekli izlenmesini sağlıyoruz.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Otomatik veri toplama ve analiz</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Gerçek zamanlı izleme ve alarm sistemleri</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Uyumluluk raporları ve sertifikasyon</span>
                </li>
              </ul>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/medical-laboratory-equipment-sterile-blue-tones.jpg"
                alt="HVAC Temiz Oda Sistemleri"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Misyonumuz & Vizyonumuz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sağlık teknolojilerinde güvenilirlik ve kaliteyi dijitalleştirerek sektöre öncülük ediyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-muted rounded-lg p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sağlık teknolojilerinde güvenilirlik ve kaliteyi dijitalleştirmek. Medikal cihazların performansını ve
                güvenliğini en üst düzeyde tutarak sağlık sektörüne değer katmak.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-muted rounded-lg p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Eye className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-muted-foreground leading-relaxed">
                Medikal cihaz sektöründe global ölçekte tanınan teknoloji ortağı olmak. Yenilikçi çözümlerimizle sağlık
                hizmetlerinin kalitesini artırmak ve dijital dönüşüme öncülük etmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kurumsal Değerlerimiz</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Trical Engineering olarak çalışmalarımızı şekillendiren temel değerlerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenilirlik</h3>
              <p className="text-gray-400 text-sm">Sözümüzün arkasında duruyoruz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Teknolojik Yenilik</h3>
              <p className="text-gray-400 text-sm">Sürekli gelişim ve inovasyon</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Müşteri Odaklılık</h3>
              <p className="text-gray-400 text-sm">İhtiyaçlarınız önceliğimiz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sürdürülebilir Kalite</h3>
              <p className="text-gray-400 text-sm">Uzun vadeli mükemmellik</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
