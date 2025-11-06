// src/lib/spacedRepetition.ts

import {
  SpacedRepetitionCard,
  CardStatus,
  Quality,
  CardGroupSummary,
  UserStatistics
} from '@/types/spacedRepetition';

/**
 * SM-2 Algorithm Implementation
 * Based on SuperMemo SM-2 algorithm by Piotr Wozniak
 *
 * The SM-2 algorithm calculates optimal intervals between reviews
 * based on the ease of recall and number of successful repetitions.
 */

/**
 * Calculate next review date using SM-2 algorithm
 *
 * @param quality - User's response quality (0-5)
 *                  0-2: Incorrect (restart interval)
 *                  3: Correct but difficult
 *                  4: Correct with some hesitation
 *                  5: Perfect recall
 * @param card - Current card data
 * @returns Updated card with new interval and ease factor
 */
export function calculateNextReview(
  quality: Quality,
  card: SpacedRepetitionCard
): SpacedRepetitionCard {
  const now = new Date();

  // Clone the card to avoid mutation
  const updatedCard: SpacedRepetitionCard = {
    ...card,
    lastReviewDate: now,
    totalReviews: card.totalReviews + 1,
  };

  // Update correct/incorrect counts
  if (quality >= 3) {
    updatedCard.correctCount = card.correctCount + 1;
  } else {
    updatedCard.incorrectCount = card.incorrectCount + 1;
  }

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // Minimum EF is 1.3
  let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  updatedCard.easeFactor = newEaseFactor;

  // Calculate new interval and repetitions
  if (quality < 3) {
    // Incorrect answer - restart
    updatedCard.repetitions = 0;
    updatedCard.interval = 1; // Review tomorrow
  } else {
    // Correct answer - increase interval
    updatedCard.repetitions = card.repetitions + 1;

    if (updatedCard.repetitions === 1) {
      updatedCard.interval = 1; // First repetition: 1 day
    } else if (updatedCard.repetitions === 2) {
      updatedCard.interval = 6; // Second repetition: 6 days
    } else {
      // Subsequent repetitions: multiply previous interval by ease factor
      updatedCard.interval = Math.round(card.interval * newEaseFactor);
    }
  }

  // Set next review date
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + updatedCard.interval);
  nextDate.setHours(0, 0, 0, 0); // Reset to start of day
  updatedCard.nextReviewDate = nextDate;

  return updatedCard;
}

/**
 * Update card after quiz result (simplified for UI)
 *
 * @param card - Current card
 * @param isCorrect - Whether the answer was correct
 * @returns Updated card
 */
export function updateCardAfterReview(
  card: SpacedRepetitionCard,
  isCorrect: boolean
): SpacedRepetitionCard {
  // Convert boolean to quality rating
  // Correct: quality 4 (good recall)
  // Incorrect: quality 0 (complete blackout)
  const quality: Quality = isCorrect ? 4 : 0;

  return calculateNextReview(quality, card);
}

/**
 * Get cards that are due for review
 *
 * @param cards - Array of all cards
 * @param limit - Maximum number of cards to return (optional)
 * @returns Cards due for review today or earlier
 */
export function getCardsForReview(
  cards: SpacedRepetitionCard[],
  limit?: number
): SpacedRepetitionCard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter cards that are due
  const dueCards = cards.filter(card => {
    const reviewDate = new Date(card.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  });

  // Sort by priority:
  // 1. Cards never reviewed (new cards)
  // 2. Cards with earliest review date
  // 3. Cards with lowest ease factor (difficult cards)
  dueCards.sort((a, b) => {
    // New cards first
    if (a.totalReviews === 0 && b.totalReviews > 0) return -1;
    if (a.totalReviews > 0 && b.totalReviews === 0) return 1;

    // Then by review date
    const dateCompare = a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
    if (dateCompare !== 0) return dateCompare;

    // Finally by ease factor (difficult cards first)
    return a.easeFactor - b.easeFactor;
  });

  // Apply limit if specified
  if (limit && limit > 0) {
    return dueCards.slice(0, limit);
  }

  return dueCards;
}

/**
 * Get card status based on learning progress
 *
 * @param card - Card to check
 * @returns Card status: 'new', 'learning', or 'mastered'
 */
export function getCardStatus(card: SpacedRepetitionCard): CardStatus {
  // New: Never reviewed
  if (card.totalReviews === 0) {
    return 'new';
  }

  // Mastered: At least 5 reviews, 80%+ accuracy, interval > 21 days
  const accuracy = card.totalReviews > 0
    ? card.correctCount / card.totalReviews
    : 0;

  if (
    card.totalReviews >= 5 &&
    accuracy >= 0.8 &&
    card.interval > 21
  ) {
    return 'mastered';
  }

  // Otherwise: Learning
  return 'learning';
}

/**
 * Create a new spaced repetition card
 *
 * @param word - English word
 * @param translation - Turkish translation
 * @param categoryId - Optional category ID
 * @param categoryName - Optional category name
 * @returns New card with default values
 */
