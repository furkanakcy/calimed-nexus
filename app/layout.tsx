import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { KeepAliveProvider } from "@/components/keep-alive-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CaliMed Nexus - Medikal Cihaz Kalibrasyon Yönetimi",
  description: "Profesyonel medikal cihaz kalibrasyon ve validasyon yönetim sistemi",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <KeepAliveProvider>
            {children}
          </KeepAliveProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
