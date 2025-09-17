import React, { useState } from 'react';
import { Room, RoomTestData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  calculateDebit, 
  calculateAirChangeRate, 
  determineISOClass, 
  validatePressure,
  validateHEPA,
  validateRecoveryTime,
  validateTemperature,
  validateHumidity,
  validateParticleClass
} from '../../utils/calculations';

interface TestDataFormProps {
  rooms: Room[];
  testData: Record<string, RoomTestData>;
  onChange: (testData: Record<string, RoomTestData>) => void;
}

const airDirectionOptions = [
  { value: 'Temiz → Kirli', label: 'Temiz → Kirli' },
  { value: 'Kirli → Temiz', label: 'Kirli → Temiz' },
  { value: 'Paralel Akış', label: 'Paralel Akış' },
];

export const TestDataForm: React.FC<TestDataFormProps> = ({ rooms, testData, onChange }) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const activeRoom = rooms[activeRoomIndex];
  const activeTestData = testData[activeRoom?.id] || initializeTestData(activeRoom?.id || '');

  function initializeTestData(roomId: string): RoomTestData {
    return {
      roomId,
      airFlow: {
        velocity: 0,
        filterSizeX: 0,
        filterSizeY: 0,
        debit: 0,
        totalDebit: 0,
        airChangeRate: 0,
        minCriteria: 6,
      },
      pressure: {
        pressure: 0,
        referenceArea: '',
        isCompliant: false,
      },
      airDirection: {
        direction: 'Temiz → Kirli',
        result: 'Uygundur',
      },
      hepa: {
        leakage: 0,
        isCompliant: false,
      },
      particle: {
        particle05: [0, 0, 0, 0],
        particle50: [0, 0, 0, 0],
        average05: 0,
        average50: 0,
        isoClass: 'ISO 7',
        isCompliant: false,
      },
      recovery: {
        duration: 0,
        isCompliant: false,
      },
      tempHumidity: {
        temperature: 0,
        humidity: 0,
        tempCompliant: false,
        humidityCompliant: false,
      },
      noiseIllumination: {
        noise: 0,
        illumination: 0,
        noiseCompliant: false,
        illuminationCompliant: false,
      },
    };
  }

  const updateTestData = (field: string, value: any) => {
    const updatedData = { ...activeTestData };
    const fieldPath = field.split('.');
    
    if (fieldPath.length === 2) {
      const [section, prop] = fieldPath;
      (updatedData as any)[section] = {
        ...(updatedData as any)[section],
        [prop]: value,
      };
    }

    // Auto-calculations and validations
    if (field === 'airFlow.velocity' || field === 'airFlow.filterSizeX' || field === 'airFlow.filterSizeY') {
      updatedData.airFlow.debit = calculateDebit(
        updatedData.airFlow.velocity,
        updatedData.airFlow.filterSizeX,
        updatedData.airFlow.filterSizeY
      );
      updatedData.airFlow.airChangeRate = calculateAirChangeRate(
        updatedData.airFlow.totalDebit,
        activeRoom.volume
      );
    }

    if (field === 'airFlow.totalDebit') {
      updatedData.airFlow.airChangeRate = calculateAirChangeRate(
        updatedData.airFlow.totalDebit,
        activeRoom.volume
      );
    }

    if (field === 'pressure.pressure') {
      updatedData.pressure.isCompliant = validatePressure(updatedData.pressure.pressure);
    }

    if (field === 'hepa.leakage') {
      updatedData.hepa.isCompliant = validateHEPA(updatedData.hepa.leakage);
    }

    if (field === 'recovery.duration') {
      updatedData.recovery.isCompliant = validateRecoveryTime(updatedData.recovery.duration);
    }

    if (field === 'tempHumidity.temperature') {
      updatedData.tempHumidity.tempCompliant = validateTemperature(updatedData.tempHumidity.temperature);
    }

    if (field === 'tempHumidity.humidity') {
      updatedData.tempHumidity.humidityCompliant = validateHumidity(updatedData.tempHumidity.humidity);
    }

    // Particle calculations
    if (field.startsWith('particle.particle05') || field.startsWith('particle.particle50')) {
      updatedData.particle.average05 = updatedData.particle.particle05.reduce((a, b) => a + b, 0) / updatedData.particle.particle05.length;
      updatedData.particle.average50 = updatedData.particle.particle50.reduce((a, b) => a + b, 0) / updatedData.particle.particle50.length;
      updatedData.particle.isoClass = determineISOClass(updatedData.particle.average05);
      updatedData.particle.isCompliant = validateParticleClass(updatedData.particle.isoClass);
    }

    const newTestData = {
      ...testData,
      [activeRoom.id]: updatedData,
    };

    onChange(newTestData);
  };

  const updateParticleValue = (type: 'particle05' | 'particle50', index: number, value: number) => {
    const updatedData = { ...activeTestData };
    updatedData.particle[type][index] = value;
    
    updatedData.particle.average05 = updatedData.particle.particle05.reduce((a, b) => a + b, 0) / updatedData.particle.particle05.length;
    updatedData.particle.average50 = updatedData.particle.particle50.reduce((a, b) => a + b, 0) / updatedData.particle.particle50.length;
    updatedData.particle.isoClass = determineISOClass(updatedData.particle.average05);
    updatedData.particle.isCompliant = validateParticleClass(updatedData.particle.isoClass);

    const newTestData = {
      ...testData,
      [activeRoom.id]: updatedData,
    };

    onChange(newTestData);
  };

  if (!activeRoom) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Önce oda listesini tanımlayın</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Verileri Girişi</h2>
        <p className="text-gray-600">Her oda için test parametrelerini girin</p>
      </div>

      {/* Room Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {rooms.map((room, index) => (
          <Button
            key={room.id}
            variant={activeRoomIndex === index ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveRoomIndex(index)}
          >
            {room.roomName || `Oda ${index + 1}`}
          </Button>
        ))}
      </div>

      {/* Room Info Header */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Mahal No:</span>
            <div className="text-blue-900">{activeRoom.roomNo}</div>
          </div>
          <div>
            <span className="font-medium text-blue-700">Mahal Adı:</span>
            <div className="text-blue-900">{activeRoom.roomName}</div>
          </div>
          <div>
            <span className="font-medium text-blue-700">Alan:</span>
            <div className="text-blue-900">{activeRoom.surfaceArea} m²</div>
          </div>
          <div>
            <span className="font-medium text-blue-700">Hacim:</span>
            <div className="text-blue-900">{activeRoom.volume} m³</div>
          </div>
        </div>
      </div>

      {/* Test Forms */}
      <div className="space-y-8">
        {/* Air Flow Test */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
            Hava Debisi ve Hava Değişim Oranı
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Hız (m/s)"
              type="number"
              step="0.01"
              value={activeTestData.airFlow.velocity}
              onChange={(e) => updateTestData('airFlow.velocity', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Filtre Boyutu X (mm)"
              type="number"
              value={activeTestData.airFlow.filterSizeX}
              onChange={(e) => updateTestData('airFlow.filterSizeX', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Filtre Boyutu Y (mm)"
              type="number"
              value={activeTestData.airFlow.filterSizeY}
              onChange={(e) => updateTestData('airFlow.filterSizeY', parseFloat(e.target.value) || 0)}
            />
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Debi (m³/h)</label>
              <div className="text-lg font-semibold">{activeTestData.airFlow.debit}</div>
            </div>
            <Input
              label="Toplam Debi (m³/h)"
              type="number"
              step="0.01"
              value={activeTestData.airFlow.totalDebit}
              onChange={(e) => updateTestData('airFlow.totalDebit', parseFloat(e.target.value) || 0)}
            />
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Hava Değişim (1/h)</label>
              <div className="text-lg font-semibold">{activeTestData.airFlow.airChangeRate}</div>
            </div>
          </div>
        </div>

        {/* Pressure Test */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
            Basınç Farkı
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Basınç (Pa)"
              type="number"
              step="0.1"
              value={activeTestData.pressure.pressure}
              onChange={(e) => updateTestData('pressure.pressure', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Referans Alan"
              value={activeTestData.pressure.referenceArea}
              onChange={(e) => updateTestData('pressure.referenceArea', e.target.value)}
              placeholder="Koridor"
            />
            <div className={`p-3 rounded ${activeTestData.pressure.isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
              <label className="text-sm font-medium text-gray-600">Sonuç (≥6 Pa)</label>
              <div className={`text-lg font-semibold ${activeTestData.pressure.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {activeTestData.pressure.isCompliant ? 'Uygundur' : 'Uygun Değil'}
              </div>
            </div>
          </div>
        </div>

        {/* Air Direction */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
            Hava Akış Yönü
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Hava Akış Yönü"
              value={activeTestData.airDirection.direction}
              onChange={(e) => updateTestData('airDirection.direction', e.target.value)}
              options={airDirectionOptions}
            />
            <div className="bg-green-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Sonuç</label>
              <div className="text-lg font-semibold text-green-600">
                {activeTestData.airDirection.result}
              </div>
            </div>
          </div>
        </div>

        {/* HEPA Test */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">4</span>
            HEPA Filtre Sızdırmazlık Testi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Maksimum Sızıntı (%)"
              type="number"
              step="0.001"
              value={activeTestData.hepa.leakage}
              onChange={(e) => updateTestData('hepa.leakage', parseFloat(e.target.value) || 0)}
            />
            <div className={`p-3 rounded ${activeTestData.hepa.isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
              <label className="text-sm font-medium text-gray-600">Sonuç (≤0.01%)</label>
              <div className={`text-lg font-semibold ${activeTestData.hepa.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {activeTestData.hepa.isCompliant ? 'Uygundur' : 'Uygun Değil'}
              </div>
            </div>
          </div>
        </div>

        {/* Particle Test */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">5</span>
            Partikül Sayısı ve Temizlik Sınıfı
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">0.5 µm Partikül Değerleri</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {activeTestData.particle.particle05.map((value, index) => (
                  <Input
                    key={index}
                    label={`Nokta ${index + 1}`}
                    type="number"
                    value={value}
                    onChange={(e) => updateParticleValue('particle05', index, parseFloat(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5.0 µm Partikül Değerleri</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {activeTestData.particle.particle50.map((value, index) => (
                  <Input
                    key={index}
                    label={`Nokta ${index + 1}`}
                    type="number"
                    value={value}
                    onChange={(e) => updateParticleValue('particle50', index, parseFloat(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Ortalama (0.5 µm)</label>
                <div className="text-lg font-semibold">{activeTestData.particle.average05.toFixed(0)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">ISO Sınıfı</label>
                <div className="text-lg font-semibold">{activeTestData.particle.isoClass}</div>
              </div>
              <div className={`p-3 rounded ${activeTestData.particle.isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
                <label className="text-sm font-medium text-gray-600">Sonuç</label>
                <div className={`text-lg font-semibold ${activeTestData.particle.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                  {activeTestData.particle.isCompliant ? 'Uygundur' : 'Uygun Değil'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Test */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">6</span>
            Dekontaminasyon / Geri Kazanım Süresi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Süre (dakika)"
              type="number"
              step="0.1"
              value={activeTestData.recovery.duration}
              onChange={(e) => updateTestData('recovery.duration', parseFloat(e.target.value) || 0)}
            />
            <div className={`p-3 rounded ${activeTestData.recovery.isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
              <label className="text-sm font-medium text-gray-600">Sonuç (≤25 dk)</label>
              <div className={`text-lg font-semibold ${activeTestData.recovery.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {activeTestData.recovery.isCompliant ? 'Uygundur' : 'Uygun Değil'}
              </div>
            </div>
          </div>
        </div>

        {/* Temperature & Humidity */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">7</span>
            Sıcaklık ve Nem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Sıcaklık (°C)"
              type="number"
              step="0.1"
              value={activeTestData.tempHumidity.temperature}
              onChange={(e) => updateTestData('tempHumidity.temperature', parseFloat(e.target.value) || 0)}
            />
            <div className={`p-3 rounded ${activeTestData.tempHumidity.tempCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
              <label className="text-sm font-medium text-gray-600">Sıcaklık (20-24°C)</label>
              <div className={`text-lg font-semibold ${activeTestData.tempHumidity.tempCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {activeTestData.tempHumidity.tempCompliant ? 'Uygundur' : 'Uygun Değil'}
              </div>
            </div>
            <Input
              label="Nem (%)"
              type="number"
              step="0.1"
              value={activeTestData.tempHumidity.humidity}
              onChange={(e) => updateTestData('tempHumidity.humidity', parseFloat(e.target.value) || 0)}
            />
            <div className={`p-3 rounded ${activeTestData.tempHumidity.humidityCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
              <label className="text-sm font-medium text-gray-600">Nem (40-60%)</label>
              <div className={`text-lg font-semibold ${activeTestData.tempHumidity.humidityCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {activeTestData.tempHumidity.humidityCompliant ? 'Uygundur' : 'Uygun Değil'}
              </div>
            </div>
          </div>
        </div>

        {/* Noise & Illumination (Optional) */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">8</span>
            Gürültü ve Aydınlatma (İsteğe Bağlı)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Gürültü (dB)"
              type="number"
              step="0.1"
              value={activeTestData.noiseIllumination?.noise || ''}
              onChange={(e) => updateTestData('noiseIllumination.noise', parseFloat(e.target.value) || 0)}
            />
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Gürültü Sonuç</label>
              <div className="text-lg font-semibold text-gray-600">-</div>
            </div>
            <Input
              label="Aydınlatma (Lux)"
              type="number"
              step="1"
              value={activeTestData.noiseIllumination?.illumination || ''}
              onChange={(e) => updateTestData('noiseIllumination.illumination', parseFloat(e.target.value) || 0)}
            />
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Aydınlatma Sonuç</label>
              <div className="text-lg font-semibold text-gray-600">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};