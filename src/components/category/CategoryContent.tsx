/**
 * CategoryContent Component
 * Handles switching between word list and quiz modes
 * Displays appropriate content based on mode
 */

import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { CategoryAdditionalInfo } from './CategoryAdditionalInfo';

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

interface CategoryContentProps {
  showQuiz: boolean;
  words: Word[];
  questions: QuizQuestion[];
  categoryId: string;
  questionCount: number;
  onQuizComplete: (score: number) => void;
  textColor: string;
  cardBackground: string;
  additionalInfo?: string;
  categoryTitle: string;
}

export function CategoryContent({
  showQuiz,
  words,
  questions,
  categoryId,
  questionCount,
  onQuizComplete,
  textColor,
  cardBackground,
  additionalInfo,
  categoryTitle,
}: CategoryContentProps) {
  if (showQuiz) {
    return (
      <div>
        {/* Quiz description */}
        <div
          className="rounded-lg shadow-md p-4 mb-6"
          style={{ backgroundColor: cardBackground }}
        >
          <p style={{ color: textColor }} className="text-sm">
            Bu test, {categoryTitle} kategorisinden {questionCount} soru
            içermektedir.
          </p>
        </div>

        <Quiz
          questions={questions}
          categoryWords={words}
          categoryId={categoryId}
          onQuizComplete={onQuizComplete}
        />
      </div>
    );
  }

  return (
    <>
      <WordList words={words} categoryId={categoryId} />

      {/* Additional category information */}
      {additionalInfo && (
        <CategoryAdditionalInfo
          title={`YDS'de ${categoryTitle}`}
          content={additionalInfo}
          textColor={textColor}
          cardBackground={cardBackground}
        />
      )}
    </>
  );
}
