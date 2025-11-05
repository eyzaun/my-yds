// src/components/WordList.tsx
'use client';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link'; // Doğru import yolu
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveWordProgress, getUserProgress } from '@/firebase/firestore';

// WordList bileşeninin geri kalanı aynı

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
  categoryId: string; // Kategori kimliği ekleyin
}

const WordList: React.FC<WordListProps> = ({ words, categoryId }) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Ana state'ler
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [studiedWords, setStudiedWords] = useState<Set<number>>(new Set([0]));
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [flipped, setFlipped] = useState(false);
  const quizInputRef = useRef<HTMLInputElement>(null);

  // Kullanıcı girişi ve ilerleme durumunu takip etme
  useEffect(() => {
    const loadProgress = async () => {
      if (user && categoryId) {
        setLoading(true);
        try {
          const { progress, error } = await getUserProgress(user.uid, categoryId);
          
          if (error) {
            console.error('İlerleme yüklenirken hata:', error);
            return;
          }
          
          if (progress && progress.studiedWords) {
            // Çalışılan kelime indekslerini belirle
            const studiedIndices = new Set<number>();
            progress.studiedWords.forEach((wordId: string) => {
              const index = words.findIndex(w => w.en === wordId);
              if (index !== -1) {
                studiedIndices.add(index);
              }
            });
            
            // İlk kelimeyi her zaman çalışılmış olarak işaretle
            studiedIndices.add(0);
            
            setStudiedWords(studiedIndices);
          }
        } catch (err) {
          console.error('İlerleme yüklenirken hata:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadProgress();
  }, [user, categoryId, words]);

  // Progress hesaplaması memoize edildi
  const progress = useMemo(() => {
    return Math.round((studiedWords.size / words.length) * 100);
  }, [studiedWords.size, words.length]);

  // Callback fonksiyonları
  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Quiz state'lerini sıfırla
      setQuizAnswer('');
      setQuizResult(null);
      setFlipped(false);

      // Kelimeyi çalışılmış olarak işaretle
      setStudiedWords(prev => {
        const updated = new Set(prev);
        updated.add(nextIndex);
        return updated;
      });

      // Kullanıcı giriş yapmışsa ilerlemeyi kaydet
      if (user && categoryId) {
        const wordId = words[nextIndex].en;
        saveWordProgress(user.uid, categoryId, wordId, true).catch(err => {
          console.error('İlerleme kaydedilirken hata:', err);
        });
      }

      // Quiz modunda input'a focus
      if (isQuizMode) {
        setTimeout(() => {
          if (quizInputRef.current) {
            quizInputRef.current.focus();
          }
        }, 100);
      }
    }
  }, [currentIndex, words, user, categoryId, isQuizMode]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    // İlk kelimeyi çalışılmış olarak işaretle
    setStudiedWords(new Set([0])); 
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

  const handleQuizSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!quizAnswer.trim()) return;

    const currentWord = words[currentIndex];
    const correctAnswer = currentWord.tr.trim().toLowerCase();
    const userAnswer = quizAnswer.trim().toLowerCase();

    // Tam eşleşme veya yaklaşık eşleşme kontrolü
    const isExactMatch = userAnswer === correctAnswer;
    const isCloseMatch = correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length / 2;

    if (isExactMatch || isCloseMatch) {
      setQuizResult('correct');
      setFlipped(true);

      // Doğru cevap - 1 saniye sonra sonraki kelimeye geç
      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      setQuizResult('incorrect');
      setFlipped(true);
    }
  }, [quizAnswer, currentIndex, words, handleNext]);

  const handleQuizKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Yanlış cevap verildiyse ve kart çevrildiyse, Enter ile sonraki kelimeye geç
    if (e.key === 'Enter' && quizResult === 'incorrect' && flipped) {
      e.preventDefault();
      handleNext();
    }
  }, [quizResult, flipped, handleNext]);

  // Liste görünümünde kelimeye tıklama
  const handleWordClick = useCallback((index: number) => {
    // Aynı kelimeye tekrar tıklanırsa seçimi kaldır
    if (selectedWordIndex === index) {
      setSelectedWordIndex(null);
    } else {
      setSelectedWordIndex(index);
    }
    
    // Kelimeyi çalışılmış olarak işaretle
    setStudiedWords(prev => {
      const updated = new Set(prev);
      updated.add(index);
      return updated;
    });
    
    // Kullanıcı giriş yapmışsa ilerlemeyi kaydet
    if (user && categoryId) {
      const wordId = words[index].en;
      saveWordProgress(user.uid, categoryId, wordId, true).catch(err => {
        console.error('İlerleme kaydedilirken hata:', err);
      });
    }
  }, [selectedWordIndex, user, categoryId, words]);

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div style={{ color: colors.text }}>İlerleme yükleniyor...</div>
      </div>
    );
  }

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
         style={isFullscreen ? { backgroundColor: colors.background } : {}}>
      {/* Üst Kontrol Paneli - sadeleştirildi */}
      <div className="flex flex-col space-y-3 mb-3">
        {/* Butonlar - mobil için optimize edildi */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            onClick={toggleViewMode}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{
              backgroundColor: colors.cardBackground,
              color: colors.text
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
                backgroundColor: isQuizMode ? colors.accent : colors.cardBackground,
                color: colors.text
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
              backgroundColor: isFullscreen ? colors.accent : colors.cardBackground,
              color: colors.text
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
              backgroundColor: colors.cardBackground,
              color: colors.text
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Baştan Başla
          </button>
        </div>

        {/* İlerleme Çubuğu */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span style={{ color: colors.text }} className="text-sm">
              Çalışılan: {studiedWords.size} / {words.length}
            </span>
            <span style={{ color: colors.text }} className="text-sm">
              İlerleme: %{progress}
            </span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: colors.cardBackground }}>
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: colors.accent 
              }}
            ></div>
          </div>
        </div>
        
        {/* Kullanıcı giriş yapmamışsa uyarı mesajı */}
        {!user && (
          <div className="text-center p-2 rounded-lg mt-2" style={{ backgroundColor: `${colors.accent}30`, color: colors.text }}>
            <p className="text-sm">
              İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
            </p>
          </div>
        )}
      </div>

      {/* Ana İçerik - Kart veya Liste */}
      {viewMode === 'card' ? (
        <>
          <FlashCard
            words={words}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          {/* Quiz Mode Input */}
          {isQuizMode && (
            <div className="w-full max-w-md mx-auto mt-4">
              <form onSubmit={handleQuizSubmit} className="flex flex-col">
                <p className="text-sm mb-2" style={{ color: colors.text }}>
                  {quizResult === 'incorrect' && flipped
                    ? 'Sonraki kelimeye geçmek için Enter tuşuna basın'
                    : 'Kelimenin Türkçe karşılığını yazın:'}
                </p>

                <div className="flex w-full">
                  <input
                    ref={quizInputRef}
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyDown={handleQuizKeyDown}
                    className="flex-grow px-3 py-2 rounded-l-lg border focus:outline-none"
                    placeholder={quizResult === 'incorrect' && flipped ? 'Enter tuşuna basın...' : 'Cevabınızı buraya yazın...'}
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: quizResult === 'correct' ? 'green' :
                                   quizResult === 'incorrect' ? 'red' :
                                   colors.accent,
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
                      backgroundColor: quizResult === 'correct' ? 'green' :
                                      quizResult === 'incorrect' && flipped ? 'orange' :
                                      colors.accent,
                      color: 'white',
                      fontSize: '16px',
                      height: '44px'
                    }}
                    disabled={(!quizAnswer.trim() && !(quizResult === 'incorrect' && flipped)) || quizResult === 'correct'}
                  >
                    {quizResult === 'incorrect' && flipped ? 'Sonraki' : 'Kontrol Et'}
                  </button>
                </div>

                {quizResult === 'correct' && (
                  <p className="text-green-500 mt-2 text-sm font-medium">✓ Doğru cevap! 👍</p>
                )}

                {quizResult === 'incorrect' && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm font-medium">
                      {flipped
                        ? `✗ Doğru cevap: ${words[currentIndex].tr}`
                        : '✗ Yanlış cevap, tekrar deneyin.'}
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
                backgroundColor: studiedWords.has(index) 
                  ? colors.accent 
                  : colors.cardBackground
              }}
              onClick={() => handleWordClick(index)}
            >
              <div style={{ color: colors.text }} className="text-lg font-semibold">
                {word.en}
              </div>
              
              {/* Sadece seçili kelime için anlamını göster */}
              {selectedWordIndex === index && (
                <div style={{ color: colors.text, opacity: 0.8 }} className="mt-1">
                  {word.tr}
                </div>
              )}
              
              {studiedWords.has(index) && (
                <div className="mt-1 flex items-center text-xs" style={{ color: colors.text, opacity: 0.75 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Çalışıldı
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