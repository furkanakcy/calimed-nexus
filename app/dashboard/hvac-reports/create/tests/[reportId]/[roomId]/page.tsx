"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HvacReportData, Room, TestsData } from "@/lib/hvac-types"

export default function TestEntryForm() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.reportId as string
  const roomId = params.roomId as string
  
  const [report, setReport] = useState<HvacReportData | null>(null)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [testsData, setTestsData] = useState<TestsData | null>(null)
  
  useEffect(() => {
    // Load the report data
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const foundReport = reports.find(r => r.id === reportId)
      if (foundReport) {
        setReport(foundReport)
        const room = foundReport.rooms.find(r => r.id === roomId)
        if (room) {
          setCurrentRoom(room)
          setTestsData(room.tests)
        }
      }
    }
  }, [reportId, roomId])
  
  if (!report || !currentRoom || !testsData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
        </div>
      </DashboardLayout>
    )
  }
  
  const handleTestDataChange = (category: keyof TestsData, field: string, value: any) => {
    if (!testsData) return
    
    const updatedTests = {
      ...testsData,
      [category]: {
        ...testsData[category],
        [field]: value
      }
    }
    setTestsData(updatedTests)
  }
  
  const handleSubmit = () => {
    // Update the report in localStorage with the new test data
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports && testsData) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const reportIndex = reports.findIndex(r => r.id === reportId)
      
      if (reportIndex !== -1) {
        const roomIndex = reports[reportIndex].rooms.findIndex(r => r.id === roomId)
        if (roomIndex !== -1) {
          reports[reportIndex].rooms[roomIndex].tests = testsData
          reports[reportIndex].updatedAt = new Date().toISOString()
          localStorage.setItem('hvac-reports', JSON.stringify(reports))
        }
      }
    }
    
    // Navigate to next room or back to report list
    const currentRoomIndex = report.rooms.findIndex(r => r.id === roomId)
    const nextRoom = report.rooms[currentRoomIndex + 1]
    
    if (nextRoom) {
      router.push(`/dashboard/hvac-reports/create/tests/${reportId}/${nextRoom.id}`)
    } else {
      router.push(`/dashboard/hvac-reports`)
    }
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentRoom.roomName} - Test Girişi</h2>
          <p className="text-gray-600 mt-1">Oda numarası: {currentRoom.roomNo} - Sınıf: {currentRoom.roomClass}</p>
        </div>
        
        <Tabs defaultValue="airflow" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="airflow">Hava Debisi</TabsTrigger>
            <TabsTrigger value="pressure">Basınç Farkı</TabsTrigger>
            <TabsTrigger value="direction">Akış Yönü</TabsTrigger>
            <TabsTrigger value="hepa">HEPA Test</TabsTrigger>
            <TabsTrigger value="particle">Partikül</TabsTrigger>
            <TabsTrigger value="recovery">Kurtarma</TabsTrigger>
            <TabsTrigger value="climate">Sıcaklık/Nem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="airflow">
            <Card>
              <CardHeader>
                <CardTitle>Hava Debisi ve Hava Değişim Oranı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Hız (m/s)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={testsData.airflowData.speed}
                      onChange={(e) => handleTestDataChange('airflowData', 'speed', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Filtre X Boyutu (mm)</Label>
                    <Input
                      type="number"
                      value={testsData.airflowData.filterDimensionX}
                      onChange={(e) => handleTestDataChange('airflowData', 'filterDimensionX', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Filtre Y Boyutu (mm)</Label>
                    <Input
                      type="number"
                      value={testsData.airflowData.filterDimensionY}
                      onChange={(e) => handleTestDataChange('airflowData', 'filterDimensionY', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Debi (m³/h)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={testsData.airflowData.flowRate}
                      onChange={(e) => handleTestDataChange('airflowData', 'flowRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pressure">
            <Card>
              <CardHeader>
                <CardTitle>Basınç Farkı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Basınç (Pa)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={testsData.pressureDifference.pressure}
                      onChange={(e) => handleTestDataChange('pressureDifference', 'pressure', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Referans Alan</Label>
                    <Input
                      value={testsData.pressureDifference.referenceArea}
                      onChange={(e) => handleTestDataChange('pressureDifference', 'referenceArea', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="direction">
            <Card>
              <CardHeader>
                <CardTitle>Hava Akış Yönü</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Akış Yönü</Label>
                    <Select 
                      value={testsData.airFlowDirection.direction}
                      onValueChange={(value) => handleTestDataChange('airFlowDirection', 'direction', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Temiz→Kirli">Temiz → Kirli</SelectItem>
                        <SelectItem value="Kirli→Temiz">Kirli → Temiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sonuç</Label>
                    <Select 
                      value={testsData.airFlowDirection.result}
                      onValueChange={(value) => handleTestDataChange('airFlowDirection', 'result', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UYGUNDUR">UYGUNDUR</SelectItem>
                        <SelectItem value="UYGUN DEĞİLDİR">UYGUN DEĞİLDİR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hepa">
            <Card>
              <CardHeader>
                <CardTitle>HEPA Filtre Sızdırmazlık Testi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maksimum Sızıntı (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={testsData.hepaLeakage.maxLeakage}
                      onChange={(e) => handleTestDataChange('hepaLeakage', 'maxLeakage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gerçekleşen Sızıntı (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={testsData.hepaLeakage.actualLeakage}
                      onChange={(e) => handleTestDataChange('hepaLeakage', 'actualLeakage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="particle">
            <Card>
              <CardHeader>
                <CardTitle>Partikül Sayısı ve Temizlik Sınıfı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>0.5 µm Partikül Sayısı</Label>
                    <Input
                      type="number"
                      value={testsData.particleCount.particle05}
                      onChange={(e) => handleTestDataChange('particleCount', 'particle05', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>5.0 µm Partikül Sayısı</Label>
                    <Input
                      type="number"
                      value={testsData.particleCount.particle5}
                      onChange={(e) => handleTestDataChange('particleCount', 'particle5', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ISO Sınıfı</Label>
                    <Input
                      value={testsData.particleCount.isoClass}
                      onChange={(e) => handleTestDataChange('particleCount', 'isoClass', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recovery">
            <Card>
              <CardHeader>
                <CardTitle>Kurtarma / Geri Kazanım Süresi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Süre (dk)</Label>
                    <Input
                      type="number"
                      value={testsData.recoveryTime.duration}
                      onChange={(e) => handleTestDataChange('recoveryTime', 'duration', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.recoveryTime.criteria}
                      onChange={(e) => handleTestDataChange('recoveryTime', 'criteria', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="climate">
            <Card>
              <CardHeader>
                <CardTitle>Sıcaklık ve Nem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sıcaklık (°C)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={testsData.temperatureHumidity.temperature}
                      onChange={(e) => handleTestDataChange('temperatureHumidity', 'temperature', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nem (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={testsData.temperatureHumidity.humidity}
                      onChange={(e) => handleTestDataChange('temperatureHumidity', 'humidity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/dashboard/hvac-reports/create/rooms/${reportId}`)}
          >
            Geri
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-[#0B5AA3] hover:bg-[#094a8a]"
          >
            {report.rooms.findIndex(r => r.id === roomId) < report.rooms.length - 1 ? 'Sonraki Oda' : 'Tamamla'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}