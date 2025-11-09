import { useState, useEffect, useCallback } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { designTokens } from '@/styles/design-tokens';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface UseFlashcardStateProps {
  flashcards: FlashcardData[];
  initialIndex: number;
  categoryId: string;
  quizMode: boolean;
  onReset?: () => void;
}

interface FlashcardStyles {
  frontBackground: string;
  backBackground: string;
  textColor: string;
  notesColor: string;
  boxShadow: string;
  border: string;
  glow: string;
}

interface FlashcardStateReturn {
  state: {
    currentIndex: number;
    flipped: boolean;
    completed: Record<string, boolean>;
    viewed: Record<string, boolean>;
    isAnimating: boolean;
    touchStart: number | null;
    touchEnd: number | null;
    canAdvance: boolean;
    isFullscreen: boolean;
    windowDimensions: {
      width: number;
      height: number;
      isLandscape: boolean;
    };
    viewedCount: number;
    progressPercentage: number;
  };
  handlers: {
    handleFlip: (e?: React.MouseEvent | React.TouchEvent) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    resetCardAndMoveNext: () => boolean;
    handleComplete: () => void;
    handleReset: () => Promise<void>;
    handleRightClick: (e: React.MouseEvent) => void;
    handleCorrectAnswer: () => void;
    handleIncorrectAnswer: () => void;
    toggleFullscreen: () => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
  };
  dimensions: {
    isMobile: boolean;
    isTablet: boolean;
    isLandscape: boolean;
    cardWidth: number;
    cardHeight: number;
    fullscreenCardWidth: number;
    fullscreenCardHeight: number;
  };
  cardStyles: FlashcardStyles;
}

