// src/lib/firebase/spacedRepetition.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import {
  SpacedRepetitionCard,
  FirestoreCardData,
  DailyStatistics,
  FirestoreDailyStats,
  UserProgress,
  CategoryProgress,
} from '@/types/spacedRepetition';
import {
  updateCardAfterReview,
  createInitialCard,
  getCardsForReview,
  calculateCardStatistics,
  calculateStreak,
  getCardStatus,
} from '@/lib/spacedRepetition';

// İstemci tarafında mı çalışıyoruz kontrol et
const isClient = typeof window !== 'undefined';

/**
 * Firestore Timestamp'i Date'e dönüştürür
 */
function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}

/**
 * SpacedRepetitionCard'ı FirestoreCardData'ya dönüştürür
 */
function cardToFirestore(card: SpacedRepetitionCard): FirestoreCardData {
  return {
    userId: card.userId,
    type: card.type,
    word: card.word,
    translation: card.translation,
    categoryId: card.categoryId,
    categoryName: card.categoryName,
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    nextReviewDate: Timestamp.fromDate(card.nextReviewDate),
    lastReviewDate: Timestamp.fromDate(card.lastReviewDate),
    createdAt: Timestamp.fromDate(card.createdAt),
    totalReviews: card.totalReviews,
    correctCount: card.correctCount,
    incorrectCount: card.incorrectCount,
  };
}

/**
 * FirestoreCardData'yı SpacedRepetitionCard'a dönüştürür
 */
function firestoreToCard(id: string, data: any): SpacedRepetitionCard {
  return {
    id,
    userId: data.userId,
    type: data.type,
    word: data.word,
    translation: data.translation,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    easeFactor: data.easeFactor,
    interval: data.interval,
    repetitions: data.repetitions,
    nextReviewDate: timestampToDate(data.nextReviewDate),
    lastReviewDate: timestampToDate(data.lastReviewDate),
    createdAt: timestampToDate(data.createdAt),
    totalReviews: data.totalReviews,
    correctCount: data.correctCount,
    incorrectCount: data.incorrectCount,
  };
}

/**
 * Quiz sonucunu kaydeder ve kartı günceller
 *
 * @param userId - Kullanıcı ID
 * @param type - Kart tipi (custom veya category)
 * @param word - İngilizce kelime
 * @param translation - Türkçe karşılık
 * @param isCorrect - Cevap doğru mu?
 * @param categoryId - Kategori ID (opsiyonel)
 * @param categoryName - Kategori adı (opsiyonel)
 */
export async function saveQuizResult(
  userId: string,
  type: 'custom' | 'category',
  word: string,
  translation: string,
  isCorrect: boolean,
  categoryId?: string,
  categoryName?: string
) {
  if (!isClient) {
    return { error: 'Server-side firestore operations are not supported' };
  }

  try {
    // Kart ID'si oluştur: userId_type_word veya userId_type_categoryId_word
    const cardId =
      type === 'custom'
        ? `${userId}_custom_${word}`
        : `${userId}_category_${categoryId}_${word}`;

    const cardRef = doc(db, 'spacedRepetitionCards', cardId);
    const cardSnap = await getDoc(cardRef);

    let updatedCard: SpacedRepetitionCard;

    if (!cardSnap.exists()) {
      // Yeni kart oluştur
      const initialCard = createInitialCard(
        word,
        translation,
        userId,
        type,
        categoryId,
        categoryName
      );

      // Quiz sonucuna göre güncelle
      const reviewResult = updateCardAfterReview(isCorrect, initialCard);

      updatedCard = {
        id: cardId,
        ...initialCard,
        ...reviewResult,
        lastReviewDate: new Date(),
        totalReviews: 1,
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
      };
    } else {
      // Mevcut kartı güncelle
      const existingCard = firestoreToCard(cardId, cardSnap.data());

      const reviewResult = updateCardAfterReview(isCorrect, existingCard);

      updatedCard = {
        ...existingCard,
        ...reviewResult,
        lastReviewDate: new Date(),
        totalReviews: existingCard.totalReviews + 1,
        correctCount: existingCard.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: existingCard.incorrectCount + (isCorrect ? 0 : 1),
      };
    }

    // Firestore'a kaydet
    await setDoc(cardRef, cardToFirestore(updatedCard));

    // Günlük istatistikleri güncelle
    await updateDailyStatistics(userId, type, isCorrect);

    return { success: true, card: updatedCard };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { error };
  }
}

/**
 * Günlük istatistikleri günceller
 *
 * @param userId - Kullanıcı ID
 * @param type - Kart tipi
 * @param isCorrect - Cevap doğru mu?
 */
