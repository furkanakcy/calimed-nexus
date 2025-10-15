import ExcelJS from 'exceljs'
import { HvacReportData, Room } from './hvac-types'

// Create reports directory if it doesn't exist
const ensureReportsDirectory = () => {
  // This would be handled by the backend in production
  // For now, we'll just use localStorage to track file paths
}

export async function generateHvacReportExcel(reportData: HvacReportData) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('Excel generation is only available in browser environment')
  }
  
  const workbook = new ExcelJS.Workbook()
  
  // Set workbook properties
  workbook.creator = reportData.reportInfo.organizationName
  workbook.lastModifiedBy = reportData.reportInfo.reportPreparedBy
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.subject = 'HVAC Performans Niteleme Test Raporu'
  workbook.title = `${reportData.reportInfo.hospitalName} - ${reportData.reportInfo.reportNumber}`
  
  // Create a worksheet for each room
  reportData.rooms.forEach((room, index) => {
    const worksheet = workbook.addWorksheet(`${room.roomName || `Oda ${index + 1}`}`)
    
    // Set page setup for professional printing
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'portrait',
      margins: {
        left: 0.75, top: 1, right: 0.75, bottom: 1,
        header: 0.5, footer: 0.5
      },
      printArea: 'A1:F50',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
    
    // Add professional header
    addProfessionalHeader(worksheet, room, reportData, index + 1)
    
    // Add enhanced test results table
    addEnhancedTestResultsTable(worksheet, room)
    
    // Add professional footer
    addProfessionalFooter(worksheet, reportData, index + 1, reportData.rooms.length)
  })
  
  // Generate and save the file
  const buffer = await workbook.xlsx.writeBuffer()
  const fileName = `HVAC_Raporu_${reportData.reportInfo.reportNumber}_${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Save to reports directory (simulated with localStorage for now)
  try {
    const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
    reportFiles[reportData.id] = reportFiles[reportData.id] || {}
    reportFiles[reportData.id].excel = {
      fileName,
      createdAt: new Date().toISOString(),
      size: buffer.byteLength
    }
    localStorage.setItem('hvac-report-files', JSON.stringify(reportFiles))
  } catch (error) {
    console.warn('Could not save file info to localStorage:', error)
  }
  
  // Download the file
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  
  return fileName
}

function addProfessionalHeader(worksheet: ExcelJS.Worksheet, room: Room, reportData: HvacReportData, pageNumber: number) {
  // Company header
  worksheet.mergeCells('A1:F1')
  const companyCell = worksheet.getCell('A1')
  companyCell.value = reportData.reportInfo.organizationName
  companyCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF0B5AA3' } }
  companyCell.alignment = { horizontal: 'center', vertical: 'middle' }
  companyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } }
  
  // Report title
  worksheet.mergeCells('A2:F2')
  const titleCell = worksheet.getCell('A2')
  titleCell.value = 'HVAC PERFORMANS NİTELEME TEST RAPORU'
  titleCell.font = { name: 'Calibri', size: 14, bold: true }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  
  // Hospital and report info
  worksheet.mergeCells('A3:F3')
  const hospitalCell = worksheet.getCell('A3')
  hospitalCell.value = `${reportData.reportInfo.hospitalName} - Rapor No: ${reportData.reportInfo.reportNumber}`
  hospitalCell.font = { name: 'Calibri', size: 12, bold: true }
  hospitalCell.alignment = { horizontal: 'center', vertical: 'middle' }
  
  // Add spacing
  worksheet.addRow([])
  
  // Room information header with professional styling
  const roomInfoRow = worksheet.addRow(['MAHAL BİLGİLERİ', '', '', '', '', ''])
  worksheet.mergeCells(`A${roomInfoRow.number}:F${roomInfoRow.number}`)
  const roomInfoCell = worksheet.getCell(`A${roomInfoRow.number}`)
  roomInfoCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
  roomInfoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B5AA3' } }
  roomInfoCell.alignment = { horizontal: 'center', vertical: 'middle' }
  
  // Room details in a structured table
  const detailsRow1 = worksheet.addRow(['Mahal No:', room.roomNo, 'Akış Biçimi:', room.flowType, 'Yüzey Alanı:', `${room.surfaceArea} m²`])
  const detailsRow2 = worksheet.addRow(['Mahal Adı:', room.roomName, 'Test Modu:', room.testMode, 'Yükseklik:', `${room.height} m`])
  const detailsRow3 = worksheet.addRow(['Mahal Sınıfı:', room.roomClass, 'Hacim:', `${room.volume} m³`, 'Sayfa:', `${pageNumber}/${reportData.rooms.length}`])
  
  // Style the details rows
  [detailsRow1, detailsRow2, detailsRow3].forEach(row => {
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, bold: colNumber % 2 === 1 }
      cell.alignment = { horizontal: colNumber % 2 === 1 ? 'right' : 'left', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      }
      if (colNumber % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
      }
    })
  })
  
  // Add spacing before test results
  worksheet.addRow([])
}

function addEnhancedTestResultsTable(worksheet: ExcelJS.Worksheet, room: Room) {
  // Test results header
  const testHeaderRow = worksheet.addRow(['TEST SONUÇLARI', '', '', '', '', ''])
  worksheet.mergeCells(`A${testHeaderRow.number}:F${testHeaderRow.number}`)
  const testHeaderCell = worksheet.getCell(`A${testHeaderRow.number}`)
  testHeaderCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
  testHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } }
  testHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' }
  
  // Table headers with professional styling
  const headerRow = worksheet.addRow(['TEST NO', 'TEST ADI', 'KRİTER', 'ÖLÇÜM DEĞERİ', 'SONUÇ', 'DURUM'])
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } }
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF374151' } },
      left: { style: 'thin', color: { argb: 'FF374151' } },
      bottom: { style: 'medium', color: { argb: 'FF374151' } },
      right: { style: 'thin', color: { argb: 'FF374151' } }
    }
  })
  
  // Test data with enhanced styling
  const tests = [
    {
      no: '1',
      name: 'Hava Debisi',
      criteria: room.tests.airflowData.criteria,
      measurement: `${room.tests.airflowData.flowRate} m³/h`,
      result: room.tests.airflowData.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.airflowData.meetsCriteria
    },
    {
      no: '2',
      name: 'Basınç Farkı',
      criteria: room.tests.pressureDifference.criteria,
      measurement: `${room.tests.pressureDifference.pressure} Pa`,
      result: room.tests.pressureDifference.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.pressureDifference.meetsCriteria
    },
    {
      no: '3',
      name: 'Hava Akış Yönü',
      criteria: 'Temiz → Kirli',
      measurement: room.tests.airFlowDirection.observation || 'Gözlem',
      result: room.tests.airFlowDirection.result,
      status: room.tests.airFlowDirection.result === 'UYGUNDUR'
    },
    {
      no: '4',
      name: 'HEPA Sızdırmazlık',
      criteria: room.tests.hepaLeakage.criteria,
      measurement: `${room.tests.hepaLeakage.actualLeakage}%`,
      result: room.tests.hepaLeakage.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.hepaLeakage.meetsCriteria
    },
    {
      no: '5',
      name: 'Partikül Sayısı (0.5 µm)',
      criteria: `ISO Class ${room.tests.particleCount.isoClass}`,
      measurement: `${room.tests.particleCount.particle05}`,
      result: room.tests.particleCount.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.particleCount.meetsCriteria
    },
    {
      no: '6',
      name: 'Recovery Time',
      criteria: room.tests.recoveryTime.criteria,
      measurement: `${room.tests.recoveryTime.duration} dk`,
      result: room.tests.recoveryTime.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.recoveryTime.meetsCriteria
    },
    {
      no: '7',
      name: 'Sıcaklık & Nem',
      criteria: room.tests.temperatureHumidity.criteria,
      measurement: `${room.tests.temperatureHumidity.temperature}°C, ${room.tests.temperatureHumidity.humidity}%`,
      result: room.tests.temperatureHumidity.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
      status: room.tests.temperatureHumidity.meetsCriteria
    }
  ]
  
  tests.forEach((test, index) => {
    const row = worksheet.addRow([test.no, test.name, test.criteria, test.measurement, test.result, test.status ? '✓' : '✗'])
    
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, bold: colNumber === 1 || colNumber === 6 }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      
      // Alternate row colors
      const bgColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB'
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      
      // Status column coloring
      if (colNumber === 5) { // Result column
        cell.font = { ...cell.font, color: { argb: test.status ? 'FF059669' : 'FFDC2626' }, bold: true }
      }
      
      if (colNumber === 6) { // Status icon column
        cell.font = { ...cell.font, color: { argb: test.status ? 'FF059669' : 'FFDC2626' }, size: 14 }
      }
      
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      }
    })
  })
  
  // Set optimal column widths
  worksheet.getColumn(1).width = 10  // Test No
  worksheet.getColumn(2).width = 25  // Test Name
  worksheet.getColumn(3).width = 18  // Criteria
  worksheet.getColumn(4).width = 15  // Measurement
  worksheet.getColumn(5).width = 15  // Result
  worksheet.getColumn(6).width = 8   // Status
  
  // Add spacing
  worksheet.addRow([])
}

function addProfessionalFooter(worksheet: ExcelJS.Worksheet, reportData: HvacReportData, currentPage: number, totalPages: number) {
  // Add spacing
  worksheet.addRow([])
  
  // Signature section header
  const signatureHeaderRow = worksheet.addRow(['İMZA VE ONAY BİLGİLERİ', '', '', '', '', ''])
  worksheet.mergeCells(`A${signatureHeaderRow.number}:F${signatureHeaderRow.number}`)
  const signatureHeaderCell = worksheet.getCell(`A${signatureHeaderRow.number}`)
  signatureHeaderCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
  signatureHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6B7280' } }
  signatureHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' }
  
  // Signature information in structured format
  const sigRow1 = worksheet.addRow(['Testi Yapan:', reportData.reportInfo.testerName, '', 'Raporu Hazırlayan:', reportData.reportInfo.reportPreparedBy, ''])
  const sigRow2 = worksheet.addRow(['Onaylayan:', reportData.reportInfo.approvedBy, '', 'Tarih:', reportData.reportInfo.measurementDate, ''])
  const sigRow3 = worksheet.addRow(['İmza:', '', '', 'Mühür:', '', `Sayfa ${currentPage}/${totalPages}`])
  
  // Style signature rows
  [sigRow1, sigRow2, sigRow3].forEach(row => {
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, bold: [1, 4].includes(colNumber) }
      cell.alignment = { horizontal: [1, 4].includes(colNumber) ? 'right' : 'left', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      }
      
      if ([1, 4].includes(colNumber)) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
      }
    })
  })
  
  // Add final spacing and page info
  worksheet.addRow([])
  const pageInfoRow = worksheet.addRow(['', '', '', '', '', `Rapor ID: ${reportData.id.slice(-8)}`])
  pageInfoRow.getCell(6).font = { name: 'Calibri', size: 8, italic: true, color: { argb: 'FF6B7280' } }
  pageInfoRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' }
}

export async function generateHvacReportPDF(reportData: HvacReportData) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available in browser environment')
  }
  
  const htmlContent = generateProfessionalReportHTML(reportData)
  const fileName = `HVAC_Raporu_${reportData.reportInfo.reportNumber}_${new Date().toISOString().split('T')[0]}.pdf`
  
  // Save to reports directory (simulated with localStorage for now)
  try {
    const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
    reportFiles[reportData.id] = reportFiles[reportData.id] || {}
    reportFiles[reportData.id].pdf = {
      fileName,
      createdAt: new Date().toISOString(),
      size: htmlContent.length // Approximate size
    }
    localStorage.setItem('hvac-report-files', JSON.stringify(reportFiles))
  } catch (error) {
    console.warn('Could not save file info to localStorage:', error)
  }
  
  // For production environments like Render.com, use a different approach
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Create a blob and download directly
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.replace('.pdf', '.html')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Show instructions for PDF conversion
    alert(`HTML dosyası indirildi: ${fileName.replace('.pdf', '.html')}\n\nPDF'e dönüştürmek için:\n1. İndirilen HTML dosyasını tarayıcıda açın\n2. Ctrl+P (veya Cmd+P) ile yazdır\n3. "PDF olarak kaydet" seçeneğini seçin`)
  } else {
    // Local development - use print dialog
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      
      // Set the document title for PDF
      printWindow.document.title = fileName
      
      // Trigger print dialog after content loads
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }
  
  return fileName
}

