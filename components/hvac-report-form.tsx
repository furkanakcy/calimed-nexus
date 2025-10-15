"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, TrashIcon } from "@/components/icons"
import { HvacReportData, Room, HvacReportInfo, TestMode, FlowType, RoomClass } from "@/lib/hvac-types"
import {
  calculateAirFlowRate,
  calculateAirChangeRate,
  calculateRoomVolume,
  calculateParticleAverage,
  determineISOClass,
  meetsISOStandard,
  validatePressureDifference,
  validateHepaLeakage,
  validateRecoveryTime,
  validateTemperature,
  validateHumidity
} from "@/lib/hvac-calculations"

const reportInfoSchema = z.object({
  hospitalName: z.string().min(1, "Hastane adı gerekli"),
  reportNumber: z.string().min(1, "Rapor numarası gerekli"),
  measurementDate: z.string().min(1, "Ölçüm tarihi gerekli"),
  testerName: z.string().min(1, "Test eden kişi gerekli"),
  reportPreparedBy: z.string().min(1, "Raporu hazırlayan gerekli"),
  approvedBy: z.string().min(1, "Onaylayan gerekli"),
  organizationName: z.string().min(1, "Kuruluş adı gerekli"),
})

interface HvacReportFormProps {
  onSave: (reportData: HvacReportData) => void
}

