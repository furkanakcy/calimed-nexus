import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, Shield, CheckCircle, Play, Star, ArrowRight, 
  Award, Zap, Globe, Lock, BarChart3, 
  Smartphone, Cloud, Menu, X, Heart, Activity, 
  Cpu, Database, Wifi, Timer, Target, Users2,
  Building2, Calendar, MessageSquare, Phone, Mail,
  ChevronRight, Sparkles, Rocket, TrendingUp
} from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Mehmet Yılmaz",
    role: "Biyomedikal Mühendisi",
    company: "Acıbadem Hastanesi",
    image: "/api/placeholder/64/64",
    content: "CaliMed Nexus sayesinde kalibrasyon süreçlerimiz %70 hızlandı. Artık tüm raporlarımız dijital ve ISO standartlarına uygun. Yapay zeka destekli analiz özelliği gerçekten devrim niteliğinde.",
    rating: 5,
    verified: true
  },
  {
    name: "Ayşe Demir",
    role: "Teknik Sorumlu",
    company: "Memorial Hastanesi",
    image: "/api/placeholder/64/64",
    content: "Sahada çalışan teknisyenlerimiz için mükemmel bir çözüm. Mobil uyumlu arayüzü ve çevrimdışı çalışma özelliği harika. Artık hastane dışında da sorunsuz çalışabiliyoruz.",
    rating: 5,
    verified: true
  },
  {
    name: "Eng. Fatih Kaya",
    role: "Kalibrasyon Uzmanı",
    company: "Medstar Hastanesi",
    image: "/api/placeholder/64/64",
    content: "Dijital imzalı raporlar ve otomatik arşivleme özelliği işimizi çok kolaylaştırdı. Artık kağıt işi yok! Blockchain tabanlı güvenlik sistemi de çok güven verici.",
    rating: 5,
    verified: true
  },
  {
    name: "Prof. Dr. Zeynep Özkan",
    role: "Başhekim Yardımcısı",
    company: "Koç Üniversitesi Hastanesi",
    image: "/api/placeholder/64/64",
    content: "Hastane yönetimi açısından mükemmel bir çözüm. Tüm kalibrasyon süreçlerini tek yerden takip edebiliyoruz. Maliyet tasarrufu %40'ı buldu.",
    rating: 5,
    verified: true
  },
  {
    name: "Murat Şahin",
    role: "IT Direktörü",
    company: "Liv Hospital",
    image: "/api/placeholder/64/64",
    content: "Entegrasyon süreci çok kolaydı. Mevcut sistemlerimizle sorunsuz çalışıyor. Bulut altyapısı sayesinde her yerden erişim sağlayabiliyoruz.",
    rating: 5,
    verified: true
  },
  {
    name: "Dr. Ahmet Korkmaz",
    role: "Kalite Direktörü",
    company: "Anadolu Sağlık Merkezi",
    image: "/api/placeholder/64/64",
    content: "ISO 17025 uyumluluğu mükemmel. Denetim süreçlerimiz artık çok daha kolay. Otomatik uyarı sistemi sayesinde hiçbir kalibrasyon tarihi kaçmıyor.",
    rating: 5,
    verified: true
  }
];

