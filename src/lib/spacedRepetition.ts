// src/lib/spacedRepetition.ts

import {
  SpacedRepetitionCard,
  UpdatedCardData,
  CardStatus,
} from '@/types/spacedRepetition';

/**
 * SM-2 (SuperMemo 2) Algoritması
 *
 * Quality değerleri:
 * 5 - Mükemmel cevap
 * 4 - Doğru cevap, biraz düşündükten sonra
 * 3 - Doğru cevap, zorlandı
 * 2 - Yanlış cevap, ama hatırladı
 * 1 - Yanlış cevap, ipucu ile hatırladı
 * 0 - Tamamen yanlış
 *
 * İki kategoriye ayırıyoruz:
 * - Doğru (quality >= 3): interval artar, repetitions artar
 * - Yanlış (quality < 3): interval = 1, repetitions = 0
 */

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * SM-2 algoritması ile sonraki tekrar aralığını hesaplar
 *
 * @param quality - Cevap kalitesi (0-5)
 * @param currentCard - Mevcut kart verisi
 * @returns Güncellenmiş kart verisi
 */
export function calculateNextReview(
  quality: number,
  currentCard: Pick<SpacedRepetitionCard, 'easeFactor' | 'interval' | 'repetitions'>
): UpdatedCardData {
  let { easeFactor, interval, repetitions } = currentCard;

  // Quality değerini kontrol et
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  // Yeni ease factor hesapla
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor minimum değerin altına düşmesin
  if (newEaseFactor < MIN_EASE_FACTOR) {
    newEaseFactor = MIN_EASE_FACTOR;
  }

  let newInterval: number;
  let newRepetitions: number;

  // Yanlış cevap (quality < 3)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Doğru cevap (quality >= 3)
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      // newInterval = previousInterval * easeFactor
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  // Sonraki tekrar tarihini hesapla
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  // Saati sıfırla (sadece gün karşılaştırması için)
  nextReviewDate.setHours(0, 0, 0, 0);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}

/**
 * Quiz sonucuna göre kartı günceller
 *
 * @param isCorrect - Cevap doğru mu?
 * @param currentCard - Mevcut kart verisi
 * @returns Güncellenmiş kart verisi
 */
export function updateCardAfterReview(
  isCorrect: boolean,
  currentCard: Pick<SpacedRepetitionCard, 'easeFactor' | 'interval' | 'repetitions'>
): UpdatedCardData {
  // isCorrect'e göre quality belirle
  // Doğru ise: 4 (iyi cevap)
  // Yanlış ise: 0 (tamamen yanlış)
  const quality = isCorrect ? 4 : 0;

  return calculateNextReview(quality, currentCard);
}

/**
 * Bugün tekrar edilecek kartları filtreler
 *
 * @param cards - Tüm kartlar
 * @returns Bugün tekrar edilecek kartlar
 */
export function getCardsForReview(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cards.filter(card => {
    const nextReview = new Date(card.nextReviewDate);
    nextReview.setHours(0, 0, 0, 0);

    // nextReviewDate bugün veya geçmişte mi?
    return nextReview <= today;
  });
}

/**
 * Kartın durumunu belirler (yeni, öğreniliyor, ustalaşıldı)
 *
 * @param card - Kart verisi
 * @returns Kart durumu
 */
export function getCardStatus(card: SpacedRepetitionCard): CardStatus {
  if (card.repetitions === 0) {
    return 'new';
  } else if (card.repetitions < 5) {
    return 'learning';
  } else {
    return 'mastered';
  }
}

/**
 * Kartları durumlarına göre filtreler
 *
 * @param cards - Tüm kartlar
 * @param status - Filtrelenecek durum
 * @returns Filtrelenmiş kartlar
 */
export function filterCardsByStatus(
  cards: SpacedRepetitionCard[],
  status: CardStatus
): SpacedRepetitionCard[] {
  return cards.filter(card => getCardStatus(card) === status);
}

/**
 * Başlangıç kart verisi oluşturur
 *
 * @param word - İngilizce kelime
 * @param translation - Türkçe karşılık
 * @param userId - Kullanıcı ID
 * @param type - Kart tipi
 * @param categoryId - Kategori ID (opsiyonel)
 * @param categoryName - Kategori adı (opsiyonel)
 * @returns Yeni kart verisi
 */
export function createInitialCard(
  word: string,
  translation: string,
  userId: string,
  type: 'custom' | 'category',
  categoryId?: string,
  categoryName?: string
): Omit<SpacedRepetitionCard, 'id'> {
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + 1); // Yarın için ayarla
  nextReview.setHours(0, 0, 0, 0);

  return {
    userId,
    type,
    word,
    translation,
    categoryId,
    categoryName,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 1,
    repetitions: 0,
    nextReviewDate: nextReview,
    lastReviewDate: now,
    createdAt: now,
    totalReviews: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
}

/**
 * Kartların istatistiklerini hesaplar
 *
 * @param cards - Tüm kartlar
 * @returns İstatistik özeti
 */
export function calculateCardStatistics(cards: SpacedRepetitionCard[]) {
  const total = cards.length;
  const newCards = filterCardsByStatus(cards, 'new').length;
  const learningCards = filterCardsByStatus(cards, 'learning').length;
  const masteredCards = filterCardsByStatus(cards, 'mastered').length;
  const dueToday = getCardsForReview(cards).length;

  // Genel doğruluk oranı
  const totalReviews = cards.reduce((sum, card) => sum + card.totalReviews, 0);
  const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0);
  const overallAccuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

  return {
    total,
    newCards,
    learningCards,
    masteredCards,
    dueToday,
    overallAccuracy: Math.round(overallAccuracy),
  };
}

/**
 * İki tarih arasındaki gün farkını hesaplar
 *
 * @param date1 - İlk tarih
 * @param date2 - İkinci tarih
 * @returns Gün farkı
 */
export function daysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Günlük seriyi hesaplar (streak)
 *
 * @param studyDates - Çalışılan tarihler (YYYY-MM-DD formatında)
 * @returns Mevcut seri ve en uzun seri
 */
export function calculateStreak(studyDates: string[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (studyDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Tarihleri sırala (en yeni başta)
  const sortedDates = [...studyDates].sort((a, b) => b.localeCompare(a));

  // Bugünün tarihi
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Mevcut seriyi hesapla
  let checkDate = new Date(today);
  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const studyDate = new Date(dateStr + 'T00:00:00');

    const expectedDateStr = checkDate.toISOString().split('T')[0];

    if (dateStr === expectedDateStr) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // En uzun seriyi hesapla
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const currentDate = new Date(sortedDates[i] + 'T00:00:00');
      const previousDate = new Date(sortedDates[i - 1] + 'T00:00:00');

      const dayDiff = daysBetween(currentDate, previousDate);

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
}
