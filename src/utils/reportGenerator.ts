import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneralInfo, Room, RoomTestData } from '../types/report';

export const generateExcelReport = async (generalInfo: GeneralInfo, rooms: Room[], allTestData: Record<string, RoomTestData>) => {
  const workbook = new ExcelJS.Workbook();
  
  rooms.forEach((room, index) => {
    const sheet = workbook.addWorksheet(`Mahal ${index + 1}`);
    const testData = allTestData[room.id];

    // Set column widths
    sheet.columns = [
      { width: 4 },   // A - NO
      { width: 25 },  // B - TEST ADI
      { width: 15 },  // C - KABUL KRİTERİ
      { width: 15 },  // D - TEST SONUCU
      { width: 12 },  // E - UYGUNLUK
      { width: 15 },  // F - Extra
      { width: 15 },  // G - Extra
      { width: 15 }   // H - Extra
    ];

    // Logo area (if available)
    if (generalInfo.logo) {
      try {
        const logoBuffer = Buffer.from(generalInfo.logo.split(',')[1], 'base64');
        const logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png',
        });
        sheet.addImage(logoId, {
          tl: { col: 0, row: 0 },
          ext: { width: 100, height: 60 }
        });
      } catch (error) {
        console.warn('Logo could not be added:', error);
      }
    }

    // Report number and version in top right
    sheet.mergeCells('F1:H1');
    sheet.getCell('F1').value = generalInfo.reportNo;
    sheet.getCell('F1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('F1').font = { bold: true, size: 12 };
    sheet.getCell('F1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E6E6' } };
    sheet.getCell('F1').border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };

    sheet.mergeCells('F2:H2');
    sheet.getCell('F2').value = new Date(generalInfo.measurementDate).toLocaleDateString('tr-TR');
    sheet.getCell('F2').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('F2').font = { size: 10 };
    sheet.getCell('F2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFA500' } };
    sheet.getCell('F2').border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };

    // Main title
    sheet.mergeCells('A4:H4');
    sheet.getCell('A4').value = 'ÖZET RAPOR / SUMMARY REPORT';
    sheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('A4').font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    sheet.getCell('A4').border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };

    // Subtitle
    sheet.mergeCells('A5:H5');
    sheet.getCell('A5').value = 'TEMİZ ODA, TEMİZ ALAN VE TEST DURUMU / CLEAN ROOM, CLEAN ZONE AND TEST STATUS';
    sheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('A5').font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };
    sheet.getCell('A5').border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };

    // Room information section
    sheet.mergeCells('A7:B7');
    sheet.getCell('A7').value = 'TEMİZ ODANIN TANIMI /\nDESCRIPTION OF THE CLEAN ROOM';
    sheet.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('A7').font = { bold: true, size: 9 };
    sheet.getCell('A7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.mergeCells('C7:E7');
    sheet.getCell('C7').value = 'ROOM INFORMATION';
    sheet.getCell('C7').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('C7').font = { bold: true, size: 10 };
    sheet.getCell('C7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.mergeCells('F7:H7');
    sheet.getCell('F7').value = 'TEST STATUS';
    sheet.getCell('F7').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('F7').font = { bold: true, size: 10 };
    sheet.getCell('F7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    // Room details
    sheet.mergeCells('A8:B8');
    sheet.getCell('A8').value = `${room.roomName}\nSTERİLİZASYON OTOKLAV`;
    sheet.getCell('A8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('A8').font = { size: 9 };

    sheet.getCell('C8').value = `AREA(m²)\n${room.surfaceArea}`;
    sheet.getCell('C8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('C8').font = { size: 9 };

    sheet.getCell('D8').value = `VOL(m³)\n${room.volume.toFixed(2)}`;
    sheet.getCell('D8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('D8').font = { size: 9 };

    sheet.getCell('E8').value = `DIFFUSER\nPIECES\n1`;
    sheet.getCell('E8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('E8').font = { size: 9 };

    sheet.getCell('F8').value = `AS\nBUILT`;
    sheet.getCell('F8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('F8').font = { size: 9 };

    sheet.getCell('G8').value = `AT\nREST\nX`;
    sheet.getCell('G8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('G8').font = { size: 9 };

    sheet.getCell('H8').value = `IN\nOPERATION`;
    sheet.getCell('H8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('H8').font = { size: 9 };

    // Air flow type section
    sheet.mergeCells('A10:B10');
    sheet.getCell('A10').value = 'HAVA AKIŞ TİPİ';
    sheet.getCell('A10').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('A10').font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } };

    sheet.mergeCells('C10:E10');
    sheet.getCell('C10').value = room.flowType === 'Turbulence' ? 'LOW TURBULENCE FLOW SYSTEM\nMIXED' : 
                                 room.flowType === 'Laminar' ? 'UNIDIRECTIONAL' : 'NON - UNIDIRECTIONAL';
    sheet.getCell('C10').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('C10').font = { size: 9 };

    sheet.mergeCells('F10:H10');
    sheet.getCell('F10').value = 'TEST TİPİ';
    sheet.getCell('F10').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('F10').font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('F10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } };

    // Test table headers
    sheet.getCell('A12').value = 'NO';
    sheet.getCell('A12').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('A12').font = { bold: true, size: 9 };
    sheet.getCell('A12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.mergeCells('B12:C12');
    sheet.getCell('B12').value = 'TEST ADI / TEST DESCRIPTION';
    sheet.getCell('B12').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('B12').font = { bold: true, size: 9 };
    sheet.getCell('B12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.getCell('D12').value = 'KABUL KRİTERİ /\nACCEPTANCE CRITERIA';
    sheet.getCell('D12').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('D12').font = { bold: true, size: 9 };
    sheet.getCell('D12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.mergeCells('E12:F12');
    sheet.getCell('E12').value = 'TEST SONUCU / TEST\nRESULTS';
    sheet.getCell('E12').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('E12').font = { bold: true, size: 9 };
    sheet.getCell('E12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    sheet.mergeCells('G12:H12');
    sheet.getCell('G12').value = 'UYGUNLUK /\nCOMPLIANCE';
    sheet.getCell('G12').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getCell('G12').font = { bold: true, size: 9 };
    sheet.getCell('G12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    // Test data rows
    let currentRow = 13;

    // Test 1: Hava Hızı / Hava Debisi
    if (testData?.airFlow) {
      sheet.getCell(`A${currentRow}`).value = 1;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'HAVA HIZI / HAVA DEBİSİ AIRFLOW VELOCITY';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '-';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = testData.airFlow.totalDebit.toFixed(2);
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = 'UYGUNDUR';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { bold: true, color: { argb: 'FF00B050' } };
      
      currentRow++;
    }

    // Test 2: Hava Değişim Oranı
    if (testData?.airFlow) {
      sheet.getCell(`A${currentRow}`).value = 2;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'HAVA DEĞİŞİM ORANI / AIR CHANGE RATE';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '≥ 10';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = testData.airFlow.airChangeRate.toFixed(2);
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.airFlow.airChangeRate >= 10 ? 'UYGUNDUR' : 'UYGUN DEĞİL';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.airFlow.airChangeRate >= 10 ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Test 3: Basınç Farkı
    if (testData?.pressure) {
      sheet.getCell(`A${currentRow}`).value = 3;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'BASINÇ FARKI / DIFFERENTIAL PRESSURE';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '≥ 0 Pa';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = testData.pressure.pressure;
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.pressure.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.pressure.isCompliant ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Test 4: Hava Akış Yönü
    if (testData?.airDirection) {
      sheet.getCell(`A${currentRow}`).value = 4;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'HAVA AKIŞ YÖNÜ / AIRFLOW DIRECTION';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '→';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`D${currentRow}`).font = { size: 14, color: { argb: 'FF5B9BD5' } };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = '→';
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`E${currentRow}`).font = { size: 14, color: { argb: 'FF5B9BD5' } };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.airDirection.result;
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.airDirection.result === 'Uygundur' ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Test 5: Partikül Sayısı
    if (testData?.particle) {
      sheet.getCell(`A${currentRow}`).value = 5;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'PARTİKÜL SAYISI VE TEMİZLİK SINIFI /\nPARTICLE NUMBER AND CLASS OF ROOM';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '≤ ISO CLASS 8';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = testData.particle.isoClass;
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.particle.isCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.particle.isCompliant ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Test 6: Sıcaklık
    if (testData?.tempHumidity) {
      sheet.getCell(`A${currentRow}`).value = 6;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'SICAKLIK / TEMPERATURE';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '18°C - 22°C';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.tempHumidity.temperature.toFixed(2)}`;
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.tempHumidity.tempCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.tempHumidity.tempCompliant ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Test 7: Nem
    if (testData?.tempHumidity) {
      sheet.getCell(`A${currentRow}`).value = 7;
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'NEM / HUMIDITY';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getCell(`B${currentRow}`).font = { size: 9 };
      
      sheet.getCell(`D${currentRow}`).value = '%35 - % 70 RH';
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`E${currentRow}:F${currentRow}`);
      sheet.getCell(`E${currentRow}`).value = `${testData.tempHumidity.humidity.toFixed(2)}`;
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      sheet.mergeCells(`G${currentRow}:H${currentRow}`);
      sheet.getCell(`G${currentRow}`).value = testData.tempHumidity.humidityCompliant ? 'UYGUNDUR' : 'UYGUN DEĞİL';
      sheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell(`G${currentRow}`).font = { 
        bold: true, 
        color: { argb: testData.tempHumidity.humidityCompliant ? 'FF00B050' : 'FFFF0000' } 
      };
      
      currentRow++;
    }

    // Classification section
    currentRow += 2;
    sheet.mergeCells(`A${currentRow}:H${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'HAVA TEMİZLİK SINIFI';
    sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    sheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    currentRow++;
    sheet.mergeCells(`A${currentRow}:H${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'DIN 1964-4/ISO 14644-1';
    sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };

    currentRow++;
    sheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const finalClass = testData?.particle?.isoClass || 'ISO CLASS 8';
    sheet.getCell(`A${currentRow}`).value = finalClass;
    sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    sheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    // Footer section
    currentRow += 3;
    sheet.mergeCells(`A${currentRow}:D${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = `TESTİ YAPAN\nRAPORU YAZAN\n:\n${generalInfo.testerName}`;
    sheet.getCell(`A${currentRow}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    sheet.getCell(`A${currentRow}`).font = { size: 10 };

    sheet.mergeCells(`E${currentRow}:H${currentRow}`);
    sheet.getCell(`E${currentRow}`).value = `NURETTİN KARACA\nMERVE YAZAR`;
    sheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
    sheet.getCell(`E${currentRow}`).font = { size: 10 };

    // Apply borders to all cells
    for (let row = 1; row <= currentRow + 5; row++) {
      for (let col = 1; col <= 8; col++) {
        const cell = sheet.getCell(row, col);
        if (!cell.border) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }
    }

    // Set row heights
    for (let i = 1; i <= currentRow + 5; i++) {
      sheet.getRow(i).height = 20;
    }
    
    // Special heights for specific rows
    sheet.getRow(4).height = 25; // Title row
    sheet.getRow(5).height = 25; // Subtitle row
    sheet.getRow(7).height = 30; // Headers
    sheet.getRow(8).height = 40; // Room info
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

    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL('image/png');
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    const footerY = pdfHeight - 30;

    if (generalInfo.logo) {
      const img = new Image();
      img.src = generalInfo.logo;
      await new Promise(resolve => img.onload = resolve);
      pdf.addImage(img, 'PNG', 10, footerY, 40, 20);
    }

    if (generalInfo.stamp) {
      const img = new Image();
      img.src = generalInfo.stamp;
      await new Promise(resolve => img.onload = resolve);
      pdf.addImage(img, 'PNG', pdfWidth / 2 - 20, footerY, 40, 20);
    }

    pdf.setFontSize(10);
    pdf.text(`Sayfa ${i + 1}/${rooms.length}`, pdfWidth - 20, footerY + 10, { align: 'right' });
  }
  
  pdf.save(`${generalInfo.reportNo}.pdf`);
};