import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Target, Eye, Award, Users, Lightbulb, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Hakkımızda</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Trical Engineering, medikal teknolojilerde güvenilirlik ve mükemmelliği dijitalleştiren öncü bir firmadır.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Kuruluş Amacımız</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Trical Engineering, medikal sektörde dijitalleşmeyi hızlandırmak ve sağlık teknolojilerinde
                  güvenilirliği artırmak amacıyla kurulmuştur.
                </p>
                <p>
                  Medikal cihazların kalibrasyon, validasyon ve teknik servis süreçlerini modern yazılım çözümleriyle
                  birleştirerek, sağlık sektörüne yenilikçi ve sürdürülebilir hizmetler sunuyoruz.
                </p>
                <p>
                  CaliMed Nexus SaaS platformumuz ile medikal servis firmalarının iş süreçlerini dijitalleştiriyor, veri
                  güvenliğini ve raporlama kalitesini en üst seviyeye çıkarıyoruz.
                </p>
              </div>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/handshake-partnership-medical-business.jpg"
                alt="Trical Engineering Ekibi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-lg p-10">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sağlık teknolojilerinde güvenilirlik ve kaliteyi dijitalleştirmek. Medikal cihazların performansını ve
                güvenliğini en üst düzeyde tutarak sağlık sektörüne değer katmak. Modern yazılım çözümleriyle iş
                süreçlerini optimize etmek ve veri güvenliğini sağlamak.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg p-10">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Eye className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Medikal cihaz sektöründe global ölçekte tanınan teknoloji ortağı olmak. Yenilikçi çözümlerimizle sağlık
                hizmetlerinin kalitesini artırmak ve dijital dönüşüme öncülük etmek. Sürdürülebilir ve güvenilir
                teknolojilerle sektörün geleceğini şekillendirmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ekibimizin Uzmanlığı</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Çok disiplinli ekibimiz, medikal teknolojilerde derin uzmanlığa sahiptir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Yazılım Mühendisliği</h3>
              <p className="text-sm text-muted-foreground">Modern web teknolojileri ve SaaS geliştirme</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Elektronik Mühendisliği</h3>
              <p className="text-sm text-muted-foreground">Medikal cihaz donanım ve kalibrasyon</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mekatronik</h3>
              <p className="text-sm text-muted-foreground">Otomasyon ve sistem entegrasyonu</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Medikal Cihaz Teknolojileri</h3>
              <p className="text-sm text-muted-foreground">Sağlık sektörü standartları ve uyumluluk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kurumsal Değerlerimiz</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Çalışmalarımızı şekillendiren ve bizi ileriye taşıyan temel değerlerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Güvenilirlik</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sözümüzün arkasında duruyoruz. Müşterilerimize verdiğimiz taahhütleri eksiksiz yerine getiriyoruz.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teknolojik Yenilik</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sürekli gelişim ve inovasyon ile sektörün önünde olmayı hedefliyoruz.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Müşteri Odaklılık</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                İhtiyaçlarınız önceliğimiz. Size özel çözümler geliştiriyoruz.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sürdürülebilir Kalite</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Uzun vadeli mükemmellik ve sürekli iyileştirme anlayışıyla çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
