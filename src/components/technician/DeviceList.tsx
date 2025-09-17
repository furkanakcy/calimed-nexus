import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Settings, Activity, Calendar, MapPin, Search, Filter } from 'lucide-react';

interface Device {
  id: number;
  serialNo: string;
  type: string;
  model: string;
  brand: string;
  hospital: {
    id: number;
    name: string;
    address?: string;
  };
  createdAt: string;
  lastCalibration?: string;
  nextCalibration?: string;
  status?: 'active' | 'maintenance' | 'inactive';
}

export default function DeviceList() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      if (user?.token && !user.token.startsWith('demo-token')) {
        const response = await fetch('http://localhost:5000/api/devices', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        }
      } else {
        // Demo data
        setDevices([
          {
            id: 1,
            serialNo: 'EKG-2025-001',
            type: 'EKG',
            model: 'ECG-2550',
            brand: 'Nihon Kohden',
            hospital: {
              id: 1,
              name: 'Demo Hastanesi',
              address: 'İstanbul, Türkiye'
            },
            createdAt: '2025-01-01',
            lastCalibration: '2024-12-15',
            nextCalibration: '2025-06-15',
            status: 'active'
          },
          {
            id: 2,
            serialNo: 'VENT-2025-001',
            type: 'Ventilatör',
            model: 'Evita V500',
            brand: 'Dräger',
            hospital: {
              id: 2,
              name: 'Acıbadem Maslak',
              address: 'Maslak, İstanbul'
            },
            createdAt: '2025-01-02',
            lastCalibration: '2024-11-20',
            nextCalibration: '2025-05-20',
            status: 'active'
          },
          {
            id: 3,
            serialNo: 'EKG-2025-002',
            type: 'EKG',
            model: 'MAC 1200',
            brand: 'GE Healthcare',
            hospital: {
              id: 1,
              name: 'Demo Hastanesi',
              address: 'İstanbul, Türkiye'
            },
            createdAt: '2025-01-03',
            lastCalibration: '2024-10-10',
            nextCalibration: '2025-04-10',
            status: 'maintenance'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'maintenance': return 'Bakımda';
      case 'inactive': return 'Pasif';
      default: return 'Bilinmiyor';
    }
  };

  const getCalibrationStatus = (nextCalibration?: string) => {
    if (!nextCalibration) return { status: 'unknown', text: 'Bilinmiyor', color: 'bg-gray-100 text-gray-800' };
    
    const nextDate = new Date(nextCalibration);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', text: 'Süresi Geçmiş', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 30) {
      return { status: 'expiring', text: `${diffDays} gün kaldı`, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'valid', text: 'Geçerli', color: 'bg-green-100 text-green-800' };
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || device.type === typeFilter;
    const matchesHospital = !hospitalFilter || device.hospital.name === hospitalFilter;
    
    return matchesSearch && matchesType && matchesHospital;
  });

  const uniqueTypes = [...new Set(devices.map(d => d.type))];
  const uniqueHospitals = [...new Set(devices.map(d => d.hospital.name))];

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
                <h1 className="text-2xl font-bold text-gray-900">Cihaz Listesi</h1>
                <p className="text-gray-600">Kalibrasyon yapılacak cihazları görüntüleyin</p>
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
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Cihaz</p>
                <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => d.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bakımda</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => d.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Süresi Yakın</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter(d => {
                    const calibStatus = getCalibrationStatus(d.nextCalibration);
                    return calibStatus.status === 'expiring' || calibStatus.status === 'expired';
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cihaz ara (seri no, model, marka, hastane...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Türler</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Hastaneler</option>
                {uniqueHospitals.map(hospital => (
                  <option key={hospital} value={hospital}>{hospital}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                  setHospitalFilter('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => {
            const calibStatus = getCalibrationStatus(device.nextCalibration);
            
            return (
              <div key={device.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Settings className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{device.type}</h3>
                        <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(device.status)}`}>
                      {getStatusText(device.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Seri No:</span>
                      <span>{device.serialNo}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{device.hospital.name}</span>
                    </div>
                    
                    {device.lastCalibration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Son: {new Date(device.lastCalibration).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                  </div>

                  {/* Calibration Status */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Kalibrasyon Durumu</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${calibStatus.color}`}>
                        {calibStatus.text}
                      </span>
                    </div>
                    {device.nextCalibration && (
                      <p className="text-xs text-gray-500">
                        Sonraki: {new Date(device.nextCalibration).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/calibration/new?deviceId=${device.id}`}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      Kalibrasyon Başlat
                    </Link>
                    <button className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Activity className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cihaz bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}