import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneralInfo, Room, RoomTestData } from '../types';

export const generateExcelReport = async (generalInfo: GeneralInfo, rooms: Room[], allTestData: Record<string, RoomTestData>) => {
  const workbook = new ExcelJS.Workbook();
  
  rooms.forEach((room, index) => {
    const sheet = workbook.addWorksheet(`Mahal ${index + 1}`);
    const testData = allTestData[room.id];

    // Styling
    const font = { name: 'Arial Narrow', size: 10 };
    const border: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' as ExcelJS.BorderStyle },
      left: { style: 'thin' as ExcelJS.BorderStyle },
      bottom: { style: 'thin' as ExcelJS.BorderStyle },
      right: { style: 'thin' as ExcelJS.BorderStyle }
    };

    // Header
    sheet.mergeCells('A1:B1');
    sheet.getCell('A1').value = `MAHAL NO : ${room.roomNo}`;
    sheet.mergeCells('C1:D1');
    sheet.getCell('C1').value = `AKIŞ BİÇİMİ : ${room.flowType}`;
    sheet.mergeCells('E1:F1');
    sheet.getCell('E1').value = `YÜZEY ALANI : ${room.surfaceArea} m²`;
    
    sheet.mergeCells('A2:B2');
    sheet.getCell('A2').value = `MAHAL ADI: ${room.roomName}`;
    sheet.mergeCells('C2:D2');
    sheet.getCell('C2').value = `TEST MODU : ${room.testMode}`;
    sheet.mergeCells('E2:F2');
    sheet.getCell('E2').value = `YÜKSEKLİK : ${room.height} m`;

    // Table Header
    sheet.getCell('A4').value = 'NO';
    sheet.mergeCells('B4:C4');
    sheet.getCell('B4').value = 'TEST ADI';
    sheet.getCell('D4').value = 'KRİTER';
    sheet.mergeCells('E4:F4');
    sheet.getCell('E4').value = 'SONUÇ';

    // Test Data Rows
    let currentRow = 5;

    // Hava Debisi ve Hava Değişim Oranı (RULES.md'de detaylı tablo yapısı yok, varsayımsal olarak ekliyorum)
    if (testData?.airFlow) {
      sheet.getCell(`A${currentRow}`).value = 1;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Hava Debisi ve Hava Değişim Oranı';
      sheet.getCell(`D${currentRow}`).value = `Min. Kriter: ${testData.airFlow.minCriteria}`;
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `Toplam Debi: ${testData.airFlow.totalDebit} m³/h\nHava Değişim Oranı: ${testData.airFlow.airChangeRate} 1/saat`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Basınç Farkı
    if (testData?.pressure) {
      sheet.getCell(`A${currentRow}`).value = 3;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Basınç Farkı';
      sheet.getCell(`D${currentRow}`).value = '≥ 6 Pa';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.pressure.pressure} Pa\n${testData.pressure.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Hava Akış Yönü
    if (testData?.airDirection) {
      sheet.getCell(`A${currentRow}`).value = 4;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Hava Akış Yönü';
      sheet.getCell(`D${currentRow}`).value = 'Temiz→Kirli';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `Gözlem\n${testData.airDirection.result}`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // HEPA Sızdırmazlık
    if (testData?.hepa) {
      sheet.getCell(`A${currentRow}`).value = 5;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'HEPA Sızdırmazlık';
      sheet.getCell(`D${currentRow}`).value = '≤ %0.01';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.hepa.leakage}%\n${testData.hepa.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Partikül Sayısı (0.5 µm)
    if (testData?.particle) {
      sheet.getCell(`A${currentRow}`).value = 6;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Partikül Sayısı (0.5 µm)';
      sheet.getCell(`D${currentRow}`).value = `ISO Class ${testData.particle.isoClass.replace('ISO ', '')}`;
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.particle.isoClass}\n${testData.particle.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Recovery Time
    if (testData?.recovery) {
      sheet.getCell(`A${currentRow}`).value = 9;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Recovery Time';
      sheet.getCell(`D${currentRow}`).value = '≤ 25 dk';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.recovery.duration} dk\n${testData.recovery.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'}`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Sıcaklık ve Nem
    if (testData?.tempHumidity) {
      sheet.getCell(`A${currentRow}`).value = 10; // Varsayımsal NO
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Sıcaklık ve Nem';
      sheet.getCell(`D${currentRow}`).value = '20-24°C & 40-60%';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `Sıcaklık: ${testData.tempHumidity.temperature}°C (${testData.tempHumidity.tempCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'})\nNem: ${testData.tempHumidity.humidity}% (${testData.tempHumidity.humidityCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'})`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Gürültü ve Aydınlatma Seviyesi (isteğe bağlı, varsa ekle)
    if (testData?.noiseIllumination) {
      sheet.getCell(`A${currentRow}`).value = 11; // Varsayımsal NO
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Gürültü ve Aydınlatma';
      sheet.getCell(`D${currentRow}`).value = 'IEST-RP-CC006.3';
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `Gürültü: ${testData.noiseIllumination.noise} dB (${testData.noiseIllumination.noiseCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'})\nAydınlatma: ${testData.noiseIllumination.illumination} Lux (${testData.noiseIllumination.illuminationCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL'})`;
      sheet.getCell(`E${currentRow}`).alignment = { wrapText: true, vertical: 'middle' };
      currentRow++;
    }

    // Footer
    const lastRow = currentRow + 2;
    sheet.mergeCells(`A${lastRow}:B${lastRow}`);
    sheet.getCell(`A${lastRow}`).value = `TESTİ YAPAN: ${generalInfo.testerName}`;
    sheet.mergeCells(`C${lastRow}:D${lastRow}`);
    sheet.getCell(`C${lastRow}`).value = `RAPORU HAZIRLAYAN: ${generalInfo.preparedBy}`;
    
    sheet.mergeCells(`A${lastRow + 1}:B${lastRow + 1}`);
    sheet.getCell(`A${lastRow + 1}`).value = `ONAYLAYAN: ${generalInfo.approvedBy}`;
    sheet.mergeCells(`C${lastRow + 1}:D${lastRow + 1}`);
    sheet.getCell(`C${lastRow + 1}`).value = `TARİH: ${generalInfo.measurementDate}`;

    // Logo and Stamp
    if (generalInfo.logo) {
      const logoId = workbook.addImage({
        base64: generalInfo.logo.split(',')[1], // Base64 verisini al
        extension: generalInfo.logo.split(';')[0].split('/')[1] as 'png' | 'jpeg',
      });
      sheet.addImage(logoId, {
        tl: { col: 0.5, row: lastRow + 2.5 }, // A sütunu, lastRow + 2.5 satırı
        ext: { width: 80, height: 40 },
      });
    }

    if (generalInfo.stamp) {
      const stampId = workbook.addImage({
        base64: generalInfo.stamp.split(',')[1], // Base64 verisini al
        extension: generalInfo.stamp.split(';')[0].split('/')[1] as 'png' | 'jpeg',
      });
      sheet.addImage(stampId, {
        tl: { col: 2.5, row: lastRow + 2.5 }, // C sütunu, lastRow + 2.5 satırı
        ext: { width: 80, height: 40 },
      });
    }

    sheet.mergeCells(`E${lastRow + 2}:F${lastRow + 2}`);
    sheet.getCell(`E${lastRow + 2}`).value = `Sayfa ${index + 1}/${rooms.length}`;
    sheet.getCell(`E${lastRow + 2}`).alignment = { horizontal: 'right' };

    // Apply styles
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = font;
        cell.border = border;
      });
    });
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${generalInfo.reportNo}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generatePdfReport = async (reportElement: HTMLElement, generalInfo: GeneralInfo, rooms: Room[]) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < rooms.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    // HTML içeriğini PDF'e ekle
    const canvas = await html2canvas(reportElement); // Her sayfa için yeniden render et
    const imgData = canvas.toDataURL('image/png');
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10; // Üstten boşluk
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Logo ve Mühür (PDF'in alt kısmına)
    const footerY = pdfHeight - 30; // Alt kısımdan 30mm yukarıda

    if (generalInfo.logo) {
      const img = new Image();
      img.src = generalInfo.logo;
      await new Promise(resolve => img.onload = resolve); // Resmin yüklenmesini bekle
      pdf.addImage(img, 'PNG', 10, footerY, 40, 20); // Sol alt köşe
    }

    if (generalInfo.stamp) {
      const img = new Image();
      img.src = generalInfo.stamp;
      await new Promise(resolve => img.onload = resolve); // Resmin yüklenmesini bekle
      pdf.addImage(img, 'PNG', pdfWidth / 2 - 20, footerY, 40, 20); // Orta alt kısım
    }

    // Sayfa Numarası
    pdf.setFontSize(10);
    pdf.text(`Sayfa ${i + 1}/${rooms.length}`, pdfWidth - 20, footerY + 10, { align: 'right' });
  }
  
  pdf.save(`${generalInfo.reportNo}.pdf`);
};
