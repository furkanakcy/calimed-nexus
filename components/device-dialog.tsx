"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDevice, updateDevice, type Device } from "@/lib/mock-data"

interface DeviceDialogProps {
  open: boolean
  onClose: () => void
  device?: Device | null
}

export function DeviceDialog({ open, onClose, device }: DeviceDialogProps) {
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceType: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    location: "",
    department: "",
    purchaseDate: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    status: "active" as Device["status"],
    notes: "",
  })

  useEffect(() => {
    if (device) {
      setFormData(device)
    } else {
      setFormData({
        deviceName: "",
        deviceType: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        location: "",
        department: "",
        purchaseDate: "",
        lastCalibrationDate: "",
        nextCalibrationDate: "",
        status: "active",
        notes: "",
      })
    }
  }, [device, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (device) {
      updateDevice(device.id, formData)
    } else {
      addDevice(formData)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{device ? "Cihaz Düzenle" : "Yeni Cihaz Ekle"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Cihaz Adı *</Label>
              <Input
                id="deviceName"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceType">Cihaz Tipi *</Label>
              <Input
                id="deviceType"
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Üretici *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Seri Numarası *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departman *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasyon *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Device["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="maintenance">Bakımda</SelectItem>
                  <SelectItem value="retired">Kullanım Dışı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Satın Alma Tarihi</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastCalibrationDate">Son Kalibrasyon Tarihi</Label>
              <Input
                id="lastCalibrationDate"
                type="date"
                value={formData.lastCalibrationDate}
                onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextCalibrationDate">Sonraki Kalibrasyon Tarihi</Label>
              <Input
                id="nextCalibrationDate"
                type="date"
                value={formData.nextCalibrationDate}
                onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="bg-[#0B5AA3] hover:bg-[#094a8a]">
              {device ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
