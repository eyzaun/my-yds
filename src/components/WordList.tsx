// src/components/WordList.tsx
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizResult } from '@/lib/firebase/spacedRepetition';
import { CardType } from '@/types/spacedRepetition';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { designTokens } from '@/styles/design-tokens';

// FlashCard dinamik olarak import ediliyor
const FlashCard = dynamic(() => import('./FlashCard'), {
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '16rem',
      color: designTokens.colors.text.secondary
    }}>
      Yükleniyor...
    </div>
  ),
  ssr: false
});

interface Word {
  en: string;
  tr: string;
}

interface WordListProps {
  words: Word[];
  categoryId: string;
  categoryName?: string;
  isCustomCard?: boolean;
}

const WordList: React.FC<WordListProps> = ({ words, categoryId, categoryName, isCustomCard = false }) => {
  const { user } = useAuth();

  // Ana state'ler
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [flipped, setFlipped] = useState(false);
  const quizInputRef = useRef<HTMLInputElement>(null);

  // Callback fonksiyonları
  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setQuizAnswer('');
      setQuizResult(null);
      setFlipped(false);

      if (isQuizMode) {
        setTimeout(() => {
          if (quizInputRef.current) {
            quizInputRef.current.focus();
          }
        }, 100);
      }
    }
  }, [currentIndex, words.length, isQuizMode]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setQuizAnswer('');
      setQuizResult(null);
      setFlipped(false);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setQuizAnswer('');
    setQuizResult(null);
    setFlipped(false);
    setIsQuizMode(false);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list');
    if (viewMode === 'card') {
      setSelectedWordIndex(null);
    }
  }, [viewMode]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const toggleQuizMode = useCallback(() => {
    setIsQuizMode(prev => !prev);
    setQuizAnswer('');
    setQuizResult(null);
    setFlipped(false);

    if (!isQuizMode) {
      setTimeout(() => {
        if (quizInputRef.current) {
          quizInputRef.current.focus();
        }
      }, 100);
    }
  }, [isQuizMode]);

  const handleQuizSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizAnswer.trim()) return;

    const currentWord = words[currentIndex];
    const correctAnswer = currentWord.tr.trim().toLowerCase();
    const userAnswer = quizAnswer.trim().toLowerCase();

    if (quizResult === 'incorrect' && flipped) {
      const isExactMatch = userAnswer === correctAnswer;
      const isCloseMatch = correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2;

      if (isExactMatch || isCloseMatch) {
        handleNext();
      } else {
        setQuizAnswer('');
      }
      return;
    }

    const isExactMatch = userAnswer === correctAnswer;
    const isCloseMatch = correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2;
    const isCorrect = isExactMatch || isCloseMatch;

    if (isCorrect) {
      setQuizResult('correct');
      setFlipped(true);

      if (user) {
        try {
          const cardType: CardType = isCustomCard ? 'custom' : 'category';
          await saveQuizResult(
            user.uid,
            cardType,
            currentWord.en,
            currentWord.tr,
            true,
            cardType === 'category' ? categoryId : undefined,
            cardType === 'category' ? (categoryName || categoryId) : undefined
          );
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }

      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      setQuizResult('incorrect');
      setFlipped(true);
      setQuizAnswer('');

      if (user) {
        try {
          const cardType: CardType = isCustomCard ? 'custom' : 'category';
          await saveQuizResult(
            user.uid,
            cardType,
            currentWord.en,
            currentWord.tr,
            false,
            cardType === 'category' ? categoryId : undefined,
            cardType === 'category' ? (categoryName || categoryId) : undefined
          );
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }
    }
  }, [quizAnswer, currentIndex, words, handleNext, quizResult, flipped, user, categoryId, categoryName, isCustomCard]);

  const handleWordClick = useCallback((index: number) => {
    if (selectedWordIndex === index) {
      setSelectedWordIndex(null);
    } else {
      setSelectedWordIndex(index);
    }
  }, [selectedWordIndex]);

  // Fullscreen mode için ESC tuşu desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isFullscreen]);

  const buttonIconViewMode = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      {viewMode === 'list' ? (
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      ) : (
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      )}
    </svg>
  );

  const buttonIconQuiz = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a1 1 0 100 2H6a4 4 0 01-4-4V5z" clipRule="evenodd" />
    </svg>
  );

  const buttonIconFullscreen = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {isFullscreen ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
      )}
    </svg>
  );

  const buttonIconReset = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div
      className={isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : 'w-full mx-auto'}
      style={{
        backgroundColor: isFullscreen ? designTokens.colors.background.primary : 'transparent',
        padding: designTokens.spacing[4]
      }}
    >
      {/* Üst Kontrol Paneli */}
      <div style={{ marginBottom: designTokens.spacing[6] }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: designTokens.spacing[3],
          flexWrap: 'wrap'
        }}>
          <Button
            variant="secondary"
            size="md"
            leftIcon={buttonIconViewMode}
            onClick={toggleViewMode}
          >
            {viewMode === 'list' ? 'Kart Görünümü' : 'Liste Görünümü'}
          </Button>

          {viewMode === 'card' && (
            <Button
              variant={isQuizMode ? 'primary' : 'secondary'}
              size="md"
              leftIcon={buttonIconQuiz}
              onClick={toggleQuizMode}
            >
              {isQuizMode ? 'Normal Mod' : 'Quiz Modu'}
            </Button>
          )}

          <Button
            variant={isFullscreen ? 'primary' : 'secondary'}
            size="md"
            leftIcon={buttonIconFullscreen}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Normal Ekran' : 'Tam Ekran'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={buttonIconReset}
            onClick={handleReset}
          >
            Baştan Başla
          </Button>
        </div>
      </div>

      {/* Ana İçerik - Kart veya Liste */}
      {viewMode === 'card' ? (
        <>
          <FlashCard
            words={words}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isQuizMode={isQuizMode}
            forceFlipped={flipped}
          />

          {/* Quiz Mode Input */}
          {isQuizMode && (
            <div style={{
              maxWidth: '28rem',
              margin: '0 auto',
              marginTop: designTokens.spacing[6]
            }}>
              <form onSubmit={handleQuizSubmit}>
                <p style={{
                  fontSize: designTokens.typography.fontSize.sm,
                  marginBottom: designTokens.spacing[3],
                  color: designTokens.colors.text.primary
                }}>
                  {quizResult === 'incorrect' && flipped
                    ? 'Doğru cevabı yazın (kartın arkasında):'
                    : 'Kelimenin Türkçe karşılığını yazın:'}
                </p>

                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    ref={quizInputRef}
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder={quizResult === 'incorrect' && flipped ? 'Doğru cevabı yazın...' : 'Cevabınızı buraya yazın...'}
                    style={{
                      flex: 1,
                      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
                      borderTopLeftRadius: designTokens.borderRadius.md,
                      borderBottomLeftRadius: designTokens.borderRadius.md,
                      border: `2px solid ${
                        quizResult === 'correct' ? designTokens.colors.accent.success.main :
                        quizResult === 'incorrect' ? designTokens.colors.accent.error.main :
                        designTokens.colors.primary[400]
                      }`,
                      backgroundColor: designTokens.colors.background.primary,
                      color: designTokens.colors.text.primary,
                      fontSize: designTokens.typography.fontSize.base,
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    autoComplete="off"
                    readOnly={quizResult === 'correct'}
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={!quizAnswer.trim() || quizResult === 'correct'}
                    style={{
                      padding: `${designTokens.spacing[3]} ${designTokens.spacing[5]}`,
                      borderTopRightRadius: designTokens.borderRadius.md,
                      borderBottomRightRadius: designTokens.borderRadius.md,
                      backgroundColor:
                        quizResult === 'correct' ? designTokens.colors.accent.success.main :
                        quizResult === 'incorrect' && flipped ? designTokens.colors.accent.warning.main :
                        designTokens.colors.primary[600],
                      color: designTokens.colors.base.white,
                      fontSize: designTokens.typography.fontSize.base,
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      border: 'none',
                      cursor: (!quizAnswer.trim() || quizResult === 'correct') ? 'not-allowed' : 'pointer',
                      opacity: (!quizAnswer.trim() || quizResult === 'correct') ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {quizResult === 'incorrect' && flipped ? 'Devam Et' : 'Kontrol Et'}
                  </button>
                </div>

                {quizResult === 'correct' && (
                  <p style={{
                    color: designTokens.colors.accent.success.main,
                    marginTop: designTokens.spacing[3],
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.semibold
                  }}>
                    Doğru cevap!
                  </p>
                )}

                {quizResult === 'incorrect' && flipped && (
                  <div style={{ marginTop: designTokens.spacing[3] }}>
                    <p style={{
                      color: designTokens.colors.accent.error.main,
                      fontSize: designTokens.typography.fontSize.sm,
                      fontWeight: designTokens.typography.fontWeight.semibold
                    }}>
                      Yanlış cevap!
                    </p>
                    <p style={{
                      fontSize: designTokens.typography.fontSize.sm,
                      marginTop: designTokens.spacing[2],
                      color: designTokens.colors.text.secondary
                    }}>
                      Kartın arkasına bak ve doğru cevabı yazıp devam et.
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: designTokens.spacing[4],
          marginTop: designTokens.spacing[4]
        }}>
          {words.map((word, index) => (
            <Card
              key={`${word.en}-${index}`}
              variant="elevated"
              clickable
              onClick={() => handleWordClick(index)}
            >
              <div style={{
                color: designTokens.colors.text.primary,
                fontSize: designTokens.typography.fontSize.lg,
                fontWeight: designTokens.typography.fontWeight.semibold
              }}>
                {word.en}
              </div>

              {selectedWordIndex === index && (
                <div style={{
                  color: designTokens.colors.text.secondary,
                  marginTop: designTokens.spacing[2],
                  fontSize: designTokens.typography.fontSize.base
                }}>
                  {word.tr}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(WordList);
