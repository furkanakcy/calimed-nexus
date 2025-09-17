import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, FileText, Download, Calendar, CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';

interface Report {
  id: number;
  calibrationId?: number;
  pdfUrl?: string;
  timestamp: string;
  digitalSignature?: string;
  type: 'calibration' | 'hvac';
  calibration?: {
    id: number;
    device: {
      type: string;
      model: string;
      brand: string;
      serialNo: string;
    };
    hospital: {
      name: string;
    };
    status: string;
    date: string;
    environmentTemp?: number;
    environmentHumidity?: number;
  };
  hvacReport?: {
    id: number;
    hospitalName: string;
    reportNo: string;
    measurementDate: string;
    testerName: string;
    preparedBy: string;
    approvedBy: string;
    organizationName: string;
    rooms: any[];
    createdAt: string;
  };
}

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      if (user?.token && !user.token.startsWith('demo-token')) {
        // Fetch both calibration reports and HVAC reports
        const [calibrationsResponse, hvacResponse] = await Promise.all([
          fetch('http://localhost:5000/api/calibrations', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/hvac-reports', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        const allReports: Report[] = [];

        // Add calibration reports
        if (calibrationsResponse.ok) {
          const calibrations = await calibrationsResponse.json();
          const calibrationReports = calibrations
            .filter((cal: any) => cal.report)
            .map((cal: any) => ({
              id: cal.report.id,
              calibrationId: cal.id,
              pdfUrl: cal.report.pdfUrl,
              timestamp: cal.report.timestamp,
              digitalSignature: cal.report.digitalSignature,
              type: 'calibration' as const,
              calibration: cal
            }));
          allReports.push(...calibrationReports);
        }

        // Add HVAC reports
        if (hvacResponse.ok) {
          const hvacReports = await hvacResponse.json();
          const hvacReportData = hvacReports.map((hvac: any) => ({
            id: `hvac-${hvac.id}`,
            timestamp: hvac.createdAt,
            type: 'hvac' as const,
            hvacReport: hvac
          }));
          allReports.push(...hvacReportData);
        }

        setReports(allReports);
      } else {
        // Demo data - include both calibration and HVAC reports
        const demoReports: Report[] = [
          {
            id: 1,
            calibrationId: 1,
            pdfUrl: '/reports/CAL-2025-001.pdf',
            timestamp: '2025-01-15T10:30:00Z',
            digitalSignature: 'demo-signature-1',
            type: 'calibration',
            calibration: {
              id: 1,
              device: {
                type: 'EKG',
                model: 'ECG-2550',
                brand: 'Nihon Kohden',
                serialNo: 'EKG-2025-001'
              },
              hospital: {
                name: 'Demo Hastanesi'
              },
              status: 'geçti',
              date: '2025-01-15T10:00:00Z',
              environmentTemp: 22.5,
              environmentHumidity: 45.2
            }
          },
          {
            id: 2,
            calibrationId: 2,
            pdfUrl: '/reports/CAL-2025-002.pdf',
            timestamp: '2025-01-14T14:20:00Z',
            digitalSignature: 'demo-signature-2',
            type: 'calibration',
            calibration: {
              id: 2,
              device: {
                type: 'Ventilatör',
                model: 'Evita V500',
                brand: 'Dräger',
                serialNo: 'VENT-2025-001'
              },
              hospital: {
                name: 'Acıbadem Maslak'
              },
              status: 'geçti',
              date: '2025-01-14T14:00:00Z',
              environmentTemp: 21.8,
              environmentHumidity: 48.1
            }
          }
        ];

        // Add HVAC reports from localStorage if any
        const savedHvacReports = localStorage.getItem('hvac-reports');
        if (savedHvacReports) {
          try {
            const hvacReports = JSON.parse(savedHvacReports);
            hvacReports.forEach((hvac: any, index: number) => {
              demoReports.push({
                id: `hvac-${index + 1}`,
                timestamp: hvac.createdAt || new Date().toISOString(),
                type: 'hvac',
                hvacReport: hvac
              });
            });
          } catch (e) {
            console.error('Error parsing saved HVAC reports:', e);
          }
        }

        setReports(demoReports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report: Report) => {
    // In a real application, this would download the actual PDF
    alert(`Rapor indiriliyor: ${report.pdfUrl}`);
  };

  const handleViewReport = (report: Report) => {
    // In a real application, this would open the PDF in a modal or new tab
    alert(`Rapor görüntüleniyor: CAL-${new Date(report.timestamp).getFullYear()}-${String(report.calibration.id).padStart(3, '0')}`);
  };

  const filteredReports = reports.filter(report => {
    let matchesSearch = false;
    let matchesStatus = true;

    if (report.type === 'calibration' && report.calibration) {
      matchesSearch = report.calibration.device.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     report.calibration.device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     report.calibration.device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     report.calibration.hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
      matchesStatus = !statusFilter || report.calibration.status === statusFilter;
    } else if (report.type === 'hvac' && report.hvacReport) {
      matchesSearch = report.hvacReport.reportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     report.hvacReport.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     report.hvacReport.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
      matchesStatus = !statusFilter || statusFilter === 'geçti'; // HVAC reports are generally successful
    }
    
    const reportDate = new Date(report.timestamp);
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    
    const matchesDate = (!startDate || reportDate >= startDate) && 
                       (!endDate || reportDate <= endDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getReportNumber = (report: Report) => {
    if (report.type === 'calibration' && report.calibration) {
      return `CAL-${new Date(report.timestamp).getFullYear()}-${String(report.calibration.id).padStart(3, '0')}`;
    }
    return 'N/A';
  };

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
              <Link to="/dashboard/technician" className="text-gray-600 hover:text-blue-600 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kalibrasyon Raporları</h1>
                <p className="text-gray-600">Oluşturduğunuz raporları görüntüleyin ve indirin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarılı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => 
                    (r.type === 'calibration' && r.calibration?.status === 'geçti') || 
                    r.type === 'hvac'
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarısız</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => 
                    r.type === 'calibration' && r.calibration?.status === 'geçmedi'
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => {
                    const reportDate = new Date(r.timestamp);
                    const currentMonth = new Date().getMonth();
                    return reportDate.getMonth() === currentMonth;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rapor ara (seri no, model, hastane...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Durumlar</option>
                <option value="geçti">Başarılı</option>
                <option value="geçmedi">Başarısız</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                placeholder="Başlangıç"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="date"
                placeholder="Bitiş"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setDateFilter({ startDate: '', endDate: '' });
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow">
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
                    Rapor No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cihaz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hastane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ortam
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
                      <div className="flex items-center">
                        <FileText className={`h-5 w-5 mr-2 ${report.type === 'hvac' ? 'text-orange-600' : 'text-blue-600'}`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.type === 'hvac' && report.hvacReport 
                              ? report.hvacReport.reportNo 
                              : getReportNumber(report)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.type === 'hvac' ? 'HVAC Raporu' : 'Kalibrasyon Raporu'}
                          </div>
                          {report.digitalSignature && (
                            <div className="text-xs text-green-600">Dijital İmzalı</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.type === 'calibration' && report.calibration ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.calibration.device.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.calibration.device.brand} {report.calibration.device.model}
                          </div>
                          <div className="text-xs text-gray-400">
                            SN: {report.calibration.device.serialNo}
                          </div>
                        </div>
                      ) : report.type === 'hvac' && report.hvacReport ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">HVAC Sistemi</div>
                          <div className="text-sm text-gray-500">
                            {report.hvacReport.rooms.length} Mahal
                          </div>
                          <div className="text-xs text-gray-400">
                            ISO 14644-1 Uyumlu
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.type === 'calibration' && report.calibration 
                        ? report.calibration.hospital.name 
                        : report.hvacReport?.hospital?.name || report.hvacReport?.hospitalName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        (report.type === 'calibration' && report.calibration?.status === 'geçti') || report.type === 'hvac'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(report.type === 'calibration' && report.calibration?.status === 'geçti') || report.type === 'hvac' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> GEÇTİ</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1" /> GEÇMEDİ</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(report.timestamp).toLocaleDateString('tr-TR')}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(report.timestamp).toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type === 'calibration' && report.calibration?.environmentTemp && report.calibration?.environmentHumidity ? (
                        <div>
                          <div>{report.calibration.environmentTemp}°C</div>
                          <div className="text-xs text-gray-400">
                            %{report.calibration.environmentHumidity} nem
                          </div>
                        </div>
                      ) : report.type === 'hvac' && report.hvacReport ? (
                        <div>
                          <div className="text-xs text-gray-600">
                            {report.hvacReport.testerName}
                          </div>
                          <div className="text-xs text-gray-400">
                            Teknisyen
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Raporu Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="text-green-600 hover:text-green-900 flex items-center"
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
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rapor bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}