export function HvacReportForm({ onSave }: HvacReportFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [reportInfo, setReportInfo] = useState<HvacReportInfo>({
    hospitalName: "",
    reportNumber: "",
    measurementDate: "",
    testerName: "",
    reportPreparedBy: "",
    approvedBy: "",
    organizationName: "BC Laboratuvarı"
  })
  const [rooms, setRooms] = useState<Room[]>([])

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors }
  } = useForm<HvacReportInfo>({
    resolver: zodResolver(reportInfoSchema),
    defaultValues: reportInfo
  })

  const steps = [
    { id: 0, title: "Genel Bilgiler", description: "Rapor ve kuruluş bilgileri" },
    { id: 1, title: "Mahal Listesi", description: "Test edilecek odalar" },
    { id: 2, title: "Test Verileri", description: "Her oda için test sonuçları" },
    { id: 3, title: "Önizleme", description: "Rapor kontrolü ve indirme" }
  ]

  const addRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNo: "",
      roomName: "",
      surfaceArea: 0,
      height: 0,
      volume: 0,
      testMode: TestMode.AtRest,
      flowType: FlowType.Turbulence,
      roomClass: RoomClass.ClassII,
      tests: {
        airflowData: {
          speed: 0,
          filterDimensionX: 0,
          filterDimensionY: 0,
          flowRate: 0,
          totalFlowRate: 0,
          airChangeRate: 0,
          meetsCriteria: false,
          criteria: ''
        },
        pressureDifference: {
          pressure: 0,
          referenceArea: "",
          meetsCriteria: false,
          criteria: '≥ 6 Pa'
        },
        airFlowDirection: {
          direction: "Temiz→Kirli",
          result: "UYGUNDUR",
          observation: ""
        },
        hepaLeakage: {
          maxLeakage: 0,
          actualLeakage: 0,
          meetsCriteria: false,
          criteria: '≤ %0.01'
        },
        particleCount: {
          particle05: 0,
          particle5: 0,
          particles05um: [],
          average: 0,
          isoClass: "",
          meetsCriteria: false
        },
        recoveryTime: {
          duration: 0,
          meetsCriteria: false,
          criteria: '≤ 25 dk'
        },
        temperatureHumidity: {
          temperature: 0,
          humidity: 0,
          meetsCriteria: false,
          criteria: '20-24°C, 40-60%'
        }
      }
    }
    
    try {
      setRooms([...rooms, newRoom])
    } catch (error) {
      console.error('Error adding room:', error)
      alert('Oda eklenirken bir hata oluştu.')
    }
  }

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId))
  }

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    try {
      setRooms(rooms.map(room =>
        room.id === roomId ? { ...room, ...updates } : room
      ))
    } catch (error) {
      console.error('Error updating room:', error)
      alert('Oda güncellenirken bir hata oluştu.')
    }
  }

  const updateRoomBasicInfo = (roomId: string, field: string, value: any) => {
    try {
      const room = rooms.find(r => r.id === roomId)
      if (!room) return

      const updatedRoom = { ...room, [field]: value }

      // Auto-calculate volume when area or height changes
      if (field === 'surfaceArea' || field === 'height') {
        updatedRoom.volume = calculateRoomVolume(
          updatedRoom.surfaceArea,
          updatedRoom.height
        )
      }

      updateRoom(roomId, updatedRoom)
    } catch (error) {
      console.error('Error updating room basic info:', error)
      alert('Oda bilgileri güncellenirken bir hata oluştu.')
    }
  }

  const updateRoomTestData = (roomId: string, testType: string, field: string, value: any) => {
    try {
      const room = rooms.find(r => r.id === roomId)
      if (!room) return

      const updatedRoom = { ...room }
      const updatedTests = { ...updatedRoom.tests }

      // Update the specific test data
      if (testType === 'pressureDifference') {
        updatedTests.pressureDifference = {
          ...updatedTests.pressureDifference,
          [field]: value
        }

        // Auto-validate pressure
        if (field === 'pressure') {
          updatedTests.pressureDifference.meetsCriteria = validatePressureDifference(value)
        }
      } else if (testType === 'hepaLeakage') {
        updatedTests.hepaLeakage = {
          ...updatedTests.hepaLeakage,
          [field]: value
        }

        // Auto-validate HEPA leakage
        if (field === 'actualLeakage') {
          updatedTests.hepaLeakage.meetsCriteria = validateHepaLeakage(value)
        }
      } else if (testType === 'particleCount') {
        updatedTests.particleCount = {
          ...updatedTests.particleCount,
          [field]: value
        }

        // Auto-calculate averages and ISO class
        if (field === 'particles05um') {
          const average = value.length > 0 ? value.reduce((a: number, b: number) => a + b, 0) / value.length : 0
          updatedTests.particleCount.particle05 = average
          updatedTests.particleCount.average = average
          updatedTests.particleCount.isoClass = determineISOClass(average)
          updatedTests.particleCount.meetsCriteria = meetsISOStandard(average)
        } else if (field === 'particle05') {
          updatedTests.particleCount.isoClass = determineISOClass(value)
          updatedTests.particleCount.meetsCriteria = meetsISOStandard(value)
        }
      } else if (testType === 'recoveryTime') {
        updatedTests.recoveryTime = {
          ...updatedTests.recoveryTime,
          [field]: value
        }

        // Auto-validate recovery time
        if (field === 'duration') {
          updatedTests.recoveryTime.meetsCriteria = validateRecoveryTime(value)
        }
      } else if (testType === 'temperatureHumidity') {
        updatedTests.temperatureHumidity = {
          ...updatedTests.temperatureHumidity,
          [field]: value
        }

        // Auto-validate temperature and humidity
        if (field === 'temperature' || field === 'humidity') {
          const tempValid = field === 'temperature' ? validateTemperature(value) : validateTemperature(updatedTests.temperatureHumidity.temperature)
          const humidValid = field === 'humidity' ? validateHumidity(value) : validateHumidity(updatedTests.temperatureHumidity.humidity)
          updatedTests.temperatureHumidity.meetsCriteria = tempValid && humidValid
        }
      }

      updatedRoom.tests = updatedTests
      updateRoom(roomId, updatedRoom)
    } catch (error) {
      console.error('Error updating room test data:', error)
      alert('Test verileri güncellenirken bir hata oluştu.')
    }
  }

  const onSubmitInfo = (data: HvacReportInfo) => {
    setReportInfo(data)
    setCurrentStep(1)
  }

  const handleSaveReport = () => {
    try {
      // Validate required data
      if (!reportInfo.hospitalName || !reportInfo.reportNumber) {
        alert('Lütfen gerekli rapor bilgilerini doldurun.')
        return
      }
      
      if (rooms.length === 0) {
        alert('En az bir oda eklemelisiniz.')
        return
      }

      const reportData: HvacReportData = {
        id: `report-${Date.now()}`,
        reportInfo,
        rooms,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onSave(reportData)
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Rapor kaydedilirken bir hata oluştu.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= index
                ? 'bg-[#0B5AA3] border-[#0B5AA3] text-white'
                : 'border-gray-300 text-gray-500'
                }`}>
                {index + 1}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${currentStep >= index ? 'text-[#0B5AA3]' : 'text-gray-500'
                  }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${currentStep > index ? 'bg-[#0B5AA3]' : 'bg-gray-300'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitInfo(onSubmitInfo)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Hastane Adı</Label>
                  <Input
                    id="hospitalName"
                    {...registerInfo("hospitalName")}
                    placeholder="Örn: Nallıhan Devlet Hastanesi"
                  />
                  {infoErrors.hospitalName && (
                    <p className="text-sm text-red-600">{infoErrors.hospitalName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="reportNumber">Rapor Numarası</Label>
                  <Input
                    id="reportNumber"
                    {...registerInfo("reportNumber")}
                    placeholder="Örn: V-2504-039"
                  />
                  {infoErrors.reportNumber && (
                    <p className="text-sm text-red-600">{infoErrors.reportNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="measurementDate">Ölçüm Tarihi</Label>
                  <Input
                    id="measurementDate"
                    type="date"
                    {...registerInfo("measurementDate")}
                  />
                  {infoErrors.measurementDate && (
                    <p className="text-sm text-red-600">{infoErrors.measurementDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="testerName">Testi Yapan</Label>
                  <Input
                    id="testerName"
                    {...registerInfo("testerName")}
                    placeholder="Örn: Nurettin Karaca"
                  />
                  {infoErrors.testerName && (
                    <p className="text-sm text-red-600">{infoErrors.testerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="reportPreparedBy">Raporu Hazırlayan</Label>
                  <Input
                    id="reportPreparedBy"
                    {...registerInfo("reportPreparedBy")}
                    placeholder="Örn: Merve Yazır"
                  />
                  {infoErrors.reportPreparedBy && (
                    <p className="text-sm text-red-600">{infoErrors.reportPreparedBy.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="approvedBy">Onaylayan</Label>
                  <Input
                    id="approvedBy"
                    {...registerInfo("approvedBy")}
                    placeholder="Örn: Sevgi Kılınç"
                  />
                  {infoErrors.approvedBy && (
                    <p className="text-sm text-red-600">{infoErrors.approvedBy.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="organizationName">Kuruluş Adı</Label>
                  <Input
                    id="organizationName"
                    {...registerInfo("organizationName")}
                    placeholder="Örn: BC Laboratuvarı"
                  />
                  {infoErrors.organizationName && (
                    <p className="text-sm text-red-600">{infoErrors.organizationName.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-[#0B5AA3] hover:bg-[#094a8a]">
                  Devam Et
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Mahal (Oda) Listesi
              <Button onClick={addRoom} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
                <PlusIcon size={16} className="mr-2" />
                Oda Ekle
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Henüz oda eklenmemiş</p>
                <Button onClick={addRoom} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
                  <PlusIcon size={16} className="mr-2" />
                  İlk Odayı Ekle
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room, index) => (
                  <Card key={room.id} className="border-l-4 border-l-[#0B5AA3]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Oda {index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Mahal No</Label>
                          <Input
                            value={room.roomNo}
                            onChange={(e) => updateRoomBasicInfo(room.id, 'roomNo', e.target.value)}
                            placeholder="Örn: 0005"
                          />
                        </div>

                        <div>
                          <Label>Mahal Adı</Label>
                          <Input
                            value={room.roomName}
                            onChange={(e) => updateRoomBasicInfo(room.id, 'roomName', e.target.value)}
                            placeholder="Örn: Steril Depo"
                          />
                        </div>

                        <div>
                          <Label>Yüzey Alanı (m²)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={room.surfaceArea}
                            onChange={(e) => updateRoomBasicInfo(room.id, 'surfaceArea', parseFloat(e.target.value) || 0)}
                            placeholder="14.00"
                          />
                        </div>

                        <div>
                          <Label>Yükseklik (m)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={room.height}
                            onChange={(e) => updateRoomBasicInfo(room.id, 'height', parseFloat(e.target.value) || 0)}
                            placeholder="3.00"
                          />
                        </div>

                        <div>
                          <Label>Hacim (m³)</Label>
                          <Input
                            value={room.volume}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label>Test Modu</Label>
                          <Select
                            value={room.testMode}
                            onValueChange={(value) => updateRoomBasicInfo(room.id, 'testMode', value as TestMode)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={TestMode.AtRest}>{TestMode.AtRest}</SelectItem>
                              <SelectItem value={TestMode.InOperation}>{TestMode.InOperation}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Akış Biçimi</Label>
                          <Select
                            value={room.flowType}
                            onValueChange={(value) => updateRoomBasicInfo(room.id, 'flowType', value as FlowType)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={FlowType.Turbulence}>{FlowType.Turbulence}</SelectItem>
                              <SelectItem value={FlowType.Laminar}>{FlowType.Laminar}</SelectItem>
                              <SelectItem value={FlowType.Unidirectional}>{FlowType.Unidirectional}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Mahal Sınıfı</Label>
                          <Select
                            value={room.roomClass}
                            onValueChange={(value) => updateRoomBasicInfo(room.id, 'roomClass', value as RoomClass)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={RoomClass.ClassIB}>{RoomClass.ClassIB}</SelectItem>
                              <SelectItem value={RoomClass.ClassII}>{RoomClass.ClassII}</SelectItem>
                              <SelectItem value={RoomClass.IntensiveCare}>{RoomClass.IntensiveCare}</SelectItem>
                              <SelectItem value={RoomClass.Other}>Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(0)}
              >
                Geri
              </Button>
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={rooms.length === 0}
                className="bg-[#0B5AA3] hover:bg-[#094a8a]"
              >
                Devam Et
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Verileri</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={rooms[0]?.id} className="w-full">
              <TabsList className="flex w-full overflow-x-auto">
                {rooms.map((room, index) => (
                  <TabsTrigger
                    key={room.id}
                    value={room.id}
                    className="flex-shrink-0 min-w-[120px]"
                  >
                    {room.roomName || `Oda ${index + 1}`}
                  </TabsTrigger>
                ))}
              </TabsList>

              {rooms.map((room) => (
                <TabsContent key={room.id} value={room.id} className="space-y-6">
                  {/* Pressure Difference Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basınç Farkı Testi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Basınç (Pa)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={room.tests?.pressureDifference?.pressure || 0}
                            onChange={(e) => updateRoomTestData(room.id, 'pressureDifference', 'pressure', parseFloat(e.target.value) || 0)}
                            placeholder="7"
                          />
                        </div>
                        <div>
                          <Label>Referans Alan</Label>
                          <Input
                            value={room.tests?.pressureDifference?.referenceArea || ''}
                            onChange={(e) => updateRoomTestData(room.id, 'pressureDifference', 'referenceArea', e.target.value)}
                            placeholder="Koridor"
                          />
                        </div>
                        <div>
                          <Label>Sonuç</Label>
                          <div className={`p-2 rounded text-center font-medium ${room.tests?.pressureDifference?.meetsCriteria
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {room.tests?.pressureDifference?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* HEPA Leakage Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">HEPA Sızdırmazlık Testi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Max Sızıntı (%)</Label>
                          <Input
                            type="number"
                            step="0.001"
                            value={room.tests?.hepaLeakage?.maxLeakage || 0}
                            onChange={(e) => updateRoomTestData(room.id, 'hepaLeakage', 'maxLeakage', parseFloat(e.target.value) || 0)}
                            placeholder="0.008"
                          />
                        </div>
                        <div>
                          <Label>Sonuç</Label>
                          <div className={`p-2 rounded text-center font-medium ${room.tests?.hepaLeakage?.meetsCriteria
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {room.tests?.hepaLeakage?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Particle Count Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Partikül Sayısı Testi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>0.5 µm Partikül Ölçümleri (virgülle ayırın)</Label>
                          <Input
                            value={room.tests?.particleCount?.particles05um?.join(', ') || ''}
                            onChange={(e) => {
                              const values = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
                              updateRoomTestData(room.id, 'particleCount', 'particles05um', values)
                            }}
                            placeholder="3200, 3400, 3600, 3300"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Ortalama (0.5 µm)</Label>
                            <Input
                              value={room.tests?.particleCount?.average || 0}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <Label>ISO Sınıfı</Label>
                            <Input
                              value={room.tests?.particleCount?.isoClass || '7'}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <Label>Sonuç</Label>
                            <div className={`p-2 rounded text-center font-medium ${room.tests?.particleCount?.meetsCriteria
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {room.tests?.particleCount?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recovery Time Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recovery Time Testi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Recovery Time (dakika)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={room.tests?.recoveryTime?.duration || 0}
                            onChange={(e) => updateRoomTestData(room.id, 'recoveryTime', 'duration', parseFloat(e.target.value) || 0)}
                            placeholder="24"
                          />
                        </div>
                        <div>
                          <Label>Sonuç</Label>
                          <div className={`p-2 rounded text-center font-medium ${room.tests?.recoveryTime?.meetsCriteria
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {room.tests?.recoveryTime?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Temperature & Humidity Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sıcaklık ve Nem Testi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Sıcaklık (°C)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={room.tests?.temperatureHumidity?.temperature || 0}
                            onChange={(e) => updateRoomTestData(room.id, 'temperatureHumidity', 'temperature', parseFloat(e.target.value) || 0)}
                            placeholder="22.5"
                          />
                        </div>
                        <div>
                          <Label>Nem (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={room.tests?.temperatureHumidity?.humidity || 0}
                            onChange={(e) => updateRoomTestData(room.id, 'temperatureHumidity', 'humidity', parseFloat(e.target.value) || 0)}
                            placeholder="55"
                          />
                        </div>
                        <div>
                          <Label>Sonuç</Label>
                          <div className={`p-2 rounded text-center font-medium ${room.tests?.temperatureHumidity?.meetsCriteria
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {room.tests?.temperatureHumidity?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Geri
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="bg-[#0B5AA3] hover:bg-[#094a8a]"
              >
                Önizleme
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Rapor Önizlemesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Rapor Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Hastane:</span> {reportInfo.hospitalName}</div>
                  <div><span className="font-medium">Rapor No:</span> {reportInfo.reportNumber}</div>
                  <div><span className="font-medium">Tarih:</span> {reportInfo.measurementDate}</div>
                  <div><span className="font-medium">Oda Sayısı:</span> {rooms.length}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Test Sonuçları Özeti</h3>
                {rooms.map((room, index) => (
                  <Card key={room.id} className="border-l-4 border-l-[#0B5AA3]">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{room.roomName || 'Bilinmeyen Oda'}</h4>
                          <p className="text-sm text-gray-600">Mahal No: {room.roomNo || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Sayfa {index + 1}/{rooms.length}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div className={`p-2 rounded text-center ${room.tests?.pressureDifference?.meetsCriteria ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          Basınç: {room.tests?.pressureDifference?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                        </div>
                        <div className={`p-2 rounded text-center ${room.tests?.hepaLeakage?.meetsCriteria ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          HEPA: {room.tests?.hepaLeakage?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                        </div>
                        <div className={`p-2 rounded text-center ${room.tests?.particleCount?.meetsCriteria ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          Partikül: {room.tests?.particleCount?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                        </div>
                        <div className={`p-2 rounded text-center ${room.tests?.recoveryTime?.meetsCriteria ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          Recovery: {room.tests?.recoveryTime?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                        </div>
                        <div className={`p-2 rounded text-center ${room.tests?.temperatureHumidity?.meetsCriteria ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          Sıcaklık/Nem: {room.tests?.temperatureHumidity?.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Geri
                </Button>
                <Button
                  onClick={handleSaveReport}
                  className="bg-[#0B5AA3] hover:bg-[#094a8a]"
                >
                  Raporu Kaydet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}