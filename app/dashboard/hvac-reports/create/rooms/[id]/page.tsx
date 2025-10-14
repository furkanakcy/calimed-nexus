use client

import { useState, useEffect } from \"react\"
import { useRouter, useParams } from \"next/navigation\"
import { DashboardLayout } from \"@/components/dashboard-layout\"
import { Button } from \"@/components/ui/button\"
import { Card, CardContent, CardHeader, CardTitle } from \"@/components/ui/card\"
import { Input } from \"@/components/ui/input\"
import { Label } from \"@/components/ui/label\"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from \"@/components/ui/select\"
import { PlusIcon, TrashIcon } from \"@/components/icons\"
import { HvacReportData, Room, TestMode, FlowType, RoomClass } from \"@/lib/hvac-types\"

export default function RoomsForm() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.id as string
  
  const [report, setReport] = useState<HvacReportData | null>(null)
  const [rooms, setRooms] = useState<Omit<Room, 'tests'>[]>([
    {
      id: Date.now().toString(),
      roomNo: '0001',
      roomName: 'Ameliyathane 1',
      surfaceArea: 20.00,
      height: 3.00,
      volume: 60.00, // Calculated automatically
      testMode: TestMode.AtRest,
      flowType: FlowType.Turbulence,
      roomClass: RoomClass.ClassII,
    }
  ])
  
  useEffect(() => {
    // Load the report data
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const foundReport = reports.find(r => r.id === reportId)
      if (foundReport) {
        setReport(foundReport)
        if (foundReport.rooms.length > 0) {
          // Load existing rooms if any
          setRooms(foundReport.rooms.map(room => {
            const { tests, ...roomWithoutTests } = room
            return roomWithoutTests
          }))
        }
      }
    }
  }, [reportId])
  
  useEffect(() => {
    // Calculate volume whenever surface area or height changes
    const updatedRooms = rooms.map(room => ({
      ...room,
      volume: room.surfaceArea * room.height
    }))
    setRooms(updatedRooms)
  }, [rooms])
  
  const handleRoomChange = (index: number, field: keyof Omit<Room, 'tests' | 'id' | 'volume'>, value: any) => {
    const updatedRooms = [...rooms]
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value
    }
    setRooms(updatedRooms)
  }
  
  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        id: Date.now().toString(),
        roomNo: (parseInt(rooms[rooms.length - 1]?.roomNo || '0000') + 1).toString().padStart(4, '0'),
        roomName: 'Yeni Oda',
        surfaceArea: 14.00,
        height: 3.00,
        volume: 42.00, // Calculated automatically
        testMode: TestMode.AtRest,
        flowType: FlowType.Turbulence,
        roomClass: RoomClass.ClassII,
      }
    ])
  }
  
  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      const updatedRooms = [...rooms]
      updatedRooms.splice(index, 1)
      setRooms(updatedRooms)
    }
  }
  
  const handleSubmit = () => {
    // Update the report in localStorage with the new rooms data
    const savedReports = localStorage.getItem('hvac-reports')
    if (savedReports) {
      const reports: HvacReportData[] = JSON.parse(savedReports)
      const reportIndex = reports.findIndex(r => r.id === reportId)
      
      if (reportIndex !== -1) {
        // Add empty tests objects to rooms before saving
        const roomsWithTests = rooms.map(room => ({
          ...room,
          tests: {
            airflowData: {
              speed: 0,
              filterDimensionX: 0,
              filterDimensionY: 0,
              flowRate: 0,
              totalFlowRate: 0,
              airChangeRate: 0,
              meetsCriteria: true,
              criteria: '',
            },
            pressureDifference: {
              pressure: 0,
              referenceArea: '',
              meetsCriteria: true,
              criteria: '',
            },
            airFlowDirection: {
              direction: 'Temiz→Kirli',
              result: 'UYGUNDUR',
              observation: '',
            },
            hepaLeakage: {
              maxLeakage: 0,
              actualLeakage: 0,
              meetsCriteria: true,
              criteria: '',
            },
            particleCount: {
              particle05: 0,
              particle5: 0,
              average: 0,
              isoClass: '',
              meetsCriteria: true,
            },
            recoveryTime: {
              duration: 0,
              meetsCriteria: true,
              criteria: '',
            },
            temperatureHumidity: {
              temperature: 0,
              humidity: 0,
              meetsCriteria: true,
              criteria: '',
            },
          }
        }))
        
        reports[reportIndex] = {
          ...reports[reportIndex],
          rooms: roomsWithTests,
          updatedAt: new Date(),
        }
        
        localStorage.setItem('hvac-reports', JSON.stringify(reports))
      }
    }
    
    // Navigate to the first room's tests page
    router.push(`/dashboard/hvac-reports/create/tests/${reportId}/${rooms[0].id}`)
  }
  
  if (!report) {
    return (
      <DashboardLayout>
        <div className=\"min-h-screen flex items-center justify-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]\"></div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className=\"space-y-6 max-w-6xl mx-auto\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900\">HVAC Raporu - Odalar</h2>
          <p className=\"text-gray-600 mt-1\">Test edilecek mahalleri (odaları) tanımlayın</p>
        </div>
        
        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between\">
            <CardTitle>Odalar</CardTitle>
            <Button onClick={addRoom} variant=\"outline\">
              <PlusIcon size={20} className=\"mr-2\" />
              Yeni Oda Ekle
            </Button>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-6\">
              {rooms.map((room, index) => (
                <Card key={room.id}>
                  <CardHeader className=\"flex flex-row items-center justify-between pb-3\">
                    <CardTitle className=\"text-lg\">Oda {index + 1}</CardTitle>
                    {rooms.length > 1 && (
                      <Button 
                        variant=\"outline\" 
                        size=\"sm\" 
                        onClick={() => removeRoom(index)}
                        className=\"text-red-600 hover:text-red-700 hover:bg-red-50\"
                      >
                        <TrashIcon size={16} />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className=\"space-y-4\">
                    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
                      <div className=\"space-y-2\">
                        <Label htmlFor={`roomNo-${index}`}>Mahal No</Label>
                        <Input
                          id={`roomNo-${index}`}
                          value={room.roomNo}
                          onChange={(e) => handleRoomChange(index, 'roomNo', e.target.value)}
                        />
                      </div>
                      
                      <div className=\"space-y-2\">
                        <Label htmlFor={`roomName-${index}`}>Mahal Adı</Label>
                        <Input
                          id={`roomName-${index}`}
                          value={room.roomName}
                          onChange={(e) => handleRoomChange(index, 'roomName', e.target.value)}
                        />
                      </div>
                      
                      <div className=\"space-y-2\">
                        <Label htmlFor={`surfaceArea-${index}`}>Yüzey Alanı (m²)</Label>
                        <Input
                          id={`surfaceArea-${index}`}
                          type=\"number\"
                          step=\"0.01\"
                          value={room.surfaceArea}
                          onChange={(e) => handleRoomChange(index, 'surfaceArea', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className=\"space-y-2\">
                        <Label htmlFor={`height-${index}`}>Yükseklik (m)</Label>
                        <Input
                          id={`height-${index}`}
                          type=\"number\"
                          step=\"0.01\"
                          value={room.height}
                          onChange={(e) => handleRoomChange(index, 'height', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className=\"space-y-2\">
                        <Label>Hacim (m³)</Label>
                        <Input
                          value={room.volume.toFixed(2)}
                          readOnly
                          className=\"bg-gray-100 cursor-not-allowed\"
                        />
                      </div>
                      
                      <div className=\"space-y-2\">
                        <Label>Test Modu</Label>
                        <Select 
                          value={room.testMode}
                          onValueChange={(value) => handleRoomChange(index, 'testMode', value as TestMode)}
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
                      
                      <div className=\"space-y-2\">
                        <Label>Akış Biçimi</Label>
                        <Select 
                          value={room.flowType}
                          onValueChange={(value) => handleRoomChange(index, 'flowType', value as FlowType)}
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
                      
                      <div className=\"space-y-2\">
                        <Label>Mahal Sınıfı</Label>
                        <Select 
                          value={room.roomClass}
                          onValueChange={(value) => handleRoomChange(index, 'roomClass', value as RoomClass)}
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
            
            <div className=\"flex justify-end gap-4 mt-6\">
              <Button 
                type=\"button\" 
                variant=\"outline\" 
                onClick={() => router.push(`/dashboard/hvac-reports/create`)}
              >
                Geri
              </Button>
              <Button 
                type=\"button\" 
                onClick={handleSubmit}
                className=\"bg-[#0B5AA3] hover:bg-[#094a8a]\"
              >
                Test Girişi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}