// src/lib/firebase/spacedRepetition.ts

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  SpacedRepetitionCard,
  CardType,
  FirestoreCardData,
  DailyStatistics,
  FirestoreDailyStats,
  UserStatistics,
  CardGroupSummary,
} from '@/types/spacedRepetition';
import {
  createNewCard,
  updateCardAfterReview,
  getCardsForReview,
  calculateUserStatistics,
  groupCardsByCategory,
  isCardDueToday,
} from '@/lib/spacedRepetition';

// SSR check
const isClient = typeof window !== 'undefined';

/**
 * Convert Firestore timestamp to Date
 */
function timestampToDate(timestamp: Timestamp | null): Date | null {
  if (!timestamp) return null;
  return timestamp.toDate();
}

/**
 * Convert Date to Firestore timestamp
 */
function dateToTimestamp(date: Date | null): Timestamp | null {
  if (!date) return null;
  return Timestamp.fromDate(date);
}

/**
 * Convert Firestore card data to application card data
 */
function firestoreToCard(data: FirestoreCardData): SpacedRepetitionCard {
  return {
    word: data.word,
    translation: data.translation,
    easeFactor: data.easeFactor,
    interval: data.interval,
    repetitions: data.repetitions,
    nextReviewDate: timestampToDate(data.nextReviewDate as unknown as Timestamp)!,
    lastReviewDate: timestampToDate(data.lastReviewDate as unknown as Timestamp),
    totalReviews: data.totalReviews,
    correctCount: data.correctCount,
    incorrectCount: data.incorrectCount,
    createdAt: timestampToDate(data.createdAt as unknown as Timestamp)!,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
  };
}

/**
 * Convert application card data to Firestore card data
 */
function cardToFirestore(card: SpacedRepetitionCard): FirestoreCardData {
  return {
    word: card.word,
    translation: card.translation,
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    nextReviewDate: dateToTimestamp(card.nextReviewDate) as unknown as Timestamp,
    lastReviewDate: dateToTimestamp(card.lastReviewDate) as unknown as Timestamp,
    totalReviews: card.totalReviews,
    correctCount: card.correctCount,
    incorrectCount: card.incorrectCount,
    createdAt: dateToTimestamp(card.createdAt) as unknown as Timestamp,
    categoryId: card.categoryId,
    categoryName: card.categoryName,
  } as FirestoreCardData;
}

/**
 * Generate card ID for Firestore
 */
function generateCardId(userId: string, type: CardType, word: string, categoryId?: string): string {
  if (type === 'custom') {
    return `${userId}_custom_${word.toLowerCase().replace(/\s+/g, '_')}`;
  } else {
    return `${userId}_${categoryId}_${word.toLowerCase().replace(/\s+/g, '_')}`;
  }
}

/**
 * Save or update a quiz result and update the card
 *
 * @param userId - User ID
 * @param type - Card type ('custom' or 'category')
 * @param word - English word
 * @param translation - Turkish translation
 * @param isCorrect - Whether the answer was correct
 * @param categoryId - Category ID (required for category type)
 * @param categoryName - Category name (optional)
 */
