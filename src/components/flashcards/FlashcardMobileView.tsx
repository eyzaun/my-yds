import React from 'react';
import { FlashcardData } from '@/types/flashcard';
import QuizMode from './QuizMode';

interface ThemeColors {
  text: string;
  accent: string;
  background: string;
}

interface FlashcardState {
  currentIndex: number;
  flipped: boolean;
  completed: Record<string, boolean>;
  viewedCount: number;
  progressPercentage: number;
  isAnimating: boolean;
  canAdvance: boolean;
}

interface FlashcardHandlers {
  handleFlip: (e?: React.MouseEvent | React.TouchEvent) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRightClick: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  toggleFullscreen: () => void;
  handleCorrectAnswer: () => void;
  handleIncorrectAnswer: () => void;
  resetCardAndMoveNext: () => boolean;
}

interface FlashcardDimensions {
  cardWidth: number;
  cardHeight: number;
}

interface CardStyles {
  frontBackground: string;
  backBackground: string;
  textColor: string;
  notesColor: string;
  boxShadow: string;
  border: string;
  glow: string;
}

interface FlashcardMobileViewProps {
  flashcards: FlashcardData[];
  state: FlashcardState;
  handlers: FlashcardHandlers;
  dimensions: FlashcardDimensions;
  cardStyles: CardStyles;
  colors: ThemeColors;
}

const FlashcardMobileView: React.FC<FlashcardMobileViewProps> = ({
  flashcards,
  state,
  handlers,
  dimensions,
  cardStyles,
  colors
}) => {
  const { 
    currentIndex, flipped, completed, viewedCount, progressPercentage, isAnimating
  } = state;
  
  const {
    handleFlip, handleNext, handlePrevious, handleRightClick, handleTouchStart,
    handleTouchMove, handleTouchEnd, toggleFullscreen, handleCorrectAnswer,
    handleIncorrectAnswer, resetCardAndMoveNext
  } = handlers;
  
  const { cardWidth, cardHeight } = dimensions;
  
  const currentCard = flashcards[currentIndex];
  
  return (
    <div className="flex flex-col h-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: colors.background }}>
      {/* Header kısmı */}
      <div className="pt-3 px-3 pb-1">
        <div className="flex justify-between items-center mb-1">
          <div style={{ color: colors.text, fontSize: '0.8rem' }}>
            <span className="font-medium">{viewedCount}</span>
            <span className="opacity-70"> / {flashcards.length}</span>
          </div>
          
          <div className="flex items-center">
            <div style={{ color: colors.text, fontSize: '0.8rem' }}>
              <span className="font-medium">%{Math.round(progressPercentage)}</span>
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="ml-2 p-1 rounded-full hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
              aria-label="Tam ekran modu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${progressPercentage}%`, 
              backgroundColor: colors.accent
            }}
          />
        </div>
      </div>
      
      {/* Kartın bulunduğu orta alan */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 pb-2 overflow-y-auto">
        {/* Flashcard */}
        <div 
          className="perspective-1000 mx-auto overflow-visible mb-3 mt-2"
          style={{ 
            width: `${cardWidth}px`, 
            maxWidth: "100%"
          }}
        >
          <div 
            className={`w-full transform-style-3d cursor-pointer transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ 
              height: `${cardHeight}px`
            }}
            onClick={handleFlip}
            onContextMenu={handleRightClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center p-4 backface-hidden transition-all duration-300 overflow-hidden flashcard-content"
              style={{ 
                backgroundColor: cardStyles.frontBackground,
                borderRadius: '12px',
                boxShadow: cardStyles.boxShadow,
                border: `1px solid ${colors.accent}15`,
                filter: flipped ? 'brightness(0.8)' : 'brightness(1)'
              }}
            >
              <div className="text-center relative z-10 w-full">
                <p 
                  className="text-xl font-bold card-text"
                  style={{ 
                    color: cardStyles.textColor,
                    textShadow: `0 0 15px ${colors.accent}30`,
                    wordBreak: 'break-word'
                  }}
                >
                  {currentCard.front}
                </p>
                
                {currentCard.notes && (
                  <p className="text-xs mt-2 opacity-70 card-notes" 
                    style={{ color: cardStyles.notesColor }}>
                    {currentCard.notes}
                  </p>
                )}
              </div>
              
              <div 
                className="absolute inset-0 rounded-xl opacity-40 pointer-events-none"
                style={{
                  boxShadow: cardStyles.glow,
                  background: `radial-gradient(circle at center, ${colors.accent}01 0%, transparent 70%)`,
                }}
              />
              
              {completed[currentCard.id] && (
                <div className="absolute top-2 right-2 text-white w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.accent,
                      boxShadow: `0 0 10px ${colors.accent}50`
                    }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center p-4 backface-hidden rotate-y-180 transition-all duration-300 overflow-hidden flashcard-content"
              style={{ 
                backgroundColor: cardStyles.backBackground,
                borderRadius: '12px',
                boxShadow: cardStyles.boxShadow,
                border: `1px solid ${colors.accent}15`,
                textShadow: `0 0 10px ${colors.accent}40`,
              }}
            >
              <div className="text-center relative z-10 w-full">
                <p 
                  className="text-xl font-bold card-text"
                  style={{ 
                    color: cardStyles.textColor,
                    textShadow: `0 0 15px ${colors.accent}30`,
                    wordBreak: 'break-word'
                  }}
                >
                  {currentCard.back}
                </p>
              </div>
              
              <div 
                className="absolute inset-0 rounded-xl opacity-40 pointer-events-none"
                style={{
                  boxShadow: cardStyles.glow,
                  background: `radial-gradient(circle at center, ${colors.accent}01 0%, transparent 70%)`,
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Navigasyon Butonları */}
        <div className="flex justify-center space-x-6">
          <button 
            className="p-2 rounded-lg opacity-75 hover:opacity-100 transition-all"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isAnimating}
            style={{
              visibility: currentIndex === 0 ? 'hidden' : 'visible',
              backgroundColor: `${colors.accent}20`,
              color: colors.accent
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center px-2 py-1 rounded-full text-xs" 
            style={{ backgroundColor: `${colors.accent}15`, color: colors.text }}>
            {currentIndex + 1} / {flashcards.length}
          </div>

          <button 
            className="p-2 rounded-lg opacity-75 hover:opacity-100 transition-all"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1 || isAnimating || !state.canAdvance}
            style={{
              visibility: currentIndex === flashcards.length - 1 ? 'hidden' : 'visible',
              backgroundColor: `${colors.accent}20`,
              opacity: state.canAdvance ? 0.9 : 0.3,
              color: colors.accent
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Altta bilgi */}
        <div className="text-center mt-1 mb-1 text-xs" style={{ color: colors.text }}>
          <span className="inline-block px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}15` }}>
            {flipped ? 'Sonraki karta geçmek için → tuşuna basın' : 'Kartı çevirmek için dokunun'}
          </span>
        </div>
      </div>
      
      {/* Quiz giriş alanı */}
      <div className="py-2 px-3" style={{ backgroundColor: colors.background, borderTop: '1px solid rgba(100, 100, 100, 0.3)' }}>
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
      
      <style jsx global>{`
        body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
          touch-action: none;
        }
        
        .always-focused input:not(:focus) {
          opacity: 0;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 1px;
          height: 1px;
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
      `}</style>
    </div>
  );
};

export default React.memo(FlashcardMobileView);