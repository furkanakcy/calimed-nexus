import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus, Calendar, Clock, User, Building, Settings } from 'lucide-react';

interface Task {
  id: number;
  planType: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  hospitalId?: number;
  deviceId?: number;
  assignedToId?: number;
  hospital?: { name: string };
  device?: { type: string; model: string };
  assignedTo?: { name: string };
}

interface Hospital {
  id: number;
  name: string;
}

interface Device {
  id: number;
  type: string;
  model: string;
  brand: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export default function TaskPlanning() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    planType: 'calibration',
    description: '',
    startDate: '',
    endDate: '',
    status: 'scheduled',
    hospitalId: '',
    deviceId: '',
    assignedToId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (user?.token && !user.token.startsWith('demo-token')) {
        const [tasksRes, hospitalsRes, devicesRes, usersRes] = await Promise.all([
          fetch('http://localhost:5000/api/plannings', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/hospitals', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/devices', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/users', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (hospitalsRes.ok) setHospitals(await hospitalsRes.json());
        if (devicesRes.ok) setDevices(await devicesRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } else {
        // Demo data
        setTasks([
          {
            id: 1,
            planType: 'calibration',
            description: 'EKG Cihazı Kalibrasyonu',
            startDate: '2025-02-10',
            endDate: '2025-02-10',
            status: 'scheduled',
            hospital: { name: 'Demo Hastanesi' },
            device: { type: 'EKG', model: 'ECG-2550' },
            assignedTo: { name: 'Demo Teknisyen' }
          },
          {
            id: 2,
            planType: 'maintenance',
            description: 'Ventilatör Bakımı',
            startDate: '2025-02-12',
            endDate: '2025-02-12',
            status: 'in_progress',
            hospital: { name: 'Acıbadem Maslak' },
            device: { type: 'Ventilatör', model: 'V500' },
            assignedTo: { name: 'Demo Teknisyen' }
          }
        ]);
        setHospitals([
          { id: 1, name: 'Demo Hastanesi' },
          { id: 2, name: 'Acıbadem Maslak' }
        ]);
        setDevices([
          { id: 1, type: 'EKG', model: 'ECG-2550', brand: 'Nihon Kohden' },
          { id: 2, type: 'Ventilatör', model: 'V500', brand: 'Dräger' }
        ]);
        setUsers([
          { id: 1, name: 'Demo Teknisyen', role: 'technician' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        hospitalId: newTask.hospitalId ? parseInt(newTask.hospitalId) : undefined,
        deviceId: newTask.deviceId ? parseInt(newTask.deviceId) : undefined,
        assignedToId: newTask.assignedToId ? parseInt(newTask.assignedToId) : undefined,
        startDate: new Date(newTask.startDate).toISOString(),
        endDate: new Date(newTask.endDate).toISOString()
      };

      if (user?.token && !user.token.startsWith('demo-token')) {
        const response = await fetch('http://localhost:5000/api/plannings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(taskData)
        });

        if (response.ok) {
          const createdTask = await response.json();
          setTasks([...tasks, createdTask]);
          setShowAddModal(false);
          setNewTask({
            planType: 'calibration',
            description: '',
            startDate: '',
            endDate: '',
            status: 'scheduled',
            hospitalId: '',
            deviceId: '',
            assignedToId: ''
          });
        } else {
          alert('Görev eklenirken hata oluştu');
        }
      } else {
        // Demo mode
        const demoTask = {
          id: tasks.length + 1,
          ...taskData,
          hospital: hospitals.find(h => h.id === parseInt(newTask.hospitalId)),
          device: devices.find(d => d.id === parseInt(newTask.deviceId)),
          assignedTo: users.find(u => u.id === parseInt(newTask.assignedToId))
        };
        setTasks([...tasks, demoTask]);
        setShowAddModal(false);
        setNewTask({
          planType: 'calibration',
          description: '',
          startDate: '',
          endDate: '',
          status: 'scheduled',
          hospitalId: '',
          deviceId: '',
          assignedToId: ''
        });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Görev eklenirken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getPlanTypeText = (type: string) => {
    switch (type) {
      case 'calibration': return 'Kalibrasyon';
      case 'maintenance': return 'Bakım';
      case 'service': return 'Servis';
      default: return type;
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
              <Link to="/dashboard/admin" className="text-gray-600 hover:text-blue-600 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Görev Planlama</h1>
                <p className="text-gray-600">Kalibrasyon ve bakım görevlerini planlayın</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Görev
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Görev</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Devam Eden</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planlanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Görev Listesi</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{task.description}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {getPlanTypeText(task.planType)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(task.startDate).toLocaleDateString('tr-TR')}
                      </div>
                      
                      {task.hospital && (
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {task.hospital.name}
                        </div>
                      )}
                      
                      {task.assignedTo && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {task.assignedTo.name}
                        </div>
                      )}
                    </div>

                    {task.device && (
                      <div className="mt-2 text-sm text-gray-600">
                        <Settings className="h-4 w-4 inline mr-2" />
                        {task.device.type} - {task.device.model}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Düzenle
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Yeni Görev Planla</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görev Türü
                </label>
                <select
                  value={newTask.planType}
                  onChange={(e) => setNewTask({ ...newTask, planType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="calibration">Kalibrasyon</option>
                  <option value="maintenance">Bakım</option>
                  <option value="service">Servis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  required
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Görev açıklaması"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.endDate}
                    onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hastane
                </label>
                <select
                  value={newTask.hospitalId}
                  onChange={(e) => setNewTask({ ...newTask, hospitalId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Hastane seçin</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cihaz
                </label>
                <select
                  value={newTask.deviceId}
                  onChange={(e) => setNewTask({ ...newTask, deviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Cihaz seçin</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.type} - {device.model} ({device.brand})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atanan Teknisyen
                </label>
                <select
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Teknisyen seçin</option>
                  {users.filter(u => u.role === 'technician').map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
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
                  Görev Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}