// src/components/WordList.tsx
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizResult } from '@/lib/firebase/spacedRepetition';
import { CardType } from '@/types/spacedRepetition';

// FlashCard dinamik olarak import ediliyor
const FlashCard = dynamic(() => import('./FlashCard'), {
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-center">Yükleniyor...</div>
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
  categoryId: string; // Kategori kimliği
  categoryName?: string; // Kategori ismi (ör: "İşletme ve Ekonomi")
  isCustomCard?: boolean; // Kendi kartları mı? (upload-flashcards'dan geliyorsa true)
}

const WordList: React.FC<WordListProps> = ({ words, categoryId, categoryName, isCustomCard = false }) => {
  const designTokens = useDesignTokens();
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

      // Quiz state'lerini sıfırla
      setQuizAnswer('');
      setQuizResult(null);
      setFlipped(false);

      // Quiz modunda input'a focus
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
      // Quiz state'lerini sıfırla
      setQuizAnswer('');
      setQuizResult(null);
      setFlipped(false);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    // Quiz state'lerini sıfırla
    setQuizAnswer('');
    setQuizResult(null);
    setFlipped(false);
    setIsQuizMode(false);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list');
    // Liste görünümüne geçerken seçili kelimeyi sıfırla
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

    // Quiz modu açıldığında input'a focus
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

    // Eğer yanlış cevap durumundaysak ve kullanıcı doğru cevabı yazıyorsa
    if (quizResult === 'incorrect' && flipped) {
      // Kullanıcının yazdığı doğru cevapla eşleşiyor mu kontrol et
      const isExactMatch = userAnswer === correctAnswer;
      const isCloseMatch = correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2;

      if (isExactMatch || isCloseMatch) {
        // Doğru yazdı, sonraki kelimeye geç
        handleNext();
      } else {
        // Hala yanlış yazıyor, input'u temizle
        setQuizAnswer('');
      }
      return;
    }

    // İlk deneme - kullanıcının cevabını kontrol et
    const isExactMatch = userAnswer === correctAnswer;
    const isCloseMatch = correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2;
    const isCorrect = isExactMatch || isCloseMatch;

    if (isCorrect) {
      setQuizResult('correct');
      setFlipped(true);

      // Save quiz result to Firebase for spaced repetition
      if (user) {
        try {
          // Determine card type based on isCustomCard prop
          const cardType: CardType = isCustomCard ? 'custom' : 'category';

          await saveQuizResult(
            user.uid,
            cardType,
            currentWord.en,
            currentWord.tr,
            true, // correct answer
            cardType === 'category' ? categoryId : undefined,
            cardType === 'category' ? (categoryName || categoryId) : undefined
          );
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }

      // Doğru cevap - 1 saniye sonra sonraki kelimeye geç
      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      // Yanlış cevap - doğru cevabı göster ve input'u temizle
      setQuizResult('incorrect');
      setFlipped(true);
      setQuizAnswer('');

      // Save incorrect quiz result to Firebase
      if (user) {
        try {
          // Determine card type based on isCustomCard prop
          const cardType: CardType = isCustomCard ? 'custom' : 'category';

          await saveQuizResult(
            user.uid,
            cardType,
            currentWord.en,
            currentWord.tr,
            false, // incorrect answer
            cardType === 'category' ? categoryId : undefined,
            cardType === 'category' ? (categoryName || categoryId) : undefined
          );
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }
    }
  }, [quizAnswer, currentIndex, words, handleNext, quizResult, flipped, user, categoryId, isCustomCard]);

  // Liste görünümünde kelimeye tıklama
  const handleWordClick = useCallback((index: number) => {
    // Aynı kelimeye tekrar tıklanırsa seçimi kaldır
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

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : 'w-full mx-auto'} px-2 py-2`}
         style={isFullscreen ? { backgroundColor: designTokens.colors.background.primary } : {}}>
      {/* Üst Kontrol Paneli - sadeleştirildi */}
      <div className="flex flex-col space-y-3 mb-3">
        {/* Butonlar - mobil için optimize edildi */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            onClick={toggleViewMode}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{
              backgroundColor: designTokens.colors.cardBackground,
              color: designTokens.colors.text
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              {viewMode === 'list' ? (
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              ) : (
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              )}
            </svg>
            {viewMode === 'list' ? 'Kart Görünümü' : 'Liste Görünümü'}
          </button>

          {viewMode === 'card' && (
            <button
              onClick={toggleQuizMode}
              className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
              style={{
                backgroundColor: isQuizMode ? designTokens.colors.accent : designTokens.colors.cardBackground,
                color: designTokens.colors.text
              }}
              title="Quiz Modu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a1 1 0 100 2H6a4 4 0 01-4-4V5z" clipRule="evenodd" />
              </svg>
              {isQuizMode ? 'Normal Mod' : 'Quiz Modu'}
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{
              backgroundColor: isFullscreen ? designTokens.colors.accent : designTokens.colors.cardBackground,
              color: designTokens.colors.text
            }}
            title="Tam Ekran"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              )}
            </svg>
            {isFullscreen ? 'Normal Ekran' : 'Tam Ekran'}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{
              backgroundColor: designTokens.colors.cardBackground,
              color: designTokens.colors.text
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Baştan Başla
          </button>
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
            <div className="w-full max-w-md mx-auto mt-4">
              <form onSubmit={handleQuizSubmit} className="flex flex-col">
                <p className="text-sm mb-2" style={{ color: designTokens.colors.text.primary }}>
                  {quizResult === 'incorrect' && flipped
                    ? 'Doğru cevabı yazın (kartın arkasında):'
                    : 'Kelimenin Türkçe karşılığını yazın:'}
                </p>

                <div className="flex w-full">
                  <input
                    ref={quizInputRef}
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-l-lg border focus:outline-none"
                    placeholder={quizResult === 'incorrect' && flipped ? 'Doğru cevabı yazın...' : 'Cevabınızı buraya yazın...'}
                    style={{
                      backgroundColor: designTokens.colors.background.primary,
                      color: designTokens.colors.text.primary,
                      borderColor: quizResult === 'correct' ? designTokens.colors.status.success :
                                   quizResult === 'incorrect' ? designTokens.colors.status.error :
                                   designTokens.colors.border.medium,
                      fontSize: '16px',
                      height: '44px'
                    }}
                    autoComplete="off"
                    readOnly={quizResult === 'correct'}
                    autoFocus
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-r-lg transition-colors font-medium"
                    style={{
                      backgroundColor: quizResult === 'correct' ? designTokens.colors.status.success :
                                      quizResult === 'incorrect' && flipped ? designTokens.colors.status.warning :
                                      designTokens.colors.primary[600],
                      color: designTokens.colors.text.inverse,
                      fontSize: '16px',
                      height: '44px'
                    }}
                    disabled={!quizAnswer.trim() || quizResult === 'correct'}
                  >
                    {quizResult === 'incorrect' && flipped ? 'Devam Et' : 'Kontrol Et'}
                  </button>
                </div>

                {quizResult === 'correct' && (
                  <p className="mt-2 text-sm font-medium" style={{ color: designTokens.colors.status.success }}>Doğru cevap!</p>
                )}

                {quizResult === 'incorrect' && flipped && (
                  <div className="mt-2">
                    <p className="text-sm font-medium" style={{ color: designTokens.colors.status.error }}>
                      Yanlış cevap!
                    </p>
                    <p className="text-sm mt-1" style={{ color: designTokens.colors.text.primary }}>
                      Kartın arkasına bak ve doğru cevabı yazıp devam et.
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3 mt-4">
          {words.map((word, index) => (
            <div
              key={`${word.en}-${index}`}
              className="p-4 rounded-lg cursor-pointer transition-all duration-300 shadow-md"
              style={{
                backgroundColor: designTokens.colors.cardBackground
              }}
              onClick={() => handleWordClick(index)}
            >
              <div style={{ color: designTokens.colors.text.primary }} className="text-lg font-semibold">
                {word.en}
              </div>

              {/* Sadece seçili kelime için anlamını göster */}
              {selectedWordIndex === index && (
                <div style={{ color: designTokens.colors.text.primary, opacity: 0.8 }} className="mt-1">
                  {word.tr}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(WordList);
