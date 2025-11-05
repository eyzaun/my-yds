'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Word {
  en: string;
  tr: string;
}

interface FlashCardProps {
  words: Word[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  isQuizMode?: boolean;
  forceFlipped?: boolean;
}

const MemoizedFlashCard = React.memo(function FlashCard({
  words,
  currentIndex,
  onNext,
  onPrevious,
  isQuizMode = false,
  forceFlipped
}: FlashCardProps) {
  const { colors } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [localWordIndex, setLocalWordIndex] = useState(currentIndex);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(false);
  
  // Minimum swipe mesafesi
  const minSwipeDistance = 50;
  
  const currentWord = words[localWordIndex];

  // Pencere boyutu değiştiğinde boyutları güncelle
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 640); // 640px altı mobil olarak kabul edelim (sm breakpoint)
    };

    handleResize(); // İlk render'da çalıştır
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // currentIndex dışarıdan değişirse local state'i güncelle
  useEffect(() => {
    if (!isAnimating) {
      setLocalWordIndex(currentIndex);
    }
  }, [currentIndex, isAnimating]);

  // forceFlipped prop'u ile dışarıdan kart çevirme kontrolü
  useEffect(() => {
    if (forceFlipped !== undefined) {
      setIsFlipped(forceFlipped);
    }
  }, [forceFlipped]);
  
