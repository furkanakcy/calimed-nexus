"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, DownloadIcon } from "@/components/icons"
import { getCalibrationsFromStorage, deleteCalibration, type CalibrationRecord } from "@/lib/mock-data"
import { CalibrationDialog } from "@/components/calibration-dialog"

export default function CalibrationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCalibration, setEditingCalibration] = useState<CalibrationRecord | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setCalibrations(getCalibrationsFromStorage())
  }, [])

  const filteredCalibrations = calibrations.filter((cal) => {
    const matchesSearch =
      cal.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cal.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cal.technicianName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "passed") return matchesSearch && cal.result === "passed"
    if (activeTab === "failed") return matchesSearch && cal.result === "failed"
    if (activeTab === "conditional") return matchesSearch && cal.result === "conditional"

    return matchesSearch
  })

  const handleDelete = (id: string) => {
    if (confirm("Bu kalibrasyon kaydını silmek istediğinizden emin misiniz?")) {
      deleteCalibration(id)
      setCalibrations(getCalibrationsFromStorage())
    }
  }

  const handleEdit = (calibration: CalibrationRecord) => {
    setEditingCalibration(calibration)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingCalibration(null)
    setCalibrations(getCalibrationsFromStorage())
  }

  const getResultBadge = (result: CalibrationRecord["result"]) => {
    const variants = {
      passed: { label: "Başarılı", className: "bg-green-50 text-green-700" },
      failed: { label: "Başarısız", className: "bg-red-50 text-red-700" },
      conditional: { label: "Koşullu", className: "bg-orange-50 text-orange-700" },
    }
    const variant = variants[result]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getTypeBadge = (type: CalibrationRecord["calibrationType"]) => {
    const variants = {
      routine: { label: "Rutin", className: "bg-blue-50 text-blue-700" },
      repair: { label: "Onarım", className: "bg-purple-50 text-purple-700" },
      validation: { label: "Validasyon", className: "bg-indigo-50 text-indigo-700" },
      verification: { label: "Doğrulama", className: "bg-cyan-50 text-cyan-700" },
    }
    const variant = variants[type]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }

  const canEdit = user.role === "admin" || user.role === "technician"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kalibrasyon Kayıtları</h2>
            <p className="text-gray-600 mt-1">Tüm kalibrasyon işlemlerini görüntüleyin ve yönetin</p>
          </div>
          {canEdit && (
            <Button onClick={() => setDialogOpen(true)} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
              <PlusIcon size={20} />
              Yeni Kalibrasyon Ekle
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Cihaz adı, sertifika numarası veya teknisyen ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs and table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tümü ({calibrations.length})</TabsTrigger>
            <TabsTrigger value="passed">
              Başarılı ({calibrations.filter((c) => c.result === "passed").length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Başarısız ({calibrations.filter((c) => c.result === "failed").length})
            </TabsTrigger>
            <TabsTrigger value="conditional">
              Koşullu ({calibrations.filter((c) => c.result === "conditional").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cihaz</TableHead>
                        <TableHead>Sertifika No</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Sonraki Tarih</TableHead>
                        <TableHead>Teknisyen</TableHead>
                        <TableHead>Sonuç</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCalibrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            {searchQuery ? "Arama sonucu bulunamadı" : "Henüz kalibrasyon kaydı eklenmemiş"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCalibrations.map((calibration) => (
                          <TableRow key={calibration.id}>
                            <TableCell className="font-medium">{calibration.deviceName}</TableCell>
                            <TableCell>{calibration.certificateNumber}</TableCell>
                            <TableCell>{getTypeBadge(calibration.calibrationType)}</TableCell>
                            <TableCell>{calibration.calibrationDate}</TableCell>
                            <TableCell>{calibration.nextCalibrationDate}</TableCell>
                            <TableCell>{calibration.technicianName}</TableCell>
                            <TableCell>{getResultBadge(calibration.result)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" title="Rapor İndir">
                                  <DownloadIcon size={16} />
                                </Button>
                                {canEdit && (
                                  <>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(calibration)}>
                                      <EditIcon size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(calibration.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <TrashIcon size={16} />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CalibrationDialog open={dialogOpen} onClose={handleDialogClose} calibration={editingCalibration} />
    </DashboardLayout>
  )
}
