import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Stethoscope, Users, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const roleConfig = {
  technician: {
    title: 'Teknisyen Girişi',
    description: 'Sahada kalibrasyon yapan teknisyenler',
    icon: Stethoscope,
    color: 'blue',
    demo: { email: 'teknisyen@calimed.com', password: 'demo123' },
    roleName: 'technician' as UserRole
  },
  hospital: {
    title: 'Hastane Girişi',
    description: 'Hastane ve klinik yetkilileri',
    icon: Users,
    color: 'green',
    demo: { email: 'hospital@calimed.com', password: 'demo123' },
    roleName: 'hospital' as UserRole
  },
  admin: {
    title: 'Firma Yöneticisi Girişi',
    description: 'Sistem yöneticileri',
    icon: Shield,
    color: 'purple',
    demo: { email: 'admin@calimed.com', password: 'demo123' },
    roleName: 'admin' as UserRole
  }
};

type RoleKey = keyof typeof roleConfig;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { role } = useParams<{ role: string }>();

  const [activeTab, setActiveTab] = useState<RoleKey>('admin'); // Default to admin tab
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Map URL parameters to role keys
  const roleMapping: Record<string, RoleKey> = {
    'teknisyen': 'technician',
    'musteri': 'hospital',
    'yonetici': 'admin'
  };

  useEffect(() => {
    if (role && roleMapping[role]) {
      setActiveTab(roleMapping[role]);
    }
  }, [role]);

  const config = roleConfig[activeTab];
  const IconComponent = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password, false);

    if (success) {
      navigate(`/dashboard/${config.roleName}`);
    } else {
      setError('Geçersiz e-posta veya şifre');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="flex items-center text-white/80 hover:text-white mb-8 transition-colors backdrop-blur-sm bg-white/10 rounded-lg px-4 py-2 w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 bg-white/5 rounded-xl p-1">
            {Object.entries(roleConfig).map(([key, roleData]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as RoleKey);
                  setError(''); // Clear error when changing tabs
                  setEmail(''); // Clear email when changing tabs
                  setPassword(''); // Clear password when changing tabs
                }}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex-1 ${
                  activeTab === key
                    ? roleData.color === 'blue' ? 'bg-blue-600 text-white shadow-lg' :
                      roleData.color === 'green' ? 'bg-green-600 text-white shadow-lg' :
                      roleData.color === 'purple' ? 'bg-purple-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {roleData.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${
              config.color === 'blue' ? 'from-blue-500 to-blue-600' :
              config.color === 'green' ? 'from-green-500 to-green-600' :
              config.color === 'purple' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'
            } shadow-xl`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">{config.title}</h2>
            <p className="text-white/70 text-lg">{config.description}</p>
          </div>



          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                placeholder="ornek@hastane.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-white/80">
                  Beni hatırla
                </label>
              </div>
              <a href="#" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                Şifremi unuttum?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg ${
                config.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                config.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                config.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Güvenli Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <p className="text-sm text-white/70 mb-3">
                Demo Hesap Bilgileri
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/90 font-medium">E-posta: {config.demo.email}</p>
                  <p className="text-white/90 font-medium">Şifre: {config.demo.password}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(config.demo.email);
                    setPassword(config.demo.password);
                  }}
                  className="text-blue-300 hover:text-blue-200 text-xs underline transition-colors"
                >
                  Demo bilgilerini otomatik doldur
                </button>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Hesabınız yok mu?{' '}
              <Link to="/register-company" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
                Firma Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
