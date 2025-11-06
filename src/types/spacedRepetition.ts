// src/types/spacedRepetition.ts

/**
 * Spaced Repetition Card Data
 * Represents a single flashcard in the spaced repetition system
 */
export interface SpacedRepetitionCard {
  // Card identification
  word: string;           // English word
  translation: string;    // Turkish translation

  // SM-2 Algorithm parameters
  easeFactor: number;     // Difficulty factor (default: 2.5)
  interval: number;       // Days until next review
  repetitions: number;    // Consecutive correct answers

  // Timestamps
  nextReviewDate: Date;   // When to review next
  lastReviewDate: Date | null;  // Last review date

  // Statistics
  totalReviews: number;   // Total number of reviews
  correctCount: number;   // Number of correct answers
  incorrectCount: number; // Number of incorrect answers

  // Metadata
  createdAt: Date;
  categoryId?: string;    // For category words
  categoryName?: string;  // For display purposes
}

/**
 * Card Status Types
 */
export type CardStatus = 'new' | 'learning' | 'mastered';

/**
 * Card Type - distinguishes between custom and category cards
 */
export type CardType = 'custom' | 'category';

/**
 * Quality Rating for SM-2 Algorithm
 * 0-2: Incorrect answer
 * 3: Correct but difficult
 * 4: Correct with hesitation
 * 5: Perfect answer
 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Quiz Result - simplified for UI
 */
export interface QuizResult {
  cardId: string;
  word: string;
  isCorrect: boolean;
  quality: Quality;
  timestamp: Date;
}

/**
 * Daily Statistics
 */
export interface DailyStatistics {
  date: string;           // YYYY-MM-DD format
  reviewedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyTime: number;      // in minutes
  newCards: number;       // New cards learned today
}

/**
 * Overall User Statistics
 */
export interface UserStatistics {
  // Total counts
  totalCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;

  // Due today
  dueToday: number;

  // Accuracy
  overallAccuracy: number;  // Percentage

  // Streak
  currentStreak: number;     // Consecutive days
  longestStreak: number;

  // Last activity
  lastReviewDate: Date | null;
}

/**
 * Card Group Summary (for custom vs category cards)
 */
export interface CardGroupSummary {
  type: CardType;
  categoryId?: string;
  categoryName?: string;

  totalCards: number;
  dueToday: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;

  accuracy: number;  // Percentage
}

/**
 * Review Session Summary
 */
export interface ReviewSession {
  startTime: Date;
  endTime: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
}

/**
 * Firestore Document Types
 */

// Firebase timestamp type (to be converted to Date)
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Card data as stored in Firestore
export interface FirestoreCardData {
  word: string;
  translation: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: FirestoreTimestamp;
  lastReviewDate: FirestoreTimestamp | null;
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
  createdAt: FirestoreTimestamp;
  categoryId?: string;
  categoryName?: string;
}

// Daily stats as stored in Firestore
export interface FirestoreDailyStats {
  date: string;
  reviewedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyTime: number;
  newCards: number;
  createdAt: FirestoreTimestamp;
}