async function updateDailyStatistics(
  userId: string,
  type: 'custom' | 'category',
  isCorrect: boolean
) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  const statsId = `${userId}_${dateStr}`;
  const statsRef = doc(db, 'dailyStatistics', statsId);
  const statsSnap = await getDoc(statsRef);

  if (!statsSnap.exists()) {
    // Yeni günlük istatistik oluştur
    const newStats: FirestoreDailyStats = {
      date: dateStr,
      userId,
      reviewedCards: 1,
      correctAnswers: isCorrect ? 1 : 0,
      incorrectAnswers: isCorrect ? 0 : 1,
      studyTime: 0,
      customCardsReviewed: type === 'custom' ? 1 : 0,
      categoryCardsReviewed: type === 'category' ? 1 : 0,
      timestamp: Timestamp.now(),
    };

    await setDoc(statsRef, newStats);
  } else {
    // Mevcut istatistiği güncelle
    const currentStats = statsSnap.data();

    await updateDoc(statsRef, {
      reviewedCards: (currentStats.reviewedCards || 0) + 1,
      correctAnswers: (currentStats.correctAnswers || 0) + (isCorrect ? 1 : 0),
      incorrectAnswers: (currentStats.incorrectAnswers || 0) + (isCorrect ? 0 : 1),
      customCardsReviewed:
        (currentStats.customCardsReviewed || 0) + (type === 'custom' ? 1 : 0),
      categoryCardsReviewed:
        (currentStats.categoryCardsReviewed || 0) + (type === 'category' ? 1 : 0),
    });
  }
}

/**
 * Kullanıcının tüm kartlarını getirir
 *
 * @param userId - Kullanıcı ID
 * @param type - Kart tipi (opsiyonel, belirtilmezse hepsi)
 * @returns Kartlar listesi
 */
export async function getUserCards(
  userId: string,
  type?: 'custom' | 'category' | 'all'
): Promise<{ cards?: SpacedRepetitionCard[]; error?: any }> {
  if (!isClient) {
    return { cards: [] };
  }

  try {
    const cardsRef = collection(db, 'spacedRepetitionCards');

    let q;
    if (type === 'all' || !type) {
      q = query(cardsRef, where('userId', '==', userId));
    } else {
      q = query(cardsRef, where('userId', '==', userId), where('type', '==', type));
    }

    const querySnapshot = await getDocs(q);
    const cards: SpacedRepetitionCard[] = [];

    querySnapshot.forEach((doc) => {
      cards.push(firestoreToCard(doc.id, doc.data()));
    });

    return { cards };
  } catch (error) {
    console.error('Error getting user cards:', error);
    return { error };
  }
}

/**
 * Bugün tekrar edilecek kartları getirir
 *
 * @param userId - Kullanıcı ID
 * @param type - Kart tipi (opsiyonel)
 * @param maxCards - Maksimum kart sayısı (default: 50)
 * @returns Bugün tekrar edilecek kartlar
 */
export async function getReviewCards(
  userId: string,
  type?: 'custom' | 'category' | 'all',
  maxCards: number = 50
): Promise<{ cards?: SpacedRepetitionCard[]; error?: any }> {
  if (!isClient) {
    return { cards: [] };
  }

  try {
    // Tüm kartları getir
    const { cards, error } = await getUserCards(userId, type);

    if (error || !cards) {
      return { error };
    }

    // Bugün tekrar edilecek olanları filtrele
    const reviewCards = getCardsForReview(cards);

    // Maksimum sayıda kart döndür
    const limitedCards = reviewCards.slice(0, maxCards);

    return { cards: limitedCards };
  } catch (error) {
    console.error('Error getting review cards:', error);
    return { error };
  }
}

/**
 * Kullanıcının kart istatistiklerini getirir
 *
 * @param userId - Kullanıcı ID
 * @returns Kart istatistikleri
 */
export async function getCardStatistics(
  userId: string
): Promise<{ statistics?: ReturnType<typeof calculateCardStatistics>; error?: any }> {
  if (!isClient) {
    return { statistics: undefined };
  }

  try {
    const { cards, error } = await getUserCards(userId, 'all');

    if (error || !cards) {
      return { error };
    }

    const statistics = calculateCardStatistics(cards);

    return { statistics };
  } catch (error) {
    console.error('Error getting card statistics:', error);
    return { error };
  }
}

/**
 * Kullanıcının günlük istatistiklerini getirir
 *
 * @param userId - Kullanıcı ID
 * @param days - Kaç günlük veri (default: 30)
 * @returns Günlük istatistikler
 */
export async function getDailyStatistics(
  userId: string,
  days: number = 30
): Promise<{ statistics?: DailyStatistics[]; error?: any }> {
  if (!isClient) {
    return { statistics: [] };
  }

  try {
    // Son X günün tarihlerini oluştur
    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const statsRef = collection(db, 'dailyStatistics');
    const statistics: DailyStatistics[] = [];

    // Batch şeklinde sorgulama yapmak yerine tek tek getir
    // (Firestore'da 'in' operatörü max 10 değer alır)
    for (const dateStr of dates) {
      const statsId = `${userId}_${dateStr}`;
      const statsDoc = await getDoc(doc(db, 'dailyStatistics', statsId));

      if (statsDoc.exists()) {
        const data = statsDoc.data();
        statistics.push({
          date: data.date,
          userId: data.userId,
          reviewedCards: data.reviewedCards || 0,
          correctAnswers: data.correctAnswers || 0,
          incorrectAnswers: data.incorrectAnswers || 0,
          studyTime: data.studyTime || 0,
          customCardsReviewed: data.customCardsReviewed || 0,
          categoryCardsReviewed: data.categoryCardsReviewed || 0,
        });
      } else {
        // Veri yoksa boş istatistik ekle
        statistics.push({
          date: dateStr,
          userId,
          reviewedCards: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          studyTime: 0,
          customCardsReviewed: 0,
          categoryCardsReviewed: 0,
        });
      }
    }

    // Tarihe göre sırala (en yeni başta)
    statistics.sort((a, b) => b.date.localeCompare(a.date));

    return { statistics };
  } catch (error) {
    console.error('Error getting daily statistics:', error);
    return { error };
  }
}

