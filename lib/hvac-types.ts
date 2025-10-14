export interface HvacReportInfo {
  hospitalName: string
  reportNumber: string
  measurementDate: string
  testerName: string
  reportPreparedBy: string
  approvedBy: string
  organizationName: string
  logo?: string
  stamp?: string
}

export interface RoomBasicInfo {
  roomNumber: string
  roomName: string
  surfaceArea: number
  height: number
  volume: number // Calculated: surfaceArea * height
  testMode: 'At Rest' | 'In Operation'
  flowType: 'Turbulence' | 'Laminar' | 'Unidirectional'
  roomClass: string
}

export interface AirFlowTest {
  velocity: number // m/s
  filterSizeX: number // mm
  filterSizeY: number // mm
  flowRate: number // m³/h - calculated
  totalFlowRate: number // m³/h
  airChangeRate: number // 1/hour - calculated
  meetsMinCriteria: boolean
}

export interface PressureDifferenceTest {
  pressure: number // Pa
  referenceArea: string
  meetsMinPressure: boolean // >= 6 Pa
  result: 'Uygundur' | 'Uygun Değil'
}

export interface AirFlowDirectionTest {
  direction: string
  result: 'Uygundur' | 'Uygun Değil'
}

export interface HepaLeakageTest {
  maxLeakage: number // %
  meetsMaxLeakage: boolean // <= 0.01%
  result: 'Uygundur' | 'Uygun Değil'
}

export interface ParticleCountTest {
  particles05um: number[]
  particles50um: number[]
  average05um: number
  average50um: number
  isoClass: string
  meetsISOStandard: boolean
  result: 'Uygundur' | 'Uygun Değil'
}

export interface RecoveryTimeTest {
  recoveryTime: number // minutes
  meetsMaxTime: boolean // <= 25 minutes
  result: 'Uygundur' | 'Uygun Değil'
}

export interface TemperatureHumidityTest {
  temperature: number // °C
  humidity: number // %
  temperatureInRange: boolean // 20-24°C
  humidityInRange: boolean // 40-60%
  result: 'Uygundur' | 'Uygun Değil'
}

export interface NoiseIlluminationTest {
  noise: number // dB
  illumination: number // Lux
  meetsIESTStandard: boolean
  result: 'Uygundur' | 'Uygun Değil'
}

export interface RoomTestData {
  id: string
  basicInfo: RoomBasicInfo
  airFlow: AirFlowTest
  pressureDifference: PressureDifferenceTest
  airFlowDirection: AirFlowDirectionTest
  hepaLeakage: HepaLeakageTest
  particleCount: ParticleCountTest
  recoveryTime: RecoveryTimeTest
  temperatureHumidity: TemperatureHumidityTest
  noiseIllumination?: NoiseIlluminationTest
}

export interface HvacReportData {
  id: string
  reportInfo: HvacReportInfo
  rooms: RoomTestData[]
  createdAt: string
  updatedAt: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}