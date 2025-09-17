import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateExcelReport, generatePdfReport } from '../../utils/reportGenerator';
import { GeneralInfo, Room, RoomTestData, ReportData, FormStep } from '../../types/report';
import { useAuth } from '../../contexts/AuthContext';
import HospitalSelector from '../common/HospitalSelector';
import { Building2, ArrowLeft, ArrowRight, Download, FileSpreadsheet, Save, Plus, Trash2 } from 'lucide-react';

const ProgressBar: React.FC<{ currentStep: FormStep }> = ({ currentStep }) => {
  const steps = [
    { key: 'general', label: 'Genel Bilgiler' },
    { key: 'rooms', label: 'Mahal Listesi' },
    { key: 'tests', label: 'Test Verileri' },
    { key: 'preview', label: 'Önizleme' },
    { key: 'download', label: 'İndir' }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm ${index <= currentIndex ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HVACReportGenerator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reportPreviewRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('general');
  const [isSaving, setIsSaving] = useState(false);

  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    hospitalName: '',
    reportNo: '',
    measurementDate: '',
    testerName: user?.name || '',
    preparedBy: user?.name || '',
    approvedBy: '',
    organizationName: '',
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [testData, setTestData] = useState<Record<string, RoomTestData>>({});

  const reportData: ReportData = {
    generalInfo,
    rooms,
    testData,
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'general':
        setCurrentStep('rooms');
        break;
      case 'rooms':
        setCurrentStep('tests');
        break;
      case 'tests':
        setCurrentStep('preview');
        break;
      case 'preview':
        setCurrentStep('download');
        break;
    }
  };

  const handlePrev = () => {
    switch (currentStep) {
      case 'rooms':
        setCurrentStep('general');
        break;
      case 'tests':
        setCurrentStep('rooms');
        break;
      case 'preview':
        setCurrentStep('tests');
        break;
      case 'download':
        setCurrentStep('preview');
        break;
    }
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      roomNo: '',
      roomName: '',
      surfaceArea: 0,
      height: 0,
      volume: 0,
      testMode: 'At Rest',
      flowType: 'Turbulence',
      roomClass: 'ISO 7'
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    const newTestData = { ...testData };
    delete newTestData[roomId];
    setTestData(newTestData);
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? { ...room, ...updates, volume: updates.surfaceArea && updates.height ? updates.surfaceArea * updates.height : room.volume }
        : room
    ));
  };

  const saveToDatabase = async () => {
    if (!user?.token) {
      alert('Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    if (!selectedHospitalId) {
      alert('Lütfen hastane seçimi yapın.');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving to database...', { generalInfo, rooms, testData, hospitalId: selectedHospitalId });

      // For demo users, save to localStorage
      if (user.token.startsWith('demo-token')) {
        const hvacReport = {
          id: Date.now(),
          hospitalId: selectedHospitalId,
          hospitalName: generalInfo.hospitalName,
          reportNo: generalInfo.reportNo,
          measurementDate: generalInfo.measurementDate,
          testerName: generalInfo.testerName,
          preparedBy: generalInfo.preparedBy,
          approvedBy: generalInfo.approvedBy,
          organizationName: generalInfo.organizationName,
          rooms: rooms.map(room => ({
            ...room,
            testData: testData[room.id] || null
          })),
          createdAt: new Date().toISOString()
        };

        // Get existing reports from localStorage
        const existingReports = localStorage.getItem('hvac-reports');
        const reports = existingReports ? JSON.parse(existingReports) : [];
        reports.push(hvacReport);
        localStorage.setItem('hvac-reports', JSON.stringify(reports));

        alert('Rapor başarıyla kaydedildi!');
        navigate('/dashboard/technician');
        return;
      }

      const response = await fetch('http://localhost:5000/api/hvac-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          generalInfo,
          rooms,
          testData,
          hospitalId: selectedHospitalId
        })
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (response.ok) {
        alert('Rapor başarıyla kaydedildi!');
        navigate('/dashboard/technician');
      } else {
        console.error('Server error:', responseData);
        alert(`Rapor kaydedilirken hata oluştu: ${responseData.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Rapor kaydedilirken hata oluştu: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      await generateExcelReport(generalInfo, rooms, testData);
    } else if (format === 'pdf' && reportPreviewRef.current) {
      await generatePdfReport(reportPreviewRef.current, generalInfo, rooms);
    }
  };

  const handleHospitalChange = (hospitalId: number, hospitalName: string) => {
    setSelectedHospitalId(hospitalId);
    setGeneralInfo({ ...generalInfo, hospitalName });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'general':
        return selectedHospitalId && generalInfo.reportNo && generalInfo.measurementDate &&
          generalInfo.testerName && generalInfo.preparedBy && generalInfo.approvedBy &&
          generalInfo.organizationName;
      case 'rooms':
        return rooms.length > 0 && rooms.every(room =>
          room.roomNo && room.roomName && room.surfaceArea > 0 && room.height > 0
        );
      case 'tests':
        return rooms.length > 0 && rooms.every(room => {
          const data = testData[room.id];
          return data && data.pressure && data.hepa && data.particle && data.recovery && data.tempHumidity && data.airDirection;
        });
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                HVAC Performans Niteleme Test Raporu
              </h1>
              <p className="text-sm text-gray-600">
                ISO 14644-1, DIN 1946-4, IEST-RP-CC006.3 standartlarına uygun rapor üretimi
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressBar currentStep={currentStep} />

        <div className="mb-8">
          {currentStep === 'general' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Genel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HospitalSelector
                  selectedHospitalId={selectedHospitalId}
                  onHospitalChange={handleHospitalChange}
                  required={true}
                  className="md:col-span-2"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firma Logosu
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setGeneralInfo({ ...generalInfo, logo: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {generalInfo.logo && (
                    <div className="mt-2">
                      <img src={generalInfo.logo} alt="Logo" className="h-16 w-auto border rounded" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rapor No
                  </label>
                  <input
                    type="text"
                    value={generalInfo.reportNo}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, reportNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ölçüm Tarihi
                  </label>
                  <input
                    type="date"
                    value={generalInfo.measurementDate}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, measurementDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testi Yapan
                  </label>
                  <input
                    type="text"
                    value={generalInfo.testerName}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, testerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raporu Hazırlayan
                  </label>
                  <input
                    type="text"
                    value={generalInfo.preparedBy}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, preparedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onaylayan
                  </label>
                  <input
                    type="text"
                    value={generalInfo.approvedBy}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, approvedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizasyon Adı
                  </label>
                  <input
                    type="text"
                    value={generalInfo.organizationName}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, organizationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'rooms' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mahal Listesi</h2>
                <button
                  onClick={addRoom}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Mahal Ekle
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz mahal eklenmemiş. Yukarıdaki butona tıklayarak mahal ekleyin.
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room, index) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Mahal {index + 1}</h3>
                        <button
                          onClick={() => removeRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mahal No
                          </label>
                          <input
                            type="text"
                            value={room.roomNo}
                            onChange={(e) => updateRoom(room.id, { roomNo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mahal Adı
                          </label>
                          <input
                            type="text"
                            value={room.roomName}
                            onChange={(e) => updateRoom(room.id, { roomName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Yüzey Alanı (m²)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={room.surfaceArea}
                            onChange={(e) => updateRoom(room.id, { surfaceArea: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Yükseklik (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={room.height}
                            onChange={(e) => updateRoom(room.id, { height: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Modu
                          </label>
                          <select
                            value={room.testMode}
                            onChange={(e) => updateRoom(room.id, { testMode: e.target.value as 'At Rest' | 'In Operation' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="At Rest">At Rest</option>
                            <option value="In Operation">In Operation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Akış Tipi
                          </label>
                          <select
                            value={room.flowType}
                            onChange={(e) => updateRoom(room.id, { flowType: e.target.value as 'Turbulence' | 'Laminar' | 'Unidirectional' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Turbulence">Turbulence</option>
                            <option value="Laminar">Laminar</option>
                            <option value="Unidirectional">Unidirectional</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          Hacim: {(room.surfaceArea * room.height).toFixed(2)} m³
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 'tests' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Test Verileri</h2>

              {rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Önce mahal eklemeniz gerekiyor.
                </div>
              ) : (
                <div className="space-y-6">
                  {rooms.map((room, index) => (
                    <div key={room.id} className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 text-blue-900">
                        {room.roomName} (Mahal {index + 1})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Hava Debisi Testi */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Hava Debisi Testi</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Hız (m/s)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.45"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    airFlow: {
                                      ...prev[room.id]?.airFlow,
                                      velocity: value,
                                      filterSizeX: prev[room.id]?.airFlow?.filterSizeX || 610,
                                      filterSizeY: prev[room.id]?.airFlow?.filterSizeY || 610,
                                      debit: value * 0.61 * 0.61 * 3600,
                                      totalDebit: prev[room.id]?.airFlow?.totalDebit || 1000,
                                      airChangeRate: (prev[room.id]?.airFlow?.totalDebit || 1000) / room.volume,
                                      minCriteria: 20
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Toplam Debi (m³/h)</label>
                            <input
                              type="number"
                              placeholder="1000"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    airFlow: {
                                      ...prev[room.id]?.airFlow,
                                      velocity: prev[room.id]?.airFlow?.velocity || 0.45,
                                      filterSizeX: 610,
                                      filterSizeY: 610,
                                      debit: (prev[room.id]?.airFlow?.velocity || 0.45) * 0.61 * 0.61 * 3600,
                                      totalDebit: value,
                                      airChangeRate: value / room.volume,
                                      minCriteria: 20
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Basınç Testi */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Basınç Testi</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Basınç (Pa)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="12.5"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    pressure: {
                                      pressure: value,
                                      referenceArea: "Koridor",
                                      isCompliant: value >= 6
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Referans Alan</label>
                            <input
                              type="text"
                              placeholder="Koridor"
                              onChange={(e) => {
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    pressure: {
                                      ...prev[room.id]?.pressure,
                                      pressure: prev[room.id]?.pressure?.pressure || 0,
                                      referenceArea: e.target.value,
                                      isCompliant: (prev[room.id]?.pressure?.pressure || 0) >= 6
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* HEPA Testi */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">HEPA Sızdırmazlık</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Sızıntı (%)</label>
                            <input
                              type="number"
                              step="0.001"
                              placeholder="0.005"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    hepa: {
                                      leakage: value,
                                      isCompliant: value <= 0.01
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Partikül Testi */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Partikül Testi</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Ortalama 0.5µm</label>
                            <input
                              type="number"
                              placeholder="2500"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                let isoClass = 'ISO 9+';
                                if (value <= 3520) isoClass = 'ISO 7';
                                else if (value <= 35200) isoClass = 'ISO 8';
                                else if (value <= 352000) isoClass = 'ISO 9';

                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    particle: {
                                      particle05: [value, value, value],
                                      particle50: [0, 0, 0],
                                      average05: value,
                                      average50: 0,
                                      isoClass: isoClass,
                                      isCompliant: value <= 3520
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Recovery Time */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Recovery Time</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Süre (dakika)</label>
                            <input
                              type="number"
                              placeholder="15"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    recovery: {
                                      duration: value,
                                      isCompliant: value <= 25
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Sıcaklık ve Nem */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Sıcaklık ve Nem</h4>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Sıcaklık (°C)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="22.5"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    tempHumidity: {
                                      ...prev[room.id]?.tempHumidity,
                                      temperature: value,
                                      humidity: prev[room.id]?.tempHumidity?.humidity || 50,
                                      tempCompliant: value >= 20 && value <= 24,
                                      humidityCompliant: (prev[room.id]?.tempHumidity?.humidity || 50) >= 40 && (prev[room.id]?.tempHumidity?.humidity || 50) <= 60
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Nem (%)</label>
                            <input
                              type="number"
                              placeholder="50"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    tempHumidity: {
                                      ...prev[room.id]?.tempHumidity,
                                      temperature: prev[room.id]?.tempHumidity?.temperature || 22,
                                      humidity: value,
                                      tempCompliant: (prev[room.id]?.tempHumidity?.temperature || 22) >= 20 && (prev[room.id]?.tempHumidity?.temperature || 22) <= 24,
                                      humidityCompliant: value >= 40 && value <= 60
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hava Akış Yönü */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-3">Hava Akış Yönü</h4>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`airDirection-${room.id}`}
                              value="Uygundur"
                              onChange={(e) => {
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    airDirection: {
                                      direction: "Temiz→Kirli",
                                      result: e.target.value as 'Uygundur' | 'Uygun Değil'
                                    }
                                  }
                                }));
                              }}
                              className="mr-2"
                            />
                            Uygundur
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`airDirection-${room.id}`}
                              value="Uygun Değil"
                              onChange={(e) => {
                                setTestData(prev => ({
                                  ...prev,
                                  [room.id]: {
                                    ...prev[room.id],
                                    roomId: room.id,
                                    airDirection: {
                                      direction: "Temiz→Kirli",
                                      result: e.target.value as 'Uygundur' | 'Uygun Değil'
                                    }
                                  }
                                }));
                              }}
                              className="mr-2"
                            />
                            Uygun Değil
                          </label>
                        </div>
                      </div>

                      {/* Test Sonuçları Özeti */}
                      {testData[room.id] && (
                        <div className="mt-4 pt-4 border-t bg-gray-50 rounded p-3">
                          <h5 className="font-medium text-gray-900 mb-2">Test Sonuçları Özeti</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            {testData[room.id].pressure && (
                              <div className={`px-2 py-1 rounded ${testData[room.id].pressure.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Basınç: {testData[room.id].pressure.isCompliant ? 'GEÇTİ' : 'GEÇMEDİ'}
                              </div>
                            )}
                            {testData[room.id].hepa && (
                              <div className={`px-2 py-1 rounded ${testData[room.id].hepa.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                HEPA: {testData[room.id].hepa.isCompliant ? 'GEÇTİ' : 'GEÇMEDİ'}
                              </div>
                            )}
                            {testData[room.id].particle && (
                              <div className={`px-2 py-1 rounded ${testData[room.id].particle.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Partikül: {testData[room.id].particle.isCompliant ? 'GEÇTİ' : 'GEÇMEDİ'}
                              </div>
                            )}
                            {testData[room.id].recovery && (
                              <div className={`px-2 py-1 rounded ${testData[room.id].recovery.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Recovery: {testData[room.id].recovery.isCompliant ? 'GEÇTİ' : 'GEÇMEDİ'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Rapor Önizleme</h2>

              <div ref={reportPreviewRef} className="border rounded-lg p-6 bg-white">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    HVAC PERFORMANS NİTELEME TEST RAPORU
                  </h1>
                  <p className="text-gray-600">
                    ISO 14644-1, DIN 1946-4, IEST-RP-CC006.3 Standartlarına Uygun
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p><strong>Hastane:</strong> {generalInfo.hospitalName}</p>
                    <p><strong>Rapor No:</strong> {generalInfo.reportNo}</p>
                    <p><strong>Ölçüm Tarihi:</strong> {generalInfo.measurementDate}</p>
                  </div>
                  <div>
                    <p><strong>Test Yapan:</strong> {generalInfo.testerName}</p>
                    <p><strong>Hazırlayan:</strong> {generalInfo.preparedBy}</p>
                    <p><strong>Onaylayan:</strong> {generalInfo.approvedBy}</p>
                  </div>
                </div>

                {rooms.map((room, index) => (
                  <div key={room.id} className="mb-8 border-b pb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Mahal {index + 1}: {room.roomName}
                    </h3>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <p><strong>Mahal No:</strong> {room.roomNo}</p>
                      <p><strong>Yüzey Alanı:</strong> {room.surfaceArea} m²</p>
                      <p><strong>Yükseklik:</strong> {room.height} m</p>
                      <p><strong>Hacim:</strong> {room.volume} m³</p>
                      <p><strong>Test Modu:</strong> {room.testMode}</p>
                      <p><strong>Akış Tipi:</strong> {room.flowType}</p>
                    </div>

                    {testData[room.id] && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-3 py-2 text-left">Test Adı</th>
                              <th className="border border-gray-300 px-3 py-2 text-left">Kriter</th>
                              <th className="border border-gray-300 px-3 py-2 text-left">Sonuç</th>
                              <th className="border border-gray-300 px-3 py-2 text-left">Durum</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testData[room.id].pressure && (
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">Basınç Farkı</td>
                                <td className="border border-gray-300 px-3 py-2">≥ 6 Pa</td>
                                <td className="border border-gray-300 px-3 py-2">{testData[room.id].pressure.pressure} Pa</td>
                                <td className={`border border-gray-300 px-3 py-2 ${testData[room.id].pressure.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                                  {testData[room.id].pressure.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                                </td>
                              </tr>
                            )}
                            {testData[room.id].hepa && (
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">HEPA Sızdırmazlık</td>
                                <td className="border border-gray-300 px-3 py-2">≤ %0.01</td>
                                <td className="border border-gray-300 px-3 py-2">{testData[room.id].hepa.leakage}%</td>
                                <td className={`border border-gray-300 px-3 py-2 ${testData[room.id].hepa.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                                  {testData[room.id].hepa.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                                </td>
                              </tr>
                            )}
                            {testData[room.id].particle && (
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">Partikül Sayısı (0.5 µm)</td>
                                <td className="border border-gray-300 px-3 py-2">ISO 7</td>
                                <td className="border border-gray-300 px-3 py-2">{testData[room.id].particle.isoClass}</td>
                                <td className={`border border-gray-300 px-3 py-2 ${testData[room.id].particle.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                                  {testData[room.id].particle.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'download' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Raporu Kaydet ve İndir</h2>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Veritabanına Kaydet</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Raporu veritabanına kaydettiğinizde, firmanızın tüm yetkili kullanıcıları bu raporu görüntüleyebilir.
                </p>
                <button
                  onClick={saveToDatabase}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Kaydediliyor...' : 'Veritabanına Kaydet'}
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Dosya Olarak İndir</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDownload('excel')}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Excel Olarak İndir
                  </button>
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    PDF Olarak İndir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {currentStep !== 'general' && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
            )}
          </div>

          <div>
            {currentStep !== 'download' && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                İleri
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}