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
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "@/components/icons"
import { getDevicesFromStorage, deleteDevice, type Device } from "@/lib/mock-data"
import { DeviceDialog } from "@/components/device-dialog"

export default function DevicesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setDevices(getDevicesFromStorage())
  }, [])

  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Bu cihazı silmek istediğinizden emin misiniz?")) {
      deleteDevice(id)
      setDevices(getDevicesFromStorage())
    }
  }

  const handleEdit = (device: Device) => {
    setEditingDevice(device)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingDevice(null)
    setDevices(getDevicesFromStorage())
  }

  const getStatusBadge = (status: Device["status"]) => {
    const variants = {
      active: { label: "Aktif", className: "bg-green-50 text-green-700" },
      inactive: { label: "Pasif", className: "bg-gray-50 text-gray-700" },
      maintenance: { label: "Bakımda", className: "bg-orange-50 text-orange-700" },
      retired: { label: "Kullanım Dışı", className: "bg-red-50 text-red-700" },
    }
    const variant = variants[status]
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
            <h2 className="text-2xl font-bold text-gray-900">Cihaz Yönetimi</h2>
            <p className="text-gray-600 mt-1">Tüm medikal cihazları görüntüleyin ve yönetin</p>
          </div>
          {canEdit && (
            <Button onClick={() => setDialogOpen(true)} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
              <PlusIcon size={20} />
              Yeni Cihaz Ekle
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Cihaz adı, seri numarası veya departman ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Devices table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cihaz Adı</TableHead>
                    <TableHead>Seri No</TableHead>
                    <TableHead>Üretici</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Son Kalibrasyon</TableHead>
                    <TableHead>Sonraki Kalibrasyon</TableHead>
                    <TableHead>Durum</TableHead>
                    {canEdit && <TableHead className="text-right">İşlemler</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-8 text-gray-500">
                        {searchQuery ? "Arama sonucu bulunamadı" : "Henüz cihaz eklenmemiş"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.deviceName}</TableCell>
                        <TableCell>{device.serialNumber}</TableCell>
                        <TableCell>{device.manufacturer}</TableCell>
                        <TableCell>{device.department}</TableCell>
                        <TableCell>{device.lastCalibrationDate}</TableCell>
                        <TableCell>{device.nextCalibrationDate}</TableCell>
                        <TableCell>{getStatusBadge(device.status)}</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(device)}>
                                <EditIcon size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(device.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeviceDialog open={dialogOpen} onClose={handleDialogClose} device={editingDevice} />
    </DashboardLayout>
  )
}