export default function useFlashcardState({
  flashcards,
  initialIndex,
  categoryId,
  quizMode,
  onReset
}: UseFlashcardStateProps): FlashcardStateReturn {
  const safeInitialIndex = initialIndex >= 0 && initialIndex < flashcards.length ? initialIndex : 0;
  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [viewed, setViewed] = useState<Record<string, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [user] = useAuthState(auth);
  const [canAdvance, setCanAdvance] = useState(!quizMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isLandscape: typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  });

  // Ekran boyutu değişikliklerini izle
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  // İlk yükleme ve index değişikliği
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < flashcards.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, flashcards.length]);

  // Quiz modu değiştiğinde canAdvance durumunu güncelle
  useEffect(() => {
    setCanAdvance(!quizMode);
  }, [quizMode, currentIndex]);

  const cardStyles: FlashcardStyles = {
    frontBackground: '#2a2a2a',
    backBackground: '#1c1c1c',
    textColor: designTokens.colors.accent || '#06b6d4',
    notesColor: '#a3a3a3',
    boxShadow: `0 8px 32px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.05)`,
    border: 'none',
    glow: `0 0 25px ${designTokens.colors.accent}30, 0 0 5px ${designTokens.colors.accent}10`
  };

  const minSwipeDistance = 50;

  // Firebase'den ilerleme durumunu yükle
  useEffect(() => {
    const loadSavedProgress = async () => {
      if (!user || !flashcards.length) return;
      
      try {
        const userProgressRef = doc(db, 'userProgress', user.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (userProgressDoc.exists()) {
          const userData = userProgressDoc.data();
          
          if (userData[categoryId]) {
            const { index, viewedCards, completedCards } = userData[categoryId];
            
            if (typeof index === 'number' && index < flashcards.length) {
              setCurrentIndex(index);
            }
            
            if (viewedCards) setViewed(viewedCards);
            if (completedCards) setCompleted(completedCards);
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };
    
    loadSavedProgress();
  }, [user, flashcards, categoryId]);

  // İlerleme durumunu Firebase'e kaydet
  const saveProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      const userProgressRef = doc(db, 'userProgress', user.uid);
      const userProgressDoc = await getDoc(userProgressRef);
      
      const progressData = {
        index: currentIndex,
        timestamp: new Date(),
        viewedCards: viewed,
        completedCards: completed,
        totalCards: flashcards.length,
        viewedCount: Object.values(viewed).filter(Boolean).length
      };
      
      if (userProgressDoc.exists()) {
        await updateDoc(userProgressRef, {
          [categoryId]: progressData
        });
      } else {
        await setDoc(userProgressRef, {
          [categoryId]: progressData
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [user, currentIndex, viewed, completed, flashcards.length, categoryId]);

  // İlerleme değiştiğinde kaydet
  useEffect(() => {
    if (flashcards.length > 0) {
      saveProgress();
    }
  }, [currentIndex, viewed, completed, saveProgress, flashcards.length]);

  // Kart çevirme
  const handleFlip = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (isAnimating) return;

    setIsAnimating(true);
    setFlipped(prev => !prev);

    if (!flipped && flashcards.length > 0) {
      const currentCard = flashcards[currentIndex];
      setViewed(prev => ({
        ...prev,
        [currentCard.id]: true
      }));
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, flipped, currentIndex, flashcards]);

  // Sonraki karta geçme
  const handleNext = useCallback(() => {
    if (isAnimating || !canAdvance) return;
    if (currentIndex >= flashcards.length - 1) return;

    setIsAnimating(true);

    const currentCard = flashcards[currentIndex];
    setViewed(prev => ({
      ...prev,
      [currentCard.id]: true
    }));

    if (flipped) {
      setFlipped(false);

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setCurrentIndex(prev => prev + 1);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, flipped, currentIndex, canAdvance, flashcards]);

  // Kartı sıfırlayıp sonraki karta geçme fonksiyonu (Enter tuşu için)
  const resetCardAndMoveNext = useCallback(() => {
    if (isAnimating || currentIndex >= flashcards.length - 1) return false;
    
    setIsAnimating(true);
    
    if (flashcards.length > 0) {
      const currentCard = flashcards[currentIndex];
      setViewed(prev => ({
        ...prev,
        [currentCard.id]: true
      }));
    }
    
    setFlipped(false);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setCanAdvance(!quizMode);
    }, 300);
    
    return true;
  }, [isAnimating, currentIndex, flashcards, quizMode]);

  // Önceki karta geçme
  const handlePrevious = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;

    setIsAnimating(true);

    if (flipped) {
      setFlipped(false);

      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setCurrentIndex(prev => prev - 1);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, flipped, currentIndex]);

  // Kart tamamlama durumunu değiştirme
  const handleComplete = useCallback(() => {
    if (!flashcards.length) return;

    const currentCard = flashcards[currentIndex];
    setCompleted(prev => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id]
    }));
  }, [currentIndex, flashcards]);

  // Tüm kartları sıfırlama
  const handleReset = useCallback(async () => {
    setCompleted({});
    setViewed({});
    setCurrentIndex(0);
    setFlipped(false);
    setIsAnimating(false);

    if (user) {
      try {
        const userProgressRef = doc(db, 'userProgress', user.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (userProgressDoc.exists()) {
          await updateDoc(userProgressRef, {
            [categoryId]: {
              index: 0,
              timestamp: new Date(),
              viewedCards: {},
              completedCards: {},
              totalCards: flashcards.length,
              viewedCount: 0
            }
          });
        }
      } catch (error) {
        console.error("Error resetting progress:", error);
      }
    }

    if (onReset) {
      onReset();
    }
  }, [onReset, user, categoryId, flashcards.length]);

  // Sağ tıklama - kart tamamlama
  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleComplete();
  }, [handleComplete]);

  // Doğru cevap verildiğinde
  const handleCorrectAnswer = useCallback(() => {
    setCanAdvance(true);
    if (!flipped) {
      handleFlip();
    }
  }, [flipped, handleFlip]);

  // Yanlış cevap verildiğinde
  const handleIncorrectAnswer = useCallback(() => {
    if (!flipped) {
      handleFlip();
    }
  }, [flipped, handleFlip]);

  // Tam ekran geçişi
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Dokunmatik olayları
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < flashcards.length - 1 && (!quizMode || canAdvance)) {
      handleNext();
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    } else if (Math.abs(distance) < minSwipeDistance / 2) {
      handleFlip();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, currentIndex, flashcards.length, handleNext, handlePrevious, handleFlip, minSwipeDistance, quizMode, canAdvance]);

  const viewedCount = Object.values(viewed).filter(Boolean).length;
  const progressPercentage = flashcards.length > 0 
    ? (viewedCount / flashcards.length) * 100 
    : 0;

  // Cihaz türü ve yönlendirme
  const isMobile = windowDimensions.width <= 768;
  const isTablet = windowDimensions.width > 768 && windowDimensions.width <= 1024;
  const isLandscape = windowDimensions.isLandscape;

  // Kart boyutları
  let cardWidth: number;
  if (isMobile) {
    cardWidth = Math.min(windowDimensions.width - 32, 400);
    
    if (isLandscape) {
      cardWidth = Math.min(windowDimensions.width * 0.6, 550);
    }
  } else if (isTablet) {
    cardWidth = Math.min(windowDimensions.width * 0.7, 500);
  } else {
    cardWidth = Math.min(windowDimensions.width * 0.75, 600);
  }

  // Kart yükseklik oranı
  const aspectRatio = isLandscape ? 0.4 : 0.56;
  const cardHeight = Math.min(cardWidth * aspectRatio, isMobile ? 220 : 400);
  
  // Tam ekran modu kart boyutları
  const fullscreenCardWidth = isMobile 
    ? Math.min(windowDimensions.width * 0.95, 600) 
    : Math.min(windowDimensions.width * 0.7, 800);
  
  let fullscreenCardHeight = isMobile 
    ? Math.min(windowDimensions.height * 0.3, 250) 
    : Math.min(windowDimensions.height * 0.45, 400);
  
  if (isLandscape && isMobile) {
    fullscreenCardHeight = Math.min(windowDimensions.height * 0.35, 200);
  }

  // Klavye kontrolü
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive = activeElement instanceof HTMLInputElement || 
                           activeElement instanceof HTMLTextAreaElement;
      
      if (!isInputActive) {
        switch (e.code) {
          case 'Space':
            e.preventDefault();
            handleFlip();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'KeyC':
            handleComplete();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFlip, handleNext, handlePrevious, handleComplete]);

  return {
    state: {
      currentIndex,
      flipped,
      completed,
      viewed,
      isAnimating,
      touchStart,
      touchEnd,
      canAdvance,
      isFullscreen,
      windowDimensions,
      viewedCount,
      progressPercentage
    },
    handlers: {
      handleFlip,
      handleNext,
      handlePrevious,
      resetCardAndMoveNext,
      handleComplete,
      handleReset,
      handleRightClick,
      handleCorrectAnswer,
      handleIncorrectAnswer,
      toggleFullscreen,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    },
    dimensions: {
      isMobile,
      isTablet,
      isLandscape,
      cardWidth,
      cardHeight,
      fullscreenCardWidth,
      fullscreenCardHeight
    },
    cardStyles
  };
}