import React, { ChangeEvent } from 'react';
import { GeneralInfo } from '../../types';
import { Input } from '../ui/Input';
import { Upload, XCircle } from 'lucide-react';

interface GeneralInfoFormProps {
  data: GeneralInfo;
  onChange: (data: GeneralInfo) => void;
}

export const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof GeneralInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, field: 'logo' | 'stamp') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          [field]: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      onChange({
        ...data,
        [field]: undefined,
      });
    }
  };

  const removeFile = (field: 'logo' | 'stamp') => {
    onChange({
      ...data,
      [field]: undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Genel Bilgiler</h2>
        <p className="text-gray-600">Rapor için temel bilgileri girin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Hastane Adı *"
          value={data.hospitalName}
          onChange={(e) => handleChange('hospitalName', e.target.value)}
          placeholder="Nallıhan Devlet Hastanesi"
        />

        <Input
          label="Rapor No *"
          value={data.reportNo}
          onChange={(e) => handleChange('reportNo', e.target.value)}
          placeholder="V-2504-039"
        />

        <Input
          label="Ölçüm Tarihi *"
          type="date"
          value={data.measurementDate}
          onChange={(e) => handleChange('measurementDate', e.target.value)}
        />

        <Input
          label="Testi Yapan *"
          value={data.testerName}
          onChange={(e) => handleChange('testerName', e.target.value)}
          placeholder="Nurettin Karaca"
        />

        <Input
          label="Raporu Hazırlayan *"
          value={data.preparedBy}
          onChange={(e) => handleChange('preparedBy', e.target.value)}
          placeholder="Merve Yazır"
        />

        <Input
          label="Onaylayan *"
          value={data.approvedBy}
          onChange={(e) => handleChange('approvedBy', e.target.value)}
          placeholder="Sevgi Kılınç"
        />

        <div className="md:col-span-2">
          <Input
            label="Kuruluş Adı *"
            value={data.organizationName}
            onChange={(e) => handleChange('organizationName', e.target.value)}
            placeholder="BC Laboratuvarı"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo Yükle (İsteğe Bağlı)
          </label>
          <div 
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            {data.logo ? (
              <>
                <img src={data.logo} alt="Logo Preview" className="mx-auto h-20 object-contain mb-2" />
                <button 
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={(e) => { e.stopPropagation(); removeFile('logo'); }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">PNG, JPG (Max 2MB)</p>
              </>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'logo')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mühür Yükle (İsteğe Bağlı)
          </label>
          <div 
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('stamp-upload')?.click()}
          >
            {data.stamp ? (
              <>
                <img src={data.stamp} alt="Stamp Preview" className="mx-auto h-20 object-contain mb-2" />
                <button 
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={(e) => { e.stopPropagation(); removeFile('stamp'); }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">PNG, JPG (Max 2MB)</p>
              </>
            )}
            <input
              id="stamp-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'stamp')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
