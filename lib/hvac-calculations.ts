import { Room } from './hvac-types'

// Calculate air flow rate from velocity and filter dimensions
export function calculateAirFlowRate(velocity: number, filterX: number, filterY: number): number {
  // Convert mm to m and calculate flow rate in m³/h
  const area = (filterX / 1000) * (filterY / 1000) // m²
  const flowRate = velocity * area * 3600 // m³/h
  return Math.round(flowRate * 100) / 100
}

// Calculate air change rate
export function calculateAirChangeRate(totalFlowRate: number, roomVolume: number): number {
  if (roomVolume === 0) return 0
  const changeRate = totalFlowRate / roomVolume
  return Math.round(changeRate * 100) / 100
}

// Calculate room volume
export function calculateRoomVolume(surfaceArea: number, height: number): number {
  return Math.round(surfaceArea * height * 100) / 100
}

// Calculate number of sampling points according to ISO 14644-1
export function calculateSamplingPoints(area: number): number {
  return Math.max(4, Math.round(Math.sqrt(10 * area)))
}

// Determine ISO class based on particle count (0.5 µm)
export function determineISOClass(averageParticles: number): string {
  if (averageParticles <= 3520) return "ISO 7"
  if (averageParticles <= 35200) return "ISO 8"
  if (averageParticles <= 352000) return "ISO 9"
  return "ISO 9+"
}

// Check if particle count meets ISO 7 standard
export function meetsISOStandard(averageParticles: number, targetClass: string = "ISO 7"): boolean {
  switch (targetClass) {
    case "ISO 7":
      return averageParticles <= 3520
    case "ISO 8":
      return averageParticles <= 35200
    case "ISO 9":
      return averageParticles <= 352000
    default:
      return averageParticles <= 3520
  }
}

// Calculate average of particle measurements
export function calculateParticleAverage(measurements: number[]): number {
  if (measurements.length === 0) return 0
  const sum = measurements.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / measurements.length)
}

// Validate pressure difference (>= 6 Pa)
export function validatePressureDifference(pressure: number): boolean {
  return pressure >= 6
}

// Validate HEPA leakage (<= 0.01%)
export function validateHepaLeakage(leakage: number): boolean {
  return leakage <= 0.01
}

// Validate recovery time (<= 25 minutes)
export function validateRecoveryTime(time: number): boolean {
  return time <= 25
}

// Validate temperature range (20-24°C)
export function validateTemperature(temperature: number): boolean {
  return temperature >= 20 && temperature <= 24
}

// Validate humidity range (40-60%)
export function validateHumidity(humidity: number): boolean {
  return humidity >= 40 && humidity <= 60
}

// Check overall room compliance
export function checkRoomCompliance(room: Room): boolean {
  if (!room.tests) return false
  
  return (
    room.tests.pressureDifference.meetsCriteria &&
    room.tests.airFlowDirection.result === 'UYGUNDUR' &&
    room.tests.hepaLeakage.meetsCriteria &&
    room.tests.particleCount.meetsCriteria &&
    room.tests.recoveryTime.meetsCriteria &&
    room.tests.temperatureHumidity.meetsCriteria &&
    room.tests.airflowData.meetsCriteria
  )
}

// Generate final assessment
export function generateFinalAssessment(rooms: Room[]): string {
  if (!rooms || rooms.length === 0) return "Veri bulunamadı."
  
  const allCompliant = rooms.every(room => checkRoomCompliance(room))
  return allCompliant 
    ? "Sistem, referans standartlara UYGUNDUR."
    : "Sistem, referans standartlara UYGUN DEĞİL."
}