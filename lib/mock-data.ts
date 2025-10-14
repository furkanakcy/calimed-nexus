export interface Device {
  id: string
  deviceName: string
  deviceType: string
  manufacturer: string
  model: string
  serialNumber: string
  location: string
  department: string
  purchaseDate: string
  lastCalibrationDate: string
  nextCalibrationDate: string
  status: "active" | "inactive" | "maintenance" | "retired"
  notes?: string
}

export const mockDevices: Device[] = [
  {
    id: "770e8400-e29b-41d4-a716-446655440000",
    deviceName: "EKG Cihazı",
    deviceType: "Kardiyoloji",
    manufacturer: "Philips",
    model: "PageWriter TC70",
    serialNumber: "PH-2023-001",
    location: "Kardiyoloji Servisi",
    department: "Kardiyoloji",
    purchaseDate: "2023-01-15",
    lastCalibrationDate: "2024-11-01",
    nextCalibrationDate: "2025-11-01",
    status: "active",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440001",
    deviceName: "Hasta Monitörü",
    deviceType: "Yoğun Bakım",
    manufacturer: "GE Healthcare",
    model: "CARESCAPE B850",
    serialNumber: "GE-2023-045",
    location: "Yoğun Bakım",
    department: "Yoğun Bakım",
    purchaseDate: "2023-03-20",
    lastCalibrationDate: "2024-10-15",
    nextCalibrationDate: "2025-10-15",
    status: "active",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440002",
    deviceName: "Defibrilatör",
    deviceType: "Acil",
    manufacturer: "ZOLL",
    model: "R Series",
    serialNumber: "ZL-2022-089",
    location: "Acil Servis",
    department: "Acil Tıp",
    purchaseDate: "2022-06-10",
    lastCalibrationDate: "2024-09-20",
    nextCalibrationDate: "2025-09-20",
    status: "active",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440003",
    deviceName: "Ultrason Cihazı",
    deviceType: "Radyoloji",
    manufacturer: "Siemens",
    model: "ACUSON S2000",
    serialNumber: "SI-2023-112",
    location: "Radyoloji",
    department: "Radyoloji",
    purchaseDate: "2023-05-10",
    lastCalibrationDate: "2024-08-15",
    nextCalibrationDate: "2024-12-20",
    status: "active",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440004",
    deviceName: "Anestezi Cihazı",
    deviceType: "Ameliyathane",
    manufacturer: "Dräger",
    model: "Fabius GS",
    serialNumber: "DR-2022-078",
    location: "Ameliyathane 1",
    department: "Anestezi",
    purchaseDate: "2022-11-20",
    lastCalibrationDate: "2024-07-10",
    nextCalibrationDate: "2024-12-22",
    status: "maintenance",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440005",
    deviceName: "Ventilatör",
    deviceType: "Yoğun Bakım",
    manufacturer: "Hamilton Medical",
    model: "HAMILTON-C6",
    serialNumber: "HM-2023-156",
    location: "Yoğun Bakım",
    department: "Yoğun Bakım",
    purchaseDate: "2023-02-15",
    lastCalibrationDate: "2024-06-25",
    nextCalibrationDate: "2024-12-25",
    status: "active",
  },
]

// LocalStorage helpers
const DEVICES_KEY = "calimed_devices"

export function getDevicesFromStorage(): Device[] {
  if (typeof window === "undefined") return mockDevices
  const stored = localStorage.getItem(DEVICES_KEY)
  if (!stored) {
    localStorage.setItem(DEVICES_KEY, JSON.stringify(mockDevices))
    return mockDevices
  }
  return JSON.parse(stored)
}

export function saveDevicesToStorage(devices: Device[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices))
}

export function addDevice(device: Omit<Device, "id">): Device {
  const devices = getDevicesFromStorage()
  const newDevice: Device = {
    ...device,
    id: crypto.randomUUID(),
  }
  devices.push(newDevice)
  saveDevicesToStorage(devices)
  return newDevice
}

export function updateDevice(id: string, updates: Partial<Device>): Device | null {
  const devices = getDevicesFromStorage()
  const index = devices.findIndex((d) => d.id === id)
  if (index === -1) return null

  devices[index] = { ...devices[index], ...updates }
  saveDevicesToStorage(devices)
  return devices[index]
}

export function deleteDevice(id: string): boolean {
  const devices = getDevicesFromStorage()
  const filtered = devices.filter((d) => d.id !== id)
  if (filtered.length === devices.length) return false

  saveDevicesToStorage(filtered)
  return true
}

export interface CalibrationRecord {
  id: string
  deviceId: string
  deviceName: string
  calibrationDate: string
  nextCalibrationDate: string
  technicianId: string
  technicianName: string
  calibrationType: "routine" | "repair" | "validation" | "verification"
  result: "passed" | "failed" | "conditional"
  certificateNumber: string
  standardsUsed: string
  environmentalConditions?: {
    temperature?: string
    humidity?: string
    pressure?: string
  }
  measurements?: string
  notes?: string
  pdfReportUrl?: string
  digitalSignature?: string
}

