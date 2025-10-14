"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DownloadIcon, FileTextIcon } from "@/components/icons"
import { getCalibrationsFromStorage, getDevicesFromStorage, type CalibrationRecord } from "@/lib/mock-data"

export default function ReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([])
  const [selectedCalibration, setSelectedCalibration] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reportType, setReportType] = useState<"single" | "summary">("single")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setCalibrations(getCalibrationsFromStorage())
  }, [])

  const generateSingleReport = () => {
    const calibration = calibrations.find((c) => c.id === selectedCalibration)
    if (!calibration) {
      alert("Lütfen bir kalibrasyon kaydı seçin")
      return
    }

    // Create a simple HTML report
    const reportWindow = window.open("", "_blank")
    if (!reportWindow) return

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kalibrasyon Raporu - ${calibration.certificateNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0B5AA3;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0B5AA3;
            margin-bottom: 10px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #0B5AA3;
          }
          .section-title {
            font-weight: bold;
            color: #0B5AA3;
            margin-bottom: 10px;
          }
          .info-row {
            display: flex;
            margin: 8px 0;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
          }
          .info-value {
            flex: 1;
          }
          .result {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 4px;
            font-weight: bold;
            background: ${calibration.result === "passed" ? "#d4edda" : calibration.result === "failed" ? "#f8d7da" : "#fff3cd"};
            color: ${calibration.result === "passed" ? "#155724" : calibration.result === "failed" ? "#721c24" : "#856404"};
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
          }
          .signature-box {
            text-align: center;
          }
          .signature-line {
            width: 200px;
            border-top: 1px solid #000;
            margin: 40px auto 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CaliMed Nexus</div>
          <div>Medikal Cihaz Kalibrasyon Yönetim Sistemi</div>
          <div style="margin-top: 10px; color: #6c757d;">Ankara Şehir Hastanesi</div>
        </div>

        <div class="title">KALİBRASYON RAPORU</div>

        <div class="section">
          <div class="section-title">Sertifika Bilgileri</div>
          <div class="info-row">
            <div class="info-label">Sertifika No:</div>
            <div class="info-value">${calibration.certificateNumber}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Kalibrasyon Tarihi:</div>
            <div class="info-value">${calibration.calibrationDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Sonraki Kalibrasyon:</div>
            <div class="info-value">${calibration.nextCalibrationDate}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Cihaz Bilgileri</div>
          <div class="info-row">
            <div class="info-label">Cihaz Adı:</div>
            <div class="info-value">${calibration.deviceName}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Kalibrasyon Detayları</div>
          <div class="info-row">
            <div class="info-label">Kalibrasyon Tipi:</div>
            <div class="info-value">${
              calibration.calibrationType === "routine"
                ? "Rutin"
                : calibration.calibrationType === "repair"
                  ? "Onarım"
                  : calibration.calibrationType === "validation"
                    ? "Validasyon"
                    : "Doğrulama"
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Kullanılan Standartlar:</div>
            <div class="info-value">${calibration.standardsUsed}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Teknisyen:</div>
            <div class="info-value">${calibration.technicianName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Sonuç:</div>
            <div class="info-value">
              <span class="result">${calibration.result === "passed" ? "BAŞARILI" : calibration.result === "failed" ? "BAŞARISIZ" : "KOŞULLU"}</span>
            </div>
          </div>
        </div>

        ${
          calibration.environmentalConditions
            ? `
        <div class="section">
          <div class="section-title">Çevresel Koşullar</div>
          ${calibration.environmentalConditions.temperature ? `<div class="info-row"><div class="info-label">Sıcaklık:</div><div class="info-value">${calibration.environmentalConditions.temperature}</div></div>` : ""}
          ${calibration.environmentalConditions.humidity ? `<div class="info-row"><div class="info-label">Nem:</div><div class="info-value">${calibration.environmentalConditions.humidity}</div></div>` : ""}
          ${calibration.environmentalConditions.pressure ? `<div class="info-row"><div class="info-label">Basınç:</div><div class="info-value">${calibration.environmentalConditions.pressure}</div></div>` : ""}
        </div>
        `
            : ""
        }

        ${
          calibration.measurements
            ? `
        <div class="section">
          <div class="section-title">Ölçümler</div>
          <div>${calibration.measurements}</div>
        </div>
        `
            : ""
        }

        ${
          calibration.notes
            ? `
        <div class="section">
          <div class="section-title">Notlar</div>
          <div>${calibration.notes}</div>
        </div>
        `
            : ""
        }

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>Teknisyen İmzası</div>
            <div style="margin-top: 5px; font-size: 12px;">${calibration.technicianName}</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>Onaylayan İmzası</div>
            <div style="margin-top: 5px; font-size: 12px;">Kalite Kontrol</div>
          </div>
        </div>

        <div class="footer">
          <div>Bu rapor CaliMed Nexus sistemi tarafından otomatik olarak oluşturulmuştur.</div>
          <div>Rapor Oluşturma Tarihi: ${new Date().toLocaleDateString("tr-TR")}</div>
        </div>
      </body>
      </html>
    `)

    reportWindow.document.close()
    setTimeout(() => {
      reportWindow.print()
    }, 250)
  }

  const generateSummaryReport = () => {
    if (!startDate || !endDate) {
      alert("Lütfen başlangıç ve bitiş tarihlerini seçin")
      return
    }

    const filteredCalibrations = calibrations.filter((cal) => {
      const calDate = new Date(cal.calibrationDate)
      return calDate >= new Date(startDate) && calDate <= new Date(endDate)
    })

    const devices = getDevicesFromStorage()
    const totalDevices = devices.length
    const passedCount = filteredCalibrations.filter((c) => c.result === "passed").length
    const failedCount = filteredCalibrations.filter((c) => c.result === "failed").length
    const conditionalCount = filteredCalibrations.filter((c) => c.result === "conditional").length

    const reportWindow = window.open("", "_blank")
    if (!reportWindow) return

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Özet Kalibrasyon Raporu</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0B5AA3;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0B5AA3;
            margin-bottom: 10px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            padding: 20px;
            background: #f8f9fa;
            border-left: 4px solid #0B5AA3;
            text-align: center;
          }
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #0B5AA3;
          }
          .stat-label {
            margin-top: 5px;
            color: #6c757d;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
          }
          th {
            background: #0B5AA3;
            color: white;
            font-weight: bold;
          }
          tr:hover {
            background: #f8f9fa;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
          }
          @media print {
            body {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CaliMed Nexus</div>
          <div>Medikal Cihaz Kalibrasyon Yönetim Sistemi</div>
          <div style="margin-top: 10px; color: #6c757d;">Ankara Şehir Hastanesi</div>
        </div>

        <div class="title">ÖZET KALİBRASYON RAPORU</div>
        <div style="text-align: center; color: #6c757d; margin-bottom: 30px;">
          Dönem: ${new Date(startDate).toLocaleDateString("tr-TR")} - ${new Date(endDate).toLocaleDateString("tr-TR")}
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${totalDevices}</div>
            <div class="stat-label">Toplam Cihaz</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${filteredCalibrations.length}</div>
            <div class="stat-label">Yapılan Kalibrasyon</div>
          </div>
          <div class="stat-card" style="border-left-color: #28a745;">
            <div class="stat-value" style="color: #28a745;">${passedCount}</div>
            <div class="stat-label">Başarılı</div>
          </div>
          <div class="stat-card" style="border-left-color: #dc3545;">
            <div class="stat-value" style="color: #dc3545;">${failedCount}</div>
            <div class="stat-label">Başarısız</div>
          </div>
          <div class="stat-card" style="border-left-color: #ffc107;">
            <div class="stat-value" style="color: #ffc107;">${conditionalCount}</div>
            <div class="stat-label">Koşullu</div>
          </div>
        </div>

        <div class="title" style="font-size: 16px; margin-top: 40px;">Kalibrasyon Detayları</div>
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Cihaz</th>
              <th>Sertifika No</th>
              <th>Tip</th>
              <th>Teknisyen</th>
              <th>Sonuç</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCalibrations
              .map(
                (cal) => `
              <tr>
                <td>${cal.calibrationDate}</td>
                <td>${cal.deviceName}</td>
                <td>${cal.certificateNumber}</td>
                <td>${
                  cal.calibrationType === "routine"
                    ? "Rutin"
                    : cal.calibrationType === "repair"
                      ? "Onarım"
                      : cal.calibrationType === "validation"
                        ? "Validasyon"
                        : "Doğrulama"
                }</td>
                <td>${cal.technicianName}</td>
                <td style="color: ${cal.result === "passed" ? "#28a745" : cal.result === "failed" ? "#dc3545" : "#ffc107"}; font-weight: bold;">
                  ${cal.result === "passed" ? "Başarılı" : cal.result === "failed" ? "Başarısız" : "Koşullu"}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <div>Bu rapor CaliMed Nexus sistemi tarafından otomatik olarak oluşturulmuştur.</div>
          <div>Rapor Oluşturma Tarihi: ${new Date().toLocaleDateString("tr-TR")}</div>
        </div>
      </body>
      </html>
    `)

    reportWindow.document.close()
    setTimeout(() => {
      reportWindow.print()
    }, 250)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapor Oluştur</h2>
          <p className="text-gray-600 mt-1">Kalibrasyon raporlarını PDF formatında oluşturun ve yazdırın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Single Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon size={20} />
                Tekil Kalibrasyon Raporu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calibration">Kalibrasyon Kaydı Seçin</Label>
                <Select value={selectedCalibration} onValueChange={setSelectedCalibration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kalibrasyon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {calibrations.map((cal) => (
                      <SelectItem key={cal.id} value={cal.id}>
                        {cal.certificateNumber} - {cal.deviceName} ({cal.calibrationDate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  setReportType("single")
                  generateSingleReport()
                }}
                className="w-full bg-[#0B5AA3] hover:bg-[#094a8a]"
                disabled={!selectedCalibration}
              >
                <DownloadIcon size={20} />
                Rapor Oluştur ve Yazdır
              </Button>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Rapor İçeriği:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Sertifika bilgileri</li>
                  <li>Cihaz detayları</li>
                  <li>Kalibrasyon sonuçları</li>
                  <li>Çevresel koşullar</li>
                  <li>Dijital imza alanları</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Summary Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon size={20} />
                Özet Rapor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <Button
                onClick={() => {
                  setReportType("summary")
                  generateSummaryReport()
                }}
                className="w-full bg-[#0B5AA3] hover:bg-[#094a8a]"
                disabled={!startDate || !endDate}
              >
                <DownloadIcon size={20} />
                Özet Rapor Oluştur
              </Button>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Rapor İçeriği:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Dönem istatistikleri</li>
                  <li>Başarı oranları</li>
                  <li>Tüm kalibrasyonların listesi</li>
                  <li>Cihaz bazlı analiz</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">PDF Rapor Özellikleri</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#0B5AA3] mt-1">✓</span>
                <span>
                  <strong>Profesyonel Format:</strong> Tüm raporlar standart kalibrasyon rapor formatında oluşturulur
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0B5AA3] mt-1">✓</span>
                <span>
                  <strong>Dijital İmza Alanları:</strong> Teknisyen ve onaylayan için imza alanları içerir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0B5AA3] mt-1">✓</span>
                <span>
                  <strong>Yazdırma Uyumlu:</strong> Raporlar doğrudan yazdırılabilir veya PDF olarak kaydedilebilir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0B5AA3] mt-1">✓</span>
                <span>
                  <strong>Standart Uyumlu:</strong> IEC ve ISO standartlarına uygun rapor formatı
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
