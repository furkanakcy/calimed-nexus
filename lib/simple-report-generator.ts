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

      ${reportData.rooms.map((room, index) => {
        // Safe access to room properties with fallbacks
        const roomNo = room.roomNo || room.basicInfo?.roomNumber || 'N/A'
        const roomName = room.roomName || room.basicInfo?.roomName || 'Bilinmeyen Oda'
        const surfaceArea = room.surfaceArea || room.basicInfo?.surfaceArea || 0
        const height = room.height || room.basicInfo?.height || 0
        const volume = room.volume || room.basicInfo?.volume || 0
        const testMode = room.testMode || room.basicInfo?.testMode || 'N/A'
        const flowType = room.flowType || room.basicInfo?.flowType || 'N/A'
        const roomClass = room.roomClass || room.basicInfo?.roomClass || 'N/A'
        
        // Safe access to test data with fallbacks
        const tests = room.tests || {}
        const airflowData = tests.airflowData || room.airFlow || {}
        const pressureDifference = tests.pressureDifference || room.pressureDifference || {}
        const airFlowDirection = tests.airFlowDirection || room.airFlowDirection || {}
        const hepaLeakage = tests.hepaLeakage || room.hepaLeakage || {}
        const particleCount = tests.particleCount || room.particleCount || {}
        const recoveryTime = tests.recoveryTime || room.recoveryTime || {}
        const temperatureHumidity = tests.temperatureHumidity || room.temperatureHumidity || {}
        
        return `
        <div class="room-section">
          <div class="room-title">MAHAL NO: ${roomNo} - ${roomName}</div>
          
          <table class="info-table">
            <tr>
              <td class="label">Yüzey Alanı:</td>
              <td>${surfaceArea} m²</td>
              <td class="label">Yükseklik:</td>
              <td>${height} m</td>
            </tr>
            <tr>
              <td class="label">Hacim:</td>
              <td>${volume} m³</td>
              <td class="label">Test Modu:</td>
              <td>${testMode}</td>
            </tr>
            <tr>
              <td class="label">Akış Biçimi:</td>
              <td>${flowType}</td>
              <td class="label">Mahal Sınıfı:</td>
              <td>${roomClass}</td>
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
                <td>${airflowData.criteria || 'Belirtilmemiş'}</td>
                <td>${airflowData.flowRate || airflowData.totalFlowRate || 0} m³/h</td>
                <td class="${(airflowData.meetsCriteria || airflowData.meetsMinCriteria) ? 'success' : 'failure'}">
                  ${(airflowData.meetsCriteria || airflowData.meetsMinCriteria) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Basınç Farkı</td>
                <td>${pressureDifference.criteria || '≥ 6 Pa'}</td>
                <td>${pressureDifference.pressure || 0} Pa</td>
                <td class="${(pressureDifference.meetsCriteria || pressureDifference.meetsMinPressure) ? 'success' : 'failure'}">
                  ${(pressureDifference.meetsCriteria || pressureDifference.meetsMinPressure) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Hava Akış Yönü</td>
                <td>Temiz → Kirli</td>
                <td>${airFlowDirection.observation || airFlowDirection.direction || 'Gözlem'}</td>
                <td class="${airFlowDirection.result === 'UYGUNDUR' || airFlowDirection.result === 'Uygundur' ? 'success' : 'failure'}">
                  ${airFlowDirection.result || 'Belirtilmemiş'}
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>HEPA Sızdırmazlık</td>
                <td>${hepaLeakage.criteria || '≤ %0.01'}</td>
                <td>${hepaLeakage.actualLeakage || hepaLeakage.maxLeakage || 0}%</td>
                <td class="${(hepaLeakage.meetsCriteria || hepaLeakage.meetsMaxLeakage) ? 'success' : 'failure'}">
                  ${(hepaLeakage.meetsCriteria || hepaLeakage.meetsMaxLeakage) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Partikül Sayısı</td>
                <td>ISO Class ${particleCount.isoClass || '7'}</td>
                <td>${particleCount.particle05 || particleCount.average05um || 0}</td>
                <td class="${(particleCount.meetsCriteria || particleCount.meetsISOStandard) ? 'success' : 'failure'}">
                  ${(particleCount.meetsCriteria || particleCount.meetsISOStandard) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Recovery Time</td>
                <td>${recoveryTime.criteria || '≤ 25 dk'}</td>
                <td>${recoveryTime.duration || recoveryTime.recoveryTime || 0} dk</td>
                <td class="${(recoveryTime.meetsCriteria || recoveryTime.meetsMaxTime) ? 'success' : 'failure'}">
                  ${(recoveryTime.meetsCriteria || recoveryTime.meetsMaxTime) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>Sıcaklık & Nem</td>
                <td>${temperatureHumidity.criteria || '20-24°C, 40-60%'}</td>
                <td>${temperatureHumidity.temperature || 0}°C, ${temperatureHumidity.humidity || 0}%</td>
                <td class="${(temperatureHumidity.meetsCriteria || (temperatureHumidity.temperatureInRange && temperatureHumidity.humidityInRange)) ? 'success' : 'failure'}">
                  ${(temperatureHumidity.meetsCriteria || (temperatureHumidity.temperatureInRange && temperatureHumidity.humidityInRange)) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; font-size: 10pt; color: #666;">
            Sayfa ${index + 1}/${reportData.rooms.length}
          </div>
        </div>
        `
      }).join('')}

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

  // Room data with safe access
  reportData.rooms.forEach((room, index) => {
    // Safe access to room properties with fallbacks
    const roomNo = room.roomNo || room.basicInfo?.roomNumber || 'N/A'
    const roomName = room.roomName || room.basicInfo?.roomName || 'Bilinmeyen Oda'
    const surfaceArea = room.surfaceArea || room.basicInfo?.surfaceArea || 0
    const height = room.height || room.basicInfo?.height || 0
    const volume = room.volume || room.basicInfo?.volume || 0
    const testMode = room.testMode || room.basicInfo?.testMode || 'N/A'
    const flowType = room.flowType || room.basicInfo?.flowType || 'N/A'
    const roomClass = room.roomClass || room.basicInfo?.roomClass || 'N/A'
    
    // Safe access to test data with fallbacks
    const tests = room.tests || {}
    const airflowData = tests.airflowData || room.airFlow || {}
    const pressureDifference = tests.pressureDifference || room.pressureDifference || {}
    const airFlowDirection = tests.airFlowDirection || room.airFlowDirection || {}
    const hepaLeakage = tests.hepaLeakage || room.hepaLeakage || {}
    const particleCount = tests.particleCount || room.particleCount || {}
    const recoveryTime = tests.recoveryTime || room.recoveryTime || {}
    const temperatureHumidity = tests.temperatureHumidity || room.temperatureHumidity || {}
    
    csvContent += `MAHAL ${index + 1}: ${roomNo} - ${roomName}\n`
    csvContent += `Yüzey Alanı,${surfaceArea} m²\n`
    csvContent += `Yükseklik,${height} m\n`
    csvContent += `Hacim,${volume} m³\n`
    csvContent += `Test Modu,${testMode}\n`
    csvContent += `Akış Biçimi,${flowType}\n`
    csvContent += `Mahal Sınıfı,${roomClass}\n\n`
    
    csvContent += `Test No,Test Adı,Kriter,Ölçüm Değeri,Sonuç\n`
    csvContent += `1,Hava Debisi,${airflowData.criteria || 'Belirtilmemiş'},${airflowData.flowRate || airflowData.totalFlowRate || 0} m³/h,${(airflowData.meetsCriteria || airflowData.meetsMinCriteria) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `2,Basınç Farkı,${pressureDifference.criteria || '≥ 6 Pa'},${pressureDifference.pressure || 0} Pa,${(pressureDifference.meetsCriteria || pressureDifference.meetsMinPressure) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `3,Hava Akış Yönü,Temiz → Kirli,${airFlowDirection.observation || airFlowDirection.direction || 'Gözlem'},${airFlowDirection.result || 'Belirtilmemiş'}\n`
    csvContent += `4,HEPA Sızdırmazlık,${hepaLeakage.criteria || '≤ %0.01'},${hepaLeakage.actualLeakage || hepaLeakage.maxLeakage || 0}%,${(hepaLeakage.meetsCriteria || hepaLeakage.meetsMaxLeakage) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `5,Partikül Sayısı,ISO Class ${particleCount.isoClass || '7'},${particleCount.particle05 || particleCount.average05um || 0},${(particleCount.meetsCriteria || particleCount.meetsISOStandard) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `6,Recovery Time,${recoveryTime.criteria || '≤ 25 dk'},${recoveryTime.duration || recoveryTime.recoveryTime || 0} dk,${(recoveryTime.meetsCriteria || recoveryTime.meetsMaxTime) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n`
    csvContent += `7,Sıcaklık & Nem,${temperatureHumidity.criteria || '20-24°C; 40-60%'},"${temperatureHumidity.temperature || 0}°C; ${temperatureHumidity.humidity || 0}%",${(temperatureHumidity.meetsCriteria || (temperatureHumidity.temperatureInRange && temperatureHumidity.humidityInRange)) ? 'UYGUNDUR' : 'UYGUN DEĞİL'}\n\n`
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