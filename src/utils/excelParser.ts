import { read, utils } from 'xlsx';

export interface ExcelRow {
  [key: string]: string | number | undefined;
}

export function parseExcelFile(buffer: ArrayBuffer): ExcelRow[] {
  const workbook = read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Get the range of cells in the worksheet
  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  console.log("Excel sheet range:", range);
  
  // Use more detailed options to ensure we get every row
  const jsonData = utils.sheet_to_json(worksheet, { 
    header: 'A',
    blankrows: false,
    defval: '',
    range: range
  });
  
  console.log("Parsed Excel rows:", jsonData.length);
  
  // Debug the first few rows
  if (jsonData.length > 0) {
    console.log("First row:", jsonData[0]);
    if (jsonData.length > 1) {
      console.log("Second row:", jsonData[1]);
    }
  }
  
  return jsonData as ExcelRow[];
}

export function convertExcelRowsToFlashcards(rows: ExcelRow[]): Array<{id: string, front: string, back: string, notes: string}> {
  const cards: Array<{id: string, front: string, back: string, notes: string}> = [];
  
  rows.forEach((row, index) => {
    // Skip header row if it exists (row 0)
    if (index === 0 && (row['A'] === 'A' || row['C'] === 'Word' || row['C'] === 'Kelime')) {
      console.log("Skipping header row:", row);
      return;
    }
    
    // Check if we have valid values in the C and D columns
    if (row['C'] && row['D']) {
      cards.push({
        id: (index + 1).toString(),
        front: row['C'].toString(),
        back: row['D'].toString(),
        notes: row['E'] ? row['E'].toString() : ''
      });
    } else {
      console.log(`Skipping invalid row ${index}:`, row);
    }
  });
  
  console.log("Created flashcards:", cards);
  return cards;
}
