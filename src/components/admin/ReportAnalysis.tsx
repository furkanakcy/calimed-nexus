import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, BarChart3, TrendingUp, Download, Calendar, Filter, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: number;
  calibrationId: number;
  pdfUrl: string;
  timestamp: string;
  calibration: {
    device: {
      type: string;
      model: string;
      brand: string;
    };
    hospital: {
      name: string;
    };
    technician: {
      name: string;
    };
    status: string;
    date: string;
  };
}

interface AnalyticsData {
  totalReports: number;
  successRate: number;
  avgCompletionTime: number;
  monthlyReports: number;
  deviceTypes: { [key: string]: number };
  monthlyTrend: { month: string; count: number }[];
}

export default function ReportAnalysis() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalReports: 0,
    successRate: 0,
    avgCompletionTime: 0,
    monthlyReports: 0,
    deviceTypes: {},
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [deviceFilter, setDeviceFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      if (user?.token && !user.token.startsWith('demo-token')) {
        const response = await fetch('http://localhost:5000/api/calibrations', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.ok) {
          const calibrations = await response.json();
          // Transform calibrations to reports format
          const reportsData = calibrations
            .filter((cal: any) => cal.report)
            .map((cal: any) => ({
              id: cal.report.id,
              calibrationId: cal.id,
              pdfUrl: cal.report.pdfUrl,
              timestamp: cal.report.timestamp,
              calibration: cal
            }));
          setReports(reportsData);
          calculateAnalytics(reportsData);
        }
      } else {
        // Demo data
        const demoReports = [
          {
            id: 1,
            calibrationId: 1,
            pdfUrl: '/reports/CAL-2025-001.pdf',
            timestamp: '2025-01-15T10:30:00Z',
            calibration: {
              device: { type: 'EKG', model: 'ECG-2550', brand: 'Nihon Kohden' },
              hospital: { name: 'Demo Hastanesi' },
              technician: { name: 'Demo Teknisyen' },
              status: 'geçti',
              date: '2025-01-15T10:00:00Z'
            }
          },
          {
            id: 2,
            calibrationId: 2,
            pdfUrl: '/reports/CAL-2025-002.pdf',
            timestamp: '2025-01-14T14:20:00Z',
            calibration: {
              device: { type: 'Ventilatör', model: 'V500', brand: 'Dräger' },
              hospital: { name: 'Acıbadem Maslak' },
              technician: { name: 'Demo Teknisyen' },
              status: 'geçti',
              date: '2025-01-14T14:00:00Z'
            }
          }
        ];
        setReports(demoReports);
        calculateAnalytics(demoReports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (reportsData: Report[]) => {
    const totalReports = reportsData.length;
    const successfulReports = reportsData.filter(r => r.calibration.status === 'geçti').length;
    const successRate = totalReports > 0 ? (successfulReports / totalReports) * 100 : 0;
    
    // Device types distribution
    const deviceTypes: { [key: string]: number } = {};
    reportsData.forEach(report => {
      const deviceType = report.calibration.device.type;
      deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + 1;
    });

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });
      const count = reportsData.filter(r => {
        const reportDate = new Date(r.timestamp);
        return reportDate.getMonth() === date.getMonth() && 
               reportDate.getFullYear() === date.getFullYear();
      }).length;
      monthlyTrend.push({ month: monthName, count });
    }

    const currentMonth = new Date().getMonth();
    const monthlyReports = reportsData.filter(r => {
      const reportDate = new Date(r.timestamp);
      return reportDate.getMonth() === currentMonth;
    }).length;

    setAnalytics({
      totalReports,
      successRate: parseFloat(successRate.toFixed(1)),
      avgCompletionTime: 45, // Demo value
      monthlyReports,
      deviceTypes,
      monthlyTrend
    });
  };

  const filteredReports = reports.filter(report => {
    const reportDate = new Date(report.timestamp);
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    
    const dateMatch = (!startDate || reportDate >= startDate) && 
                     (!endDate || reportDate <= endDate);
    const deviceMatch = !deviceFilter || 
                       report.calibration.device.type.toLowerCase().includes(deviceFilter.toLowerCase());
    
    return dateMatch && deviceMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard/admin" className="text-gray-600 hover:text-blue-600 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapor Analizi</h1>
                <p className="text-gray-600">Kalibrasyon raporlarını analiz edin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalReports}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%{analytics.successRate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.monthlyReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ort. Süre</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.avgCompletionTime} dk</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Rapor Trendi</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analytics.monthlyTrend.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-600 rounded-t w-full min-h-[4px]"
                      style={{ 
                        height: `${Math.max((item.count / Math.max(...analytics.monthlyTrend.map(t => t.count))) * 200, 4)}px` 
                      }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                    <div className="text-xs font-semibold text-gray-900">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Types Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Türü Dağılımı</h3>
              <div className="space-y-3">
                {Object.entries(analytics.deviceTypes).map(([deviceType, count]) => {
                  const percentage = (count / analytics.totalReports) * 100;
                  return (
                    <div key={deviceType} className="flex items-center">
                      <div className="w-20 text-sm text-gray-600">{deviceType}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm font-semibold text-gray-900">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters and Recent Reports */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtreler
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cihaz Türü
                  </label>
                  <input
                    type="text"
                    placeholder="EKG, Ventilatör..."
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => {
                    setDateFilter({ startDate: '', endDate: '' });
                    setDeviceFilter('');
                  }}
                  className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Özeti</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Başarılı Kalibrasyon</span>
                  <span className="text-sm font-semibold text-green-600">
                    %{analytics.successRate}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ortalama Süre</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {analytics.avgCompletionTime} dk
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bu Ay Artış</span>
                  <span className="text-sm font-semibold text-green-600">
                    +12.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Rapor Listesi ({filteredReports.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cihaz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hastane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknisyen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
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
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.calibration.device.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.calibration.device.brand} {report.calibration.device.model}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.calibration.hospital.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.calibration.technician.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.calibration.status === 'geçti' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.calibration.status === 'geçti' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> GEÇTİ</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1" /> GEÇMEDİ</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.timestamp).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        İndir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}