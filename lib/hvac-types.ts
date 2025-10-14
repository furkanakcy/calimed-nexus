export interface HvacReportInfo {
  hospitalName: string
  reportNumber: string
  measurementDate: string
  testerName: string
  reportPreparerName: string
  approverName: string
  organizationName: string
  logo?: string
  seal?: string
}

export enum TestMode {
  AtRest = 'At Rest',
  InOperation = 'In Operation'
}

export enum FlowType {
  Turbulence = 'Turbulence',
  Laminar = 'Laminar',
  Unidirectional = 'Unidirectional'
}

export enum RoomClass {
  ClassIB = 'Class IB',
  ClassII = 'Class II',
  IntensiveCare = 'Intensive Care',
  Other = 'Other'
}

export interface Room {
  id: string
  roomNo: string
  roomName: string
  surfaceArea: number
  height: number
  volume: number
  testMode: TestMode
  flowType: FlowType
  roomClass: RoomClass
  tests: TestsData
}

export interface AirflowData {
  speed: number
  filterDimensionX: number
  filterDimensionY: number
  flowRate: number
  totalFlowRate: number
  airChangeRate: number
  meetsCriteria: boolean
  criteria: string
}

export interface PressureDifference {
  pressure: number
  referenceArea: string
  meetsCriteria: boolean
  criteria: string
}

export interface AirFlowDirection {
  direction: string
  result: string
  observation: string
}

export interface HepaLeakage {
  maxLeakage: number
  actualLeakage: number
  meetsCriteria: boolean
  criteria: string
}

export interface ParticleCount {
  particle05: number
  particle5: number
  average: number
  isoClass: string
  meetsCriteria: boolean
}

export interface RecoveryTime {
  duration: number
  meetsCriteria: boolean
  criteria: string
}

export interface TemperatureHumidity {
  temperature: number
  humidity: number
  meetsCriteria: boolean
  criteria: string
}

export interface TestsData {
  airflowData: AirflowData
  pressureDifference: PressureDifference
  airFlowDirection: AirFlowDirection
  hepaLeakage: HepaLeakage
  particleCount: ParticleCount
  recoveryTime: RecoveryTime
  temperatureHumidity: TemperatureHumidity
}

export interface HvacReportData {
  id: string
  reportInfo: HvacReportInfo
  rooms: Room[]
  createdAt: string
  updatedAt: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}