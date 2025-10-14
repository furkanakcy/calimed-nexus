"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageIcon, ClipboardCheckIcon, AlertCircleIcon, CheckCircleIcon } from "@/components/icons"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }

  // Mock statistics
  const stats = [
    {
      title: "Toplam Cihaz",
      value: "156",
      icon: PackageIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Aktif Kalibrasyonlar",
      value: "23",
      icon: ClipboardCheckIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Yaklaşan Kalibrasyonlar",
      value: "12",
      icon: AlertCircleIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Tamamlanan (Bu Ay)",
      value: "34",
      icon: CheckCircleIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  // Mock recent calibrations
  const recentCalibrations = [
    {
      id: 1,
      device: "EKG Cihazı",
      type: "Rutin Kalibrasyon",
      date: "2024-12-15",
      status: "Başarılı",
      technician: "Ayşe Demir",
    },
    {
      id: 2,
      device: "Hasta Monitörü",
      type: "Validasyon",
      date: "2024-12-14",
      status: "Başarılı",
      technician: "Ayşe Demir",
    },
    {
      id: 3,
      device: "Defibrilatör",
      type: "Rutin Kalibrasyon",
      date: "2024-12-13",
      status: "Başarılı",
      technician: "Ayşe Demir",
    },
  ]

  // Mock upcoming calibrations
  const upcomingCalibrations = [
    { id: 1, device: "Ultrason Cihazı", department: "Radyoloji", dueDate: "2024-12-20", daysLeft: 5 },
    { id: 2, device: "Anestezi Cihazı", department: "Ameliyathane", dueDate: "2024-12-22", daysLeft: 7 },
    { id: 3, device: "Ventilatör", department: "Yoğun Bakım", dueDate: "2024-12-25", daysLeft: 10 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {user.fullName}</h2>
          <p className="text-gray-600 mt-1">{user.organizationName} - Kalibrasyon Yönetim Sistemi</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent calibrations */}
          <Card>
            <CardHeader>
              <CardTitle>Son Kalibrasyonlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalibrations.map((cal) => (
                  <div key={cal.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cal.device}</p>
                      <p className="text-sm text-gray-600">{cal.type}</p>
                      <p className="text-xs text-gray-500 mt-1">Teknisyen: {cal.technician}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{cal.date}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 mt-1">
                        {cal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming calibrations */}
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Kalibrasyonlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCalibrations.map((cal) => (
                  <div key={cal.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cal.device}</p>
                      <p className="text-sm text-gray-600">{cal.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{cal.dueDate}</p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          cal.daysLeft <= 5 ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {cal.daysLeft} gün kaldı
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