export async function saveQuizResult(
  userId: string,
  type: CardType,
  word: string,
  translation: string,
  isCorrect: boolean,
  categoryId?: string,
  categoryName?: string
): Promise<void> {
  if (!isClient) {
    throw new Error('This function can only run on client-side');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated');
  }

  try {
    const cardId = generateCardId(userId, type, word, categoryId);
    const cardRef = doc(db, 'users', userId, 'spaced-repetition', type, cardId);

    // Get existing card or create new one
    const cardDoc = await getDoc(cardRef);
    let card: SpacedRepetitionCard;

    if (cardDoc.exists()) {
      // Update existing card
      card = firestoreToCard(cardDoc.data() as FirestoreCardData);
    } else {
      // Create new card
      card = createNewCard(word, translation, categoryId, categoryName);
    }

    // Update card based on quiz result
    const updatedCard = updateCardAfterReview(card, isCorrect);

    // Save to Firestore
    await setDoc(cardRef, cardToFirestore(updatedCard));

    // Update daily statistics
    await updateDailyStatistics(userId, isCorrect, cardDoc.exists() ? false : true);

  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

/**
 * Get all cards for a user
 *
 * @param userId - User ID
 * @param type - Card type filter ('custom', 'category', or 'all')
 * @param categoryId - Category ID filter (optional, only for type='category')
 * @returns Array of cards
 */
export async function getUserCards(
  userId: string,
  type: CardType | 'all' = 'all',
  categoryId?: string
): Promise<SpacedRepetitionCard[]> {
  if (!isClient) {
    throw new Error('This function can only run on client-side');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated');
  }

  try {
    const cards: SpacedRepetitionCard[] = [];

    // Determine which collections to query
    const collections: CardType[] = type === 'all' ? ['custom', 'category'] : [type];

    for (const collectionType of collections) {
      const collectionRef = collection(db, 'users', userId, 'spaced-repetition', collectionType);
      let q = query(collectionRef);

      // Filter by category if specified
      if (collectionType === 'category' && categoryId) {
        q = query(collectionRef, where('categoryId', '==', categoryId));
      }

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        cards.push(firestoreToCard(doc.data() as FirestoreCardData));
      });
    }

    return cards;
  } catch (error) {
    console.error('Error getting user cards:', error);
    throw error;
  }
}

/**
 * Get cards that are due for review
 *
 * @param userId - User ID
 * @param type - Card type filter ('custom', 'category', or 'all')
 * @param limit - Maximum number of cards to return
 * @returns Array of cards due for review
 */
export async function getReviewCards(
  userId: string,
  type: CardType | 'all' = 'all',
  limit?: number
): Promise<SpacedRepetitionCard[]> {
  // Get all cards
  const allCards = await getUserCards(userId, type);

  // Filter and sort due cards
  const dueCards = getCardsForReview(allCards, limit);

  return dueCards;
}

/**
 * Get card statistics for user
 *
 * @param userId - User ID
 * @returns User statistics
 */
export async function getCardStatistics(
  userId: string
): Promise<UserStatistics> {
  try {
    const allCards = await getUserCards(userId, 'all');
    return calculateUserStatistics(allCards);
  } catch (error) {
    console.error('Error getting card statistics:', error);
    throw error;
  }
}

/**
 * Get card summaries grouped by category
 *
 * @param userId - User ID
 * @returns Array of category summaries
 */
export async function getCardGroupSummaries(
  userId: string
): Promise<CardGroupSummary[]> {
  try {
    const allCards = await getUserCards(userId, 'all');
    return groupCardsByCategory(allCards);
  } catch (error) {
    console.error('Error getting card group summaries:', error);
    throw error;
  }
}

/**
 * Update daily statistics
 *
 * @param userId - User ID
 * @param isCorrect - Whether the answer was correct
 * @param isNewCard - Whether this is a new card being reviewed for the first time
 */