export function createNewCard(
  word: string,
  translation: string,
  categoryId?: string,
  categoryName?: string
): SpacedRepetitionCard {
  const now = new Date();

  return {
    word,
    translation,
    easeFactor: 2.5,        // Default ease factor
    interval: 0,            // Will be set to 1 after first review
    repetitions: 0,
    nextReviewDate: now,    // Due immediately for first review
    lastReviewDate: null,
    totalReviews: 0,
    correctCount: 0,
    incorrectCount: 0,
    createdAt: now,
    categoryId,
    categoryName,
  };
}

/**
 * Calculate accuracy percentage
 *
 * @param correctCount - Number of correct answers
 * @param totalReviews - Total number of reviews
 * @returns Accuracy as percentage (0-100)
 */
export function calculateAccuracy(correctCount: number, totalReviews: number): number {
  if (totalReviews === 0) return 0;
  return Math.round((correctCount / totalReviews) * 100);
}

/**
 * Group cards by category and calculate summary statistics
 *
 * @param cards - Array of cards
 * @returns Array of category summaries
 */
export function groupCardsByCategory(
  cards: SpacedRepetitionCard[]
): CardGroupSummary[] {
  const categoryMap = new Map<string, SpacedRepetitionCard[]>();

  // Group cards
  cards.forEach(card => {
    const key = card.categoryId || 'custom';
    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
    }
    categoryMap.get(key)!.push(card);
  });

  // Calculate summaries
  const summaries: CardGroupSummary[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  categoryMap.forEach((categoryCards, key) => {
    const isCustom = key === 'custom';
    const firstCard = categoryCards[0];

    // Count cards by status
    let newCards = 0;
    let learningCards = 0;
    let masteredCards = 0;
    let dueToday = 0;
    let totalCorrect = 0;
    let totalReviews = 0;

    categoryCards.forEach(card => {
      const status = getCardStatus(card);
      if (status === 'new') newCards++;
      else if (status === 'learning') learningCards++;
      else if (status === 'mastered') masteredCards++;

      // Check if due today
      const reviewDate = new Date(card.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      if (reviewDate <= today) {
        dueToday++;
      }

      totalCorrect += card.correctCount;
      totalReviews += card.totalReviews;
    });

    summaries.push({
      type: isCustom ? 'custom' : 'category',
      categoryId: isCustom ? undefined : key,
      categoryName: isCustom ? 'Kendi Kartlarım' : (firstCard.categoryName || key),
      totalCards: categoryCards.length,
      dueToday,
      newCards,
      learningCards,
      masteredCards,
      accuracy: calculateAccuracy(totalCorrect, totalReviews),
    });
  });

  // Sort: custom first, then by category name
  summaries.sort((a, b) => {
    if (a.type === 'custom' && b.type !== 'custom') return -1;
    if (a.type !== 'custom' && b.type === 'custom') return 1;
    return (a.categoryName || '').localeCompare(b.categoryName || '');
  });

  return summaries;
}

/**
 * Calculate overall user statistics
 *
 * @param cards - Array of all user's cards
 * @returns Overall statistics
 */
export function calculateUserStatistics(
  cards: SpacedRepetitionCard[]
): UserStatistics {
  if (cards.length === 0) {
    return {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      masteredCards: 0,
      dueToday: 0,
      overallAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastReviewDate: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let newCards = 0;
  let learningCards = 0;
  let masteredCards = 0;
  let dueToday = 0;
  let totalCorrect = 0;
  let totalReviews = 0;
  let lastReviewDate: Date | null = null;

  cards.forEach(card => {
    const status = getCardStatus(card);
    if (status === 'new') newCards++;
    else if (status === 'learning') learningCards++;
    else if (status === 'mastered') masteredCards++;

    // Check if due today
    const reviewDate = new Date(card.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    if (reviewDate <= today) {
      dueToday++;
    }

    totalCorrect += card.correctCount;
    totalReviews += card.totalReviews;

    // Track last review date
    if (card.lastReviewDate) {
      if (!lastReviewDate || card.lastReviewDate > lastReviewDate) {
        lastReviewDate = card.lastReviewDate;
      }
    }
  });

  return {
    totalCards: cards.length,
    newCards,
    learningCards,
    masteredCards,
    dueToday,
    overallAccuracy: calculateAccuracy(totalCorrect, totalReviews),
    currentStreak: 0, // TODO: Calculate from daily statistics
    longestStreak: 0, // TODO: Calculate from daily statistics
    lastReviewDate,
  };
}

/**
 * Check if a card is due for review today
 *
 * @param card - Card to check
 * @returns True if card is due today or earlier
 */
export function isCardDueToday(card: SpacedRepetitionCard): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(card.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= today;
}

/**
 * Get recommended daily review limit based on total cards
 *
 * @param totalCards - Total number of cards
 * @returns Recommended daily review limit
 */
export function getRecommendedDailyLimit(totalCards: number): number {
  if (totalCards < 50) return 20;
  if (totalCards < 100) return 30;
  if (totalCards < 200) return 40;
  return 50;
}
