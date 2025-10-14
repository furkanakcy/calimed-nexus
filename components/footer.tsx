import Link from "next/link"
import { MailIcon, PhoneIcon, MapPinIcon } from "./icons"

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-semibold text-lg">Trical Engineering</span>
            </div>
            <p className="text-sm text-gray-400">Medikal teknolojilerde güven ve mükemmellik</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/hizmetler" className="text-sm text-gray-400 hover:text-white transition-colors">
                Hizmetler
              </Link>
              <Link href="/urunler" className="text-sm text-gray-400 hover:text-white transition-colors">
                Ürünler
              </Link>
              <Link href="/hakkimizda" className="text-sm text-gray-400 hover:text-white transition-colors">
                Hakkımızda
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Hizmetlerimiz</h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-400">Kalibrasyon & Validasyon</p>
              <p className="text-sm text-gray-400">Teknik Servis</p>
              <p className="text-sm text-gray-400">HVAC Raporlama</p>
              <p className="text-sm text-gray-400">CaliMed Nexus</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MailIcon size={16} className="mt-1 text-primary" />
                <a
                  href="mailto:info@tricalengineering.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  info@tricalengineering.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <PhoneIcon size={16} className="mt-1 text-primary" />
                <span className="text-sm text-gray-400">+90 xxx xxx xx xx</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon size={16} className="mt-1 text-primary" />
                <span className="text-sm text-gray-400">
                  Teknopark İstanbul, No: 12
                  <br />
                  Pendik / İstanbul
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">© 2025 Trical Engineering. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
