"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, FileTextIcon, CalendarIcon } from "@/components/icons"

interface ReportFile {
  fileName: string
  createdAt: string
  size: number
}

interface ReportFiles {
  pdf?: ReportFile
  excel?: ReportFile
}

interface HvacReportFilesProps {
  reportId: string
  reportNumber: string
}

export function HvacReportFiles({ reportId, reportNumber }: HvacReportFilesProps) {
  const [files, setFiles] = useState<ReportFiles>({})
  
  useEffect(() => {
    // Load report files from storage - with mobile safety checks
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
        if (reportFiles[reportId]) {
          setFiles(reportFiles[reportId])
        }
      } catch (error) {
        console.error('Error loading report files:', error)
      }
    }
  }, [reportId])
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('tr-TR')
  }
  
  const handleDownload = (file: ReportFile, type: 'pdf' | 'excel') => {
    if (typeof window === 'undefined' || !window.localStorage) {
      alert('Bu özellik mobil cihazlarda desteklenmemektedir.')
      return
    }
    
    // In a real application, this would download from the server
    // For now, we'll show a message
    alert(`${file.fileName} dosyası indirilecek. (Gerçek uygulamada sunucudan indirilir)`)
  }
  
  if (!files.pdf && !files.excel) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Dosya Oluşturulmamış</h3>
          <p className="text-gray-600">Bu rapor için henüz PDF veya Excel dosyası oluşturulmamış.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon size={20} />
          Oluşturulan Dosyalar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.pdf && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileTextIcon size={20} className="text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{files.pdf.fileName}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <CalendarIcon size={14} />
                    {formatDate(files.pdf.createdAt)}
                    <span>•</span>
                    {formatFileSize(files.pdf.size)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  PDF
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(files.pdf!, 'pdf')}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <DownloadIcon size={16} className="mr-1" />
                  İndir
                </Button>
              </div>
            </div>
          )}
          
          {files.excel && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileTextIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{files.excel.fileName}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <CalendarIcon size={14} />
                    {formatDate(files.excel.createdAt)}
                    <span>•</span>
                    {formatFileSize(files.excel.size)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Excel
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(files.excel!, 'excel')}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <DownloadIcon size={16} className="mr-1" />
                  İndir
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Not:</strong> Dosyalar rapor oluşturulduğunda otomatik olarak kaydedilir. 
            Diğer kullanıcılar da bu dosyalara erişebilir.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}