async function updateDailyStatistics(
  userId: string,
  isCorrect: boolean,
  isNewCard: boolean
): Promise<void> {
  if (!isClient) return;

  const db = getFirestore();
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const statsRef = doc(db, 'users', userId, 'statistics', 'daily', dateString);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      // Update existing stats
      const data = statsDoc.data() as FirestoreDailyStats;
      await updateDoc(statsRef, {
        reviewedCards: data.reviewedCards + 1,
        correctAnswers: isCorrect ? data.correctAnswers + 1 : data.correctAnswers,
        incorrectAnswers: !isCorrect ? data.incorrectAnswers + 1 : data.incorrectAnswers,
        newCards: isNewCard ? data.newCards + 1 : data.newCards,
      });
    } else {
      // Create new stats
      await setDoc(statsRef, {
        date: dateString,
        reviewedCards: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
        studyTime: 0, // Can be updated separately
        newCards: isNewCard ? 1 : 0,
        createdAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error updating daily statistics:', error);
    // Don't throw - statistics update failure shouldn't block the main operation
  }
}

/**
 * Get daily statistics for a date range
 *
 * @param userId - User ID
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Array of daily statistics
 */
export async function getDailyStatistics(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyStatistics[]> {
  if (!isClient) {
    throw new Error('This function can only run on client-side');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated');
  }

  try {
    const statsCollection = collection(db, 'users', userId, 'statistics', 'daily');
    const q = query(
      statsCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const statistics: DailyStatistics[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreDailyStats;
      statistics.push({
        date: data.date,
        reviewedCards: data.reviewedCards,
        correctAnswers: data.correctAnswers,
        incorrectAnswers: data.incorrectAnswers,
        studyTime: data.studyTime,
        newCards: data.newCards,
      });
    });

    return statistics;
  } catch (error) {
    console.error('Error getting daily statistics:', error);
    throw error;
  }
}

/**
 * Get last N days of statistics
 *
 * @param userId - User ID
 * @param days - Number of days to retrieve
 * @returns Array of daily statistics
 */
export async function getRecentStatistics(
  userId: string,
  days: number = 7
): Promise<DailyStatistics[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const endDateStr = endDate.toISOString().split('T')[0];
  const startDateStr = startDate.toISOString().split('T')[0];

  return getDailyStatistics(userId, startDateStr, endDateStr);
}

/**
 * Calculate current and longest streak
 *
 * @param userId - User ID
 * @returns Object with current and longest streak
 */
export async function calculateStreaks(
  userId: string
): Promise<{ currentStreak: number; longestStreak: number }> {
  try {
    // Get statistics for the last 365 days
    const stats = await getRecentStatistics(userId, 365);

    if (stats.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort by date (newest first)
    stats.sort((a, b) => b.date.localeCompare(a.date));

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = today;

    for (const stat of stats) {
      if (stat.date === checkDate && stat.reviewedCards > 0) {
        currentStreak++;
        // Move to previous day
        const date = new Date(checkDate);
        date.setDate(date.getDate() - 1);
        checkDate = date.toISOString().split('T')[0];
      } else if (stat.date < checkDate) {
        // Gap in streak
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = stats[0].date;

    for (const stat of stats) {
      if (stat.date === expectedDate && stat.reviewedCards > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);

        // Move to previous day
        const date = new Date(expectedDate);
        date.setDate(date.getDate() - 1);
        expectedDate = date.toISOString().split('T')[0];
      } else {
        // Gap in streak - start new streak
        tempStreak = 0;
        expectedDate = stat.date;
      }
    }

    return { currentStreak, longestStreak };
  } catch (error) {
    console.error('Error calculating streaks:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

/**
 * Delete a card
 *
 * @param userId - User ID
 * @param type - Card type
 * @param word - Word to delete
 * @param categoryId - Category ID (for category cards)
 */
export async function deleteCard(
  userId: string,
  type: CardType,
  word: string,
  categoryId?: string
): Promise<void> {
  if (!isClient) {
    throw new Error('This function can only run on client-side');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated');
  }

  try {
    const cardId = generateCardId(userId, type, word, categoryId);
    const cardRef = doc(db, 'users', userId, 'spaced-repetition', type, cardId);

    await setDoc(cardRef, { deleted: true }, { merge: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
}

/**
 * Bulk create cards (useful for initializing from existing flashcards)
 *
 * @param userId - User ID
 * @param type - Card type
 * @param words - Array of {word, translation, categoryId?, categoryName?}
 */
export async function bulkCreateCards(
  userId: string,
  type: CardType,
  words: Array<{
    word: string;
    translation: string;
    categoryId?: string;
    categoryName?: string;
  }>
): Promise<void> {
  if (!isClient) {
    throw new Error('This function can only run on client-side');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated');
  }

  try {
    const batch = writeBatch(db);

    for (const wordData of words) {
      const cardId = generateCardId(
        userId,
        type,
        wordData.word,
        wordData.categoryId
      );
      const cardRef = doc(db, 'users', userId, 'spaced-repetition', type, cardId);

      // Check if card already exists
      const cardDoc = await getDoc(cardRef);
      if (!cardDoc.exists()) {
        const newCard = createNewCard(
          wordData.word,
          wordData.translation,
          wordData.categoryId,
          wordData.categoryName
        );
        batch.set(cardRef, cardToFirestore(newCard));
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error bulk creating cards:', error);
    throw error;
  }
}
