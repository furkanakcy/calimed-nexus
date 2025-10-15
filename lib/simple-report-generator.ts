import { HvacReportData } from './hvac-types'

export function generateSimplePDF(reportData: HvacReportData) {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available in browser environment')
  }

  // Check if we're in production (Render.com)
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('vercel.app')

  console.log('Environment check:', { 
    hostname: window.location.hostname, 
    isProduction,
    userAgent: navigator.userAgent 
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <title>HVAC Raporu - ${reportData.reportInfo.reportNumber}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 18pt; font-weight: bold; color: #0B5AA3; }
        .subtitle { font-size: 14pt; margin: 10px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 8px; border: 1px solid #ddd; }
        .info-table .label { font-weight: bold; background: #f5f5f5; }
        .room-section { margin: 30px 0; page-break-inside: avoid; }
        .room-title { font-size: 14pt; font-weight: bold; margin-bottom: 15px; }
        .test-table { width: 100%; border-collapse: collapse; }
        .test-table th, .test-table td { padding: 8px; border: 1px solid #ddd; text-align: center; }
        .test-table th { background: #0B5AA3; color: white; }
        .success { color: #059669; font-weight: bold; }
        .failure { color: #dc2626; font-weight: bold; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${reportData.reportInfo.organizationName}</div>
        <div class="subtitle">HVAC PERFORMANS NİTELEME TEST RAPORU</div>
        <div>${reportData.reportInfo.hospitalName} - ${reportData.reportInfo.reportNumber}</div>
      </div>

      <table class="info-table">
        <tr>
          <td class="label">Rapor No:</td>
          <td>${reportData.reportInfo.reportNumber}</td>
          <td class="label">Ölçüm Tarihi:</td>
          <td>${reportData.reportInfo.measurementDate}</td>
        </tr>
        <tr>
          <td class="label">Testi Yapan:</td>
          <td>${reportData.reportInfo.testerName}</td>
          <td class="label">Raporu Hazırlayan:</td>
          <td>${reportData.reportInfo.reportPreparerName}</td>
        </tr>
        <tr>
          <td class="label">Onaylayan:</td>
          <td>${reportData.reportInfo.approverName}</td>
          <td class="label">Kuruluş:</td>
          <td>${reportData.reportInfo.organizationName}</td>
        </tr>
      </table>

      ${reportData.rooms.map((room, index) => `
        <div class="room-section">
          <div class="room-title">MAHAL NO: ${room.roomNo} - ${room.roomName}</div>
          
          <table class="info-table">
            <tr>
              <td class="label">Yüzey Alanı:</td>
              <td>${room.surfaceArea} m²</td>
              <td class="label">Yükseklik:</td>
              <td>${room.height} m</td>
            </tr>
            <tr>
              <td class="label">Hacim:</td>
              <td>${room.volume} m³</td>
              <td class="label">Test Modu:</td>
              <td>${room.testMode}</td>
            </tr>
            <tr>
              <td class="label">Akış Biçimi:</td>
              <td>${room.flowType}</td>
              <td class="label">Mahal Sınıfı:</td>
              <td>${room.roomClass}</td>
            </tr>
          </table>

          <table class="test-table">
            <thead>
              <tr>
                <th>Test No</th>
                <th>Test Adı</th>
                <th>Kriter</th>
                <th>Ölçüm Değeri</th>
                <th>Sonuç</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Hava Debisi</td>
                <td>${room.tests.airflowData.criteria}</td>
                <td>${room.tests.airflowData.flowRate} m³/h</td>
                <td class="${room.tests.airflowData.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.airflowData.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Basınç Farkı</td>
                <td>${room.tests.pressureDifference.criteria}</td>
                <td>${room.tests.pressureDifference.pressure} Pa</td>
                <td class="${room.tests.pressureDifference.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.pressureDifference.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Hava Akış Yönü</td>
                <td>Temiz → Kirli</td>
                <td>${room.tests.airFlowDirection.observation || 'Gözlem'}</td>
                <td class="${room.tests.airFlowDirection.result === 'UYGUNDUR' ? 'success' : 'failure'}">
                  ${room.tests.airFlowDirection.result}
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>HEPA Sızdırmazlık</td>
                <td>${room.tests.hepaLeakage.criteria}</td>
                <td>${room.tests.hepaLeakage.actualLeakage}%</td>
                <td class="${room.tests.hepaLeakage.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.hepaLeakage.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Partikül Sayısı</td>
                <td>ISO Class ${room.tests.particleCount.isoClass}</td>
                <td>${room.tests.particleCount.particle05}</td>
                <td class="${room.tests.particleCount.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.particleCount.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Recovery Time</td>
                <td>${room.tests.recoveryTime.criteria}</td>
                <td>${room.tests.recoveryTime.duration} dk</td>
                <td class="${room.tests.recoveryTime.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.recoveryTime.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>Sıcaklık & Nem</td>
                <td>${room.tests.temperatureHumidity.criteria}</td>
                <td>${room.tests.temperatureHumidity.temperature}°C, ${room.tests.temperatureHumidity.humidity}%</td>
                <td class="${room.tests.temperatureHumidity.meetsCriteria ? 'success' : 'failure'}">
                  ${room.tests.temperatureHumidity.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; font-size: 10pt; color: #666;">
            Sayfa ${index + 1}/${reportData.rooms.length}
          </div>
        </div>
      `).join('')}

      <div style="margin-top: 40px; border-top: 2px solid #0B5AA3; padding-top: 20px;">
        <table class="info-table">
          <tr>
            <td class="label">Testi Yapan:</td>
            <td>${reportData.reportInfo.testerName}</td>
            <td class="label">Raporu Hazırlayan:</td>
            <td>${reportData.reportInfo.reportPreparerName}</td>
          </tr>
          <tr>
            <td class="label">Onaylayan:</td>
            <td>${reportData.reportInfo.approverName}</td>
            <td class="label">Tarih:</td>
            <td>${reportData.reportInfo.measurementDate}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `

  const fileName = `HVAC_Raporu_${reportData.reportInfo.reportNumber}_${new Date().toISOString().split('T')[0]}.html`
  
  // Save file info to localStorage
  try {
    const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
    reportFiles[reportData.id] = reportFiles[reportData.id] || {}
    reportFiles[reportData.id].pdf = {
      fileName: fileName.replace('.html', '.pdf'),
      createdAt: new Date().toISOString(),
      size: htmlContent.length
    }
    localStorage.setItem('hvac-report-files', JSON.stringify(reportFiles))
  } catch (error) {
    console.warn('Could not save file info to localStorage:', error)
  }

  if (isProduction) {
    // Production environment - use different approach
    try {
      // Method 1: Try direct download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      
      // Check if browser supports download attribute
      const link = document.createElement('a')
      if ('download' in link) {
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        
        // Add to DOM, click, and remove
        document.body.appendChild(link)
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          
          alert(`HTML dosyası indirildi: ${fileName}

PDF'e dönüştürmek için:
1. İndirilen HTML dosyasını tarayıcıda açın
2. Ctrl+P (veya Cmd+P) ile yazdır menüsünü açın  
3. "Hedef" kısmından "PDF olarak kaydet" seçin
4. Kaydet butonuna tıklayın`)
        }, 100)
      } else {
        // Fallback: Open in new tab
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(htmlContent)
          newWindow.document.close()
          newWindow.document.title = fileName
          
          alert(`Rapor yeni sekmede açıldı.

PDF olarak kaydetmek için:
1. Yeni sekmede Ctrl+P (veya Cmd+P) tuşlarına basın
2. "Hedef" kısmından "PDF olarak kaydet" seçin
3. Dosya adını "${fileName.replace('.html', '.pdf')}" olarak değiştirin
4. Kaydet butonuna tıklayın`)
        } else {
          throw new Error('Popup blocked')
        }
      }
    } catch (error) {
      console.error('Production PDF generation failed:', error)
      
      // Ultimate fallback: Copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(htmlContent).then(() => {
          alert(`Rapor HTML kodu panoya kopyalandı.

Manuel olarak kaydetmek için:
1. Yeni bir metin editörü açın
2. Ctrl+V ile yapıştırın
3. Dosyayı "${fileName}" adıyla kaydedin
4. Dosyayı tarayıcıda açıp PDF olarak yazdırın`)
        }).catch(() => {
          // Show HTML in alert as last resort
          const shortHtml = htmlContent.substring(0, 1000) + '...'
          alert(`İndirme başarısız. HTML içeriğinin başlangıcı:

${shortHtml}

Lütfen bu içeriği manuel olarak bir HTML dosyasına kaydedin.`)
        })
      }
    }
  } else {
    // Local development - use simple method
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    alert(`HTML dosyası indirildi: ${fileName}

PDF'e dönüştürmek için:
1. İndirilen HTML dosyasını tarayıcıda açın
2. Ctrl+P (veya Cmd+P) ile yazdır menüsünü açın
3. "Hedef" kısmından "PDF olarak kaydet" seçin
4. Kaydet butonuna tıklayın`)
  }

  return fileName
}

export function generateSimpleExcel(reportData: HvacReportData) {
  if (typeof window === 'undefined') {
    throw new Error('Excel generation is only available in browser environment')
  }

  // Check if we're in production
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('vercel.app')

  // Create CSV content (Excel alternative)
  let csvContent = "data:text/csv;charset=utf-8,"
  
  // Header
  csvContent += `HVAC PERFORMANS NİTELEME TEST RAPORU\n`
  csvContent += `${reportData.reportInfo.hospitalName} - ${reportData.reportInfo.reportNumber}\n`
  csvContent += `Tarih: ${reportData.reportInfo.measurementDate}\n\n`
  
  // Report info
  csvContent += `Rapor Bilgileri\n`
  csvContent += `Rapor No,${reportData.reportInfo.reportNumber}\n`
  csvContent += `Testi Yapan,${reportData.reportInfo.testerName}\n`
  csvContent += `Raporu Hazırlayan,${reportData.reportInfo.reportPreparerName}\n`
  csvContent += `Onaylayan,${reportData.reportInfo.approverName}\n`
  csvContent += `Kuruluş,${reportData.reportInfo.organizationName}\n\n`

  // Room data
  reportData.rooms.forEach((room, index) => {
    csvContent += `MAHAL ${index + 1}: ${room.roomNo} - ${room.roomName}\n`
    csvContent += `Yüzey Alanı,${room.surfaceArea} m²\n`
    csvContent += `Yükseklik,${room.height} m\n`
    csvContent += `Hacim,${room.volume} m³\n`
    csvContent += `Test Modu,${room.testMode}\n`
    csvContent += `Akış Biçimi,${room.flowType}\n`
    csvContent += `Mahal Sınıfı,${room.roomClass}\n\n`
    
    csvContent += `Test No,Test Adı,Kriter,Ölçüm Değeri,Sonuç\n`
    csvContent += `1,Hava Debisi,${room.tests.airflowData.criteria},${room.tests.airflowData.flowRate} m³/h,${room.tests.airflowData.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `2,Basınç Farkı,${room.tests.pressureDifference.criteria},${room.tests.pressureDifference.pressure} Pa,${room.tests.pressureDifference.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `3,Hava Akış Yönü,Temiz → Kirli,${room.tests.airFlowDirection.observation || 'Gözlem'},${room.tests.airFlowDirection.result}\n`
    csvContent += `4,HEPA Sızdırmazlık,${room.tests.hepaLeakage.criteria},${room.tests.hepaLeakage.actualLeakage}%,${room.tests.hepaLeakage.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `5,Partikül Sayısı,ISO Class ${room.tests.particleCount.isoClass},${room.tests.particleCount.particle05},${room.tests.particleCount.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `6,Recovery Time,${room.tests.recoveryTime.criteria},${room.tests.recoveryTime.duration} dk,${room.tests.recoveryTime.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `7,Sıcaklık & Nem,${room.tests.temperatureHumidity.criteria},"${room.tests.temperatureHumidity.temperature}°C, ${room.tests.temperatureHumidity.humidity}%",${room.tests.temperatureHumidity.meetsCriteria ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n\n`
  })

  const fileName = `HVAC_Raporu_${reportData.reportInfo.reportNumber}_${new Date().toISOString().split('T')[0]}.csv`
  
  // Save file info to localStorage
  try {
    const reportFiles = JSON.parse(localStorage.getItem('hvac-report-files') || '{}')
    reportFiles[reportData.id] = reportFiles[reportData.id] || {}
    reportFiles[reportData.id].excel = {
      fileName: fileName.replace('.csv', '.xlsx'),
      createdAt: new Date().toISOString(),
      size: csvContent.length
    }
    localStorage.setItem('hvac-report-files', JSON.stringify(reportFiles))
  } catch (error) {
    console.warn('Could not save file info to localStorage:', error)
  }

  if (isProduction) {
    // Production environment - safer approach
    try {
      // Method 1: Try blob download
      const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { 
        type: 'text/csv;charset=utf-8' 
      })
      
      const link = document.createElement('a')
      if ('download' in link && window.URL) {
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        
        document.body.appendChild(link)
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          
          alert(`CSV dosyası indirildi: ${fileName}

Excel'de açmak için:
1. Excel'i açın
2. Dosya > Aç menüsünden CSV dosyasını seçin
3. "Sınırlandırılmış" seçeneğini işaretleyin
4. Ayırıcı olarak "Virgül" seçin
5. Türkçe karakterler için UTF-8 kodlamasını seçin`)
        }, 100)
      } else {
        // Fallback: Data URI
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.href = encodedUri
        link.download = fileName
        link.style.display = 'none'
        
        document.body.appendChild(link)
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
        }, 100)
        
        alert(`CSV dosyası indirildi: ${fileName}`)
      }
    } catch (error) {
      console.error('Production Excel generation failed:', error)
      
      // Fallback: Copy to clipboard
      const csvData = csvContent.replace('data:text/csv;charset=utf-8,', '')
      if (navigator.clipboard) {
        navigator.clipboard.writeText(csvData).then(() => {
          alert(`CSV verisi panoya kopyalandı.

Manuel olarak kaydetmek için:
1. Yeni bir metin editörü açın
2. Ctrl+V ile yapıştırın  
3. Dosyayı "${fileName}" adıyla kaydedin
4. Excel'de açın`)
        }).catch(() => {
          alert(`İndirme başarısız. Lütfen tekrar deneyin veya farklı bir tarayıcı kullanın.`)
        })
      }
    }
  } else {
    // Local development
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert(`CSV dosyası indirildi: ${fileName}

Excel'de açmak için:
1. Excel'i açın
2. Dosya > Aç menüsünden CSV dosyasını seçin
3. "Sınırlandırılmış" seçeneğini işaretleyin
4. Ayırıcı olarak "Virgül" seçin
5. Türkçe karakterler için UTF-8 kodlamasını seçin`)
  }

  return fileName
}