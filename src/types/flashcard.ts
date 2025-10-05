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