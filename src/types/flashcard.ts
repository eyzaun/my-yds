// src/types/flashcard.ts

/**
 * Flashcard için temel veri tipi
 */
export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  notes?: string;
}

/**
 * Unified Flashcard Type - Tüm sistemlerde kullanılacak ortak tip
 * FlashcardData'yı genişletir ve ek meta bilgiler ekler
 */
export interface UnifiedFlashcard extends FlashcardData {
  category?: string;  // Kategori ID'si (opsiyonel)
  source?: 'excel' | 'category' | 'custom';  // Verinin kaynağı
}

/**
 * Kategori kelimelerini UnifiedFlashcard'a çeviren converter
 * @param word - Kategori kelimesi (en, tr formatında)
 * @param categoryId - Kategori ID'si
 * @returns UnifiedFlashcard
 */
export function wordToFlashcard(
  word: { en: string; tr: string },
  categoryId: string
): UnifiedFlashcard {
  return {
    id: `${categoryId}_${word.en.toLowerCase().replace(/\s+/g, '_')}`,
    front: word.en,
    back: word.tr,
    category: categoryId,
    source: 'category'
  };
}

/**
 * Kategori kelime listesini UnifiedFlashcard dizisine çevirir
 * @param words - Kategori kelime listesi
 * @param categoryId - Kategori ID'si
 * @returns UnifiedFlashcard dizisi
 */
export function wordsToFlashcards(
  words: Array<{ en: string; tr: string }>,
  categoryId: string
): UnifiedFlashcard[] {
  return words.map(word => wordToFlashcard(word, categoryId));
}

/**
 * Excel'den gelen veriyi UnifiedFlashcard'a çeviren converter
 * @param data - Excel'den parse edilmiş veri
 * @param generateId - ID oluşturma fonksiyonu (opsiyonel)
 * @returns UnifiedFlashcard
 */
export function excelToFlashcard(
  data: { id?: string; front: string; back: string; notes?: string },
  generateId?: () => string
): UnifiedFlashcard {
  const id = data.id || (generateId ? generateId() : `excel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  return {
    id,
    front: data.front,
    back: data.back,
    notes: data.notes,
    source: 'excel'
  };
}

/**
 * FlashcardData'yı UnifiedFlashcard'a çeviren converter
 * @param flashcard - Mevcut FlashcardData
 * @param source - Verinin kaynağı (opsiyonel)
 * @param category - Kategori ID (opsiyonel)
 * @returns UnifiedFlashcard
 */
export function toUnifiedFlashcard(
  flashcard: FlashcardData,
  source?: 'excel' | 'category' | 'custom',
  category?: string
): UnifiedFlashcard {
  return {
    ...flashcard,
    source,
    category
  };
}