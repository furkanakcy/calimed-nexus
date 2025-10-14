"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  PackageIcon,
  ClipboardCheckIcon,
  UsersIcon,
  FileTextIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  UserIcon,
} from "@/components/icons"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon, roles: ["admin", "technician", "observer"] },
    { name: "Cihazlar", href: "/dashboard/devices", icon: PackageIcon, roles: ["admin", "technician", "observer"] },
    {
      name: "Kalibrasyonlar",
      href: "/dashboard/calibrations",
      icon: ClipboardCheckIcon,
      roles: ["admin", "technician", "observer"],
    },
    { name: "Raporlar", href: "/dashboard/reports", icon: FileTextIcon, roles: ["admin", "technician"] },
    { name: "HVAC Raporları", href: "/dashboard/hvac-reports", icon: FileTextIcon, roles: ["admin", "technician"] },
    { name: "Kullanıcılar", href: "/dashboard/users", icon: UsersIcon, roles: ["admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0B5AA3] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">CM</span>
              </div>
              <span className="font-semibold text-gray-900">CaliMed Nexus</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <XIcon size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B5AA3]/10 rounded-full flex items-center justify-center">
                <UserIcon size={20} className="text-[#0B5AA3]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.organizationName}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                {user?.role === "admin" && "Admin"}
                {user?.role === "technician" && "Teknisyen"}
                {user?.role === "observer" && "Gözlemci"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-[#0B5AA3] text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 pb-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Trical Engineering
            </Link>
          </div>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-3 bg-transparent">
              <LogOutIcon size={20} />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 mr-4">
            <MenuIcon size={24} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
