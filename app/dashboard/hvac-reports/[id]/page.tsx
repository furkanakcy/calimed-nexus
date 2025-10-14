"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRightIcon, DownloadIcon, EditIcon } from "@/components/icons"
import { HvacReportData } from "@/lib/hvac-types"
import { generateHvacReportPDF, generateHvacReportExcel } from "@/lib/hvac-report-generator"
import { checkRoomCompliance, generateFinalAssessment } from "@/lib/hvac-calculations"
import { HvacReportFiles } from "@/components/hvac-report-files"

export default function HvacReportViewPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [report, setReport] = useState<HvacReportData | null>(null)
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])
  
  useEffect(() => {
    if (params.id && typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedReports = localStorage.getItem('hvac-reports')
        if (savedReports) {
          const reports: HvacReportData[] = JSON.parse(savedReports)
          const foundReport = reports.find(r => r.id === params.id)
          if (foundReport) {
            setReport(foundReport)
          } else {
            router.push('/dashboard/hvac-reports')
          }
        } else {
          router.push('/dashboard/hvac-reports')
        }
      } catch (error) {
        console.error('Error loading HVAC report:', error)
        router.push('/dashboard/hvac-reports')
      }
    } else if (params.id && typeof window !== 'undefined') {
      // localStorage not available
      alert('Bu özellik mobil cihazlarda tam olarak desteklenmemektedir.')
      router.push('/dashboard/hvac-reports')
    }
  }, [params.id, router])
  
  if (isLoading || !user || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }
  
  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      alert('Bu özellik mobil cihazlarda desteklenmemektedir.')
      return
    }
    
    try {
      await generateHvacReportPDF(report)
      window.location.reload()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('PDF oluşturulurken bir hata oluştu.')
    }
  }
  
  const handleDownloadExcel = async () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      alert('Bu özellik mobil cihazlarda desteklenmemektedir.')
      return
    }
    
    try {
      await generateHvacReportExcel(report)
      window.location.reload()
    } catch (error) {
      console.error('Error generating Excel:', error)
      alert('Excel oluşturulurken bir hata oluştu.')
    }
  }
  
  const finalAssessment = generateFinalAssessment(report.rooms)
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <button 
                onClick={() => router.push('/dashboard/hvac-reports')}
                className="hover:text-[#0B5AA3]"
              >
                HVAC Raporları
              </button>
              <ArrowRightIcon size={16} />
              <span>{report.reportInfo.reportNumber}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{report.reportInfo.hospitalName}</h2>
            <p className="text-gray-600 mt-1">HVAC Performans Niteleme Test Raporu</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
            >
              <DownloadIcon size={16} className="mr-2" />
              PDF İndir
            </Button>
            <Button
              onClick={handleDownloadExcel}
              className="bg-[#0B5AA3] hover:bg-[#094a8a]"
            >
              <DownloadIcon size={16} className="mr-2" />
              Excel İndir
            </Button>
          </div>
        </div>
        
        {/* Report Info */}
        <Card>
          <CardHeader>
            <CardTitle>Rapor Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Rapor Numarası</div>
                <div className="text-lg font-semibold">{report.reportInfo.reportNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Ölçüm Tarihi</div>
                <div className="text-lg font-semibold">{report.reportInfo.measurementDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Testi Yapan</div>
                <div className="text-lg font-semibold">{report.reportInfo.testerName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Raporu Hazırlayan</div>
                <div className="text-lg font-semibold">{report.reportInfo.reportPreparedBy}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Onaylayan</div>
                <div className="text-lg font-semibold">{report.reportInfo.approvedBy}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Kuruluş</div>
                <div className="text-lg font-semibold">{report.reportInfo.organizationName}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Final Assessment */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500 mb-2">Nihai Değerlendirme</div>
              <Badge 
                variant={finalAssessment.includes('UYGUNDUR') ? 'default' : 'destructive'}
                className={`text-lg px-4 py-2 ${
                  finalAssessment.includes('UYGUNDUR') 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {finalAssessment}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Rooms Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Mahal Test Sonuçları ({report.rooms.length} Oda)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.rooms.map((room, index) => {
                const isCompliant = checkRoomCompliance(room)
                
                return (
                  <Card key={room.id} className={`border-l-4 ${
                    isCompliant ? 'border-l-green-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{room.basicInfo.roomName}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Mahal No: {room.basicInfo.roomNumber}</div>
                            <div>Yüzey Alanı: {room.basicInfo.surfaceArea} m² | Yükseklik: {room.basicInfo.height} m | Hacim: {room.basicInfo.volume} m³</div>
                            <div>Test Modu: {room.basicInfo.testMode} | Akış Biçimi: {room.basicInfo.flowType} | Sınıf: {room.basicInfo.roomClass}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={isCompliant ? 'default' : 'destructive'}
                            className={isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">Sayfa {index + 1}/{report.rooms.length}</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Test Results Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-lg border ${
                          room.pressureDifference.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">Basınç Farkı</div>
                          <div className="text-xs text-gray-600">≥ 6 Pa</div>
                          <div className="font-semibold">{room.pressureDifference.pressure} Pa</div>
                          <div className={`text-xs font-medium ${
                            room.pressureDifference.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.pressureDifference.result}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${
                          room.airFlowDirection.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">Hava Akış Yönü</div>
                          <div className="text-xs text-gray-600">Temiz→Kirli</div>
                          <div className="font-semibold">Gözlem</div>
                          <div className={`text-xs font-medium ${
                            room.airFlowDirection.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.airFlowDirection.result}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${
                          room.hepaLeakage.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">HEPA Sızdırmazlık</div>
                          <div className="text-xs text-gray-600">≤ %0.01</div>
                          <div className="font-semibold">%{room.hepaLeakage.maxLeakage}</div>
                          <div className={`text-xs font-medium ${
                            room.hepaLeakage.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.hepaLeakage.result}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${
                          room.particleCount.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">Partikül Sayısı (0.5 µm)</div>
                          <div className="text-xs text-gray-600">ISO Class 7</div>
                          <div className="font-semibold">{room.particleCount.isoClass}</div>
                          <div className={`text-xs font-medium ${
                            room.particleCount.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.particleCount.result}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${
                          room.recoveryTime.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">Recovery Time</div>
                          <div className="text-xs text-gray-600">≤ 25 dk</div>
                          <div className="font-semibold">{room.recoveryTime.recoveryTime} dk</div>
                          <div className={`text-xs font-medium ${
                            room.recoveryTime.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.recoveryTime.result}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${
                          room.temperatureHumidity.result === 'Uygundur' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-sm font-medium">Sıcaklık & Nem</div>
                          <div className="text-xs text-gray-600">20-24°C, 40-60%</div>
                          <div className="font-semibold">{room.temperatureHumidity.temperature}°C, {room.temperatureHumidity.humidity}%</div>
                          <div className={`text-xs font-medium ${
                            room.temperatureHumidity.result === 'Uygundur' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {room.temperatureHumidity.result}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Generated Files */}
        <HvacReportFiles 
          reportId={report.id} 
          reportNumber={report.reportInfo.reportNumber} 
        />
        
        {/* Report Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Rapor Detayları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-500">Oluşturulma Tarihi</div>
                <div>{new Date(report.createdAt).toLocaleString('tr-TR')}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">Son Güncelleme</div>
                <div>{new Date(report.updatedAt).toLocaleString('tr-TR')}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">Toplam Oda Sayısı</div>
                <div>{report.rooms.length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">Uygun Oda Sayısı</div>
                <div>{report.rooms.filter(room => checkRoomCompliance(room)).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}