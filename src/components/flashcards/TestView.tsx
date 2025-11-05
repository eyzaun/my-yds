'use client';

import React, { useState, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { FlashcardData } from '@/types/flashcard';
import { QuizQuestion } from './FlashcardDeck';

interface TestViewProps {
  questions: QuizQuestion[];
  flashcards?: FlashcardData[];
  onComplete?: (score: number) => void;
  showWordMeanings?: boolean;
}

/**
 * TestView Component
 * Çoktan seçmeli test görünümü
 * - Quiz sorularını gösterir
 * - Cevap seçimi yapar
 * - Sonuçları gösterir
 * - Skor hesaplar
 */
export default function TestView({
  questions,
  flashcards = [],
  onComplete,
  showWordMeanings = true
}: TestViewProps) {
  const { colors } = useTheme();
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Cevap seçimi handler
  const handleAnswerSelect = useCallback((questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  // Test gönderme handler
  const handleSubmit = useCallback(() => {
    const totalScore = questions.reduce((acc, question) => {
      return acc + (userAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    setScore(totalScore);
    setShowResults(true);

    // Callback varsa çağır
    if (onComplete) {
      onComplete(totalScore);
    }
  }, [questions, userAnswers, onComplete]);

  // Testi sıfırlama
  const handleReset = useCallback(() => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  }, []);

  // Kelimenin anlamını bul
  const getWordMeaning = (word: string): string | null => {
    if (!showWordMeanings || !flashcards.length) return null;

    const card = flashcards.find(
      card => card.front.toLowerCase() === word.toLowerCase()
    );

    return card ? card.back : null;
  };

  // Cevapların tamamlanma durumu
  const allQuestionsAnswered = questions.every(q => userAnswers[q.id]);
  const percentage = Math.round((score / questions.length) * 100);

  // Boş test kontrolü
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8" style={{ color: colors.text }}>
        Test soruları yüklenmedi.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-4">
      {!showResults ? (
        <>
          {/* Test başlık */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
              Çoktan Seçmeli Test
            </h2>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              Toplam {questions.length} soru
            </p>
          </div>

          {/* Sorular */}
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="mb-6 p-4 rounded-lg shadow-md transition-all duration-300"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="mb-4">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold mr-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: 'white'
                  }}
                >
                  Soru {index + 1}
                </span>
              </div>

              <p
                style={{ color: colors.text }}
                className="mb-4 text-base leading-relaxed"
              >
                {question.sentence}
              </p>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = userAnswers[question.id] === option;

                  return (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: isSelected
                          ? colors.accent
                          : colors.background,
                        color: colors.text,
                        border: `2px solid ${isSelected ? colors.accent : 'transparent'}`
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, option)}
                        className="w-4 h-4"
                        style={{ accentColor: colors.accent }}
                      />
                      <span className={isSelected ? 'font-semibold' : ''}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit button */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              Cevaplanan soru: {Object.keys(userAnswers).length} / {questions.length}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="w-full max-w-md px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.accent,
                color: 'white'
              }}
            >
              {allQuestionsAnswered ? 'Testi Bitir' : 'Lütfen Tüm Soruları Cevaplayın'}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Sonuç kartı */}
          <div
            className="p-6 rounded-lg shadow-lg text-center"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Test Tamamlandı!
            </h2>

            <div className="my-4">
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: colors.accent }}
              >
                {score} / {questions.length}
              </div>
              <div
                className="text-2xl"
                style={{ color: colors.text }}
              >
                %{percentage}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                  border: `2px solid ${colors.accent}`
                }}
              >
                Testi Tekrarla
              </button>
            </div>
          </div>

          {/* Detaylı sonuçlar */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: colors.text }}
            >
              Detaylı Sonuçlar
            </h3>

            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wordMeaning = getWordMeaning(question.word);

              return (
                <div
                  key={question.id}
                  className="p-4 mb-4 rounded-lg shadow-md"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderLeft: `4px solid ${isCorrect ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'}`
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: isCorrect ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                        color: 'white'
                      }}
                    >
                      {isCorrect ? '✓ Doğru' : '✗ Yanlış'}
                    </span>
                    <span style={{ color: colors.text, opacity: 0.6 }} className="text-sm">
                      Soru {index + 1}
                    </span>
                  </div>

                  <p className="mb-3" style={{ color: colors.text }}>
                    {question.sentence}
                  </p>

                  {wordMeaning && (
                    <div
                      className="mb-3 p-2 rounded"
                      style={{ backgroundColor: colors.background }}
                    >
                      <span style={{ color: colors.text }} className="text-sm">
                        <strong>{question.word}</strong>: {wordMeaning}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p>
                      <span style={{ color: colors.text }} className="text-sm">
                        Sizin cevabınız:{' '}
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          color: isCorrect ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'
                        }}
                      >
                        {userAnswer}
                      </span>
                    </p>

                    {!isCorrect && (
                      <p>
                        <span style={{ color: colors.text }} className="text-sm">
                          Doğru cevap:{' '}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: 'rgb(74, 222, 128)' }}
                        >
                          {question.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
