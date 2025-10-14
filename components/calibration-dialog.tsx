"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import {
  addCalibration,
  updateCalibration,
  getDevicesFromStorage,
  type CalibrationRecord,
  type Device,
} from "@/lib/mock-data"

interface CalibrationDialogProps {
  open: boolean
  onClose: () => void
  calibration?: CalibrationRecord | null
}

export function CalibrationDialog({ open, onClose, calibration }: CalibrationDialogProps) {
  const { user } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    calibrationDate: "",
    nextCalibrationDate: "",
    technicianId: user?.id || "",
    technicianName: user?.fullName || "",
    calibrationType: "routine" as CalibrationRecord["calibrationType"],
    result: "passed" as CalibrationRecord["result"],
    certificateNumber: "",
    standardsUsed: "",
    temperature: "",
    humidity: "",
    pressure: "",
    measurements: "",
    notes: "",
  })

  useEffect(() => {
    setDevices(getDevicesFromStorage())
  }, [])

  useEffect(() => {
    if (calibration) {
      setFormData({
        deviceId: calibration.deviceId,
        deviceName: calibration.deviceName,
        calibrationDate: calibration.calibrationDate,
        nextCalibrationDate: calibration.nextCalibrationDate,
        technicianId: calibration.technicianId,
        technicianName: calibration.technicianName,
        calibrationType: calibration.calibrationType,
        result: calibration.result,
        certificateNumber: calibration.certificateNumber,
        standardsUsed: calibration.standardsUsed,
        temperature: calibration.environmentalConditions?.temperature || "",
        humidity: calibration.environmentalConditions?.humidity || "",
        pressure: calibration.environmentalConditions?.pressure || "",
        measurements: calibration.measurements || "",
        notes: calibration.notes || "",
      })
    } else {
      setFormData({
        deviceId: "",
        deviceName: "",
        calibrationDate: new Date().toISOString().split("T")[0],
        nextCalibrationDate: "",
        technicianId: user?.id || "",
        technicianName: user?.fullName || "",
        calibrationType: "routine",
        result: "passed",
        certificateNumber: `CAL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        standardsUsed: "",
        temperature: "",
        humidity: "",
        pressure: "",
        measurements: "",
        notes: "",
      })
    }
  }, [calibration, open, user])

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      setFormData({
        ...formData,
        deviceId: device.id,
        deviceName: device.deviceName,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const calibrationData = {
      deviceId: formData.deviceId,
      deviceName: formData.deviceName,
      calibrationDate: formData.calibrationDate,
      nextCalibrationDate: formData.nextCalibrationDate,
      technicianId: formData.technicianId,
      technicianName: formData.technicianName,
      calibrationType: formData.calibrationType,
      result: formData.result,
      certificateNumber: formData.certificateNumber,
      standardsUsed: formData.standardsUsed,
      environmentalConditions: {
        temperature: formData.temperature,
        humidity: formData.humidity,
        pressure: formData.pressure,
      },
      measurements: formData.measurements,
      notes: formData.notes,
    }

    if (calibration) {
      updateCalibration(calibration.id, calibrationData)
    } else {
      addCalibration(calibrationData)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{calibration ? "Kalibrasyon Kaydını Düzenle" : "Yeni Kalibrasyon Kaydı"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Selection */}
          <div className="space-y-2">
            <Label htmlFor="device">Cihaz *</Label>
            <Select value={formData.deviceId} onValueChange={handleDeviceChange} disabled={!!calibration}>
              <SelectTrigger>
                <SelectValue placeholder="Cihaz seçin" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.deviceName} - {device.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calibrationDate">Kalibrasyon Tarihi *</Label>
              <Input
                id="calibrationDate"
                type="date"
                value={formData.calibrationDate}
                onChange={(e) => setFormData({ ...formData, calibrationDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextCalibrationDate">Sonraki Kalibrasyon Tarihi *</Label>
              <Input
                id="nextCalibrationDate"
                type="date"
                value={formData.nextCalibrationDate}
                onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calibrationType">Kalibrasyon Tipi *</Label>
              <Select
                value={formData.calibrationType}
                onValueChange={(value) =>
                  setFormData({ ...formData, calibrationType: value as CalibrationRecord["calibrationType"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Rutin</SelectItem>
                  <SelectItem value="repair">Onarım</SelectItem>
                  <SelectItem value="validation">Validasyon</SelectItem>
                  <SelectItem value="verification">Doğrulama</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Sonuç *</Label>
              <Select
                value={formData.result}
                onValueChange={(value) => setFormData({ ...formData, result: value as CalibrationRecord["result"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Başarılı</SelectItem>
                  <SelectItem value="failed">Başarısız</SelectItem>
                  <SelectItem value="conditional">Koşullu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Sertifika Numarası *</Label>
              <Input
                id="certificateNumber"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="standardsUsed">Kullanılan Standartlar *</Label>
              <Input
                id="standardsUsed"
                value={formData.standardsUsed}
                onChange={(e) => setFormData({ ...formData, standardsUsed: e.target.value })}
                placeholder="örn: IEC 60601-2-25"
                required
              />
            </div>
          </div>

          {/* Environmental Conditions */}
          <div>
            <h3 className="text-sm font-medium mb-3">Çevresel Koşullar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Sıcaklık</Label>
                <Input
                  id="temperature"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="örn: 22°C"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidity">Nem</Label>
                <Input
                  id="humidity"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  placeholder="örn: 45%"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">Basınç</Label>
                <Input
                  id="pressure"
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                  placeholder="örn: 1013 hPa"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurements">Ölçümler</Label>
            <Textarea
              id="measurements"
              value={formData.measurements}
              onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              rows={3}
              placeholder="Kalibrasyon ölçüm değerleri..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Ek notlar ve gözlemler..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="bg-[#0B5AA3] hover:bg-[#094a8a]">
              {calibration ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
