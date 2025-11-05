/**
 * CategoryPage Component
 * Generic, reusable page component for all category pages
 * Eliminates ~1,440 lines of duplicate code across 8+ category pages
 *
 * REFACTORED: Now uses FlashcardDeck with mode="category"
 * - Unified flashcard display
 * - Automatic list/card/test view switching
 * - Progress tracking via FlashcardDeck
 * - Consistent UX with upload-flashcards page
 *
 * Usage:
 * ```tsx
 * import { CategoryPage } from '@/components/pages/CategoryPage';
 * import { categoryConfigs } from '@/config/categories.config';
 *
 * export default function AcademicTermsPage() {
 *   return <CategoryPage config={categoryConfigs['academic-terms']} />;
 * }
 * ```
 */

'use client';

import dynamic from 'next/dynamic';
import { CategoryConfig } from '@/config/categories.config';
import { useCategoryPage } from '@/hooks/useCategoryPage';
import { wordsToFlashcards } from '@/types/flashcard';
import FlashcardDeck, { QuizQuestion } from '@/components/flashcards/FlashcardDeck';
import { CategoryHeader, CategoryDescription } from '@/components/category';

// Dynamic import for AdBanner to avoid SSR issues
const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });

interface CategoryPageProps {
  config: CategoryConfig;
}

/**
 * Generic category page component
 * Handles all category page logic and rendering
 */
export function CategoryPage({ config }: CategoryPageProps) {
  const {
    words,
    questions,
    questionCount,
    colors,
    user,
  } = useCategoryPage(config);

  // Convert words to UnifiedFlashcard format
  // Map Word format (english, turkish) to expected format (en, tr)
  const mappedWords = words.map(word => ({
    en: 'english' in word ? (word as any).english : (word as any).en,
    tr: 'turkish' in word ? (word as any).turkish : (word as any).tr
  }));
  const flashcards = wordsToFlashcards(mappedWords, config.id);

  // Convert questions to QuizQuestion format (ensure id is present)
  const quizQuestions: QuizQuestion[] = questions.map((q, index) => ({
    id: q.id ?? index + 1,
    word: q.word,
    sentence: q.sentence,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <CategoryHeader title={config.title} textColor={colors.text} />

        {/* Category Description */}
        <CategoryDescription
          description={config.description}
          wordCount={words.length}
          questionCount={questionCount}
          user={user}
          textColor={colors.text}
          cardBackground={colors.cardBackground}
          accentColor={colors.accent}
        />

        {/* Additional Info Section */}
        {config.additionalInfo && (
          <div
            className="mb-6 p-4 rounded-lg text-sm leading-relaxed"
            style={{ backgroundColor: colors.cardBackground, color: colors.text }}
          >
            <details>
              <summary className="cursor-pointer font-semibold mb-2">
                {config.title} Hakkında Detaylı Bilgi
              </summary>
              <div className="mt-3 whitespace-pre-line opacity-90">
                {config.additionalInfo}
              </div>
            </details>
          </div>
        )}

        {/* Main Content: FlashcardDeck with all view modes */}
        <FlashcardDeck
          flashcards={flashcards}
          mode="category"
          showListView={true}
          showTestMode={true}
          testQuestions={quizQuestions}
          categoryId={config.id}
          quizMode={false}
          initialViewMode="card"
        />
      </div>

      {/* Ad Banner */}
      <AdBanner
        slot={config.adSlot}
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
}
