import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, CheckCircle, AlertTriangle, Plus, Activity, Settings } from 'lucide-react';

interface Task {
  id: number;
  deviceType: 'EKG' | 'Ventilatör';
  deviceModel: string;
  location: string;
  scheduledTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface RecentCalibration {
  id: number;
  deviceType: string;
  deviceModel: string;
  date: string;
  result: 'passed' | 'failed';
  reportId: string;
}

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [recentCalibrations, setRecentCalibrations] = useState<RecentCalibration[]>([]);

  useEffect(() => {
    if (user && user.token !== 'demo-token-technician') {
      const fetchTechnicianData = async () => {
        try {
          const headers = { 'Authorization': `Bearer ${user.token}` };

          const [planningsRes, calibrationsRes] = await Promise.all([
            fetch('http://localhost:5000/api/plannings', { headers }),
            fetch('http://localhost:5000/api/calibrations', { headers })
          ]);

          const plannings = planningsRes.ok ? await planningsRes.json() : [];
          const calibrations = calibrationsRes.ok ? await calibrationsRes.json() : [];

        const today = new Date().toISOString().split('T')[0];
        const tasks: Task[] = plannings
          .filter((p: any) => new Date(p.startDate).toISOString().split('T')[0] === today)
          .map((p: any) => ({
            id: p.id,
            deviceType: p.device.type,
            deviceModel: p.device.model,
            location: p.hospital.name,
            scheduledTime: new Date(p.startDate).toLocaleTimeString(),
            status: p.status,
            priority: 'medium' // Placeholder
          }));
        setTodayTasks(tasks);

        const recents: RecentCalibration[] = calibrations
          .slice(0, 3)
          .map((c: any) => ({
            id: c.id,
            deviceType: c.device.type,
            deviceModel: c.device.model,
            date: new Date(c.date).toLocaleDateString(),
            result: c.status === 'geçti' ? 'passed' : 'failed',
            reportId: `CAL-${new Date(c.date).getFullYear()}-${c.id}`
          }));
        setRecentCalibrations(recents);
        } catch (error) {
          console.error('Failed to fetch technician data:', error);
          // Set demo data as fallback
          setTodayTasks([
            {
              id: 1,
              deviceType: 'EKG',
              deviceModel: 'Nihon Kohden ECG-2550',
              location: 'İstanbul Şehir Hastanesi - Kardiyoloji',
              scheduledTime: '09:00',
              status: 'pending',
              priority: 'high'
            }
          ]);
        }
      };

      fetchTechnicianData();
    } else {
      // Demo data
      setTodayTasks([
        {
          id: 1,
          deviceType: 'EKG',
          deviceModel: 'Nihon Kohden ECG-2550',
          location: 'İstanbul Şehir Hastanesi - Kardiyoloji',
          scheduledTime: '09:00',
          status: 'pending',
          priority: 'high'
        }
      ]);
      setRecentCalibrations([
        {
          id: 1,
          deviceType: 'EKG',
          deviceModel: 'Nihon Kohden ECG-1550',
          date: '2025-01-14',
          result: 'passed',
          reportId: 'CAL-2025-0114-001'
        }
      ]);
    }
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
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
              <h1 className="text-2xl font-bold text-gray-900">Teknisyen Dashboard</h1>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugün</p>
                <p className="text-2xl font-bold text-gray-900">3 Görev</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold text-gray-900">24 Tamamlandı</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%97.2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
                <p className="text-2xl font-bold text-gray-900">45 dk</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Bugün Yapılacak Görevler</h2>
                <Link
                  to="/calibration/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Kalibrasyon
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(task.status)}
                          <span className="font-semibold text-gray-900">
                            {task.deviceType} - {task.deviceModel}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{task.location}</p>
                        <p className="text-sm text-gray-500">Saat: {task.scheduledTime}</p>
                      </div>
                      {task.status === 'pending' && (
                        <Link
                          to={`/calibration/start/${task.id}`}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          Başla
                        </Link>
                      )}
                      {task.status === 'in-progress' && (
                        <Link
                          to={`/calibration/continue/${task.id}`}
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors"
                        >
                          Devam Et
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Calibrations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Son Kalibrasyonlar</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCalibrations.map((cal) => (
                  <div key={cal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {cal.deviceType} - {cal.deviceModel}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            cal.result === 'passed' 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-red-700 bg-red-100'
                          }`}>
                            {cal.result === 'passed' ? 'GEÇTİ' : 'GEÇMEDİ'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{cal.date}</p>
                        <p className="text-sm text-gray-500">Rapor: {cal.reportId}</p>
                      </div>
                      <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                        Rapor İndir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HVAC Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">HVAC Raporları</h2>
                <Link
                  to="/reports/hvac"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Rapor
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          HVAC-2025-001
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100">
                          TAMAMLANDI
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">İstanbul Şehir Hastanesi</p>
                      <p className="text-sm text-gray-500">15 Ocak 2025</p>
                    </div>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                      Görüntüle
                    </button>
                  </div>
                </div>
                
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Daha fazla HVAC raporu için</p>
                  <Link 
                    to="/technician/reports" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Tüm Raporları Görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/calibration/new"
                className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center"
              >
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Yeni Kalibrasyon Başlat</p>
              </Link>
              
              <Link
                to="/technician/devices"
                className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center"
              >
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Cihaz Listesi</p>
              </Link>
              
              <Link
                to="/technician/reports"
                className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-colors text-center"
              >
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Raporlar</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
