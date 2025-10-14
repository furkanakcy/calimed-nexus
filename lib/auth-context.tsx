"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "super_admin" | "admin" | "technician" | "observer"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  organizationId: string
  organizationName: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@ankara-sehir.com": {
    id: "660e8400-e29b-41d4-a716-446655440000",
    email: "admin@ankara-sehir.com",
    password: "admin123",
    fullName: "Ahmet Yılmaz",
    role: "admin",
    organizationId: "550e8400-e29b-41d4-a716-446655440000",
    organizationName: "Ankara Şehir Hastanesi",
  },
  "teknisyen@ankara-sehir.com": {
    id: "660e8400-e29b-41d4-a716-446655440001",
    email: "teknisyen@ankara-sehir.com",
    password: "tech123",
    fullName: "Ayşe Demir",
    role: "technician",
    organizationId: "550e8400-e29b-41d4-a716-446655440000",
    organizationName: "Ankara Şehir Hastanesi",
  },
  "gozlemci@ankara-sehir.com": {
    id: "660e8400-e29b-41d4-a716-446655440002",
    email: "gozlemci@ankara-sehir.com",
    password: "observer123",
    fullName: "Mehmet Kaya",
    role: "observer",
    organizationId: "550e8400-e29b-41d4-a716-446655440000",
    organizationName: "Ankara Şehir Hastanesi",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("calimed_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS[email]

    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword)
      localStorage.setItem("calimed_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("calimed_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    observer: 1,
    technician: 2,
    admin: 3,
    super_admin: 4,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
