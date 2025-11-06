// src/types/spacedRepetition.ts

/**
 * Spaced Repetition Card - Tek bir kart için tüm veriler
 */
export interface SpacedRepetitionCard {
  id: string;
  userId: string;
  type: 'custom' | 'category'; // Kullanıcının kendi kartları veya kategori kelimeleri

  // Kart içeriği
  word: string; // İngilizce kelime
  translation: string; // Türkçe karşılık
  categoryId?: string; // Eğer kategori kartı ise
  categoryName?: string; // Kategori adı

  // SM-2 Algoritması parametreleri
  easeFactor: number; // Zorluk faktörü (minimum 1.3)
  interval: number; // Sonraki tekrar aralığı (gün cinsinden)
  repetitions: number; // Arka arkaya doğru cevap sayısı

  // Tarihler
  nextReviewDate: Date; // Sonraki tekrar tarihi
  lastReviewDate: Date; // Son tekrar tarihi
  createdAt: Date; // Kart oluşturulma tarihi

  // İstatistikler
  totalReviews: number; // Toplam tekrar sayısı
  correctCount: number; // Toplam doğru cevap sayısı
  incorrectCount: number; // Toplam yanlış cevap sayısı
}

/**
 * Quiz sonucu - Her quiz denemesi için
 */
export interface QuizResult {
  cardId: string;
  word: string;
  isCorrect: boolean;
  quality: number; // 0-5 arası (SM-2 algoritması için)
  timestamp: Date;
}

/**
 * Günlük istatistikler
 */
export interface DailyStatistics {
  date: string; // YYYY-MM-DD formatında
  userId: string;

  reviewedCards: number; // Tekrar edilen kart sayısı
  correctAnswers: number; // Doğru cevap sayısı
  incorrectAnswers: number; // Yanlış cevap sayısı
  studyTime: number; // Çalışma süresi (dakika)

  // Kart tipleri
  customCardsReviewed: number;
  categoryCardsReviewed: number;
}

/**
 * Kullanıcı ilerleme özeti
 */
export interface UserProgress {
  userId: string;

  // Toplam istatistikler
  totalCards: number;
  customCards: number;
  categoryCards: number;

  // Kart durumları
  newCards: number; // Hiç çalışılmamış (repetitions === 0)
  learningCards: number; // Öğreniliyor (repetitions > 0 && repetitions < 5)
  masteredCards: number; // Ustalaşılmış (repetitions >= 5)

  // Bugünkü bilgiler
  dueToday: number; // Bugün tekrar edilecek kart sayısı
  completedToday: number; // Bugün tamamlanan kart sayısı

  // Genel başarı oranı
  overallAccuracy: number; // Yüzde cinsinden (0-100)

  // Streak bilgisi
  currentStreak: number; // Günlük çalışma serisi
  longestStreak: number; // En uzun çalışma serisi

  lastStudyDate?: Date;
}

/**
 * SM-2 Algoritması için güncellenmiş kart verisi
 */
export interface UpdatedCardData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * Kart durumu - kullanıcı için görünüm
 */
export type CardStatus = 'new' | 'learning' | 'mastered';

/**
 * Firestore'da saklanacak kart verisi
 */
export interface FirestoreCardData {
  userId: string;
  type: 'custom' | 'category';

  word: string;
  translation: string;
  categoryId?: string;
  categoryName?: string;

  easeFactor: number;
  interval: number;
  repetitions: number;

  nextReviewDate: any; // Firestore Timestamp
  lastReviewDate: any; // Firestore Timestamp
  createdAt: any; // Firestore Timestamp

  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
}

/**
 * Firestore'da saklanacak günlük istatistik
 */
export interface FirestoreDailyStats {
  date: string;
  userId: string;

  reviewedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyTime: number;

  customCardsReviewed: number;
  categoryCardsReviewed: number;

  timestamp: any; // Firestore Timestamp
}

/**
 * Kategori bazında ilerleme
 */
export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  totalWords: number;
  learnedWords: number;
  accuracy: number;
  lastStudied?: Date;
}
