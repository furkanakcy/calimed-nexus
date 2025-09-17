import React, { forwardRef } from 'react';
import { ReportData } from '../types';
import { calculateOverallCompliance } from '../utils/calculations';
import { FileDown, Eye } from 'lucide-react';
import { Button } from './ui/Button';

interface ReportPreviewProps {
  reportData: ReportData;
  onDownload: (format: 'excel' | 'pdf') => void;
}

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(({ reportData, onDownload }, ref) => {
  const totalPages = reportData.rooms.length;
  
  return (
    <div ref={ref} className="max-w-6xl mx-auto space-y-6 bg-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rapor Önizleme</h2>
        <p className="text-gray-600">
          {reportData.rooms.length} oda için toplam {totalPages} sayfa rapor oluşturulacak
        </p>
      </div>

      {/* Report Summary */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Rapor Özeti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Hastane:</span>
              <span className="font-medium">{reportData.generalInfo.hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rapor No:</span>
              <span className="font-medium">{reportData.generalInfo.reportNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tarih:</span>
              <span className="font-medium">{reportData.generalInfo.measurementDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Toplam Oda:</span>
              <span className="font-medium">{reportData.rooms.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Testi Yapan:</span>
              <span className="font-medium">{reportData.generalInfo.testerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hazırlayan:</span>
              <span className="font-medium">{reportData.generalInfo.preparedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Onaylayan:</span>
              <span className="font-medium">{reportData.generalInfo.approvedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kuruluş:</span>
              <span className="font-medium">{reportData.generalInfo.organizationName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Results Overview */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Test Sonuçları Özeti</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Mahal No</th>
                <th className="text-left py-2">Mahal Adı</th>
                <th className="text-center py-2">Basınç</th>
                <th className="text-center py-2">HEPA</th>
                <th className="text-center py-2">Partikül</th>
                <th className="text-center py-2">Recovery</th>
                <th className="text-center py-2">Sıcaklık</th>
                <th className="text-center py-2">Nem</th>
                <th className="text-center py-2">Genel</th>
              </tr>
            </thead>
            <tbody>
              {reportData.rooms.map((room, index) => {
                const testData = reportData.testData[room.id];
                const overallCompliance = testData ? calculateOverallCompliance(testData) : false;
                
                return (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{room.roomNo}</td>
                    <td className="py-2">{room.roomName}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.pressure?.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.pressure?.isCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.hepa?.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.hepa?.isCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.particle?.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.particle?.isCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.recovery?.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.recovery?.isCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.tempHumidity?.tempCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.tempHumidity?.tempCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        testData?.tempHumidity?.humidityCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testData?.tempHumidity?.humidityCompliant ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        overallCompliance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {overallCompliance ? 'Uygun' : 'Uygun Değil'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Report Page */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Örnek Rapor Sayfası</h3>
        {reportData.rooms.length > 0 && (
          <div className="border-2 border-gray-200 p-6 bg-gray-50 font-mono text-sm">
            <div className="mb-4 text-center font-bold">
              HVAC PERFORMANS NİTELEME TEST RAPORU (PQ RAPORU)
            </div>
            <div className="mb-4">
              <div>MAHAL NO : {reportData.rooms[0].roomNo}</div>
              <div>MAHAL ADI : {reportData.rooms[0].roomName}</div>
              <div>AKIŞ BİÇİMİ : {reportData.rooms[0].flowType}</div>
              <div>TEST MODU : {reportData.rooms[0].testMode}</div>
              <div>YÜZEY ALANI : {reportData.rooms[0].surfaceArea} m²</div>
              <div>YÜKSEKLİK : {reportData.rooms[0].height} m</div>
            </div>
            <div className="border border-gray-400">
              <div className="border-b border-gray-400 p-2 bg-gray-100 font-bold">
                TEST SONUÇLARI
              </div>
              <div className="p-2 space-y-2">
                {reportData.testData[reportData.rooms[0].id] && (
                  <>
                    <div className="flex justify-between">
                      <span>Basınç Farkı:</span>
                      <span className={reportData.testData[reportData.rooms[0].id].pressure.isCompliant ? 'text-green-600' : 'text-red-600'}>
                        {reportData.testData[reportData.rooms[0].id].pressure.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HEPA Sızdırmazlık:</span>
                      <span className={reportData.testData[reportData.rooms[0].id].hepa.isCompliant ? 'text-green-600' : 'text-red-600'}>
                        {reportData.testData[reportData.rooms[0].id].hepa.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partikül Sayısı:</span>
                      <span className={reportData.testData[reportData.rooms[0].id].particle.isCompliant ? 'text-green-600' : 'text-red-600'}>
                        {reportData.testData[reportData.rooms[0].id].particle.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 text-right text-xs">
              Sayfa 1/{totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => onDownload('excel')}
          size="lg"
          className="flex items-center gap-2"
        >
          <FileDown className="w-5 h-5" />
          Excel Raporu İndir (.xlsx)
        </Button>
        <Button
          onClick={() => onDownload('pdf')}
          variant="secondary"
          size="lg"
          className="flex items-center gap-2"
        >
          <FileDown className="w-5 h-5" />
          PDF Raporu İndir (.pdf)
        </Button>
      </div>
    </div>
  );
});
