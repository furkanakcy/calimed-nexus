import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Bluetooth, Usb, Activity, FileText } from 'lucide-react';

type DeviceType = 'ekg' | 'ventilator';
type WizardStep = 'device' | 'connection' | 'testing' | 'results' | 'report';

interface DeviceOption {
  id: string;
  name: string;
  model: string;
  description: string;
}

const EKG_DEVICES: DeviceOption[] = [
  { id: 'nihon-ekg-2550', name: 'Nihon Kohden', model: 'ECG-2550', description: '12 kanallı EKG cihazı' },
  { id: 'ge-mac-1200', name: 'GE Healthcare', model: 'MAC 1200', description: '12 kanallı taşınabilir EKG' },
  { id: 'philips-pagewriter', name: 'Philips', model: 'PageWriter TC70', description: 'Dokunmatik ekran EKG' }
];

const VENTILATOR_DEVICES: DeviceOption[] = [
  { id: 'drager-evita-v500', name: 'Dräger', model: 'Evita V500', description: 'Yoğun bakım ventilatörü' },
  { id: 'drager-infinity', name: 'Dräger', model: 'Evita Infinity', description: 'Akıllı ventilatör sistemi' },
  { id: 'hamilton-g5', name: 'Hamilton', model: 'HAMILTON-G5', description: 'Adaptif ventilatör' }
];

