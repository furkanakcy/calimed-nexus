import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus, AlertTriangle, Clock, CheckCircle, Settings, Calendar, Building2, Eye, Download } from 'lucide-react';

interface ServiceRequest {
  id: number;
  description: string;
  status: string;
  priority: string;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  device?: {
    id: number;
    type: string;
    model: string;
    brand: string;
    serialNo: string;
  };
  technician?: {
    id: number;
    name: string;
  };
}

interface Device {
  id: number;
  type: string;
  model: string;
  brand: string;
  serialNo: string;
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

export default function ServiceRequest() {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [hvacReports, setHvacReports] = useState<HVACReport[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    description: '',
    priority: 'medium',
    deviceId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (user?.token && !user.token.startsWith('demo-token')) {
        const [requestsRes, devicesRes, hvacRes] = await Promise.all([
          fetch('http://localhost:5000/api/service-orders', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/devices', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/hvac-reports', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (requestsRes.ok) setServiceRequests(await requestsRes.json());
        if (devicesRes.ok) setDevices(await devicesRes.json());
        if (hvacRes.ok) setHvacReports(await hvacRes.json());
      } else {
        // Demo data
        setServiceRequests([
          {
            id: 1,
            description: 'EKG cihazında hatalı ölçüm sorunu var, acil kalibrasyon gerekiyor',
            status: 'assigned',
            priority: 'high',
            scheduledDate: '2025-02-10',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T11:00:00Z',
            device: {
              id: 1,
              type: 'EKG',
              model: 'ECG-2550',
              brand: 'Nihon Kohden',
              serialNo: 'EKG-2025-001'
            },
            technician: {
              id: 1,
              name: 'Demo Teknisyen'
            }
          },
          {
            id: 2,
            description: 'Ventilatör cihazının rutin bakımı yapılması gerekiyor',
            status: 'pending',
            priority: 'medium',
            createdAt: '2025-01-14T14:00:00Z',
            updatedAt: '2025-01-14T14:00:00Z',
            device: {
              id: 2,
              type: 'Ventilatör',
              model: 'Evita V500',
              brand: 'Dräger',
              serialNo: 'VENT-2025-001'
            }
          },
          {
            id: 3,
            description: 'Kalibrasyon süresi dolmuş, yenilenmesi gerekiyor',
            status: 'completed',
            priority: 'medium',
            scheduledDate: '2025-01-12',
            completedDate: '2025-01-12',
            createdAt: '2025-01-10T09:00:00Z',
            updatedAt: '2025-01-12T16:00:00Z',
            device: {
              id: 3,
              type: 'EKG',
              model: 'MAC 1200',
              brand: 'GE Healthcare',
              serialNo: 'EKG-2025-002'
            },
            technician: {
              id: 1,
              name: 'Demo Teknisyen'
            }
          }
        ]);

        setDevices([
          {
            id: 1,
            type: 'EKG',
            model: 'ECG-2550',
            brand: 'Nihon Kohden',
            serialNo: 'EKG-2025-001'
          },
          {
            id: 2,
            type: 'Ventilatör',
            model: 'Evita V500',
            brand: 'Dräger',
            serialNo: 'VENT-2025-001'
          },
          {
            id: 3,
            type: 'EKG',
            model: 'MAC 1200',
            brand: 'GE Healthcare',
            serialNo: 'EKG-2025-002'
          }
        ]);

        // Demo HVAC reports for hospital
        setHvacReports([
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
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        description: newRequest.description,
        status: 'pending',
        priority: newRequest.priority,
        deviceId: newRequest.deviceId ? parseInt(newRequest.deviceId) : undefined,
        hospitalId: 1 // This should be the actual hospital ID
      };

      if (user?.token && !user.token.startsWith('demo-token')) {
        const response = await fetch('http://localhost:5000/api/service-orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(requestData)
        });

        if (response.ok) {
          const createdRequest = await response.json();
          setServiceRequests([...serviceRequests, createdRequest]);
          setShowAddModal(false);
          setNewRequest({ description: '', priority: 'medium', deviceId: '' });
        } else {
          alert('Servis talebi oluşturulurken hata oluştu');
        }
      } else {
        // Demo mode
        const demoRequest = {
          id: serviceRequests.length + 1,
          ...requestData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          device: devices.find(d => d.id === parseInt(newRequest.deviceId))
        };
        setServiceRequests([...serviceRequests, demoRequest]);
        setShowAddModal(false);
        setNewRequest({ description: '', priority: 'medium', deviceId: '' });
      }
    } catch (error) {
      console.error('Failed to add service request:', error);
      alert('Servis talebi oluşturulurken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'assigned': return 'Atandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'assigned': return <Settings className="h-4 w-4" />;
      case 'in_progress': return <Settings className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
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
              <Link to="/dashboard/hospital" className="text-gray-600 hover:text-blue-600 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Servis Talepleri</h1>
                <p className="text-gray-600">Cihaz bakım ve kalibrasyon taleplerini yönetin</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Talep
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Talep</p>
                <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beklemede</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Devam Eden</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceRequests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HVAC Reports Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Building2 className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">HVAC Raporlarım</h2>
                </div>
                <span className="text-sm text-gray-500">
                  Hastanemiz için oluşturulan HVAC performans raporları
                </span>
              </div>
            </div>
            
            {hvacReports.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz HVAC raporu bulunmuyor.</p>
                <p className="text-sm mt-2">HVAC test raporu talebi için servis talebi oluşturabilirsiniz.</p>
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
                        Teknisyen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mahal Sayısı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Tarihi
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
                              <div className="text-xs text-gray-500">HVAC Performans Raporu</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.createdBy.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.rooms.length} Mahal
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.measurementDate).toLocaleDateString('tr-TR')}
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
        </div>

        {/* Service Requests List */}
        <div className="space-y-6">
          {serviceRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Talep #{request.id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {getPriorityText(request.priority)} Öncelik
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>Oluşturulma: {new Date(request.createdAt).toLocaleDateString('tr-TR')}</div>
                    {request.scheduledDate && (
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Planlanan: {new Date(request.scheduledDate).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{request.description}</p>
                </div>

                {request.device && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">İlgili Cihaz</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Tür:</span>
                        <div>{request.device.type}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Model:</span>
                        <div>{request.device.brand} {request.device.model}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Seri No:</span>
                        <div>{request.device.serialNo}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Durum:</span>
                        <div className="text-green-600">Aktif</div>
                      </div>
                    </div>
                  </div>
                )}

                {request.technician && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Atanan Teknisyen: <strong>{request.technician.name}</strong></span>
                    </div>
                    {request.completedDate && (
                      <div className="text-sm text-green-600">
                        Tamamlandı: {new Date(request.completedDate).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      Bu talep henüz bir teknisyene atanmamıştır. En kısa sürede değerlendirilecektir.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {serviceRequests.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz servis talebi yok</h3>
            <p className="text-gray-600 mb-4">İlk servis talebinizi oluşturmak için butona tıklayın.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Yeni Talep Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Add Service Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Yeni Servis Talebi</h3>
            
            <form onSubmit={handleAddRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cihaz Seçin
                </label>
                <select
                  value={newRequest.deviceId}
                  onChange={(e) => setNewRequest({ ...newRequest, deviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Cihaz seçin (isteğe bağlı)</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.type} - {device.brand} {device.model} (SN: {device.serialNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik Seviyesi
                </label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talep Açıklaması *
                </label>
                <textarea
                  required
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sorunun detaylı açıklamasını yazın..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Bilgi</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Acil durumlar için telefon ile de iletişime geçebilirsiniz</li>
                  <li>• Talep oluşturulduktan sonra size bilgilendirme yapılacaktır</li>
                  <li>• Teknisyen ataması yapıldığında e-posta ile bilgilendirileceksiniz</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Talep Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}