import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Download, Plus, CheckCircle, AlertTriangle, Clock, Building } from 'lucide-react';

interface Device {
  id: number;
  type: 'EKG' | 'Ventilatör';
  model: string;
  serialNo: string;
  location: string;
  lastCalibration: string;
  nextCalibration: string;
  status: 'valid' | 'expiring' | 'expired';
  reportId?: string;
}

interface ServiceRequest {
  id: number;
  deviceType: string;
  urgency: 'normal' | 'urgent';
  description: string;
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
  technician?: string;
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  const [devices, setDevices] = useState<Device[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (user && user.token !== 'demo-token-hospital') {
      const fetchCustomerData = async () => {
        try {
          const headers = { 'Authorization': `Bearer ${user.token}` };

          const [devicesRes, serviceRequestsRes] = await Promise.all([
            fetch('http://localhost:5000/api/devices', { headers }),
            fetch('http://localhost:5000/api/service-orders', { headers })
          ]);

          const fetchedDevices = devicesRes.ok ? await devicesRes.json() : [];
          const fetchedServiceRequests = serviceRequestsRes.ok ? await serviceRequestsRes.json() : [];

        const formattedDevices: Device[] = fetchedDevices.map((d: any) => ({
          id: d.id,
          type: d.type,
          model: d.model,
          serialNo: d.serialNo,
          location: d.hospital.name, // Assuming device has a hospital relation
          lastCalibration: 'N/A', // This data is not directly in device model
          nextCalibration: 'N/A', // This data is not directly in device model
          status: 'valid', // Placeholder, needs logic based on calibration dates
          reportId: 'N/A' // Placeholder
        }));
        setDevices(formattedDevices);

        const formattedServiceRequests: ServiceRequest[] = fetchedServiceRequests.map((sr: any) => ({
          id: sr.id,
          deviceType: sr.device ? `${sr.device.type} - ${sr.device.model}` : 'Genel',
          urgency: sr.priority === 'high' ? 'urgent' : 'normal',
          description: sr.description,
          status: sr.status,
          createdAt: new Date(sr.createdAt).toLocaleDateString(),
          technician: sr.technician ? sr.technician.name : undefined
        }));
        setServiceRequests(formattedServiceRequests);
        } catch (error) {
          console.error('Failed to fetch customer data:', error);
          // Set demo data as fallback
          setDevices([
            {
              id: 1,
              type: 'EKG',
              model: 'Nihon Kohden ECG-2550',
              serialNo: 'NK2550-2023-001',
              location: 'Kardiyoloji Servisi - Oda 203',
              lastCalibration: '2024-12-15',
              nextCalibration: '2025-06-15',
              status: 'valid',
              reportId: 'CAL-2024-1215-001'
            }
          ]);
        }
      };

      fetchCustomerData();
    } else {
      // Demo data
      setDevices([
        {
          id: 1,
          type: 'EKG',
          model: 'Nihon Kohden ECG-2550',
          serialNo: 'NK2550-2023-001',
          location: 'Kardiyoloji Servisi - Oda 203',
          lastCalibration: '2024-12-15',
          nextCalibration: '2025-06-15',
          status: 'valid',
          reportId: 'CAL-2024-1215-001'
        }
      ]);
      setServiceRequests([
        {
          id: 1,
          deviceType: 'EKG Cihazı - Nihon Kohden ECG-1550',
          urgency: 'urgent',
          description: 'Cihaz hatalı ölçüm yapıyor, acil kalibrasyon gerekiyor',
          status: 'assigned',
          createdAt: '2025-01-14',
          technician: 'Mehmet Demir'
        }
      ]);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-700 bg-green-100';
      case 'expiring': return 'text-yellow-700 bg-yellow-100';
      case 'expired': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return 'Geçerli';
      case 'expiring': return 'Yaklaşıyor';
      case 'expired': return 'Süresi Geçmiş';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expiring': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'expired': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Müşteri Paneli</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Hoş geldiniz, {user?.name}
              </p>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Geçerli</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => d.status === 'valid').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yaklaşan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => d.status === 'expiring').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Süresi Geçmiş</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => d.status === 'expired').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Cihaz</p>
                <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Cihaz Durumu</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni Servis Talebi
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.status)}
                        <span className="font-semibold text-gray-900">
                          {device.type} - {device.model}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device.status)}`}>
                          {getStatusText(device.status)}
                        </span>
                      </div>
                      {device.reportId && (
                        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          Rapor
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Seri No:</strong> {device.serialNo}</p>
                        <p><strong>Konum:</strong> {device.location}</p>
                      </div>
                      <div>
                        <p><strong>Son Kalibrasyon:</strong> {device.lastCalibration}</p>
                        <p><strong>Sonraki Kalibrasyon:</strong> {device.nextCalibration}</p>
                      </div>
                    </div>

                    {device.status === 'expired' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-medium">
                          ⚠️ Bu cihazın kalibrasyon süresi geçmiştir. Acil servis talebi oluşturun.
                        </p>
                      </div>
                    )}

                    {device.status === 'expiring' && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700 font-medium">
                          ⏰ Bu cihazın kalibrasyon süresi yaklaşıyor. Servis talebinde bulunmanız önerilir.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Servis Talepleri</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.urgency === 'urgent' 
                          ? 'text-red-700 bg-red-100' 
                          : 'text-blue-700 bg-blue-100'
                      }`}>
                        {request.urgency === 'urgent' ? 'ACİL' : 'NORMAL'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'completed' 
                          ? 'text-green-700 bg-green-100'
                          : request.status === 'assigned'
                          ? 'text-blue-700 bg-blue-100' 
                          : 'text-yellow-700 bg-yellow-100'
                      }`}>
                        {request.status === 'completed' && 'TAMAMLANDI'}
                        {request.status === 'assigned' && 'ATANDI'}
                        {request.status === 'pending' && 'BEKLEMEDE'}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{request.deviceType}</h4>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <p>Talep Tarihi: {request.createdAt}</p>
                      {request.technician && <p>Teknisyen: {request.technician}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/hospital/service-request" className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Yeni Servis Talebi</p>
              </Link>
              
              <button className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <Download className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Raporları İndir</p>
              </button>
              
              <button className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center">
                <Building className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Cihaz Yönetimi</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
