\"use client\"

import { useState, useEffect } from \"react\"
import { useRouter, useParams } from \"next/navigation\"
import { DashboardLayout } from \"@/components/dashboard-layout\"
import { Button } from \"@/components/ui/button\"
import { Card, CardContent, CardHeader, CardTitle } from \"@/components/ui/card\"
import { Input } from \"@/components/ui/input\"
import { Label } from \"@/components/ui/label\"
import { Tabs, TabsContent, TabsList, TabsTrigger } from \"@/components/ui/tabs\"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from \"@/components/ui/select\"
import { HvacReportData, Room, TestsData } from \"@/lib/hvac-types\"

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
        const foundRoom = foundReport.rooms.find(r => r.id === roomId)
        if (foundRoom) {
          setCurrentRoom(foundRoom)
          setTestsData(foundRoom.tests)
        }
      }
    }
  }, [reportId, roomId])
  
  if (!report || !currentRoom || !testsData) {
    return (
      <DashboardLayout>
        <div className=\"min-h-screen flex items-center justify-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]\"></div>
        </div>
      </DashboardLayout>
    )
  }
  
  const updateTestsData = (section: keyof TestsData, data: any) => {
    const updatedTests = {
      ...testsData,
      [section]: {
        ...testsData[section],
        ...data
      }
    }
    setTestsData(updatedTests)
    
    // Update the room in the report
    const updatedRooms = report.rooms.map(room => 
      room.id === roomId 
        ? { ...room, tests: updatedTests } 
        : room
    )
    
    const updatedReport = {
      ...report,
      rooms: updatedRooms,
      updatedAt: new Date()
    }
    
    // Update localStorage
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const reportIndex = reports.findIndex(r => r.id === reportId)
      if (reportIndex !== -1) {
        reports[reportIndex] = updatedReport
        localStorage.setItem('hvac-reports', JSON.stringify(reports))
      }
    }
    
    setReport(updatedReport)
    setCurrentRoom({ ...currentRoom, tests: updatedTests })
  }
  
  const handleAirflowDataChange = (field: string, value: any) => {
    updateTestsData('airflowData', { [field]: value })
  }
  
  const handlePressureDifferenceChange = (field: string, value: any) => {
    updateTestsData('pressureDifference', { [field]: value })
  }
  
  const handleAirFlowDirectionChange = (field: string, value: any) => {
    updateTestsData('airFlowDirection', { [field]: value })
  }
  
  const handleHEPALeakageChange = (field: string, value: any) => {
    updateTestsData('hepaLeakage', { [field]: value })
  }
  
  const handleParticleCountChange = (field: string, value: any) => {
    updateTestsData('particleCount', { [field]: value })
  }
  
  const handleRecoveryTimeChange = (field: string, value: any) => {
    updateTestsData('recoveryTime', { [field]: value })
  }
  
  const handleTemperatureHumidityChange = (field: string, value: any) => {
    updateTestsData('temperatureHumidity', { [field]: value })
  }
  
  const handleNextRoom = () => {
    // Find current room index and navigate to next room or summary
    const roomIndex = report.rooms.findIndex(r => r.id === roomId)
    if (roomIndex < report.rooms.length - 1) {
      const nextRoom = report.rooms[roomIndex + 1]
      router.push(`/dashboard/hvac-reports/create/tests/${reportId}/${nextRoom.id}`)
    } else {
      // All rooms completed, go to preview
      router.push(`/dashboard/hvac-reports/preview/${reportId}`)
    }
  }
  
  const handlePreviousRoom = () => {
    const roomIndex = report.rooms.findIndex(r => r.id === roomId)
    if (roomIndex > 0) {
      const prevRoom = report.rooms[roomIndex - 1]
      router.push(`/dashboard/hvac-reports/create/tests/${reportId}/${prevRoom.id}`)
    } else {
      router.push(`/dashboard/hvac-reports/create/rooms/${reportId}`)
    }
  }
  
  return (
    <DashboardLayout>
      <div className=\"space-y-6 max-w-6xl mx-auto\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900\">{currentRoom.roomName} - Test Girişi</h2>
          <p className=\"text-gray-600 mt-1\">Oda numarası: {currentRoom.roomNo} - Sınıf: {currentRoom.roomClass}</p>
        </div>
        
        <Tabs defaultValue=\"airflow\" className=\"space-y-4\">
          <TabsList className=\"grid w-full grid-cols-7\">
            <TabsTrigger value=\"airflow\">Hava Debisi</TabsTrigger>
            <TabsTrigger value=\"pressure\">Basınç Farkı</TabsTrigger>
            <TabsTrigger value=\"flow-direction\">Hava Akış Yönü</TabsTrigger>
            <TabsTrigger value=\"hepa\">HEPA Sızdırmazlık</TabsTrigger>
            <TabsTrigger value=\"particle\">Partikül Sayısı</TabsTrigger>
            <TabsTrigger value=\"recovery\">Kurtarma Süresi</TabsTrigger>
            <TabsTrigger value=\"temp-humidity\">Sıcaklık ve Nem</TabsTrigger>
          </TabsList>
          
          <TabsContent value=\"airflow\">
            <Card>
              <CardHeader>
                <CardTitle>Hava Debisi ve Hava Değişim Oranı</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Hız (m/s)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.001\"
                      value={testsData.airflowData.speed}
                      onChange={(e) => handleAirflowDataChange('speed', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Filtre X Boyutu (mm)</Label>
                    <Input
                      type=\"number\"
                      value={testsData.airflowData.filterDimensionX}
                      onChange={(e) => handleAirflowDataChange('filterDimensionX', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Filtre Y Boyutu (mm)</Label>
                    <Input
                      type=\"number\"
                      value={testsData.airflowData.filterDimensionY}
                      onChange={(e) => handleAirflowDataChange('filterDimensionY', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Debi (m³/h)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.01\"
                      value={testsData.airflowData.flowRate}
                      onChange={(e) => handleAirflowDataChange('flowRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Toplam Debi (m³/h)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.01\"
                      value={testsData.airflowData.totalFlowRate}
                      onChange={(e) => handleAirflowDataChange('totalFlowRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Hava Değişim Oranı (1/saat)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.001\"
                      value={testsData.airflowData.airChangeRate}
                      onChange={(e) => handleAirflowDataChange('airChangeRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.airflowData.criteria}
                      onChange={(e) => handleAirflowDataChange('criteria', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.airflowData.meetsCriteria.toString()}
                      onValueChange={(value) => handleAirflowDataChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"pressure\">
            <Card>
              <CardHeader>
                <CardTitle>Basınç Farkı ve Hava Akış Yönü</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Basınç (Pa)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.1\"
                      value={testsData.pressureDifference.pressure}
                      onChange={(e) => handlePressureDifferenceChange('pressure', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Referans Alan</Label>
                    <Input
                      value={testsData.pressureDifference.referenceArea}
                      onChange={(e) => handlePressureDifferenceChange('referenceArea', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.pressureDifference.criteria}
                      onChange={(e) => handlePressureDifferenceChange('criteria', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.pressureDifference.meetsCriteria.toString()}
                      onValueChange={(value) => handlePressureDifferenceChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"flow-direction\">
            <Card>
              <CardHeader>
                <CardTitle>Hava Akış Yönü</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Akış Yönü</Label>
                    <Select 
                      value={testsData.airFlowDirection.direction}
                      onValueChange={(value) => handleAirFlowDirectionChange('direction', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"Temiz→Kirli\">Temiz → Kirli</SelectItem>
                        <SelectItem value=\"Kirli→Temiz\">Kirli → Temiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Sonuç</Label>
                    <Select 
                      value={testsData.airFlowDirection.result}
                      onValueChange={(value) => handleAirFlowDirectionChange('result', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"UYGUNDUR\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"UYGUN DEĞİL\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className=\"space-y-2 col-span-2\">
                    <Label>Observasyon</Label>
                    <Input
                      value={testsData.airFlowDirection.observation}
                      onChange={(e) => handleAirFlowDirectionChange('observation', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"hepa\">
            <Card>
              <CardHeader>
                <CardTitle>HEPA Filtre Sızdırmazlık Testi</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Maksimum Sızıntı (%</Label>
                    <Input
                      type=\"number\"
                      step=\"0.001\"
                      value={testsData.hepaLeakage.maxLeakage}
                      onChange={(e) => handleHEPALeakageChange('maxLeakage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Gerçekleşen Sızıntı (%</Label>
                    <Input
                      type=\"number\"
                      step=\"0.001\"
                      value={testsData.hepaLeakage.actualLeakage}
                      onChange={(e) => handleHEPALeakageChange('actualLeakage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.hepaLeakage.criteria}
                      onChange={(e) => handleHEPALeakageChange('criteria', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.hepaLeakage.meetsCriteria.toString()}
                      onValueChange={(value) => handleHEPALeakageChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"particle\">
            <Card>
              <CardHeader>
                <CardTitle>Partikül Sayısı ve Temizlik Sınıfı</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>0.5 µm Partikül Sayısı</Label>
                    <Input
                      type=\"number\"
                      value={testsData.particleCount.particle05}
                      onChange={(e) => handleParticleCountChange('particle05', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>5.0 µm Partikül Sayısı</Label>
                    <Input
                      type=\"number\"
                      value={testsData.particleCount.particle5}
                      onChange={(e) => handleParticleCountChange('particle5', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Ortalama</Label>
                    <Input
                      type=\"number\"
                      step=\"0.01\"
                      value={testsData.particleCount.average}
                      onChange={(e) => handleParticleCountChange('average', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>ISO Sınıfı</Label>
                    <Input
                      value={testsData.particleCount.isoClass}
                      onChange={(e) => handleParticleCountChange('isoClass', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2 col-span-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.particleCount.meetsCriteria.toString()}
                      onValueChange={(value) => handleParticleCountChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"recovery\">
            <Card>
              <CardHeader>
                <CardTitle>Kurtarma / Geri Kazanım Süresi</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Süre (dk)</Label>
                    <Input
                      type=\"number\"
                      value={testsData.recoveryTime.duration}
                      onChange={(e) => handleRecoveryTimeChange('duration', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.recoveryTime.criteria}
                      onChange={(e) => handleRecoveryTimeChange('criteria', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.recoveryTime.meetsCriteria.toString()}
                      onValueChange={(value) => handleRecoveryTimeChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value=\"temp-humidity\">
            <Card>
              <CardHeader>
                <CardTitle>Sıcaklık ve Nem</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Sıcaklık (°C)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.1\"
                      value={testsData.temperatureHumidity.temperature}
                      onChange={(e) => handleTemperatureHumidityChange('temperature', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Nem (%)</Label>
                    <Input
                      type=\"number\"
                      step=\"0.1\"
                      value={testsData.temperatureHumidity.humidity}
                      onChange={(e) => handleTemperatureHumidityChange('humidity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Kriter</Label>
                    <Input
                      value={testsData.temperatureHumidity.criteria}
                      onChange={(e) => handleTemperatureHumidityChange('criteria', e.target.value)}
                    />
                  </div>
                  
                  <div className=\"space-y-2\">
                    <Label>Uygunluk</Label>
                    <Select 
                      value={testsData.temperatureHumidity.meetsCriteria.toString()}
                      onValueChange={(value) => handleTemperatureHumidityChange('meetsCriteria', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"true\">UYGUNDUR</SelectItem>
                        <SelectItem value=\"false\">UYGUN DEĞİL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className=\"flex justify-between\">
          <Button 
            variant=\"outline\" 
            onClick={handlePreviousRoom}
            disabled={report.rooms.findIndex(r => r.id === roomId) === 0}
          >
            Geri
          </Button>
          <Button 
            onClick={handleNextRoom}
            className=\"bg-[#0B5AA3] hover:bg-[#094a8a]\"
          >
            {report.rooms.findIndex(r => r.id === roomId) === report.rooms.length - 1 
              ? 'Tümünü Tamamla' 
              : 'Sonraki Odaya Geç'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}