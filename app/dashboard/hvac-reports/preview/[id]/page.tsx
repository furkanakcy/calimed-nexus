"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadIcon, EyeIcon, PrinterIcon } from "@/components/icons"
import { HvacReportData } from "@/lib/hvac-types"
import { generateHvacReportPDF, generateHvacReportExcel } from "@/lib/hvac-report-generator"

export default function HvacReportPreview() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.id as string
  
  const [report, setReport] = useState<HvacReportData | null>(null)
  
  useEffect(() => {
    // Load the report data
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const foundReport = reports.find(r => r.id === reportId)
      if (foundReport) {
        setReport(foundReport)
      }
    }
  }, [reportId])
  
  const handleGeneratePDF = async () => {
    if (!report) return
    
    try {
      await generateHvacReportPDF(report)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('PDF oluşturma sırasında bir hata oluştu.')
    }
  }
  
  const handleGenerateExcel = () => {
    generateHvacReportExcel(report);
  }
  
  if (!report) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HVAC Raporu Önizleme</h2>
          <p className="text-gray-600 mt-1">Oluşturulan HVAC raporunun önizlemesi</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Rapor Önizlemesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-8 border rounded-lg shadow-sm min-h-[842px]"> {/* A4 height */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{report.reportInfo.hospitalName}</h1>
                  <p className="text-sm text-gray-600">{report.reportInfo.organizationName}</p>
                </div>
                {report.reportInfo.logo && (
                  <img 
                    src={report.reportInfo.logo} 
                    alt="Logo" 
                    className="h-16 w-16 object-contain" 
                  />
                )}
              </div>
              
              <div className="border-t border-b py-4 mb-8 text-center">
                <h2 className="text-xl font-bold mb-2">HVAC PERFORMANS NİTELEME TEST RAPORU</h2>
                <p className="text-sm text-gray-600">(PQ Raporu)</p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-bold mb-4">Genel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Rapor No:</span> {report.reportInfo.reportNumber}</div>
                  <div><span className="font-medium">Ölçüm Tarihi:</span> {report.reportInfo.measurementDate}</div>
                  <div><span className="font-medium">Testi Yapan:</span> {report.reportInfo.testerName}</div>
                  <div><span className="font-medium">Raporu Hazırlayan:</span> {report.reportInfo.reportPreparerName}</div>
                  <div><span className="font-medium">Onaylayan:</span> {report.reportInfo.approverName}</div>
                </div>
              </div>
              
              {/* Render room data for preview */}
              {report.rooms.map((room, index) => (
                <div key={room.id} className="mb-8 border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">MAHAL NO: {room.roomNo} - {room.roomName}</h3>
                    <div className="text-sm">
                      <div>AKIŞ BİÇİMİ: {room.flowType}</div>
                      <div>TEST MODU: {room.testMode}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="font-medium">YÜZEY ALANI:</span> {room.surfaceArea} m²</div>
                    <div><span className="font-medium">YÜKSEKLİK:</span> {room.height} m</div>
                    <div><span className="font-medium">HACİM:</span> {(room.volume || room.basicInfo?.volume || 0).toFixed(2)} m³</div>
                    <div><span className="font-medium">MAHAL SINIFI:</span> {room.roomClass}</div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">NO</th>
                          <th className="border px-4 py-2 text-left">TEST ADI</th>
                          <th className="border px-4 py-2 text-left">KRİTER</th>
                          <th className="border px-4 py-2 text-left">SONUÇ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Airflow Data */}
                        <tr>
                          <td className="border px-4 py-2">1</td>
                          <td className="border px-4 py-2">Hava Debisi ve Hava Değişim Oranı</td>
                          <td className="border px-4 py-2">{room.tests?.airflowData?.criteria || 'Belirtilmemiş'}</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.airflowData?.flowRate || room.airFlow?.totalFlowRate || 0} m³/h</div>
                            <div className={(room.tests?.airflowData?.meetsCriteria || room.airFlow?.meetsMinCriteria) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.airflowData?.meetsCriteria || room.airFlow?.meetsMinCriteria) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Pressure Difference */}
                        <tr>
                          <td className="border px-4 py-2">2</td>
                          <td className="border px-4 py-2">Basınç Farkı</td>
                          <td className="border px-4 py-2">{room.tests?.pressureDifference?.criteria || '≥ 6 Pa'}</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.pressureDifference?.pressure || room.pressureDifference?.pressure || 0} Pa</div>
                            <div className={(room.tests?.pressureDifference?.meetsCriteria || room.pressureDifference?.result === 'Uygundur') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.pressureDifference?.meetsCriteria || room.pressureDifference?.result === 'Uygundur') ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Air Flow Direction */}
                        <tr>
                          <td className="border px-4 py-2">3</td>
                          <td className="border px-4 py-2">Hava Akış Yönü</td>
                          <td className="border px-4 py-2">Temiz→Kirli</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.airFlowDirection?.observation || room.airFlowDirection?.direction || 'Gözlem'}</div>
                            <div className={(room.tests?.airFlowDirection?.result === 'UYGUNDUR' || room.airFlowDirection?.result === 'Uygundur') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {room.tests?.airFlowDirection?.result || room.airFlowDirection?.result || 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* HEPA Leakage */}
                        <tr>
                          <td className="border px-4 py-2">4</td>
                          <td className="border px-4 py-2">HEPA Sızdırmazlık</td>
                          <td className="border px-4 py-2">{room.tests?.hepaLeakage?.criteria || '≤ %0.01'}</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.hepaLeakage?.actualLeakage || room.hepaLeakage?.maxLeakage || 0}%</div>
                            <div className={(room.tests?.hepaLeakage?.meetsCriteria || room.hepaLeakage?.result === 'Uygundur') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.hepaLeakage?.meetsCriteria || room.hepaLeakage?.result === 'Uygundur') ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Particle Count */}
                        <tr>
                          <td className="border px-4 py-2">5</td>
                          <td className="border px-4 py-2">Partikül Sayısı (0.5 µm)</td>
                          <td className="border px-4 py-2">ISO Class {room.tests?.particleCount?.isoClass || room.particleCount?.isoClass || '7'}</td>
                          <td className="border px-4 py-2">
                            <div>ISO {room.tests?.particleCount?.isoClass || room.particleCount?.isoClass || '7'}</div>
                            <div className={(room.tests?.particleCount?.meetsCriteria || room.particleCount?.meetsISOStandard) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.particleCount?.meetsCriteria || room.particleCount?.meetsISOStandard) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Recovery Time */}
                        <tr>
                          <td className="border px-4 py-2">6</td>
                          <td className="border px-4 py-2">Recovery Time</td>
                          <td className="border px-4 py-2">{room.tests?.recoveryTime?.criteria || '≤ 25 dk'}</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.recoveryTime?.duration || room.recoveryTime?.recoveryTime || 0} dk</div>
                            <div className={(room.tests?.recoveryTime?.meetsCriteria || room.recoveryTime?.meetsMaxTime) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.recoveryTime?.meetsCriteria || room.recoveryTime?.meetsMaxTime) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Temperature/Humidity */}
                        <tr>
                          <td className="border px-4 py-2">7</td>
                          <td className="border px-4 py-2">Sıcaklık ve Nem</td>
                          <td className="border px-4 py-2">{room.tests?.temperatureHumidity?.criteria || '20-24°C, 40-60%'}</td>
                          <td className="border px-4 py-2">
                            <div>{room.tests?.temperatureHumidity?.temperature || room.temperatureHumidity?.temperature || 0}°C / {room.tests?.temperatureHumidity?.humidity || room.temperatureHumidity?.humidity || 0}%</div>
                            <div className={(room.tests?.temperatureHumidity?.meetsCriteria || (room.temperatureHumidity?.temperatureInRange && room.temperatureHumidity?.humidityInRange)) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(room.tests?.temperatureHumidity?.meetsCriteria || (room.temperatureHumidity?.temperatureInRange && room.temperatureHumidity?.humidityInRange)) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <div>
                      <div className="font-medium">TESTİ YAPAN: {report.reportInfo.testerName}</div>
                      <div className="text-sm text-gray-600">{report.reportInfo.organizationName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">RAPORU HAZIRLAYAN: {report.reportInfo.reportPreparerName}</div>
                      <div className="text-sm text-gray-600">TARİH: {report.reportInfo.measurementDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <div>
                      <div className="font-medium">ONAYLAYAN: {report.reportInfo.approverName}</div>
                      <div className="text-sm text-gray-600">{report.reportInfo.organizationName}</div>
                    </div>
                    <div className="text-right">
                      {report.reportInfo.seal && (
                        <img 
                          src={report.reportInfo.seal} 
                          alt="Mühür" 
                          className="h-16 w-16 object-contain ml-auto" 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right mt-4 text-sm text-gray-600">
                    Sayfa {index + 1}/{report.rooms.length}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/hvac-reports/create/rooms/${reportId}`)}
          >
            Düzenle
          </Button>
          <Button 
            onClick={handleGeneratePDF} 
            className="bg-[#0B5AA3] hover:bg-[#094a8a]"
          >
            <DownloadIcon size={20} className="mr-2" />
            PDF Olarak İndir
          </Button>
          <Button 
            onClick={handleGenerateExcel} 
            variant="outline"
          >
            <DownloadIcon size={20} className="mr-2" />
            Excel Olarak İndir
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}