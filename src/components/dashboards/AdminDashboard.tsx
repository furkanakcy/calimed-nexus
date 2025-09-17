import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  FileText,
  Activity,
  Building2,
  Eye,
  Download
} from 'lucide-react';

interface AnalyticsData {
  totalCalibrations: number;
  successRate: number;
  avgTime: number;
  activeDevices: number;
  pendingRequests: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: number;
  type: 'calibration' | 'service_request' | 'device_added';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
  technician?: string;
  customer?: string;
}

interface HVACReport {
  id: number;
  reportNo: string;
  hospitalName: string;
  measurementDate: string;
  testerName: string;
  organizationName: string;
  rooms: any[];
  createdAt: string;
  hospital?: {
    name: string;
  };
  createdBy: {
    name: string;
  };
}

// HVAC Reports Section Component
const HVACReportsSection: React.FC = () => {
  const { user } = useAuth();
  const [hvacReports, setHvacReports] = useState<HVACReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHVACReports();
  }, []);

  const fetchHVACReports = async () => {
    try {
      if (!user?.token) return;

      if (user.token.startsWith('demo-token')) {
        // Demo data
        const demoReports: HVACReport[] = [
          {
            id: 1,
            reportNo: 'HVAC-2025-001',
            hospitalName: 'Demo Hastanesi',
            measurementDate: '2025-01-15',
            testerName: 'Demo Teknisyen',
            organizationName: 'CaliMed Demo Company',
            rooms: [{ roomName: 'Ameliyathane 1' }, { roomName: 'Yoğun Bakım' }],
            createdAt: '2025-01-15T10:30:00Z',
            createdBy: { name: 'Demo Teknisyen' }
          },
          {
            id: 2,
            reportNo: 'HVAC-2025-002',
            hospitalName: 'Acıbadem Maslak',
            measurementDate: '2025-01-14',
            testerName: 'Demo Teknisyen',
            organizationName: 'CaliMed Demo Company',
            rooms: [{ roomName: 'Temiz Oda' }],
            createdAt: '2025-01-14T14:20:00Z',
            createdBy: { name: 'Demo Teknisyen' }
          }
        ];
        setHvacReports(demoReports);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/hvac-reports', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setHvacReports(data.slice(0, 5)); // Show only latest 5 reports
      }
    } catch (error) {
      console.error('Failed to fetch HVAC reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">HVAC Raporları</h2>
          </div>
          <Link 
            to="/admin/hvac-reports" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>
      </div>
      
      {hvacReports.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Henüz HVAC raporu bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapor No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hastane
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teknisyen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahal Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hvacReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-orange-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.reportNo}
                        </div>
                        <div className="text-xs text-gray-500">HVAC Raporu</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.hospital?.name || report.hospitalName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.createdBy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.rooms.length} Mahal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Raporu Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Raporu İndir"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCalibrations: 0,
    successRate: 0,
    avgTime: 0,
    activeDevices: 0,
    pendingRequests: 0,
    monthlyGrowth: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (user && user.token !== 'demo-token-admin') {
      const fetchDashboardData = async () => {
        try {
          const headers = { 'Authorization': `Bearer ${user.token}` };
          
          // Fetch calibrations, devices, service orders
          const [calibrationsRes, devicesRes, serviceOrdersRes] = await Promise.all([
            fetch('http://localhost:5000/api/calibrations', { headers }),
            fetch('http://localhost:5000/api/devices', { headers }),
            fetch('http://localhost:5000/api/service-orders', { headers })
          ]);

          const calibrations = calibrationsRes.ok ? await calibrationsRes.json() : [];
          const devices = devicesRes.ok ? await devicesRes.json() : [];
          const serviceOrders = serviceOrdersRes.ok ? await serviceOrdersRes.json() : [];

        // Calculate analytics
        const totalCalibrations = calibrations.length;
        const successfulCalibrations = calibrations.filter((c: any) => c.status === 'geçti').length;
        const successRate = totalCalibrations > 0 ? (successfulCalibrations / totalCalibrations) * 100 : 0;
        const activeDevices = devices.length;
        const pendingRequests = serviceOrders.filter((so: any) => so.status === 'pending').length;

        setAnalytics({
          totalCalibrations,
          successRate: parseFloat(successRate.toFixed(1)),
          avgTime: 45, // Placeholder
          activeDevices,
          pendingRequests,
          monthlyGrowth: 12.5 // Placeholder
        });

        // Format recent activity
        const formattedActivity: RecentActivity[] = [
          ...calibrations.slice(0, 2).map((c: any) => ({
            id: c.id,
            type: 'calibration',
            description: `${c.device.type} ${c.device.brand} ${c.device.model} kalibrasyonu`,
            timestamp: new Date(c.date).toLocaleString(),
            status: c.status === 'geçti' ? 'success' : 'warning',
            technician: c.technician.name,
            customer: c.hospital.name
          })),
          ...serviceOrders.slice(0, 2).map((so: any) => ({
            id: so.id,
            type: 'service_request',
            description: so.description,
            timestamp: new Date(so.createdAt).toLocaleString(),
            status: 'warning',
            customer: so.hospital.name
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setRecentActivity(formattedActivity);
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
          // Set demo data as fallback
          setAnalytics({
            totalCalibrations: 1247,
            successRate: 97.2,
            avgTime: 45,
            activeDevices: 342,
            pendingRequests: 8,
            monthlyGrowth: 12.5
          });
        }
      };

      fetchDashboardData();
    } else {
      // Set demo data for demo user
      setAnalytics({
        totalCalibrations: 1247,
        successRate: 97.2,
        avgTime: 45,
        activeDevices: 342,
        pendingRequests: 8,
        monthlyGrowth: 12.5
      });
      setRecentActivity([
        {
          id: 1,
          type: 'calibration',
          description: 'EKG Nihon Kohden ECG-2550 kalibrasyonu tamamlandı',
          timestamp: '2025-01-15 14:30',
          status: 'success',
          technician: 'Mehmet Demir',
          customer: 'İstanbul Şehir Hastanesi'
        },
        {
          id: 2,
          type: 'service_request',
          description: 'Acil servis talebi oluşturuldu - Ventilatör arızası',
          timestamp: '2025-01-15 13:15',
          status: 'warning',
          customer: 'Acıbadem Maslak'
        }
      ]);
    }
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'calibration': return <Activity className="h-5 w-5" />;
      case 'service_request': return <AlertTriangle className="h-5 w-5" />;
      case 'device_added': return <Settings className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yönetici Paneli</h1>
              <p className="text-gray-600">Hoş geldiniz, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kalibrasyon</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCalibrations.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{analytics.monthlyGrowth}% bu ay</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%{analytics.successRate}</p>
                <p className="text-xs text-green-600 mt-1">Hedefin üstünde</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Cihaz</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeDevices}</p>
                <p className="text-xs text-blue-600 mt-1">Kayıtlı cihaz sayısı</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen Talep</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pendingRequests}</p>
                <p className="text-xs text-orange-600 mt-1">Acil müdahale gerekiyor</p>
              </div>
            </div>
          </div>
        </div>

        {/* HVAC Reports Section */}
        <div className="mb-8">
          <HVACReportsSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Tümünü Gör →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>{activity.timestamp}</p>
                        {activity.technician && <p>Teknisyen: {activity.technician}</p>}
                        {activity.customer && <p>Müşteri: {activity.customer}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performans Özeti</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Kalibrasyon Başarısı</span>
                    <span className="text-sm font-semibold text-gray-900">%{analytics.successRate}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${analytics.successRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Ortalama Tamamlama</span>
                    <span className="text-sm font-semibold text-gray-900">{analytics.avgTime} dk</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Müşteri Memnuniyeti</span>
                    <span className="text-sm font-semibold text-gray-900">%94.8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: '94.8%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Proaktif Bakım Önerileri</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 15 cihazın kalibrasyon süresi bu ay doluyor</li>
                  <li>• 3 teknisyen ek eğitim almalı</li>
                  <li>• Yoğun bakım servisinde yoğunluk var</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Management Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Hızlı Yönetim İşlemleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/users" className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Teknisyen Yönetimi</p>
              </Link>
              
              <Link to="/admin/planning" className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Görev Planlama</p>
              </Link>
              
              <Link to="/admin/reports" className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Rapor Analizi</p>
              </Link>

              <Link to="/admin/hospitals" className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Hastane Yönetimi</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