const features = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "ISO 17025 Uyumlu",
    description: "Uluslararası standartlarda dijital imzalı, zaman damgalı raporlar. Blockchain teknolojisi ile değiştirilemez kayıtlar.",
    color: "blue",
    benefits: ["Dijital imza", "Zaman damgası", "Blockchain güvenlik", "Otomatik arşivleme"]
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Yapay Zeka Destekli",
    description: "AI algoritmaları ile otomatik anomali tespiti ve predictive maintenance önerileri.",
    color: "green",
    benefits: ["Anomali tespiti", "Predictive maintenance", "Akıllı analiz", "Otomatik uyarılar"]
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Mobil & Offline",
    description: "Sahada tablet ve telefon ile çevrimdışı çalışma. İnternet bağlantısı olmadan da tam fonksiyon.",
    color: "purple",
    benefits: ["Offline çalışma", "Mobil uyumlu", "Senkronizasyon", "QR kod desteği"]
  },
  {
    icon: <Cloud className="h-8 w-8" />,
    title: "Bulut Altyapısı",
    description: "AWS tabanlı güvenli bulut altyapısı. Otomatik yedekleme ve 99.9% uptime garantisi.",
    color: "indigo",
    benefits: ["AWS altyapısı", "Otomatik yedekleme", "Global erişim", "Scalable sistem"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Gelişmiş Analytics",
    description: "Real-time dashboard, trend analizi ve performans metrikleri. Executive raporlar.",
    color: "orange",
    benefits: ["Real-time dashboard", "Trend analizi", "KPI takibi", "Executive raporlar"]
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "Enterprise Güvenlik",
    description: "256-bit SSL, çok faktörlü kimlik doğrulama ve GDPR uyumlu veri koruma.",
    color: "red",
    benefits: ["256-bit SSL", "2FA desteği", "GDPR uyumlu", "Audit trail"]
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "IoT Entegrasyonu",
    description: "Medikal cihazlarla doğrudan entegrasyon. Sensör verilerini otomatik toplama.",
    color: "cyan",
    benefits: ["IoT sensörler", "Otomatik veri toplama", "Real-time monitoring", "API entegrasyonu"]
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Büyük Veri Analizi",
    description: "Milyonlarca kalibrasyon verisini analiz ederek pattern recognition ve insights.",
    color: "pink",
    benefits: ["Big data analizi", "Pattern recognition", "Predictive insights", "Machine learning"]
  },
  {
    icon: <Wifi className="h-8 w-8" />,
    title: "API Ekosistemi",
    description: "RESTful API ile mevcut sistemlerinizle kolay entegrasyon. Webhook desteği.",
    color: "teal",
    benefits: ["RESTful API", "Webhook desteği", "SDK kütüphaneleri", "Kolay entegrasyon"]
  }
];

const stats = [
  { number: "50,000+", label: "Kalibrasyon Testi", icon: <Target className="h-6 w-6" /> },
  { number: "1,200+", label: "Aktif Kullanıcı", icon: <Users2 className="h-6 w-6" /> },
  { number: "99.9%", label: "Uptime Garantisi", icon: <Activity className="h-6 w-6" /> },
  { number: "150+", label: "Hastane", icon: <Building2 className="h-6 w-6" /> }
];

