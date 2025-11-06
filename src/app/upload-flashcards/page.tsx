'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import { FlashcardData } from '@/types/flashcard';
import { parseExcelFile, convertExcelRowsToFlashcards } from '@/utils/excelParser';
import { saveFlashcardSet, getUserFlashcardSets, getFlashcardsBySetId, deleteFlashcardSet } from '@/lib/firebase/flashcardStorage';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

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
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
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
      if (set) {
        setSetName(set.name);
        setCurrentSetId(setId);
      }

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
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Kapat Butonu */}
          <div className="mb-4">
            <button
              onClick={() => {
                setShowViewer(false);
                setFlashcards([]);
                setSetName('');
                setCurrentSetId(null);
              }}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text
              }}
            >
              ← Geri Dön
            </button>
          </div>

          {/* FlashcardDeck */}
          <FlashcardDeck
            flashcards={flashcards}
            categoryId={currentSetId || 'custom'}
            categoryName={setName}
            cardType="custom"
            quizMode={true}
            onReset={() => {
              setShowViewer(false);
              setFlashcards([]);
              setSetName('');
              setCurrentSetId(null);
            }}
          />
        </div>
      </div>
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
        <ClientOnlyAd
          slot="flashcards-footer"
          format="auto"
          className="my-4 mx-auto"
        />
      </div>
    </div>
  );
}