export const mockCalibrations: CalibrationRecord[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440000",
    deviceId: "770e8400-e29b-41d4-a716-446655440000",
    deviceName: "EKG Cihazı",
    calibrationDate: "2024-11-01",
    nextCalibrationDate: "2025-11-01",
    technicianId: "660e8400-e29b-41d4-a716-446655440001",
    technicianName: "Ayşe Demir",
    calibrationType: "routine",
    result: "passed",
    certificateNumber: "CAL-2024-1001",
    standardsUsed: "IEC 60601-2-25",
    environmentalConditions: {
      temperature: "22°C",
      humidity: "45%",
      pressure: "1013 hPa",
    },
    notes: "Tüm parametreler normal aralıkta",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440001",
    deviceId: "770e8400-e29b-41d4-a716-446655440001",
    deviceName: "Hasta Monitörü",
    calibrationDate: "2024-10-15",
    nextCalibrationDate: "2025-10-15",
    technicianId: "660e8400-e29b-41d4-a716-446655440001",
    technicianName: "Ayşe Demir",
    calibrationType: "routine",
    result: "passed",
    certificateNumber: "CAL-2024-1002",
    standardsUsed: "IEC 60601-2-49",
    environmentalConditions: {
      temperature: "21°C",
      humidity: "50%",
      pressure: "1012 hPa",
    },
    notes: "Kalibrasyon başarılı",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    deviceId: "770e8400-e29b-41d4-a716-446655440002",
    deviceName: "Defibrilatör",
    calibrationDate: "2024-09-20",
    nextCalibrationDate: "2025-09-20",
    technicianId: "660e8400-e29b-41d4-a716-446655440001",
    technicianName: "Ayşe Demir",
    calibrationType: "validation",
    result: "passed",
    certificateNumber: "CAL-2024-0987",
    standardsUsed: "IEC 60601-2-4",
    environmentalConditions: {
      temperature: "23°C",
      humidity: "48%",
      pressure: "1014 hPa",
    },
    notes: "Validasyon tamamlandı",
  },
]

const CALIBRATIONS_KEY = "calimed_calibrations"

export function getCalibrationsFromStorage(): CalibrationRecord[] {
  if (typeof window === "undefined") return mockCalibrations
  const stored = localStorage.getItem(CALIBRATIONS_KEY)
  if (!stored) {
    localStorage.setItem(CALIBRATIONS_KEY, JSON.stringify(mockCalibrations))
    return mockCalibrations
  }
  return JSON.parse(stored)
}

export function saveCalibrationsToStorage(calibrations: CalibrationRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CALIBRATIONS_KEY, JSON.stringify(calibrations))
}

export function addCalibration(calibration: Omit<CalibrationRecord, "id">): CalibrationRecord {
  const calibrations = getCalibrationsFromStorage()
  const newCalibration: CalibrationRecord = {
    ...calibration,
    id: crypto.randomUUID(),
  }
  calibrations.push(newCalibration)
  saveCalibrationsToStorage(calibrations)
  return newCalibration
}

export function updateCalibration(id: string, updates: Partial<CalibrationRecord>): CalibrationRecord | null {
  const calibrations = getCalibrationsFromStorage()
  const index = calibrations.findIndex((c) => c.id === id)
  if (index === -1) return null

  calibrations[index] = { ...calibrations[index], ...updates }
  saveCalibrationsToStorage(calibrations)
  return calibrations[index]
}

export function deleteCalibration(id: string): boolean {
  const calibrations = getCalibrationsFromStorage()
  const filtered = calibrations.filter((c) => c.id !== id)
  if (filtered.length === calibrations.length) return false

  saveCalibrationsToStorage(filtered)
  return true
}

export interface User {
  id: string
  email: string
  fullName: string
  role: "admin" | "technician" | "observer"
  isActive: boolean
  createdAt: string
}

export const mockUsers: User[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440000",
    email: "admin@ankara-sehir.com",
    fullName: "Ahmet Yılmaz",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    email: "teknisyen@ankara-sehir.com",
    fullName: "Ayşe Demir",
    role: "technician",
    isActive: true,
    createdAt: "2024-02-20",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    email: "gozlemci@ankara-sehir.com",
    fullName: "Mehmet Kaya",
    role: "observer",
    isActive: true,
    createdAt: "2024-03-10",
  },
]

const USERS_KEY = "calimed_users"

export function getUsersFromStorage(): User[] {
  if (typeof window === "undefined") return mockUsers
  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers))
    return mockUsers
  }
  return JSON.parse(stored)
}

export function saveUsersToStorage(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsersFromStorage()
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  users.push(newUser)
  saveUsersToStorage(users)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsersFromStorage()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  saveUsersToStorage(users)
  return users[index]
}

export function deleteUser(id: string): boolean {
  const users = getUsersFromStorage()
  const filtered = users.filter((u) => u.id !== id)
  if (filtered.length === users.length) return false

  saveUsersToStorage(filtered)
  return true
}
