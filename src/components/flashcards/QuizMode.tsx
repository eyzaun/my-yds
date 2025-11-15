'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useTheme } from '@/hooks/useTheme';

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
  const { tokens } = useTheme();
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

    // Kullanıcının cevabını temizle ve küçük harfe çevir
    const userInput = answer.trim().toLocaleLowerCase('tr-TR');

    // Doğru cevabı virgülle ayır ve her birini temizle
    const correctOptions = currentCard.back
      .split(',')
      .map(option => option.trim().toLocaleLowerCase('tr-TR'));

    console.log('==================');
    console.log('Kullanıcı yazdı:', userInput);
    console.log('Doğru cevaplar:', correctOptions);
    console.log('Orijinal cevap:', currentCard.back);

    // KONTROL 1: Tam eşleşme var mı?
    // Kullanıcının yazdığı, doğru cevaplardan herhangi biriyle TAM olarak eşleşiyor mu?
    const hasExactMatch = correctOptions.includes(userInput);
    console.log('Tam eşleşme var mı?', hasExactMatch);

    // KONTROL 2: Kısmi eşleşme var mı? (en az 3 karakter ve yarısından fazlası doğru)
    let hasPartialMatch = false;
    if (!hasExactMatch && userInput.length >= 3) {
      for (const correctOption of correctOptions) {
        const includesAnswer = correctOption.includes(userInput);
        const longEnough = userInput.length > correctOption.length / 2;
        console.log(`  "${correctOption}" içeriyor mu "${userInput}"?`, includesAnswer, '- Yeterince uzun mu?', longEnough);
        if (includesAnswer && longEnough) {
          hasPartialMatch = true;
          break;
        }
      }
    }
    console.log('Kısmi eşleşme var mı?', hasPartialMatch);

    // Sonuç: Tam veya kısmi eşleşme varsa doğru kabul et
    const isCorrectAnswer = hasExactMatch || hasPartialMatch;
    console.log('SONUÇ: Cevap doğru mu?', isCorrectAnswer);
    console.log('==================');

    if (isCorrectAnswer) {
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
    backgroundColor: tokens.colors.background.primary,
  } : {};

  return (
    <div className={`w-full max-w-md mx-auto ${alwaysKeepKeyboardOpen ? 'always-focused' : ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col" style={formStyle}>
        <p className="text-sm mb-1" style={{
          color: tokens.colors.text.primary,
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
              backgroundColor: tokens.colors.background.primary,
              color: tokens.colors.text.primary,
              borderColor: isCorrect === true ? tokens.colors.status.success :
                           isCorrect === false ? tokens.colors.status.error :
                           tokens.colors.border.medium,
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
              backgroundColor: isCorrect === true ? tokens.colors.status.success :
                              waitingForEnter || (isFlipped && isCorrect === false) ? tokens.colors.status.warning :
                              tokens.colors.primary[600],
              color: tokens.colors.text.inverse,
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
          <p className="mt-2 text-sm" style={{ color: tokens.colors.status.success }}>Doğru cevap!</p>
        )}

        {isCorrect === false && (
          <div className="mt-2">
            <p className="text-sm" style={{ color: tokens.colors.status.error }}>
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
                style={{ color: tokens.colors.accent.primary, padding: 0 }}
              >
                İpucu göster
              </Button>
            )}
            {showHint && !isFlipped && (
              <p className="text-xs mt-1" style={{ color: tokens.colors.text.primary }}>
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