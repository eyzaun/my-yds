'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import { FlashcardData } from '@/types/flashcard';
import { parseExcelFile, convertExcelRowsToFlashcards } from '@/utils/excelParser';
import { saveFlashcardSet, getUserFlashcardSets, getFlashcardsBySetId, deleteFlashcardSet } from '@/lib/firebase/flashcardStorage';
import AdBanner from '../../components/AdBanner';

// Gelişmiş FlashcardViewer komponenti
const FlashcardViewer = ({ 
  flashcards, 
  onClose,
  colors,
  isQuizMode = false,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleQuizMode
}: { 
  flashcards: FlashcardData[], 
  onClose: () => void,
  colors: any,
  isQuizMode?: boolean,
  isFullscreen?: boolean,
  onToggleFullscreen?: () => void,
  onToggleQuizMode?: () => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCard = flashcards[currentIndex];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobilde tam ekran + quiz modunda viewport'u kilitle
  useEffect(() => {
    if (isMobile && isQuizMode && isFullscreen) {
      // Viewport meta tag'ini güncelle
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
      }
      
      // Body scroll'u engelle
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      
      // iOS bounce effect'i engelle
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
      
      return () => {
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
      };
    }
  }, [isMobile, isQuizMode, isFullscreen]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setUserAnswer('');
      setShowResult(false);
      if (isQuizMode && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const handleFlip = () => {
    if (!isQuizMode || showResult) {
      setFlipped(!flipped);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.toLowerCase().trim() === currentCard.back.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    setFlipped(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isQuizMode) {
      // Quiz modunda sadece Enter tuşu çalışsın
      if (e.key === 'Enter' && showResult) {
        e.preventDefault();
        handleNext();
      }
    } else {
      // Normal modda ok tuşları ve space çalışsın
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showResult) {
      e.preventDefault();
      handleNext();
    }
  };

  // Mobil için optimize edilmiş kart yüksekliği
  const getCardHeight = () => {
    if (isMobile) {
      if (isFullscreen && isQuizMode) return '180px';
      if (isFullscreen) return '250px';
      return isQuizMode ? '200px' : '250px';
    }
    return isFullscreen ? '400px' : '300px';
  };

  const fullscreenContainerStyle = isFullscreen && isMobile && isQuizMode ? {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden'
  } : {};

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} flex flex-col`}
      style={{ 
        backgroundColor: isFullscreen ? colors.background : 'transparent',
        ...fullscreenContainerStyle
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-semibold" style={{ color: colors.text }}>
          Kelime Kartları ({currentIndex + 1}/{flashcards.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleQuizMode}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: isQuizMode ? colors.accent : `${colors.accent}20`,
              color: isQuizMode ? 'white' : colors.text
            }}
            title="Quiz Modu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a1 1 0 100 2H6a4 4 0 01-4-4V5z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: `${colors.accent}20`,
              color: colors.text
            }}
            title="Tam Ekran"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              )}
            </svg>
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: `${colors.accent}20`,
              color: colors.text
            }}
            title="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Area */}
      <div className={`${isFullscreen && isMobile && isQuizMode ? 'flex-1 overflow-hidden' : 'flex-1'} flex flex-col items-center justify-center px-4 pb-4`}>
        <div className="w-full max-w-2xl">
          {/* Flashcard */}
          <div 
            className="relative w-full cursor-pointer"
            style={{ 
              height: getCardHeight(),
              perspective: '1000px'
            }}
            onClick={handleFlip}
          >
            <div 
              className="absolute inset-0 w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front */}
              <div 
                className="absolute inset-0 w-full h-full rounded-xl flex flex-col items-center justify-center p-6"
                style={{
                  backgroundColor: colors.cardBackground,
                  backfaceVisibility: 'hidden',
                  boxShadow: `0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px ${colors.accent}20`
                }}
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center" style={{ color: colors.text }}>
                  {currentCard.front}
                </h3>
                {currentCard.notes && (
                  <p className="text-xs md:text-sm text-center mt-3 opacity-60" style={{ color: colors.text }}>
                    {currentCard.notes}
                  </p>
                )}
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 w-full h-full rounded-xl flex flex-col items-center justify-center p-6"
                style={{
                  backgroundColor: colors.cardBackground,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: `0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px ${colors.accent}20`
                }}
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center" style={{ color: colors.accent }}>
                  {currentCard.back}
                </h3>
                {showResult && (
                  <div className={`mt-4 px-4 py-2 rounded-lg ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    <p className="text-white font-medium">
                      {isCorrect ? '✓ Doğru!' : '✗ Yanlış!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quiz Mode Input */}
          {isQuizMode && !flipped && (
            <form onSubmit={handleQuizSubmit} className="mt-4">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Cevabınızı yazın..."
                className="w-full px-4 py-3 rounded-lg text-base md:text-lg"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  border: `2px solid ${colors.accent}40`
                }}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button
                type="submit"
                className="mt-3 w-full py-3 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: colors.accent,
                  color: 'white'
                }}
              >
                Kontrol Et
              </button>
            </form>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-3 rounded-lg transition-all disabled:opacity-30"
              style={{ 
                backgroundColor: `${colors.accent}20`,
                color: colors.text
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-sm text-center px-4" style={{ color: colors.text }}>
              {isQuizMode && showResult ? (
                <span>Enter'a basarak devam edin</span>
              ) : isQuizMode ? (
                <span>Cevabı yazın</span>
              ) : (
                <span>Kartı çevirmek için tıklayın</span>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1 || (isQuizMode && !showResult)}
              className="p-3 rounded-lg transition-all disabled:opacity-30"
              style={{ 
                backgroundColor: `${colors.accent}20`,
                color: colors.text
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UploadFlashcardsPage() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [savedSets, setSavedSets] = useState<{id: string, name: string, cardCount: number, createdAt: Date}[]>([]);
  const [setName, setSetName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerQuizMode, setViewerQuizMode] = useState(false);
  const [viewerFullscreen, setViewerFullscreen] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser);
      if (!currentUser) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=/upload-flashcards';
        }
      } else {
        loadSavedSets();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSavedSets = async () => {
    try {
      setIsLoading(true);
      const sets = await getUserFlashcardSets();
      setSavedSets(sets);
    } catch (err) {
      console.error('Error loading saved flashcard sets:', err);
      setError('Kaydedilmiş kelime setleriniz yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setError(null);
    setSuccess(null);
    
    try {
      const buffer = await file.arrayBuffer();
      const excelRows = parseExcelFile(buffer);
      const cards = convertExcelRowsToFlashcards(excelRows);
      
      if (cards.length === 0) {
        setError('Excel dosyasında kelime bulunamadı. Lütfen C, D ve E sütunlarını kontrol edin.');
        return;
      }
      
      setFlashcards(cards);
      setSetName(file.name.replace(/\.(xlsx|xls)$/, ''));
      setSuccess(`${cards.length} kelime başarıyla yüklendi!`);
    } catch (err) {
      console.error('Error processing Excel file:', err);
      setError('Excel dosyası işlenirken bir hata oluştu. Lütfen dosya formatını kontrol edin.');
    }
  };

  const handleSaveFlashcards = async () => {
    if (!setName.trim()) {
      setError('Lütfen kelime seti için bir isim girin.');
      return;
    }

    if (flashcards.length === 0) {
      setError('Kaydedilecek kelime kartı bulunamadı.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      await saveFlashcardSet(setName, flashcards);
      setSuccess(`"${setName}" kelime seti başarıyla kaydedildi!`);
      
      await loadSavedSets();
      
      // Reset form
      setTimeout(() => {
        setFlashcards([]);
        setSetName('');
        const fileInput = document.getElementById('excel-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }, 2000);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Kelime seti kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFlashcardSet = async (setId: string, setName: string) => {
    if (!confirm(`"${setName}" kelime setini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setIsDeleting(setId);
      await deleteFlashcardSet(setId);
      setSuccess('Kelime seti başarıyla silindi.');
      setSavedSets(prevSets => prevSets.filter(set => set.id !== setId));
    } catch (err) {
      console.error('Error deleting flashcard set:', err);
      setError('Kelime seti silinirken bir hata oluştu.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLoadFlashcardSet = async (setId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const cards = await getFlashcardsBySetId(setId);
      
      if (cards.length === 0) {
        setError('Bu set için kelime kartları bulunamadı.');
        return;
      }
      
      setFlashcards(cards);
      const set = savedSets.find(s => s.id === setId);
      if (set) setSetName(set.name);
      
      setShowViewer(true);
    } catch (err) {
      console.error('Error loading flashcard set:', err);
      setError('Kelime seti yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
            Kişisel Kelime Kartları
          </h1>
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: colors.cardBackground }}>
            <p className="mb-4" style={{ color: colors.text }}>
              Bu özelliği kullanmak için giriş yapmanız gerekmektedir.
            </p>
            <Link
              href="/login?redirect=/upload-flashcards"
              className="inline-block px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showViewer && flashcards.length > 0) {
    return (
      <FlashcardViewer
        flashcards={flashcards}
        onClose={() => {
          setShowViewer(false);
          setFlashcards([]);
          setSetName('');
        }}
        colors={colors}
        isQuizMode={viewerQuizMode}
        isFullscreen={viewerFullscreen}
        onToggleQuizMode={() => setViewerQuizMode(!viewerQuizMode)}
        onToggleFullscreen={() => setViewerFullscreen(!viewerFullscreen)}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
          Kişisel Kelime Kartları
        </h1>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Upload Panel */}
          <div className="rounded-xl p-6" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Excel Dosyanızı Yükleyin
            </h2>
            
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
              <p className="text-sm mb-2" style={{ color: colors.text }}>
                <strong>Excel Format:</strong>
              </p>
              <ul className="text-sm space-y-1" style={{ color: colors.text }}>
                <li>• <strong>C sütunu:</strong> Kelime (ön yüz)</li>
                <li>• <strong>D sütunu:</strong> Anlam (arka yüz)</li>
                <li>• <strong>E sütunu:</strong> İpucu/Not (ön yüzde küçük yazı)</li>
              </ul>
            </div>

            <div className="relative">
              <input
                type="file"
                id="excel-file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="excel-file"
                className="block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all hover:bg-opacity-5"
                style={{
                  borderColor: colors.accent,
                  backgroundColor: `${colors.accent}05`
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke={colors.accent}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="font-medium" style={{ color: colors.text }}>
                  Dosya seçmek için tıklayın
                </p>
                <p className="text-sm mt-1 opacity-70" style={{ color: colors.text }}>
                  veya sürükleyip bırakın
                </p>
              </label>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                <p className="font-medium" style={{ color: colors.text }}>
                  {flashcards.length} kelime yüklendi
                </p>
              </div>
            )}
          </div>

          {/* Preview & Save Panel */}
          <div className="rounded-xl p-6" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Önizleme ve Kaydet
            </h2>

            {flashcards.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Set Adı
                  </label>
                  <input
                    type="text"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="Örn: YDS Kelimelerim"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.accent}40`
                    }}
                  />
                </div>

                <div className="mb-4 max-h-48 overflow-y-auto">
                  {flashcards.slice(0, 5).map((card, index) => (
                    <div
                      key={card.id}
                      className="mb-2 p-3 rounded-lg"
                      style={{ backgroundColor: `${colors.accent}05` }}
                    >
                      <p className="text-sm" style={{ color: colors.text }}>
                        <strong>{index + 1}.</strong> {card.front} → {card.back}
                        {card.notes && <span className="opacity-60"> ({card.notes})</span>}
                      </p>
                    </div>
                  ))}
                  {flashcards.length > 5 && (
                    <p className="text-sm text-center opacity-70" style={{ color: colors.text }}>
                      ...ve {flashcards.length - 5} kelime daha
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowViewer(true)}
                    className="flex-1 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: `${colors.accent}20`,
                      color: colors.text
                    }}
                  >
                    Önizle
                  </button>
                  <button
                    onClick={handleSaveFlashcards}
                    disabled={isSaving}
                    className="flex-1 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: colors.accent,
                      color: 'white',
                      opacity: isSaving ? 0.7 : 1
                    }}
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke={colors.text}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="opacity-50" style={{ color: colors.text }}>
                  Henüz dosya yüklenmedi
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Sets Section */}
        <div className="rounded-xl p-6" style={{ backgroundColor: colors.cardBackground }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
            Kaydedilmiş Kelime Setleriniz
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: colors.accent }}></div>
            </div>
          ) : savedSets.length > 0 ? (
            <div className="grid gap-3">
              {savedSets.map(set => (
                <div
                  key={set.id}
                  className="group flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: colors.background }}
                  onClick={() => handleLoadFlashcardSet(set.id)}
                >
                  <div className="flex-1 pointer-events-none">
                    <h3 className="font-medium group-hover:underline" style={{ color: colors.text }}>
                      {set.name}
                    </h3>
                    <p className="text-sm opacity-70" style={{ color: colors.text }}>
                      {set.cardCount} kelime • {set.createdAt.toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteFlashcardSet(set.id, set.name)}
                      disabled={isDeleting === set.id}
                      className="p-2 rounded-lg transition-all hover:bg-red-50"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        opacity: isDeleting === set.id ? 0.5 : 1
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke={colors.text}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p className="opacity-50" style={{ color: colors.text }}>
                Henüz kaydedilmiş kelime setiniz yok
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ad - Sayfanın en altında */}
      <div className="mt-24 pb-16">
        <AdBanner
          slot="flashcards-footer"
          format="auto"
          className="my-4 mx-auto"
        />
      </div>
    </div>
  );
}