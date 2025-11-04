/**
 * useCategoryPage Hook
 * Centralized state management for category pages
 * Eliminates duplicate state logic across 8+ category pages
 */

import { useState, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryConfig } from '@/config/categories.config';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import { useSEO } from './useSEO';

interface Word {
  english: string;
  turkish: string;
}

interface QuizQuestion {
  id?: number;
  word: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
}

/**
 * Custom hook for category page logic
 * Handles state, data fetching, and SEO
 */
export function useCategoryPage(config: CategoryConfig) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { colors } = useTheme();
  const { user } = useAuth();

  // Inject SEO structured data
  useSEO({
    title: config.title,
    description: config.metaDescription,
    url: `https://my-yds.web.app/${config.id}`,
  });

  // Get words based on category
  const words = useMemo<Word[]>(() => {
    if (config.id === 'all-words') {
      // Special case: combine all categories
      return Object.values(vocabulary).flat();
    }

    // Regular category
    const key = config.vocabularyKey as keyof typeof vocabulary;
    return vocabulary[key] || [];
  }, [config.id, config.vocabularyKey]);

  // Get quiz questions based on category
  const questions = useMemo<QuizQuestion[]>(() => {
    if (config.id === 'all-words') {
      // Special case: combine all quizzes with unique IDs
      return Object.values(quizData).flatMap((categoryQuestions, categoryIndex) =>
        categoryQuestions.map((question, questionIndex) => ({
          ...question,
          id: categoryIndex * 100 + questionIndex + 1,
        }))
      );
    }

    // Regular category
    const key = config.quizKey as keyof typeof quizData;
    return quizData[key] || [];
  }, [config.id, config.quizKey]);

  const questionCount = questions.length;

  // For all-words page, we might want to limit quiz questions
  const displayQuestions = useMemo(() => {
    if (config.id === 'all-words' && questions.length > 20) {
      // Get random 20 questions for all-words
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 20);
    }
    return questions;
  }, [config.id, questions]);

  return {
    // State
    showQuiz,
    setShowQuiz,
    score,
    setScore,

    // Data
    words,
    questions: displayQuestions,
    questionCount: config.id === 'all-words' ? 20 : questionCount,

    // Theme and Auth
    colors,
    user,

    // Config
    config,
  };
}
