import React, { useState, useRef } from 'react';
import { generateExcelReport, generatePdfReport } from './utils/reportGenerator';
import { ProgressBar } from './components/ProgressBar';
import { GeneralInfoForm } from './components/forms/GeneralInfoForm';
import { RoomListForm } from './components/forms/RoomListForm';
import { TestDataForm } from './components/forms/TestDataForm';
import { ReportPreview } from './components/ReportPreview';
import { Button } from './components/ui/Button';
import { FormStep, GeneralInfo, Room, RoomTestData, ReportData } from './types';
import { Building2, ArrowLeft, ArrowRight } from 'lucide-react';

function App() {
  const reportPreviewRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('general');
  
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    hospitalName: '',
    reportNo: '',
    measurementDate: '',
    testerName: '',
    preparedBy: '',
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

  const handleDownload = async (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      await generateExcelReport(generalInfo, rooms, testData);
    } else if (format === 'pdf' && reportPreviewRef.current) {
      await generatePdfReport(reportPreviewRef.current, generalInfo, rooms);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'general':
        return generalInfo.hospitalName && generalInfo.reportNo && generalInfo.measurementDate && 
               generalInfo.testerName && generalInfo.preparedBy && generalInfo.approvedBy && 
               generalInfo.organizationName;
      case 'rooms':
        return rooms.length > 0 && rooms.every(room => 
          room.roomNo && room.roomName && room.surfaceArea > 0 && room.height > 0
        );
      case 'tests':
        return rooms.every(room => testData[room.id]);
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
            <GeneralInfoForm 
              data={generalInfo}
              onChange={setGeneralInfo}
            />
          )}

          {currentStep === 'rooms' && (
            <RoomListForm 
              rooms={rooms}
              onChange={setRooms}
            />
          )}

          {currentStep === 'tests' && (
            <TestDataForm 
              rooms={rooms}
              testData={testData}
              onChange={setTestData}
            />
          )}

          {(currentStep === 'preview' || currentStep === 'download') && (
            <div ref={reportPreviewRef}>
              <ReportPreview 
                reportData={reportData}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {currentStep !== 'general' && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
            )}
          </div>

          <div>
            {currentStep !== 'download' && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                İleri
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              © 2025 HVAC PQ Rapor Sistemi. Tüm hakları saklıdır. 
              ISO 14644-1, DIN 1946-4, IEST-RP-CC006.3 standartları referans alınmıştır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