export default function CalibrationWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('device');
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceOption | null>(null);
  const [connectionType, setConnectionType] = useState<'bluetooth' | 'usb' | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTestingComplete, setIsTestingComplete] = useState(false);

  const steps: { id: WizardStep; title: string; description: string }[] = [
    { id: 'device', title: 'Cihaz Seçimi', description: 'Kalibre edilecek cihazı seçin' },
    { id: 'connection', title: 'Bağlantı Kurma', description: 'Cihaza bağlanın' },
    { id: 'testing', title: 'Test Gerçekleştirme', description: 'Kalibrasyon testlerini çalıştırın' },
    { id: 'results', title: 'Sonuçları İnceleme', description: 'Test sonuçlarını kontrol edin' },
    { id: 'report', title: 'Rapor Oluşturma', description: 'ISO uyumlu rapor hazırlayın' }
  ];

  const handleDeviceTypeSelect = (type: DeviceType) => {
    setDeviceType(type);
    setSelectedDevice(null);
  };

  const handleDeviceSelect = (device: DeviceOption) => {
    setSelectedDevice(device);
  };

  const handleConnectionStart = async (type: 'bluetooth' | 'usb') => {
    setConnectionType(type);
    setIsConnected(false);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  };

  const handleTestStart = async () => {
    setIsTestingComplete(false);
    
    // Simulate testing process
    setTimeout(() => {
      const mockResults = {
        ekg: {
          leadII: { measured: 0.98, expected: 1.0, passed: true },
          leadV1: { measured: 1.02, expected: 1.0, passed: true },
          heartRate: { measured: 75, expected: 75, passed: true }
        },
        ventilator: {
          pressure: { measured: 19.8, expected: 20.0, passed: true },
          volume: { measured: 498, expected: 500, passed: true },
          flow: { measured: 29.5, expected: 30.0, passed: true }
        }
      };
      
      setTestResults(deviceType === 'ekg' ? mockResults.ekg : mockResults.ventilator);
      setIsTestingComplete(true);
    }, 5000);
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'device': return selectedDevice !== null;
      case 'connection': return isConnected;
      case 'testing': return isTestingComplete;
      case 'results': return testResults !== null;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard/teknisyen" className="text-gray-600 hover:text-blue-600 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Kalibrasyon Sihirbazı</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <p className="text-gray-600">
              {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-8 min-h-96">
          {currentStep === 'device' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Cihaz Türü ve Model Seçimi</h3>
              
              {/* Device Type Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => handleDeviceTypeSelect('ekg')}
                  className={`p-6 rounded-lg border-2 transition-colors ${
                    deviceType === 'ekg' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Activity className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <h4 className="text-lg font-semibold mb-2">EKG Cihazı</h4>
                  <p className="text-gray-600">Elektrokardiyografi cihazları</p>
                </button>

                <button
                  onClick={() => handleDeviceTypeSelect('ventilator')}
                  className={`p-6 rounded-lg border-2 transition-colors ${
                    deviceType === 'ventilator' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Activity className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="text-lg font-semibold mb-2">Ventilatör</h4>
                  <p className="text-gray-600">Mekanik ventilasyon cihazları</p>
                </button>
              </div>

              {/* Device Model Selection */}
              {deviceType && (
                <div>
                  <h4 className="text-md font-semibold mb-4">
                    {deviceType === 'ekg' ? 'EKG' : 'Ventilatör'} Modeli Seçin:
                  </h4>
                  <div className="space-y-3">
                    {(deviceType === 'ekg' ? EKG_DEVICES : VENTILATOR_DEVICES).map((device) => (
                      <button
                        key={device.id}
                        onClick={() => handleDeviceSelect(device)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          selectedDevice?.id === device.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold">{device.name} {device.model}</h5>
                            <p className="text-sm text-gray-600">{device.description}</p>
                          </div>
                          {selectedDevice?.id === device.id && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'connection' && selectedDevice && (
            <div>
              <h3 className="text-lg font-semibold mb-6">
                {selectedDevice.name} {selectedDevice.model} - Bağlantı Kurma
              </h3>
              
              {!connectionType && (
                <div>
                  <p className="text-gray-600 mb-6">
                    Kalibrasyonu başlatmak için cihaza bağlanmanız gerekiyor. 
                    Bağlantı türünü seçin:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => handleConnectionStart('bluetooth')}
                      className="p-6 rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-colors"
                    >
                      <Bluetooth className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <h4 className="text-lg font-semibold mb-2">Bluetooth</h4>
                      <p className="text-gray-600">Kablosuz bağlantı</p>
                    </button>

                    <button
                      onClick={() => handleConnectionStart('usb')}
                      className="p-6 rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-colors"
                    >
                      <Usb className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h4 className="text-lg font-semibold mb-2">USB</h4>
                      <p className="text-gray-600">Kablolu bağlantı</p>
                    </button>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold mb-4 text-center text-gray-700">
                      Alternatif Seçenek
                    </h4>
                    <Link
                      to="/reports/hvac"
                      className="block p-6 rounded-lg border-2 border-orange-300 hover:border-orange-400 transition-colors bg-orange-50"
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                      <h4 className="text-lg font-semibold mb-2 text-center">Manuel Rapor Oluştur</h4>
                      <p className="text-gray-600 text-center">
                        HVAC performans test raporu manuel olarak oluşturun
                      </p>
                    </Link>
                  </div>
                </div>
              )}

              {connectionType && !isConnected && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Cihaza Bağlanılıyor...</p>
                  <p className="text-gray-600 mt-2">
                    {connectionType === 'bluetooth' ? 'Bluetooth' : 'USB'} üzerinden bağlantı kuruluyor
                  </p>
                </div>
              )}

              {isConnected && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Bağlantı Başarılı!</p>
                  <p className="text-gray-600 mt-2">
                    {selectedDevice.name} {selectedDevice.model} cihazına başarıyla bağlandınız.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'testing' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Kalibrasyon Testi</h3>
              
              {!isTestingComplete && !testResults && (
                <div className="text-center py-8">
                  <button
                    onClick={handleTestStart}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Testi Başlat
                  </button>
                  <p className="text-gray-600 mt-4">
                    Test yaklaşık 3-5 dakika sürecektir
                  </p>
                </div>
              )}

              {testResults && !isTestingComplete && (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <Activity className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">Test Devam Ediyor...</p>
                  <p className="text-gray-600 mt-2">
                    {deviceType === 'ekg' ? 'EKG sinyalleri' : 'Ventilatör parametreleri'} ölçülüyor
                  </p>
                </div>
              )}

              {isTestingComplete && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Test Tamamlandı!</p>
                  <p className="text-gray-600 mt-2">
                    Tüm testler başarıyla tamamlandı. Sonuçları incelemek için ilerleyin.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'results' && testResults && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Test Sonuçları</h3>
              
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Ölçülen: {result.measured} | Beklenen: {result.expected}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.passed ? 'GEÇTİ' : 'GEÇMEDİ'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-900">Kalibrasyon Başarılı</h4>
                    <p className="text-green-700">
                      Tüm parametreler tolerans değerleri içinde ölçüldü.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'report' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Rapor Oluşturma</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <FileText className="h-8 w-8 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">ISO 17025 Uyumlu Rapor</h4>
                    <p className="text-blue-700 mb-4">
                      Kalibrasyon raporu otomatik olarak oluşturulacak ve dijital imza ile 
                      güvence altına alınacaktır.
                    </p>
                    
                    <div className="space-y-2 text-sm text-blue-600">
                      <p>✓ Cihaz bilgileri ve seri numarası</p>
                      <p>✓ Ortam koşulları (sıcaklık, nem)</p>
                      <p>✓ Test sonuçları ve tolerans değerleri</p>
                      <p>✓ Elektronik imza ve zaman damgası</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    alert('Rapor oluşturuluyor ve PDF olarak kaydediliyor...');
                    navigate('/dashboard/teknisyen');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Rapor Oluştur ve Bitir
                </button>
                
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  E-posta ile Gönder
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 'device'}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Önceki
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed() || currentStep === 'report'}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}