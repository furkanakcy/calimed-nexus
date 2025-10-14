"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { HvacReportForm } from "@/components/hvac-report-form"
import { HvacReportData } from "@/lib/hvac-types"

export default function CreateHvacReportPage() {
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
  
  const handleSaveReport = (reportData: HvacReportData) => {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      alert('Bu özellik mobil cihazlarda desteklenmemektedir. Lütfen masaüstü tarayıcı kullanın.')
      return
    }
    
    try {
      // Save to localStorage (in production, this would be an API call)
      const existingReports = localStorage.getItem('hvac-reports')
      const reports = existingReports ? JSON.parse(existingReports) : []
      
      // Validate reports array
      if (!Array.isArray(reports)) {
        localStorage.removeItem('hvac-reports')
        reports = []
      }
      
      reports.push(reportData)
      localStorage.setItem('hvac-reports', JSON.stringify(reports))
      
      // Redirect to reports list
      router.push('/dashboard/hvac-reports')
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Rapor kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yeni HVAC Raporu</h2>
          <p className="text-gray-600 mt-1">HVAC Performans Niteleme Test Raporu oluşturun</p>
        </div>
        
        <HvacReportForm onSave={handleSaveReport} />
      </div>
    </DashboardLayout>
  )
}