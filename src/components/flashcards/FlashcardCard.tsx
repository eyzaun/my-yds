import React from 'react';
import { FlashcardData } from '@/types/flashcard';

interface CardStyles {
  frontBackground: string;
  backBackground: string;
  textColor: string;
  notesColor: string;
  boxShadow: string;
  border: string;
  glow: string;
}

interface ThemeColors {
  accent: string;
  text: string;
  cardBackground: string;
}

interface FlashcardCardProps {
  currentCard: FlashcardData;
  flipped: boolean;
  isAnimating: boolean;
  cardWidth: number;
  cardHeight: number;
  cardStyles: CardStyles;
  colors: ThemeColors;
  handlers: {
    handleFlip: (e?: React.MouseEvent | React.TouchEvent) => void;
    handleRightClick: (e: React.MouseEvent) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
  };
  dimensions: {
    isMobile: boolean;
    isLandscape: boolean;
  };
  isFullscreen?: boolean;
  completed?: Record<string, boolean>;
  quizMode?: boolean;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  currentCard,
  flipped,
  cardWidth,
  cardHeight,
  cardStyles,
  colors,
  handlers,
  dimensions,
  isFullscreen = false,
  completed = {},
  quizMode = false
}) => {
  const { handleFlip, handleRightClick, handleTouchStart, handleTouchMove, handleTouchEnd } = handlers;
  const { isMobile, isLandscape } = dimensions;

  return (
    <div
      className="perspective-1000 mx-auto overflow-visible"
      style={{
        width: `${cardWidth}px`,
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: isFullscreen ? '20px' : '0'
      }}
    >
      <div
        className={`w-full transform-style-3d transition-transform duration-500 ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{
          height: `${cardHeight}px`,
          maxHeight: isLandscape ? "60vh" : "50vh",
          backgroundColor: 'transparent',
          cursor: quizMode ? 'default' : 'pointer'
        }}
        onClick={quizMode ? undefined : handleFlip}
        onContextMenu={quizMode ? undefined : handleRightClick}
        onTouchStart={quizMode ? undefined : handleTouchStart}
        onTouchMove={quizMode ? undefined : handleTouchMove}
        onTouchEnd={quizMode ? undefined : handleTouchEnd}
      >
        {/* Ön yüz */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8 backface-hidden transition-all duration-300 overflow-hidden flashcard-content"
          style={{ 
            backgroundColor: cardStyles.frontBackground,
            borderRadius: '12px',
            boxShadow: cardStyles.boxShadow,
            border: `1px solid ${colors.accent}15`,
            filter: flipped ? 'brightness(0.8)' : 'brightness(1)',
            boxSizing: 'border-box',
            textShadow: `0 0 10px ${colors.accent}40`,
          }}
        >
          <div className="text-center relative z-10 w-full">
            <p 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold card-text"
              style={{ 
                color: cardStyles.textColor,
                textShadow: `0 0 15px ${colors.accent}30`,
                fontSize: isMobile ? (isLandscape ? '1.75rem' : '1.5rem') : isFullscreen ? '3rem' : '2.25rem',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {currentCard.front}
            </p>
            {currentCard.notes && (
              <p className="text-sm mt-2 md:mt-4 opacity-70 card-notes" 
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
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.accent,
                  boxShadow: `0 0 10px ${colors.accent}50`
                }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Arka yüz */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8 backface-hidden rotate-y-180 transition-all duration-300 overflow-hidden flashcard-content"
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold card-text"
              style={{ 
                color: cardStyles.textColor,
                textShadow: `0 0 15px ${colors.accent}30`,
                fontSize: isMobile ? (isLandscape ? '1.75rem' : '1.5rem') : isFullscreen ? '3rem' : '2.25rem',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
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
  );
};

export default React.memo(FlashcardCard);