"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadIcon, FileTextIcon, AlertCircleIcon } from "@/components/icons"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (format: 'pdf' | 'excel') => void
  reportNumber: string
}

export function DownloadModal({ isOpen, onClose, onDownload, reportNumber }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  const handleDownload = async (format: 'pdf' | 'excel') => {
    setIsDownloading(true)
    try {
      await onDownload(format)
    } catch (error) {
      console.error('Download failed:', error)
      alert('İndirme başarısız oldu. Lütfen tekrar deneyin.')
    } finally {
      setIsDownloading(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon size={20} />
            Rapor İndir - {reportNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircleIcon size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">İndirme Bilgisi</p>
              <p>Render.com'da güvenlik nedeniyle dosyalar HTML/CSV formatında indirilir. 
              İndirilen dosyaları PDF/Excel'e dönüştürme talimatları gösterilecektir.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <DownloadIcon size={16} className="mr-2" />
              {isDownloading ? 'İndiriliyor...' : 'PDF Olarak İndir (HTML)'}
            </Button>

            <Button
              onClick={() => handleDownload('excel')}
              disabled={isDownloading}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              <DownloadIcon size={16} className="mr-2" />
              {isDownloading ? 'İndiriliyor...' : 'Excel Olarak İndir (CSV)'}
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isDownloading}>
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}