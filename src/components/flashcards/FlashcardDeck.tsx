'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { useTheme } from '@/contexts/ThemeContext';
import QuizMode from '@/components/flashcards/QuizMode';
import FullscreenWrapper from '@/components/flashcards/FullscreenWrapper';
import useFlashcardState from '@/hooks/useFlashcardState';
import FlashcardCard from '@/components/flashcards/FlashcardCard';
import FlashcardControl from '@/components/flashcards/FlashcardControl';
import FlashcardMobileView from '@/components/flashcards/FlashcardMobileView';
import ListView from '@/components/flashcards/ListView';
import TestView from '@/components/flashcards/TestView';

/**
 * Quiz sorusu tipi - Test modu için
 */
export interface QuizQuestion {
  id: number;
  word: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
}

/**
 * View mode tipi - Hangi görünüm modunda olduğumuzu belirtir
 */
export type ViewMode = 'card' | 'list' | 'test';

/**
 * FlashcardDeck mode tipi
 * - 'flashcard': Kendi kartlarım modu (Excel'den yüklenen kartlar)
 * - 'category': Kategori modu (statik kelime listeleri)
 */
export type DeckMode = 'flashcard' | 'category';

interface FlashcardDeckProps {
  flashcards: FlashcardData[];
  onReset?: () => void;
  categoryId?: string;
  initialIndex?: number;
  quizMode?: boolean;

  // YENİ: Mode desteği
  mode?: DeckMode;
  onClose?: () => void;

  // YENİ: Kategori modu özellikleri
  showListView?: boolean;
  showTestMode?: boolean;
  testQuestions?: QuizQuestion[];
  onTestComplete?: (score: number) => void;

  // YENİ: Initial view mode
  initialViewMode?: ViewMode;
}

export default function FlashcardDeck({
  flashcards = [],
  onReset,
  categoryId = 'default',
  initialIndex = 0,
  quizMode = false,
  // YENİ prop'lar
  mode = 'flashcard',
  onClose,
  showListView = false,
  showTestMode = false,
  testQuestions = [],
  onTestComplete,
  initialViewMode = 'card'
}: FlashcardDeckProps) {
  const { colors } = useTheme();
  const flashcardContainerRef = useRef<HTMLDivElement>(null);

  // YENİ: View mode state - kategori modunda kullanılır
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  
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
    return <div className="text-center p-8" style={{ color: colors.text }}>Henüz kart bulunmuyor.</div>;
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
        colors={colors}
      />
    );
  }
  
  // YENİ: View Mode Toggle Renderer - Kategori modunda görünüm seçici
  const renderViewModeToggle = () => {
    if (mode !== 'category') return null;

    return (
      <div className="flex justify-center gap-2 mb-6">
        {showListView && (
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-300"
            style={{
              backgroundColor: viewMode === 'list' ? colors.accent : colors.cardBackground,
              color: viewMode === 'list' ? 'white' : colors.text
            }}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Liste
            </span>
          </button>
        )}

        <button
          onClick={() => setViewMode('card')}
          className="px-4 py-2 rounded-lg text-sm transition-colors duration-300"
          style={{
            backgroundColor: viewMode === 'card' ? colors.accent : colors.cardBackground,
            color: viewMode === 'card' ? 'white' : colors.text
          }}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Kart
          </span>
        </button>

        {showTestMode && (
          <button
            onClick={() => setViewMode('test')}
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-300"
            style={{
              backgroundColor: viewMode === 'test' ? colors.accent : colors.cardBackground,
              color: viewMode === 'test' ? 'white' : colors.text
            }}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Test
            </span>
          </button>
        )}
      </div>
    );
  };

  // YENİ: Liste görünümü renderer
  const renderListView = () => {
    // Çalışılan kartları viewed state'inden al
    const studiedCardsSet = new Set(
      Object.keys(state.viewed)
        .filter(key => state.viewed[key])
        .map(key => {
          // Key formatı: cardId veya index
          const cardIndex = flashcards.findIndex(card => card.id === key);
          return cardIndex !== -1 ? cardIndex : parseInt(key);
        })
        .filter(index => !isNaN(index))
    );

    // Kart çalışıldı olarak işaretle
    const handleCardStudied = (index: number) => {
      if (flashcards[index]) {
        const card = flashcards[index];
        handlers.handleComplete(); // Mevcut kartı complete olarak işaretle

        // Viewed state'ini güncelle
        state.viewed[card.id] = true;
      }
    };

    return (
      <ListView
        flashcards={flashcards}
        studiedCards={studiedCardsSet}
        onCardStudied={handleCardStudied}
      />
    );
  };

  // YENİ: Test görünümü renderer
  const renderTestView = () => {
    // Test soruları yoksa uyarı göster
    if (!testQuestions || testQuestions.length === 0) {
      return (
        <div className="text-center p-8" style={{ color: colors.text }}>
          <p className="mb-4">Bu kategori için test soruları bulunmuyor.</p>
        </div>
      );
    }

    return (
      <TestView
        questions={testQuestions}
        flashcards={flashcards}
        onComplete={onTestComplete}
        showWordMeanings={true}
      />
    );
  };

  // Ana içerik
  const renderMainContent = () => (
    <>
      {/* View mode toggle - sadece kategori modunda göster */}
      {renderViewModeToggle()}

      {/* ViewMode'a göre içeriği render et */}
      {mode === 'category' && viewMode === 'list' && renderListView()}
      {mode === 'category' && viewMode === 'test' && renderTestView()}

      {/* Kart görünümü - flashcard modunda veya card viewMode'da göster */}
      {(mode === 'flashcard' || viewMode === 'card') && (
        <>
          <FlashcardControl
            state={state}
            handlers={handlers}
            colors={colors}
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
            colors={colors}
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
          <div className="text-center mt-4 sm:mt-6 text-sm" style={{ color: colors.text }}>
            <span className="inline-block px-4 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}15` }}>
              {quizMode ? 'Doğru cevabı görmek için kartın üzerine tıklayın' : 'Kelime çevirmek için kartın üzerine tıklayın'}
            </span>
          </div>

          <div className="mt-3 sm:mt-4 text-center">
            <button
              className="text-sm px-3 py-1 rounded-lg hover:bg-opacity-20 transition-all duration-300"
              onClick={handleReset}
              style={{
                color: colors.accent,
                backgroundColor: `${colors.accent}10`,
              }}
            >
              Tüm kartları sıfırla
            </button>
          </div>
        </>
      )}
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
          colors={colors}
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

      <div className="nav-buttons-wrapper flex items-center justify-center gap-4">
        <button 
          className="p-2 rounded-full opacity-75 hover:opacity-100 transition-all"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || state.isAnimating}
          style={{
            visibility: currentIndex === 0 ? 'hidden' : 'visible',
            backgroundColor: `${colors.accent}30`,
            color: colors.accent
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${colors.accent}15`, color: colors.text }}>
          {currentIndex + 1} / {flashcards.length}
        </div>

        <button 
          className="p-2 rounded-full opacity-75 hover:opacity-100 transition-all"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1 || state.isAnimating || !canAdvance}
          style={{
            visibility: currentIndex === flashcards.length - 1 ? 'hidden' : 'visible',
            backgroundColor: `${colors.accent}30`,
            opacity: canAdvance ? 0.9 : 0.3,
            color: colors.accent
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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