'use client';

import React, { useEffect, useRef } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useTheme } from '@/hooks/useTheme';
import QuizMode from '@/components/flashcards/QuizMode';
import FullscreenWrapper from '@/components/flashcards/FullscreenWrapper';
import useFlashcardState from '@/hooks/useFlashcardState';
import FlashcardCard from '@/components/flashcards/FlashcardCard';
import FlashcardControl from '@/components/flashcards/FlashcardControl';
import FlashcardMobileView from '@/components/flashcards/FlashcardMobileView';
import { useFlashcardFullscreen } from '@/contexts/FlashcardFullscreenContext';

interface FlashcardDeckProps {
  flashcards: FlashcardData[];
  onReset?: () => void;
  categoryId?: string;
  initialIndex?: number;
  quizMode?: boolean;
}

export default function FlashcardDeck({
  flashcards = [],
  onReset,
  categoryId = 'default',
  initialIndex = 0,
  quizMode = false
}: FlashcardDeckProps) {
  const { tokens } = useTheme();
  const flashcardContainerRef = useRef<HTMLDivElement>(null);
  const { setIsFullscreen } = useFlashcardFullscreen();

  const {
    state,
    handlers,
    dimensions,
    cardStyles,
  } = useFlashcardState({
    flashcards,
    initialIndex,
    categoryId,
    quizMode,
    onReset
  });

  const {
    currentIndex, flipped, isFullscreen, canAdvance, completed
  } = state;

  const {
    handleFlip, handleNext, handlePrevious, handleCorrectAnswer,
    handleIncorrectAnswer, resetCardAndMoveNext, handleReset,
    handleRightClick, handleTouchStart, handleTouchMove, handleTouchEnd,
    toggleFullscreen
  } = handlers;
  
  const { isMobile, isLandscape, cardWidth, cardHeight,
          fullscreenCardWidth, fullscreenCardHeight } = dimensions;

  // Tam ekran modunu context'e bildir
  useEffect(() => {
    setIsFullscreen(isFullscreen);
  }, [isFullscreen, setIsFullscreen]);

  // Global stiller - sadece bir kere oluşturulur
  useEffect(() => {
    const className = 'flashcard-global-styles';
    
    // Stil zaten varsa, tekrar oluşturma
    if (document.getElementById(className)) return;
    
    const style = document.createElement('style');
    style.id = className;
    style.innerHTML = `
      .card-text, .card-notes {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        caret-color: transparent;
      }
      
      .flashcard-content * {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        caret-color: transparent;
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .transform-style-3d {
        transform-style: preserve-3d;
      }
      
      .backface-hidden {
        backface-visibility: hidden;
      }
      
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.getElementById(className)) {
        document.head.removeChild(document.getElementById(className)!);
      }
    };
  }, []);
  
  // Kart bulunmaması durumu
  if (!flashcards.length) {
    return <div className="text-center p-8" style={{ color: tokens.colors.text.primary }}>Henüz kart bulunmuyor.</div>;
  }
  
  // MOBİL QUIZ MODU ÖZEL GÖRÜNÜM
  if (isMobile && quizMode && !isFullscreen) {
    return (
      <FlashcardMobileView
        flashcards={flashcards}
        state={state}
        handlers={handlers}
        dimensions={dimensions}
        cardStyles={cardStyles}
        colors={tokens.colors}
      />
    );
  }
  
  // Ana içerik
  const renderMainContent = () => (
    <>
      <FlashcardControl
        state={state}
        handlers={handlers}
        colors={tokens.colors}
        shouldRenderBottomButtons={isMobile}
        flashcards={flashcards}
      />

      <FlashcardCard
        currentCard={flashcards[currentIndex]}
        flipped={flipped}
        isAnimating={state.isAnimating}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardStyles={cardStyles}
        colors={tokens.colors}
        handlers={{handleFlip, handleRightClick, handleTouchStart, handleTouchMove, handleTouchEnd}}
        dimensions={{isMobile, isLandscape}}
        completed={completed}
      />
      
      {/* Quiz modu */}
      {quizMode && (
        <div className="mt-5 mb-5">
          <QuizMode 
            flashcards={flashcards}
            currentIndex={currentIndex}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
            onMoveNext={resetCardAndMoveNext}
            isFlipped={flipped}
          />
        </div>
      )}

      {/* Alt bilgiler */}
      <div className="text-center text-sm" style={{ color: tokens.colors.text.primary, marginTop: tokens.spacing[4] }}>
        <span className="inline-block rounded-full" style={{
          backgroundColor: `${tokens.colors.primary[500]}15`,
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`
        }}>
          {quizMode ? 'Doğru cevabı görmek için kartın üzerine tıklayın' : 'Kelime çevirmek için kartın üzerine tıklayın'}
        </span>
      </div>
      
      <div className="text-center" style={{ marginTop: tokens.spacing[2] }}>
        <Button
          variant="secondary"
          size="small"
          onClick={handleReset}
        >
          Tüm kartları sıfırla
        </Button>
      </div>
    </>
  );

  // Tam ekran içeriği
  const renderFullscreenContent = () => (
    <>
      <div className="flex-grow">
        <FlashcardCard
          currentCard={flashcards[currentIndex]}
          flipped={flipped}
          isAnimating={state.isAnimating}
          cardWidth={fullscreenCardWidth}
          cardHeight={fullscreenCardHeight}
          cardStyles={cardStyles}
          colors={tokens.colors}
          handlers={{handleFlip, handleRightClick, handleTouchStart, handleTouchMove, handleTouchEnd}}
          dimensions={{isMobile, isLandscape}}
          isFullscreen={true}
          completed={completed}
        />
      </div>

      {quizMode && (
        <div className="fullscreen-quiz-form">
          <QuizMode 
            flashcards={flashcards}
            currentIndex={currentIndex}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
            onMoveNext={resetCardAndMoveNext}
            isFlipped={flipped}
            alwaysKeepKeyboardOpen={true}
            isMobileMode={true}
          />
        </div>
      )}

      <div className="nav-buttons-wrapper flex items-center justify-center" style={{ gap: tokens.spacing[6] }}>
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || state.isAnimating}
          style={{
            visibility: currentIndex === 0 ? 'hidden' : 'visible',
            padding: tokens.spacing[1],
            borderRadius: '50%',
            opacity: 0.75
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        <div className="text-center rounded-full text-sm" style={{
          backgroundColor: `${tokens.colors.primary[500]}15`,
          color: tokens.colors.text.primary,
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`
        }}>
          {currentIndex + 1} / {flashcards.length}
        </div>

        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1 || state.isAnimating || !canAdvance}
          style={{
            visibility: currentIndex === flashcards.length - 1 ? 'hidden' : 'visible',
            padding: tokens.spacing[1],
            borderRadius: '50%',
            opacity: canAdvance ? 0.75 : 0.3
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {isFullscreen ? (
        <FullscreenWrapper 
          isActive={isFullscreen} 
          onExit={toggleFullscreen}
          isQuizMode={quizMode}
        >
          {renderFullscreenContent()}
        </FullscreenWrapper>
      ) : (
        <div className="container mx-auto px-4 py-8 relative" ref={flashcardContainerRef}>
          <div className="max-w-4xl mx-auto">
            {renderMainContent()}
          </div>
        </div>
      )}
    </>
  );
}