function generateProfessionalReportHTML(reportData: HvacReportData): string {
  const pages = reportData.rooms.map((room, index) => {
    const tests = [
      {
        no: '1',
        name: 'Hava Debisi',
        criteria: room.tests.airflowData.criteria,
        measurement: `${room.tests.airflowData.flowRate} m³/h`,
        result: room.tests.airflowData.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.airflowData.meetsCriteria
      },
      {
        no: '2',
        name: 'Basınç Farkı',
        criteria: room.tests.pressureDifference.criteria,
        measurement: `${room.tests.pressureDifference.pressure} Pa`,
        result: room.tests.pressureDifference.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.pressureDifference.meetsCriteria
      },
      {
        no: '3',
        name: 'Hava Akış Yönü',
        criteria: 'Temiz → Kirli',
        measurement: room.tests.airFlowDirection.observation || 'Gözlem',
        result: room.tests.airFlowDirection.result,
        status: room.tests.airFlowDirection.result === 'UYGUNDUR'
      },
      {
        no: '4',
        name: 'HEPA Sızdırmazlık',
        criteria: room.tests.hepaLeakage.criteria,
        measurement: `${room.tests.hepaLeakage.actualLeakage}%`,
        result: room.tests.hepaLeakage.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.hepaLeakage.meetsCriteria
      },
      {
        no: '5',
        name: 'Partikül Sayısı (0.5 µm)',
        criteria: `ISO Class ${room.tests.particleCount.isoClass}`,
        measurement: `${room.tests.particleCount.particle05}`,
        result: room.tests.particleCount.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.particleCount.meetsCriteria
      },
      {
        no: '6',
        name: 'Recovery Time',
        criteria: room.tests.recoveryTime.criteria,
        measurement: `${room.tests.recoveryTime.duration} dk`,
        result: room.tests.recoveryTime.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.recoveryTime.meetsCriteria
      },
      {
        no: '7',
        name: 'Sıcaklık & Nem',
        criteria: room.tests.temperatureHumidity.criteria,
        measurement: `${room.tests.temperatureHumidity.temperature}°C, ${room.tests.temperatureHumidity.humidity}%`,
        result: room.tests.temperatureHumidity.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL',
        status: room.tests.temperatureHumidity.meetsCriteria
      }
    ]

    const testRows = tests.map((test, testIndex) => `
      <tr class="${testIndex % 2 === 0 ? 'even-row' : 'odd-row'}">
        <td class="test-no">${test.no}</td>
        <td class="test-name">${test.name}</td>
        <td class="criteria">${test.criteria}</td>
        <td class="measurement">${test.measurement}</td>
        <td class="result ${test.status ? 'success' : 'failure'}">${test.result}</td>
        <td class="status ${test.status ? 'success' : 'failure'}">${test.status ? '✓' : '✗'}</td>
      </tr>
    `).join('')

    return `
      <div class="page">
        <header class="report-header">
          <div class="company-info">
            <h1>${reportData.reportInfo.organizationName}</h1>
            <h2>HVAC PERFORMANS NİTELEME TEST RAPORU</h2>
            <h3>${reportData.reportInfo.hospitalName} - Rapor No: ${reportData.reportInfo.reportNumber}</h3>
          </div>
        </header>
        
        <section class="room-info-section">
          <h4>MAHAL BİLGİLERİ</h4>
          <div class="room-details">
            <div class="detail-row">
              <span class="label">Mahal No:</span>
              <span class="value">${room.roomNo}</span>
              <span class="label">Akış Biçimi:</span>
              <span class="value">${room.flowType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Mahal Adı:</span>
              <span class="value">${room.roomName}</span>
              <span class="label">Test Modu:</span>
              <span class="value">${room.testMode}</span>
            </div>
            <div class="detail-row">
              <span class="label">Mahal Sınıfı:</span>
              <span class="value">${room.roomClass}</span>
              <span class="label">Yüzey Alanı:</span>
              <span class="value">${room.surfaceArea} m²</span>
            </div>
            <div class="detail-row">
              <span class="label">Yükseklik:</span>
              <span class="value">${room.height} m</span>
              <span class="label">Hacim:</span>
              <span class="value">${room.volume} m³</span>
            </div>
          </div>
        </section>
        
        <section class="test-results-section">
          <h4>TEST SONUÇLARI</h4>
          <table class="test-table">
            <thead>
              <tr>
                <th>Test No</th>
                <th>Test Adı</th>
                <th>Kriter</th>
                <th>Ölçüm Değeri</th>
                <th>Sonuç</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              ${testRows}
            </tbody>
          </table>
        </section>
        
        <footer class="report-footer">
          <div class="signature-section">
            <h4>İMZA VE ONAY BİLGİLERİ</h4>
            <div class="signature-grid">
              <div class="signature-item">
                <span class="sig-label">Testi Yapan:</span>
                <span class="sig-value">${reportData.reportInfo.testerName}</span>
              </div>
              <div class="signature-item">
                <span class="sig-label">Raporu Hazırlayan:</span>
                <span class="sig-value">${reportData.reportInfo.reportPreparedBy}</span>
              </div>
              <div class="signature-item">
                <span class="sig-label">Onaylayan:</span>
                <span class="sig-value">${reportData.reportInfo.approvedBy}</span>
              </div>
              <div class="signature-item">
                <span class="sig-label">Tarih:</span>
                <span class="sig-value">${reportData.reportInfo.measurementDate}</span>
              </div>
            </div>
            <div class="page-info">
              <span>Sayfa ${index + 1}/${reportData.rooms.length}</span>
              <span>Rapor ID: ${reportData.id.slice(-8)}</span>
            </div>
          </div>
        </footer>
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <title>HVAC Raporu - ${reportData.reportInfo.reportNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        
        .page {
          page-break-after: always;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #0B5AA3 0%, #1e40af 100%);
          color: white;
          border-radius: 8px;
        }
        
        .report-header h1 {
          margin: 0 0 10px 0;
          font-size: 18pt;
          font-weight: bold;
        }
        
        .report-header h2 {
          margin: 0 0 10px 0;
          font-size: 16pt;
          font-weight: 600;
        }
        
        .report-header h3 {
          margin: 0;
          font-size: 14pt;
          font-weight: 500;
          opacity: 0.9;
        }
        
        .room-info-section {
          margin-bottom: 25px;
        }
        
        .room-info-section h4 {
          background: #059669;
          color: white;
          padding: 10px 15px;
          margin: 0 0 15px 0;
          font-size: 12pt;
          font-weight: bold;
          border-radius: 4px;
        }
        
        .room-details {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .detail-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 2fr;
          gap: 10px;
          margin-bottom: 8px;
          align-items: center;
        }
        
        .detail-row:last-child {
          margin-bottom: 0;
        }
        
        .label {
          font-weight: 600;
          color: #374151;
        }
        
        .value {
          color: #111827;
        }
        
        .test-results-section {
          flex: 1;
          margin-bottom: 25px;
        }
        
        .test-results-section h4 {
          background: #374151;
          color: white;
          padding: 10px 15px;
          margin: 0 0 15px 0;
          font-size: 12pt;
          font-weight: bold;
          border-radius: 4px;
        }
        
        .test-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .test-table th {
          background: #374151;
          color: white;
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 10pt;
          border: none;
        }
        
        .test-table td {
          padding: 10px 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
          font-size: 10pt;
        }
        
        .even-row {
          background: #ffffff;
        }
        
        .odd-row {
          background: #f9fafb;
        }
        
        .test-no {
          font-weight: bold;
          background: #f3f4f6 !important;
        }
        
        .test-name {
          text-align: left !important;
          font-weight: 500;
        }
        
        .result.success {
          color: #059669;
          font-weight: bold;
        }
        
        .result.failure {
          color: #dc2626;
          font-weight: bold;
        }
        
        .status.success {
          color: #059669;
          font-size: 14pt;
          font-weight: bold;
        }
        
        .status.failure {
          color: #dc2626;
          font-size: 14pt;
          font-weight: bold;
        }
        
        .report-footer {
          margin-top: auto;
        }
        
        .signature-section h4 {
          background: #6b7280;
          color: white;
          padding: 10px 15px;
          margin: 0 0 15px 0;
          font-size: 12pt;
          font-weight: bold;
          border-radius: 4px;
        }
        
        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .signature-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .signature-item:last-child {
          border-bottom: none;
        }
        
        .sig-label {
          font-weight: 600;
          color: #374151;
        }
        
        .sig-value {
          color: #111827;
          font-weight: 500;
        }
        
        .page-info {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          font-size: 9pt;
          color: #6b7280;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .page {
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${pages}
    </body>
    </html>
  `
}