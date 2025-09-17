export interface GeneralInfo {
  hospitalName: string;
  reportNo: string;
  measurementDate: string;
  testerName: string;
  preparedBy: string;
  approvedBy: string;
  organizationName: string;
  logo?: string;
  stamp?: string;
}

export interface Room {
  id: string;
  roomNo: string;
  roomName: string;
  surfaceArea: number;
  height: number;
  volume: number; // auto calculated
  testMode: 'At Rest' | 'In Operation';
  flowType: 'Turbulence' | 'Laminar' | 'Unidirectional';
  roomClass: string;
}

export interface AirFlowTest {
  velocity: number; // m/s
  filterSizeX: number; // mm
  filterSizeY: number; // mm
  debit: number; // m³/h - auto calculated
  totalDebit: number; // m³/h
  airChangeRate: number; // 1/h - auto calculated
  minCriteria: number;
}

export interface PressureTest {
  pressure: number; // Pa
  referenceArea: string;
  isCompliant: boolean; // ≥6 Pa
}

export interface AirFlowDirection {
  direction: string;
  result: 'Uygundur' | 'Uygun Değil';
}

export interface HEPATest {
  leakage: number; // %
  isCompliant: boolean; // ≤0.01%
}

export interface ParticleTest {
  particle05: number[];
  particle50: number[];
  average05: number;
  average50: number;
  isoClass: string;
  isCompliant: boolean;
}

export interface RecoveryTest {
  duration: number; // minutes
  isCompliant: boolean; // ≤25 min
}

export interface TemperatureHumidityTest {
  temperature: number; // °C
  humidity: number; // %
  tempCompliant: boolean; // 20-24°C
  humidityCompliant: boolean; // 40-60%
}

export interface NoiseIlluminationTest {
  noise: number; // dB
  illumination: number; // Lux
  noiseCompliant: boolean;
  illuminationCompliant: boolean;
}

export interface RoomTestData {
  roomId: string;
  airFlow: AirFlowTest;
  pressure: PressureTest;
  airDirection: AirFlowDirection;
  hepa: HEPATest;
  particle: ParticleTest;
  recovery: RecoveryTest;
  tempHumidity: TemperatureHumidityTest;
  noiseIllumination?: NoiseIlluminationTest;
}

export interface ReportData {
  generalInfo: GeneralInfo;
  rooms: Room[];
  testData: Record<string, RoomTestData>;
}

export type FormStep = 'general' | 'rooms' | 'tests' | 'preview' | 'download';</parameter>