"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, FileTextIcon, DownloadIcon } from "@/components/icons"
import { HvacReportData } from "@/lib/hvac-types"
import { generateSimplePDF, generateSimpleExcel } from "@/lib/simple-report-generator"
import { DownloadModal } from "@/components/download-modal"

export default function HvacReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<HvacReportData[]>([])
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean; reportId: string; reportNumber: string }>({
    isOpen: false,
    reportId: '',
    reportNumber: ''
  })
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])
  
  useEffect(() => {
    // Load reports from storage - with mobile safety checks
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedReports = localStorage.getItem('hvac-reports')
        if (savedReports) {
          const parsedReports = JSON.parse(savedReports)
          if (Array.isArray(parsedReports)) {
            setReports(parsedReports)
          }
        }
      } catch (error) {
        console.error('Error loading HVAC reports:', error)
        // Clear corrupted data
        localStorage.removeItem('hvac-reports')
      }
    }
  }, [])
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }
  
  const handleCreateReport = () => {
    router.push("/dashboard/hvac-reports/create")
  }
  
  const handleViewReport = (id: string) => {
    router.push(`/dashboard/hvac-reports/${id}`)
  }
  
  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    if (typeof window === 'undefined' || !window.localStorage) {
      alert('Bu özellik mobil cihazlarda desteklenmemektedir.')
      return
    }
    
    try {
      const savedReports = localStorage.getItem('hvac-reports')
      if (savedReports) {
        const reports: HvacReportData[] = JSON.parse(savedReports)
        const report = reports.find(r => r.id === downloadModal.reportId)
        if (report) {
          if (format === 'pdf') {
            generateSimplePDF(report)
          } else {
            generateSimpleExcel(report)
          }
          // Refresh the page to show updated file status
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Rapor oluşturulurken bir hata oluştu.')
    }
  }

  const openDownloadModal = (reportId: string, reportNumber: string) => {
    setDownloadModal({ isOpen: true, reportId, reportNumber })
  }

  const closeDownloadModal = () => {
    setDownloadModal({ isOpen: false, reportId: '', reportNumber: '' })
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HVAC Raporları</h2>
          <p className="text-gray-600 mt-1">Hastane ve laboratuvar HVAC performans niteleme test raporlarını oluşturun ve yönetin</p>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Raporlar</h3>
          <Button onClick={handleCreateReport} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
            <PlusIcon size={20} className="mr-2" />
            Yeni HVAC Raporu
          </Button>
        </div>
        
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">HVAC Raporu Bulunamadı</h3>
              <p className="text-gray-600 mb-4">Yeni bir HVAC raporu oluşturarak başlayın</p>
              <Button onClick={handleCreateReport} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
                <PlusIcon size={20} className="mr-2" />
                Yeni Rapor Oluştur
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{report.reportInfo.hospitalName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Rapor No:</span> {report.reportInfo.reportNumber}</p>
                    <p><span className="font-medium">Tarih:</span> {report.reportInfo.measurementDate}</p>
                    <p><span className="font-medium">Oda Sayısı:</span> {report.rooms.length}</p>
                    <p><span className="font-medium">Test Eden:</span> {report.reportInfo.testerName}</p>
                    
                    {/* Show file status */}
                    {(() => {
                      if (typeof window === 'undefined' || !window.localStorage) {
                        return (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                              Dosya durumu yüklenemedi
                            </span>
                          </div>
                        )
                      }
                      
                      try {
                        const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
                        const files = reportFiles[report.id] || {}
                        const hasFiles = files.pdf || files.excel
                        
                        return hasFiles ? (
                          <div className="flex gap-1 mt-2">
                            {files.pdf && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                PDF
                              </span>
                            )}
                            {files.excel && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                Excel
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                              Dosya yok
                            </span>
                          </div>
                        )
                      } catch (error) {
                        return (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-200">
                              Dosya durumu hatası
                            </span>
                          </div>
                        )
                      }
                    })()}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <FileTextIcon size={16} className="mr-1" />
                      Görüntüle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDownloadModal(report.id, report.reportInfo.reportNumber)}
                    >
                      <DownloadIcon size={16} className="mr-1" />
                      İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DownloadModal
          isOpen={downloadModal.isOpen}
          onClose={closeDownloadModal}
          onDownload={handleDownloadReport}
          reportNumber={downloadModal.reportNumber}
        />
      </div>
    </DashboardLayout>
  )
}