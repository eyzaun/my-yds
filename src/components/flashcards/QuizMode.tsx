'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { designTokens } from '@/styles/design-tokens';

interface QuizModeProps {
  flashcards: FlashcardData[];
  initialIndex?: number;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  onMoveNext: () => void;
  currentIndex: number;
  isFlipped?: boolean;
  alwaysKeepKeyboardOpen?: boolean;
  isMobileMode?: boolean;
}

export default function QuizMode({ 
  flashcards, 
  onCorrectAnswer,
  onIncorrectAnswer,
  onMoveNext,
  currentIndex,
  isFlipped = false,
  alwaysKeepKeyboardOpen = false,
  isMobileMode = false
}: QuizModeProps) {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [waitingForEnter, setWaitingForEnter] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  // Kart değişikliği işleyicisi
  const handleCardChange = useCallback(() => {
    setAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setWaitingForEnter(false);
    
    // Input alanına focus
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  }, []);
  
  // Kart değiştiğinde state sıfırlama
  useEffect(() => {
    handleCardChange();
  }, [currentIndex, handleCardChange]);

  // Mobil klavye yönetimi
  useEffect(() => {
    if (!((isMobile || isMobileMode) && alwaysKeepKeyboardOpen)) return;
    
    // İlk focus
    const initialFocusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
    
    // Periyodik focus kontrolü
    const interval = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 1000);
    
    return () => {
      clearTimeout(initialFocusTimer);
      clearInterval(interval);
    };
  }, [isMobile, isMobileMode, alwaysKeepKeyboardOpen]);

  // Yanlış cevaptan sonra kart çevrildiğinde Enter bekle
  useEffect(() => {
    if (isFlipped && isCorrect === false) {
      setWaitingForEnter(true);
      
      // Input alanına focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [isFlipped, isCorrect]);

  // Enter tuşu işleyicisi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (waitingForEnter && e.key === 'Enter') {
        e.preventDefault();
        setWaitingForEnter(false);
        onMoveNext();
        
        // Sonraki karta focus
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [waitingForEnter, onMoveNext]);

  // Cevap kontrolü ve sonraki karta geçiş
  const handleSubmit = useCallback((e: React.FormEvent | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    // Enter tuşu bekleme modu
    if (waitingForEnter) {
      setWaitingForEnter(false);
      onMoveNext();
      
      // Sonraki karta geçtikten sonra input'a focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
      
      return;
    }
    
    if (!flashcards[currentIndex]) return;
    
    const currentCard = flashcards[currentIndex];
    const correctAnswer = currentCard.back.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();
    
    // Geliştirilmiş cevap kontrolü
    const isExactMatch = userAnswer === correctAnswer;
    
    // Yaklaşık eşleşme kontrolü - kelimenin büyük kısmını doğru yazmış mı?
    const isCloseMatch = 
      correctAnswer.includes(userAnswer) && 
      userAnswer.length > correctAnswer.length / 2;
      
    if (isExactMatch || isCloseMatch) {
      setIsCorrect(true);
      
      // Doğru cevap bildirimi
      setTimeout(() => {
        onCorrectAnswer();
        
        // Sonraki kelimeye geçiş
        setTimeout(() => {
          onMoveNext();
          setAnswer('');
          setIsCorrect(null);
          
          // Otomatik focus
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 300);
        }, 800);
      }, 700);
    } else {
      setIsCorrect(false);
      // Yanlış cevap - kartı çevir
      onIncorrectAnswer();
      
      // Input'a focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [waitingForEnter, currentIndex, answer, flashcards, onMoveNext, onCorrectAnswer, onIncorrectAnswer]);

  // Klavye event işleyicisi
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Event yayılmasını engelle
    e.stopPropagation();
    
    // Kart çevrilmiş ve yanlış cevap verilmişse
    if (isFlipped && isCorrect === false) {
      if (e.key === 'Enter') {
        e.preventDefault();
        setWaitingForEnter(false);
        onMoveNext();
        
        // Sonraki karta geçince focus
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 300);
      }
      return;
    }
    
    // Normal cevap kontrolü
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [isFlipped, isCorrect, handleSubmit, onMoveNext]);
  
  // Focus kaybını önleme
  const handleBlur = useCallback(() => {
    if ((isMobile || isMobileMode) && alwaysKeepKeyboardOpen) {
      // Odak kaybında, yeniden focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isMobile, isMobileMode, alwaysKeepKeyboardOpen]);

  // Güvenlik kontrolü
  if (!flashcards[currentIndex]) {
    return <div>Kartlar yüklenemedi.</div>;
  }

  const currentCard = flashcards[currentIndex];
  
  // Form stilleri
  const formStyle = isMobileMode ? {
    backgroundColor: designTokens.colors.background,
  } : {};

  return (
    <div className={`w-full max-w-md mx-auto ${alwaysKeepKeyboardOpen ? 'always-focused' : ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col" style={formStyle}>
        <p className="text-sm mb-1" style={{
          color: designTokens.colors.text,
          fontSize: isMobile ? '14px' : '15px'
        }}>
          {waitingForEnter || (isFlipped && isCorrect === false)
            ? 'Sonraki kelimeye geçmek için Enter tuşuna basın'
            : 'Kartın arkasındaki kelimeyi yazın:'}
        </p>
        
        <div className="flex w-full quiz-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="flex-grow px-3 py-1 rounded-l-lg border focus:outline-none"
            placeholder={waitingForEnter || (isFlipped && isCorrect === false) ? 'Enter tuşuna basın...' : 'Cevabınızı buraya yazın...'}
            style={{
              backgroundColor: designTokens.colors.background,
              color: designTokens.colors.text,
              borderColor: isCorrect === true ? 'green' :
                           isCorrect === false ? 'red' :
                           designTokens.colors.accent,
              fontSize: '16px',
              height: isMobileMode ? '44px' : '40px'
            }}
            autoComplete="off"
            readOnly={isCorrect === true}
            autoFocus
          />


          <Button
            type="submit"
            variant="primary"
            className="rounded-r-lg"
            style={{
              backgroundColor: isCorrect === true ? 'green' :
                              waitingForEnter || (isFlipped && isCorrect === false) ? 'orange' :
                              designTokens.colors.accent,
              color: 'white',
              fontSize: '16px',
              height: isMobileMode ? '44px' : '40px',
              borderRadius: '0 0.5rem 0.5rem 0'
            }}
            disabled={(!answer.trim() && !waitingForEnter && !(isFlipped && isCorrect === false)) || isCorrect === true}
          >
            {waitingForEnter || (isFlipped && isCorrect === false) ? 'Sonraki' : 'Kontrol Et'}
          </Button>
        </div>
        
        {isCorrect === true && (
          <p className="text-green-500 mt-2 text-sm">Doğru cevap!</p>
        )}
        
        {isCorrect === false && (
          <div className="mt-2">
            <p className="text-red-500 text-sm">
              {isFlipped 
                ? `Doğru cevap: ${currentCard.back}` 
                : 'Yanlış cevap, tekrar deneyin.'}
            </p>
            {!showHint && !isFlipped && (
              <Button
                type="button"
                onClick={() => setShowHint(true)}
                variant="ghost"
                className="text-xs underline mt-1"
                style={{ color: designTokens.colors.accent, padding: 0 }}
              >
                İpucu göster
              </Button>
            )}
            {showHint && !isFlipped && (
              <p className="text-xs mt-1" style={{ color: designTokens.colors.text }}>
                İpucu: {currentCard.back.charAt(0)}
                {currentCard.back.charAt(1)}
                {currentCard.back.length > 2 ? '...' : ''}
                {' '} ({currentCard.back.length} harf)
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}