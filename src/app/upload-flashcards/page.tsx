'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { Heading1, Heading2, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { FlashcardData } from '@/types/flashcard';
import { parseExcelFile, convertExcelRowsToFlashcards } from '@/utils/excelParser';
import { saveFlashcardSet, getUserFlashcardSets, getFlashcardsBySetId, deleteFlashcardSet } from '@/lib/firebase/flashcardStorage';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });
const WordList = dynamic(() => import('../../components/WordList'), { ssr: false });

interface Word {
  en: string;
  tr: string;
}

// FlashcardData'dan Word'e dönüştürme fonksiyonu
const convertFlashcardsToWords = (flashcards: FlashcardData[]): Word[] => {
  return flashcards.map(card => ({
    en: card.front,
    tr: card.back
  }));
};

export default function UploadFlashcardsPage() {
  const { tokens } = useTheme();
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
  const [currentSetId, setCurrentSetId] = useState<string>('');

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
      setCurrentSetId(setId);
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
      <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background }}>
        <Container maxWidth="4xl" className="py-8">
          <Heading1 className="mb-6 text-center">
            Kişisel Kelime Kartları
          </Heading1>
          <Card variant="elevated" className="p-8 text-center">
            <Text className="mb-4">
              Bu özelliği kullanmak için giriş yapmanız gerekmektedir.
            </Text>
            <Link href="/login?redirect=/upload-flashcards">
              <Button variant="primary">
                Giriş Yap
              </Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  if (showViewer && flashcards.length > 0) {
    const words = convertFlashcardsToWords(flashcards);
    return (
      <div className="min-h-screen pb-16" style={{ backgroundColor: tokens.colors.background }}>
        <Container maxWidth="6xl" className="py-8">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <Heading1 className="text-2xl md:text-3xl">
              {setName}
            </Heading1>
            <button
              onClick={() => {
                setShowViewer(false);
                setFlashcards([]);
                setSetName('');
                setCurrentSetId('');
              }}
              className="p-2 rounded-lg transition-all hover:bg-opacity-80"
              style={{
                backgroundColor: tokens.colors.cardBackground,
                color: tokens.colors.text
              }}
              title="Geri Dön"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* WordList Component */}
          <WordList words={words} categoryId={currentSetId || 'custom-flashcards'} isCustomCard={true} />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background }}>
      <Container maxWidth="6xl" className="py-8">
        <Heading1 className="mb-8 text-center">
          Kişisel Kelime Kartları
        </Heading1>

        {/* Notifications */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: `${tokens.colors.error}10`,
              border: `1px solid ${tokens.colors.error}30`
            }}
          >
            <Text style={{ color: tokens.colors.error }}>{error}</Text>
          </div>
        )}

        {success && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: `${tokens.colors.success}10`,
              border: `1px solid ${tokens.colors.success}30`
            }}
          >
            <Text style={{ color: tokens.colors.success }}>{success}</Text>
          </div>
        )}

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Upload Panel */}
          <Card variant="elevated" className="p-6">
            <Heading2 className="mb-4">
              Excel Dosyanızı Yükleyin
            </Heading2>

            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: `${tokens.colors.accent}10` }}>
              <Text className="text-sm mb-2">
                <strong>Excel Format:</strong>
              </Text>
              <ul className="text-sm space-y-1" style={{ color: tokens.colors.text }}>
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
                  borderColor: tokens.colors.accent,
                  backgroundColor: `${tokens.colors.accent}05`
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke={tokens.colors.accent}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <Text className="font-medium">
                  Dosya seçmek için tıklayın
                </Text>
                <Text className="text-sm mt-1 opacity-70">
                  veya sürükleyip bırakın
                </Text>
              </label>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${tokens.colors.accent}10` }}>
                <Text className="font-medium">
                  {flashcards.length} kelime yüklendi
                </Text>
              </div>
            )}
          </Card>

          {/* Preview & Save Panel */}
          <Card variant="elevated" className="p-6">
            <Heading2 className="mb-4">
              Önizleme ve Kaydet
            </Heading2>

            {flashcards.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text }}>
                    Set Adı
                  </label>
                  <Input
                    type="text"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    placeholder="Örn: YDS Kelimelerim"
                  />
                </div>

                <div className="mb-4 max-h-48 overflow-y-auto">
                  {flashcards.slice(0, 5).map((card, index) => (
                    <div
                      key={card.id}
                      className="mb-2 p-3 rounded-lg"
                      style={{ backgroundColor: `${tokens.colors.accent}05` }}
                    >
                      <Text className="text-sm">
                        <strong>{index + 1}.</strong> {card.front} → {card.back}
                        {card.notes && <span className="opacity-60"> ({card.notes})</span>}
                      </Text>
                    </div>
                  ))}
                  {flashcards.length > 5 && (
                    <Text className="text-sm text-center opacity-70">
                      ...ve {flashcards.length - 5} kelime daha
                    </Text>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowViewer(true)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Önizle
                  </Button>
                  <Button
                    onClick={handleSaveFlashcards}
                    disabled={isSaving}
                    variant="primary"
                    className="flex-1"
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke={tokens.colors.text}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <Text className="opacity-50">
                  Henüz dosya yüklenmedi
                </Text>
              </div>
            )}
          </Card>
        </div>

        {/* Saved Sets Section */}
        <Card variant="elevated" className="p-6">
          <Heading2 className="mb-4">
            Kaydedilmiş Kelime Setleriniz
          </Heading2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: tokens.colors.accent }}></div>
            </div>
          ) : savedSets.length > 0 ? (
            <div className="grid gap-3">
              {savedSets.map(set => (
                <div
                  key={set.id}
                  className="group flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: tokens.colors.background }}
                  onClick={() => handleLoadFlashcardSet(set.id)}
                >
                  <div className="flex-1 pointer-events-none">
                    <h3 className="font-medium group-hover:underline" style={{ color: tokens.colors.text }}>
                      {set.name}
                    </h3>
                    <Text className="text-sm opacity-70">
                      {set.cardCount} kelime • {set.createdAt.toLocaleDateString('tr-TR')}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteFlashcardSet(set.id, set.name)}
                      disabled={isDeleting === set.id}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: tokens.colors.errorLight,
                        color: tokens.colors.error,
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke={tokens.colors.text}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <Text className="opacity-50">
                Henüz kaydedilmiş kelime setiniz yok
              </Text>
            </div>
          )}
        </Card>
      </Container>

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