  // Kart çevirme işlemi
  const handleFlip = useCallback((e?: React.MouseEvent | KeyboardEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (isAnimating) return;

    setIsAnimating(true);
    setIsFlipped(prev => !prev);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  // Sonraki karta geçiş - düzeltilmiş sıralama
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    if (currentIndex >= words.length - 1) return;
    
    setIsAnimating(true);
    
    // Eğer kart arka yüzündeyse, önce ön yüze çevir
    if (isFlipped) {
      setIsFlipped(false);
      
      // Flip animasyonu bittikten sonra kelimeyi değiştir
      setTimeout(() => {
        onNext(); // Parent'a bildir
        setLocalWordIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Kart zaten ön yüzdeyse, doğrudan kelimeyi değiştir
      onNext(); // Parent'a bildir
      setLocalWordIndex(prev => prev + 1);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, isFlipped, currentIndex, words.length, onNext]);

  // Önceki karta dön - düzeltilmiş sıralama
  const handlePrevious = useCallback(() => {
    if (isAnimating) return;
    if (currentIndex <= 0) return;
    
    setIsAnimating(true);
    
    // Eğer kart arka yüzündeyse, önce ön yüze çevir
    if (isFlipped) {
      setIsFlipped(false);
      
      // Flip animasyonu bittikten sonra kelimeyi değiştir
      setTimeout(() => {
        onPrevious(); // Parent'a bildir
        setLocalWordIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Kart zaten ön yüzdeyse, doğrudan kelimeyi değiştir
      onPrevious(); // Parent'a bildir
      setLocalWordIndex(prev => prev - 1);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, isFlipped, currentIndex, onPrevious]);

  // Klavye kontrolleri
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAnimating) return;

      switch (e.key) {
        case 'ArrowRight':
          // Quiz modunda ok tuşları çalışmaz
          if (!isQuizMode) {
            e.preventDefault();
            handleNext();
          }
          break;
        case 'ArrowLeft':
          // Quiz modunda ok tuşları çalışmaz
          if (!isQuizMode) {
            e.preventDefault();
            handlePrevious();
          }
          break;
        case ' ':
        case 'Enter':
          // Quiz modunda space/enter tuşları da çalışmaz (quiz input'u kullanılacak)
          if (!isQuizMode) {
            e.preventDefault();
            handleFlip();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleFlip, handleNext, handlePrevious, isAnimating, isQuizMode]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < words.length - 1) {
      handleNext();
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    } else if (Math.abs(distance) < minSwipeDistance / 2) {
      handleFlip();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Boyut hesaplamaları
  const extraWidth = Math.max(0, windowWidth - 400) / 3; // 400px'den sonra 1/3 oranında artış
  
  // Mobil cihazlarda kartın daha büyük görünmesi için genişliği ayarlayalım
  // Masaüstünde max 500px, mobilde ise ekranın %90'ını kaplar
  const cardWidth = isMobile
    ? windowWidth * 0.90 // Mobilde ekranın %90'ı
    : Math.min(windowWidth - 100, 400 + extraWidth); // Masaüstünde maksimum 400px + ekstra genişlik
  
  // Yükseklik hesaplaması - kart genişliğine göre orantılı
  // Standart 400px genişlik için yükseklik 215px olsun
  const aspectRatio = 215 / 400; // Kart orantısı
  const cardHeight = cardWidth * aspectRatio;

  // Butonların stili
  const buttonStyle = {
    backgroundColor: colors.cardBackground,
    color: colors.text,
  };

  // Butonlar için ortak stil
  const navigationButtonClass = "flex items-center justify-center h-12 w-12 rounded-full shadow-lg transition-colors duration-300";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Mobil ve masaüstü için farklı düzenler */}
      {isMobile ? (
        /* Mobil düzen - Kartlar ve butonlar alt alta */
        <div className="w-full flex flex-col items-center">
          {/* Flash Card - Responsive ve orantılı */}
          <div 
            className="perspective-1000 mb-4 w-full" 
            style={{ maxWidth: `${cardWidth}px` }}
          >
            <div
              className={`w-full transform-style-3d cursor-pointer transition-transform duration-300 shadow-xl
                        ${isFlipped ? 'rotate-y-180' : ''}`}
              style={{
                height: `${cardHeight}px`,
              }}
              onClick={handleFlip}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="button"
              tabIndex={0}
              aria-label={`Flash card for word: ${currentWord.en}`}
            >
              {/* Front Side */}
              <div className="absolute w-full h-full backface-hidden rounded-xl p-4 flex flex-col items-center justify-center shadow-lg"
                  style={{ backgroundColor: colors.cardBackground }}>
                <h2 style={{ color: colors.text }} className="text-4xl sm:text-5xl font-bold text-center">
                  {currentWord.en}
                </h2>
              </div>

              {/* Back Side */}
              <div className="absolute w-full h-full backface-hidden rounded-xl p-4 flex flex-col items-center justify-center shadow-lg rotate-y-180"
                  style={{ backgroundColor: colors.accent }}>
                <h2 style={{ color: colors.text }} className="text-4xl sm:text-5xl font-bold text-center">
                  {currentWord.tr}
                </h2>
              </div>
            </div>
          </div>

          {/* Navigasyon Butonları - Alt Alta */}
          <div className="flex items-center justify-center space-x-6 mt-2 mb-4">
            <button
              onClick={handlePrevious}
              className={navigationButtonClass}
              style={{
                ...buttonStyle,
                opacity: (currentIndex === 0 || isAnimating || isQuizMode) ? 0.5 : 1,
                cursor: (currentIndex === 0 || isAnimating || isQuizMode) ? 'not-allowed' : 'pointer'
              }}
              disabled={currentIndex === 0 || isAnimating || isQuizMode}
              aria-label="Önceki kelime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.cardBackground, color: colors.text }}>
              {currentIndex + 1} / {words.length}
            </div>

            <button
              onClick={handleNext}
              className={navigationButtonClass}
              style={{
                ...buttonStyle,
                opacity: (currentIndex === words.length - 1 || isAnimating || isQuizMode) ? 0.5 : 1,
                cursor: (currentIndex === words.length - 1 || isAnimating || isQuizMode) ? 'not-allowed' : 'pointer'
              }}
              disabled={currentIndex === words.length - 1 || isAnimating || isQuizMode}
              aria-label="Sonraki kelime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Masaüstü düzen - Yanlarda butonlar */
        <div className="relative w-full flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-full px-4">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className={`${navigationButtonClass} mr-4`}
              style={{
                ...buttonStyle,
                opacity: (currentIndex === 0 || isAnimating || isQuizMode) ? 0.5 : 1,
                cursor: (currentIndex === 0 || isAnimating || isQuizMode) ? 'not-allowed' : 'pointer'
              }}
              disabled={currentIndex === 0 || isAnimating || isQuizMode}
              aria-label="Önceki kelime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Flash Card - Responsive ve orantılı */}
            <div 
              className="flex-grow perspective-1000 mb-2" 
              style={{ maxWidth: `${cardWidth}px` }}
            >
              <div
                className={`w-full transform-style-3d cursor-pointer transition-transform duration-300 shadow-xl
                          ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{
                  height: `${cardHeight}px`,
                }}
                onClick={handleFlip}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                role="button"
                tabIndex={0}
                aria-label={`Flash card for word: ${currentWord.en}`}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full backface-hidden rounded-xl p-4 flex flex-col items-center justify-center shadow-lg"
                    style={{ backgroundColor: colors.cardBackground }}>
                  <h2 style={{ color: colors.text }} className="text-4xl sm:text-5xl font-bold text-center">
                    {currentWord.en}
                  </h2>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full backface-hidden rounded-xl p-4 flex flex-col items-center justify-center shadow-lg rotate-y-180"
                    style={{ backgroundColor: colors.accent }}>
                  <h2 style={{ color: colors.text }} className="text-4xl sm:text-5xl font-bold text-center">
                    {currentWord.tr}
                  </h2>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className={`${navigationButtonClass} ml-4`}
              style={{
                ...buttonStyle,
                opacity: (currentIndex === words.length - 1 || isAnimating || isQuizMode) ? 0.5 : 1,
                cursor: (currentIndex === words.length - 1 || isAnimating || isQuizMode) ? 'not-allowed' : 'pointer'
              }}
              disabled={currentIndex === words.length - 1 || isAnimating || isQuizMode}
              aria-label="Sonraki kelime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Kelime çevirme ipucu */}
      <div style={{ color: colors.text, opacity: 0.8 }} className="text-sm mb-2 text-center">
        {isMobile ? 
          "Kelime çevirmek için kartın üzerine dokunun veya yanlara kaydırın" : 
          "Kelime çevirmek için kartın üzerine tıklayın"
        }
      </div>
    </div>
  );
});

MemoizedFlashCard.displayName = 'FlashCard';

export default MemoizedFlashCard;