const processSteps = [
  {
    step: "01",
    title: "Cihaz Bağlantısı",
    description: "Medikal cihazınızı sisteme bağlayın veya QR kod ile tanımlayın",
    icon: <Stethoscope className="h-8 w-8" />
  },
  {
    step: "02", 
    title: "Otomatik Test",
    description: "AI destekli test protokolleri otomatik olarak çalışır",
    icon: <Cpu className="h-8 w-8" />
  },
  {
    step: "03",
    title: "Analiz & Rapor",
    description: "Sonuçlar analiz edilir ve ISO uyumlu rapor oluşturulur",
    icon: <BarChart3 className="h-8 w-8" />
  },
  {
    step: "04",
    title: "Dijital İmza",
    description: "Blockchain ile güvenli dijital imza ve arşivleme",
    icon: <Shield className="h-8 w-8" />
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₺2,500",
    period: "/ay",
    description: "Küçük klinikler için",
    features: [
      "50 kalibrasyon/ay",
      "5 kullanıcı",
      "Temel raporlama",
      "Email destek",
      "Mobil uygulama"
    ],
    popular: false,
    color: "blue"
  },
  {
    name: "Professional",
    price: "₺7,500",
    period: "/ay", 
    description: "Orta ölçekli hastaneler",
    features: [
      "200 kalibrasyon/ay",
      "20 kullanıcı",
      "Gelişmiş analytics",
      "7/24 telefon destek",
      "API erişimi",
      "Özel entegrasyonlar"
    ],
    popular: true,
    color: "purple"
  },
  {
    name: "Enterprise",
    price: "Özel",
    period: "fiyat",
    description: "Büyük hastane grupları",
    features: [
      "Sınırsız kalibrasyon",
      "Sınırsız kullanıcı", 
      "Özel AI modelleri",
      "Dedicated support",
      "On-premise seçeneği",
      "SLA garantisi"
    ],
    popular: false,
    color: "green"
  }
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo request logic here
    alert('Demo talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    setShowDemoForm(false);
    setDemoForm({ name: '', email: '', company: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CaliMed Nexus
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Özellikler
              </a>
              <a href="#process" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Nasıl Çalışır
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Referanslar
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Fiyatlandırma
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                İletişim
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Giriş Yap
              </Link>
              <button
                onClick={() => setShowDemoForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Demo Talep Et
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600">Özellikler</a>
              <a href="#testimonials" className="block py-2 text-gray-600">Referanslar</a>
              <a href="#pricing" className="block py-2 text-gray-600">Fiyatlandırma</a>
              <a href="#contact" className="block py-2 text-gray-600">İletişim</a>
              <Link to="/login" className="block py-2 text-gray-600">Giriş Yap</Link>
              <button
                onClick={() => setShowDemoForm(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                Demo Talep Et
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-8 border border-blue-200">
              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
              Türkiye'nin İlk AI Destekli Kalibrasyon Platformu
              <Award className="h-4 w-4 ml-2 text-blue-600" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Medikal Cihaz</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Kalibrasyonunda
              </span>
              <span className="text-gray-900 flex items-center justify-center gap-4">
                Devrim
                <Rocket className="h-16 w-16 text-blue-600 animate-pulse" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-5xl mx-auto leading-relaxed">
              <span className="font-semibold text-gray-800">EKG, Ventilatör, HVAC ve 200+ medikal cihaz</span> için 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"> ISO 17025 uyumlu</span>, 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-semibold"> yapay zeka destekli</span> 
              kalibrasyon platformu.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-4xl mx-auto border border-gray-200 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Timer className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-gray-800">%70 Daha Hızlı</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-800">%40 Maliyet Tasarrufu</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-800">%100 Uyumluluk</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => setShowDemoForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Ücretsiz Demo Talep Et
              </button>
              <Link 
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
              >
                Hemen Başla
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex justify-center mb-3">
                      <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Gelişmiş Teknoloji Özellikleri
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Neden <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CaliMed Nexus</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Yapay zeka, blockchain ve IoT teknolojilerini bir araya getiren 
              <span className="font-semibold text-blue-600"> next-generation</span> kalibrasyon platformu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className={`text-${feature.color}-600 group-hover:text-${feature.color}-700`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nasıl <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Çalışır</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              4 basit adımda profesyonel kalibrasyon süreci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-4"></div>
                )}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2 text-pink-400" />
              Müşteri Memnuniyeti %98
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Müşterilerimiz <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">Ne Diyor</span>?
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Türkiye'nin önde gelen hastaneleri ve sağlık kuruluşları CaliMed Nexus'u tercih ediyor
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-white">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full mr-6 border-4 border-white/20"
                  />
                  <div className="text-left">
                    <div className="font-bold text-xl text-white flex items-center">
                      {testimonials[activeTestimonial].name}
                      {testimonials[activeTestimonial].verified && (
                        <CheckCircle className="h-5 w-5 text-green-400 ml-2" />
                      )}
                    </div>
                    <div className="text-blue-200">{testimonials[activeTestimonial].role}</div>
                    <div className="text-pink-300 font-medium">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                  index === activeTestimonial ? 'ring-2 ring-pink-400' : ''
                }`}
                onClick={() => setActiveTestimonial(index)}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  {testimonial.verified && (
                    <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                  )}
                </div>
                <p className="text-blue-100 mb-6 leading-relaxed text-sm">
                  "{testimonial.content.substring(0, 120)}..."
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3 border-2 border-white/20"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-blue-200">{testimonial.role}</div>
                    <div className="text-xs text-pink-300">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'bg-pink-400' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Şeffaf ve Adil Fiyatlandırma
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Size Uygun <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Planı</span> Seçin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İhtiyacınıza göre ölçeklenebilir çözümler. Tüm planlar 30 gün ücretsiz deneme ile gelir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white transform scale-105 shadow-2xl' 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
              } transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      En Popüler
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ml-2 ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-3 ${
                        plan.popular ? 'text-green-300' : 'text-green-500'
                      }`} />
                      <span className={plan.popular ? 'text-purple-100' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowDemoForm(true)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'İletişime Geç' : 'Ücretsiz Dene'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Tüm planlar 30 gün ücretsiz deneme, kurulum ücreti yok, istediğiniz zaman iptal edebilirsiniz.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                SSL Güvenlik
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                7/24 Destek
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-purple-500" />
                ISO Uyumlu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hemen Başlamaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ücretsiz demo ile CaliMed Nexus'un gücünü keşfedin. 
            Kurulum gerektirmez, hemen kullanmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDemoForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Ücretsiz Demo Talep Et
            </button>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Hemen Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hemen <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Başlamaya</span> Hazır mısınız?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ücretsiz demo ile CaliMed Nexus'un gücünü keşfedin. 
              Kurulum gerektirmez, hemen kullanmaya başlayın.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Telefon Desteği</h3>
                <p className="text-blue-100">+90 (212) 555 0123</p>
                <p className="text-blue-200 text-sm">7/24 Teknik Destek</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">E-posta</h3>
                <p className="text-blue-100">info@calimed.com</p>
                <p className="text-blue-200 text-sm">24 saat içinde yanıt</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Canlı Destek</h3>
                <p className="text-blue-100">Anında yardım</p>
                <p className="text-blue-200 text-sm">Pazartesi-Cuma 09:00-18:00</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowDemoForm(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Ücretsiz Demo Talep Et
              </button>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Rocket className="h-5 w-5" />
                Hemen Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CaliMed Nexus
                  </span>
                  <p className="text-xs text-gray-400">Next-Gen Calibration Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Yapay zeka destekli, ISO 17025 uyumlu medikal cihaz kalibrasyon platformu. 
                Türkiye'nin en güvenilir kalibrasyon çözümü.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-white">Ürün</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Özellikler</a></li>
                <li><a href="#process" className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Nasıl Çalışır</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />API Dokümantasyonu</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Güvenlik</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-white">Destek</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#contact" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />İletişim</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Eğitim Videoları</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Teknik Destek</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1" />Sistem Durumu</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                © 2025 CaliMed Nexus. Tüm hakları saklıdır. | Made with ❤️ in Turkey
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Gizlilik Politikası</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Kullanım Şartları</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">KVKK</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  ISO 17025 Sertifikalı
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-500" />
                  256-bit SSL Güvenlik
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  GDPR Uyumlu
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-orange-500" />
                  99.9% Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Demo Talep Et</h3>
              <button
                onClick={() => setShowDemoForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleDemoRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket/Hastane
                </label>
                <input
                  type="text"
                  required
                  value={demoForm.company}
                  onChange={(e) => setDemoForm({...demoForm, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  required
                  value={demoForm.phone}
                  onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+90 (555) 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj (Opsiyonel)
                </label>
                <textarea
                  value={demoForm.message}
                  onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Hangi cihazlar için kalibrasyon yapıyorsunuz? Özel ihtiyaçlarınız var mı?"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Demo sürecinde neler olacak?</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• 30 dakikalık kişiselleştirilmiş demo</li>
                      <li>• Cihazlarınıza özel test senaryoları</li>
                      <li>• Sorularınıza detaylı yanıtlar</li>
                      <li>• 30 gün ücretsiz deneme fırsatı</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Demo Randevusu Al
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}