/**
 * Kullanıcının genel ilerlemesini getirir
 *
 * @param userId - Kullanıcı ID
 * @returns Kullanıcı ilerleme özeti
 */
export async function getUserProgress(
  userId: string
): Promise<{ progress?: UserProgress; error?: any }> {
  if (!isClient) {
    return { progress: undefined };
  }

  try {
    // Tüm kartları getir
    const { cards, error: cardsError } = await getUserCards(userId, 'all');

    if (cardsError || !cards) {
      return { error: cardsError };
    }

    // Kart istatistiklerini hesapla
    const stats = calculateCardStatistics(cards);

    // Bugün tamamlanan kartları say
    const today = new Date().toISOString().split('T')[0];
    const todayStatsId = `${userId}_${today}`;
    const todayStatsDoc = await getDoc(doc(db, 'dailyStatistics', todayStatsId));

    const completedToday = todayStatsDoc.exists()
      ? todayStatsDoc.data()?.reviewedCards || 0
      : 0;

    // Günlük seriyi hesapla
    const { statistics: dailyStats } = await getDailyStatistics(userId, 365);
    const studyDates =
      dailyStats
        ?.filter((stat) => stat.reviewedCards > 0)
        .map((stat) => stat.date) || [];

    const { currentStreak, longestStreak } = calculateStreak(studyDates);

    // Son çalışma tarihini bul
    const lastStudyDate =
      studyDates.length > 0 ? new Date(studyDates[0] + 'T00:00:00') : undefined;

    // Kart tiplerini say
    const customCards = cards.filter((c) => c.type === 'custom').length;
    const categoryCards = cards.filter((c) => c.type === 'category').length;

    const progress: UserProgress = {
      userId,
      totalCards: stats.total,
      customCards,
      categoryCards,
      newCards: stats.newCards,
      learningCards: stats.learningCards,
      masteredCards: stats.masteredCards,
      dueToday: stats.dueToday,
      completedToday,
      overallAccuracy: stats.overallAccuracy,
      currentStreak,
      longestStreak,
      lastStudyDate,
    };

    return { progress };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { error };
  }
}

/**
 * Kategori bazında ilerlemeyi getirir
 *
 * @param userId - Kullanıcı ID
 * @returns Kategori bazında ilerleme
 */
export async function getCategoryProgress(
  userId: string
): Promise<{ categories?: CategoryProgress[]; error?: any }> {
  if (!isClient) {
    return { categories: [] };
  }

  try {
    const { cards, error } = await getUserCards(userId, 'category');

    if (error || !cards) {
      return { error };
    }

    // Kategorilere göre grupla
    const categoryMap = new Map<string, SpacedRepetitionCard[]>();

    cards.forEach((card) => {
      if (card.categoryId) {
        const existing = categoryMap.get(card.categoryId) || [];
        existing.push(card);
        categoryMap.set(card.categoryId, existing);
      }
    });

    // Kategori ilerlemelerini hesapla
    const categories: CategoryProgress[] = [];

    categoryMap.forEach((categoryCards, categoryId) => {
      const totalWords = categoryCards.length;
      const learnedWords = categoryCards.filter(
        (card) => getCardStatus(card) === 'mastered'
      ).length;

      const totalReviews = categoryCards.reduce(
        (sum, card) => sum + card.totalReviews,
        0
      );
      const totalCorrect = categoryCards.reduce(
        (sum, card) => sum + card.correctCount,
        0
      );
      const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

      // En son çalışılan tarihi bul
      const lastStudied = categoryCards.reduce((latest, card) => {
        return card.lastReviewDate > latest ? card.lastReviewDate : latest;
      }, new Date(0));

      categories.push({
        categoryId,
        categoryName: categoryCards[0]?.categoryName || categoryId,
        totalWords,
        learnedWords,
        accuracy: Math.round(accuracy),
        lastStudied: lastStudied.getTime() > 0 ? lastStudied : undefined,
      });
    });

    // En son çalışılana göre sırala
    categories.sort((a, b) => {
      if (!a.lastStudied) return 1;
      if (!b.lastStudied) return -1;
      return b.lastStudied.getTime() - a.lastStudied.getTime();
    });

    return { categories };
  } catch (error) {
    console.error('Error getting category progress:', error);
    return { error };
  }
}
