import React from 'react';
import { FlashcardData } from '@/types/flashcard';

interface ThemeColors {
  text: string;
  accent: string;
  cardBackground: string;
}

interface FlashcardControlProps {
  state: {
    currentIndex: number;
    isAnimating: boolean;
    canAdvance: boolean;
    viewedCount: number;
    progressPercentage: number;
  };
  handlers: {
    handlePrevious: () => void;
    handleNext: () => void;
    toggleFullscreen: () => void;
  };
  colors: ThemeColors;
  shouldRenderBottomButtons: boolean;
  flashcards: FlashcardData[];
}

const FlashcardControl: React.FC<FlashcardControlProps> = ({
  state,
  handlers,
  colors,
  shouldRenderBottomButtons,
  flashcards
}) => {
  const { currentIndex, isAnimating, canAdvance, viewedCount, progressPercentage } = state;
  const { handlePrevious, handleNext, toggleFullscreen } = handlers;
  
  return (
    <>
      {/* Üst bilgi çubuğu */}
      <div className="mb-4 mt-2 flex flex-wrap justify-between items-center">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div style={{ color: colors.text }}>
              <span className="font-medium">Çalışılan: {viewedCount}</span>
              <span className="opacity-70"> / {flashcards.length}</span>
            </div>
            
            <div style={{ color: colors.text }}>
              <span className="font-medium">İlerleme: %{Math.round(progressPercentage)}</span>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${progressPercentage}%`, 
                backgroundColor: colors.accent
              }}
            />
          </div>
        </div>
        
        <button 
          onClick={toggleFullscreen}
          className="ml-4 p-2 rounded-full hover:bg-opacity-80 transition-colors"
          style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
          aria-label="Tam ekran modu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Önceki/Sonraki butonları - Mobil olmayan cihazlar için */}
      {!shouldRenderBottomButtons && (
        <>
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isAnimating}
            style={{
              visibility: currentIndex === 0 ? 'hidden' : 'visible',
              backgroundColor: colors.cardBackground,
              boxShadow: `0 0 15px ${colors.accent}20, 0 0 5px ${colors.accent}10`,
              transform: `translateY(-50%) ${currentIndex === 0 ? 'scale(0.9)' : 'scale(1)'}`,
              marginLeft: '-10px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={colors.accent}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1 || isAnimating || !canAdvance}
            style={{
              visibility: currentIndex === flashcards.length - 1 ? 'hidden' : 'visible',
              backgroundColor: colors.cardBackground,
              boxShadow: `0 0 15px ${colors.accent}20, 0 0 5px ${colors.accent}10`,
              transform: `translateY(-50%) ${currentIndex === flashcards.length - 1 ? 'scale(0.9)' : 'scale(1)'}`,
              marginRight: '-10px',
              opacity: canAdvance ? 0.75 : 0.3
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={colors.accent}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Alt kontroller - Mobil cihazlar için */}
      {shouldRenderBottomButtons && (
        <div className="flex justify-center space-x-4 mt-2">
          <button 
            className="p-3 rounded-lg opacity-75 hover:opacity-100 transition-all duration-300"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isAnimating}
            style={{
              visibility: currentIndex === 0 ? 'hidden' : 'visible',
              backgroundColor: colors.cardBackground,
              boxShadow: `0 0 15px ${colors.accent}20, 0 0 5px ${colors.accent}10`,
              opacity: 0.9,
              color: colors.accent
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            className="p-3 rounded-lg opacity-75 hover:opacity-100 transition-all duration-300"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1 || isAnimating || !canAdvance}
            style={{
              visibility: currentIndex === flashcards.length - 1 ? 'hidden' : 'visible',
              backgroundColor: colors.cardBackground,
              boxShadow: `0 0 15px ${colors.accent}20, 0 0 5px ${colors.accent}10`,
              opacity: canAdvance ? 0.9 : 0.3,
              color: colors.accent
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default React.memo(FlashcardControl);