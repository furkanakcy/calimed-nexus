import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, ChevronDown } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface HospitalSelectorProps {
  selectedHospitalId: number | null;
  onHospitalChange: (hospitalId: number, hospitalName: string) => void;
  required?: boolean;
  className?: string;
}

export default function HospitalSelector({ 
  selectedHospitalId, 
  onHospitalChange, 
  required = false,
  className = ""
}: HospitalSelectorProps) {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      if (!user?.token) {
        setError('Kullanıcı oturumu bulunamadı');
        return;
      }

      // Demo mode
      if (user.token.startsWith('demo-token')) {
        const demoHospitals: Hospital[] = [
          { id: 1, name: 'Demo Hastanesi', address: 'Demo Adresi', phone: '+90 555 123 4567' },
          { id: 2, name: 'Acıbadem Maslak', address: 'Maslak, İstanbul', phone: '+90 212 304 4444' },
          { id: 3, name: 'Memorial Şişli', address: 'Şişli, İstanbul', phone: '+90 212 314 6666' }
        ];
        setHospitals(demoHospitals);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/hospitals', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHospitals(data);
      } else {
        setError('Hastane listesi alınamadı');
      }
    } catch (error) {
      console.error('Hospital fetch error:', error);
      setError('Hastane listesi alınırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospitalId = parseInt(e.target.value);
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (hospital) {
      onHospitalChange(hospitalId, hospital.name);
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hastane Seçimi {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-500">Hastaneler yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hastane Seçimi {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hastane Seçimi {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-700 flex items-center">
          <Building2 className="h-4 w-4 mr-2" />
          Henüz hastane tanımlanmamış. Lütfen yöneticinizle iletişime geçin.
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Hastane Seçimi {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={selectedHospitalId || ''}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10"
        >
          <option value="">Hastane seçiniz...</option>
          {hospitals.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name}
              {hospital.address && ` - ${hospital.address}`}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedHospitalId && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center text-sm text-blue-800">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="font-medium">
              Seçilen Hastane: {hospitals.find(h => h.id === selectedHospitalId)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}