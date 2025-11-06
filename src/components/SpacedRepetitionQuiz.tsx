'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getReviewCards, saveQuizResult } from '@/lib/firebase/spacedRepetition';
import { SpacedRepetitionCard, CardType } from '@/types/spacedRepetition';

interface SpacedRepetitionQuizProps {
  userId: string;
  type: CardType | 'all';
  categoryId?: string;
  categoryName?: string;
  onExit: () => void;
}

export default function SpacedRepetitionQuiz({
  userId,
  type,
  categoryId,
  categoryName,
  onExit,
}: SpacedRepetitionQuizProps) {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<SpacedRepetitionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  });
  const [finished, setFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    // Auto-focus input when card changes
    if (!finished && !loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, finished, loading]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const reviewCards = await getReviewCards(userId, type as CardType, 50);

      if (reviewCards.length === 0) {
        setFinished(true);
      } else {
        setCards(reviewCards);
        setSessionStats({ total: reviewCards.length, correct: 0, incorrect: 0 });
      }
    } catch (error) {
      console.error('Error loading review cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const currentCard = cards[currentIndex];
    const correctAnswer = currentCard.translation.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    // Check if continuing after incorrect answer
    if (result === 'incorrect' && flipped) {
      const isMatch =
        userAnswer === correctAnswer ||
        (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2);

      if (isMatch) {
        handleNext();
      } else {
        setAnswer('');
      }
      return;
    }

    // First attempt - check answer
    const isCorrect =
      userAnswer === correctAnswer ||
      (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2);

    setResult(isCorrect ? 'correct' : 'incorrect');
    setFlipped(true);

    // Save result to Firebase
    try {
      const cardType: CardType = currentCard.categoryId ? 'category' : 'custom';
      await saveQuizResult(
        userId,
        cardType,
        currentCard.word,
        currentCard.translation,
        isCorrect,
        currentCard.categoryId,
        currentCard.categoryName
      );
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    // Auto-advance if correct
    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      setAnswer('');
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
      setResult(null);
      setFlipped(false);
    } else {
      setFinished(true);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.accent }}
          />
          <p style={{ color: colors.text }}>Kartlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (finished || cards.length === 0) {
    const accuracy =
      sessionStats.total > 0
        ? Math.round((sessionStats.correct / sessionStats.total) * 100)
        : 0;

    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <div className="text-6xl mb-6">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
            {sessionStats.total === 0 ? 'Tebrikler!' : 'Quiz Tamamlandı!'}
          </h2>
          {sessionStats.total === 0 ? (
            <p className="mb-6 opacity-70" style={{ color: colors.text }}>
              Bugün için tüm kartları tamamladınız!
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.text }}>
                    {sessionStats.total}
                  </div>
                  <div className="text-sm opacity-70" style={{ color: colors.text }}>
                    Toplam
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-green-500">
                    {sessionStats.correct}
                  </div>
                  <div className="text-sm opacity-70" style={{ color: colors.text }}>
                    Doğru
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-red-500">
                    {sessionStats.incorrect}
                  </div>
                  <div className="text-sm opacity-70" style={{ color: colors.text }}>
                    Yanlış
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold mb-2" style={{ color: colors.accent }}>
                  {accuracy}%
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.text }}>
                  Doğruluk Oranı
                </div>
              </div>
            </>
          )}

          <button
            onClick={onExit}
            className="w-full py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: colors.accent }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 py-4 px-4 shadow-md"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold" style={{ color: colors.text }}>
              {categoryName || 'Tüm Kartlar'}
            </h1>
            <button
              onClick={onExit}
              className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
              style={{ backgroundColor: colors.background, color: colors.text }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: colors.accent }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-2 text-sm">
            <span style={{ color: colors.text }}>
              {currentIndex + 1} / {cards.length}
            </span>
            <div className="flex gap-4">
              <span className="text-green-500">✓ {sessionStats.correct}</span>
              <span className="text-red-500">✗ {sessionStats.incorrect}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Display */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Flashcard */}
        <div
          className="rounded-2xl p-12 mb-6 text-center shadow-lg min-h-[300px] flex items-center justify-center"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
              {currentCard.word}
            </div>
            {flipped && (
              <div className="text-2xl md:text-3xl opacity-70" style={{ color: colors.text }}>
                {currentCard.translation}
              </div>
            )}
          </div>
        </div>

        {/* Answer Input */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <p className="text-sm mb-2" style={{ color: colors.text }}>
              {result === 'incorrect' && flipped
                ? 'Doğru cevabı yazın (kartın arkasında):'
                : 'Kelimenin Türkçe karşılığını yazın:'}
            </p>

            <div className="flex w-full mb-4">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-grow px-4 py-3 rounded-l-lg border focus:outline-none"
                placeholder={
                  result === 'incorrect' && flipped
                    ? 'Doğru cevabı yazın...'
                    : 'Cevabınızı buraya yazın...'
                }
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor:
                    result === 'correct'
                      ? 'green'
                      : result === 'incorrect'
                      ? 'red'
                      : colors.accent,
                  fontSize: '16px',
                  height: '48px',
                }}
                autoComplete="off"
                readOnly={result === 'correct'}
                autoFocus
              />

              <button
                type="submit"
                className="px-6 py-3 rounded-r-lg transition-all font-medium"
                style={{
                  backgroundColor:
                    result === 'correct'
                      ? 'green'
                      : result === 'incorrect' && flipped
                      ? 'orange'
                      : colors.accent,
                  color: 'white',
                  fontSize: '16px',
                  height: '48px',
                }}
                disabled={!answer.trim() || result === 'correct'}
              >
                {result === 'incorrect' && flipped ? 'Devam Et' : 'Kontrol Et'}
              </button>
            </div>

            {/* Feedback */}
            {result === 'correct' && (
              <p className="text-green-500 text-center font-medium mb-2">
                ✓ Doğru cevap! 👍
              </p>
            )}

            {result === 'incorrect' && flipped && (
              <div className="text-center mb-4">
                <p className="text-red-500 font-medium mb-1">✗ Yanlış cevap!</p>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  Kartın arkasına bak ve doğru cevabı yazıp devam et.
                </p>
              </div>
            )}

            {/* Skip Button */}
            {!result && (
              <button
                type="button"
                onClick={handleSkip}
                className="py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
              >
                Atla
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
