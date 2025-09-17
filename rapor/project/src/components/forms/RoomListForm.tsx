import React from 'react';
import { Room } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { calculateVolume } from '../../utils/calculations';

interface RoomListFormProps {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
}

const testModeOptions = [
  { value: 'At Rest', label: 'At Rest' },
  { value: 'In Operation', label: 'In Operation' },
];

const flowTypeOptions = [
  { value: 'Turbulence', label: 'Turbulence' },
  { value: 'Laminar', label: 'Laminar' },
  { value: 'Unidirectional', label: 'Unidirectional' },
];

const roomClassOptions = [
  { value: 'Sınıf IB', label: 'Sınıf IB' },
  { value: 'Sınıf II', label: 'Sınıf II' },
  { value: 'Yoğun Bakım', label: 'Yoğun Bakım' },
  { value: 'Ameliyathane', label: 'Ameliyathane' },
  { value: 'Steril Depo', label: 'Steril Depo' },
];

export const RoomListForm: React.FC<RoomListFormProps> = ({ rooms, onChange }) => {
  const addRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNo: `000${rooms.length + 1}`,
      roomName: '',
      surfaceArea: 0,
      height: 0,
      volume: 0,
      testMode: 'At Rest',
      flowType: 'Turbulence',
      roomClass: 'Sınıf II',
    };
    onChange([...rooms, newRoom]);
  };

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value,
    };

    // Auto-calculate volume when area or height changes
    if (field === 'surfaceArea' || field === 'height') {
      updatedRooms[index].volume = calculateVolume(
        updatedRooms[index].surfaceArea,
        updatedRooms[index].height
      );
    }

    onChange(updatedRooms);
  };

  const removeRoom = (index: number) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    onChange(updatedRooms);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mahal (Oda) Listesi</h2>
        <p className="text-gray-600">Test edilecek odaları tanımlayın</p>
      </div>

      <div className="space-y-6">
        {rooms.map((room, index) => (
          <div key={room.id} className="bg-gray-50 rounded-lg p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Oda {index + 1}
              </h3>
              {rooms.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoom(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Mahal No *"
                value={room.roomNo}
                onChange={(e) => updateRoom(index, 'roomNo', e.target.value)}
                placeholder="0001"
              />

              <Input
                label="Mahal Adı *"
                value={room.roomName}
                onChange={(e) => updateRoom(index, 'roomName', e.target.value)}
                placeholder="Ameliyathane 1"
              />

              <Input
                label="Yüzey Alanı (m²) *"
                type="number"
                step="0.01"
                value={room.surfaceArea || ''}
                onChange={(e) => updateRoom(index, 'surfaceArea', parseFloat(e.target.value) || 0)}
                placeholder="14.00"
              />

              <Input
                label="Yükseklik (m) *"
                type="number"
                step="0.01"
                value={room.height || ''}
                onChange={(e) => updateRoom(index, 'height', parseFloat(e.target.value) || 0)}
                placeholder="3.00"
              />

              <div className="bg-blue-50 p-3 rounded-md">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Hacim (m³)
                </label>
                <div className="text-lg font-semibold text-blue-900">
                  {room.volume.toFixed(2)}
                </div>
                <div className="text-xs text-blue-600">
                  (Otomatik hesaplanan)
                </div>
              </div>

              <Select
                label="Test Modu *"
                value={room.testMode}
                onChange={(e) => updateRoom(index, 'testMode', e.target.value as any)}
                options={testModeOptions}
              />

              <Select
                label="Akış Biçimi *"
                value={room.flowType}
                onChange={(e) => updateRoom(index, 'flowType', e.target.value as any)}
                options={flowTypeOptions}
              />

              <Select
                label="Mahal Sınıfı *"
                value={room.roomClass}
                onChange={(e) => updateRoom(index, 'roomClass', e.target.value)}
                options={roomClassOptions}
              />
            </div>
          </div>
        ))}

        <div className="text-center">
          <Button onClick={addRoom} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni Oda Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};
