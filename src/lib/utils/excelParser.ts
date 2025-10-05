import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { FlashcardData } from '@/types/flashcard';

/**
 * Parses Excel file and converts it to flashcards
 */
export async function parseExcelToFlashcards(file: File): Promise<FlashcardData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = new ExcelJS.Workbook();
        
        await workbook.xlsx.load(buffer as ArrayBuffer);
        
        // Get the first worksheet
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          throw new Error('Excel dosyasında bir çalışma sayfası bulunamadı.');
        }
        
        const flashcards: FlashcardData[] = [];
        
        // Process each row
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // C sütunu: İngilizce kelime (indeks 3)
            // D sütunu: Türkçe anlam (indeks 4)
            // E sütunu: Notlar (indeks 5, varsa)
            const front = row.getCell(3).text.trim();
            const back = row.getCell(4).text.trim();
            const notes = row.getCell(5).text.trim();
            
            if (front && back) {
              flashcards.push({
                id: uuidv4(),
                front,
                back,
                notes: notes || undefined,
              });
            }
          }
        });
        
        resolve(flashcards);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    
    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Checks if a row is likely a header row
 */
export function isHeaderRow(values: ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue }): boolean {
  // Convert to array if it's an object
  const valueArray = Array.isArray(values) 
    ? values 
    : Object.values(values);
  
  // Skip empty values at position 0
  // Sütun indekslerini C ve D'ye karşılık gelecek şekilde ayarla (3 ve 4)
  const headerCandidates = valueArray.slice(3, 5).map(val => 
    val && typeof val === 'string' ? val.toLowerCase() : ''
  );
  
  // Check if any header contains typical header words
  const headerKeywords = ['english', 'turkish', 'kelime', 'anlam', 'word', 'meaning', 'front', 'back', 'ingilizce', 'türkçe'];
  
  return headerCandidates.some(header => 
    headerKeywords.some(keyword => typeof header === 'string' && header.includes(keyword))
  );
}