/**
 * CategoryPage Component
 * Generic, reusable page component for all category pages
 * Eliminates ~1,440 lines of duplicate code across 8+ category pages
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
import {
  CategoryHeader,
  CategoryDescription,
  ModeSelector,
  CategoryContent,
  TestResult,
} from '@/components/category';

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
    showQuiz,
    setShowQuiz,
    score,
    setScore,
    words,
    questions,
    questionCount,
    colors,
    user,
  } = useCategoryPage(config);

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

        {/* Mode Selector (Word List / Quiz) */}
        <ModeSelector
          showQuiz={showQuiz}
          onModeChange={setShowQuiz}
          textColor={colors.text}
          accentColor={colors.accent}
          cardBackground={colors.cardBackground}
        />

        {/* Main Content (Word List or Quiz) */}
        <CategoryContent
          showQuiz={showQuiz}
          words={words}
          questions={questions}
          categoryId={config.id}
          questionCount={questionCount}
          onQuizComplete={setScore}
          textColor={colors.text}
          cardBackground={colors.cardBackground}
          additionalInfo={config.additionalInfo}
          categoryTitle={config.title}
        />

        {/* Test Result (shown after quiz completion) */}
        {score !== null && (
          <TestResult
            score={score}
            questionCount={questionCount}
            onRetry={() => setScore(null)}
            textColor={colors.text}
            cardBackground={colors.cardBackground}
            accentColor={colors.accent}
          />
        )}
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
