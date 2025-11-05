'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { FlashcardData } from '@/types/flashcard';
import { parseExcelFile, convertExcelRowsToFlashcards } from '@/utils/excelParser';
import {
  saveFlashcardSet,
  getUserFlashcardSets,
  getFlashcardsBySetId,
  deleteFlashcardSet
} from '@/lib/firebase/flashcardStorage';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import ExcelUploader from '@/components/flashcards/ExcelUploader';
import AdBanner from '@/components/AdBanner';

interface SavedSet {
  id: string;
  name: string;
  cardCount: number;
  createdAt: Date;
}

export default function UploadFlashcardsPage() {
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [setName, setSetName] = useState('');
  const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadSavedSets();
      } else {
        setSavedSets([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load saved flashcard sets
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

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setError(null);
    setSuccess(null);
    setIsFileLoading(true);

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
    } finally {
      setIsFileLoading(false);
    }
  };

  // Save flashcards to Firebase
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
      }, 2000);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Kelime seti kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete flashcard set
  const handleDeleteFlashcardSet = async (setId: string, setNameToDelete: string) => {
    if (!confirm(`"${setNameToDelete}" kelime setini silmek istediğinize emin misiniz?`)) {
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

  // Load and view flashcard set
  const handleViewFlashcardSet = async (setId: string) => {
    try {
      setIsLoading(true);
      const cards = await getFlashcardsBySetId(setId);
      setFlashcards(cards);
      setSelectedSetId(setId);
      setShowViewer(true);
    } catch (err) {
      console.error('Error loading flashcard set:', err);
      setError('Kelime seti yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close viewer
  const handleCloseViewer = () => {
    setShowViewer(false);
    setFlashcards([]);
    setSelectedSetId(null);
  };

  // Show flashcard viewer
  if (showViewer && flashcards.length > 0) {
    return (
      <FlashcardDeck
        flashcards={flashcards}
        mode="flashcard"
        quizMode={true}
        categoryId={selectedSetId || 'uploaded'}
        onClose={handleCloseViewer}
      />
    );
  }

  // Main page
  return (
    <div
      className="min-h-screen pb-16"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1
            className="text-2xl md:text-3xl font-bold mb-6 text-center"
            style={{ color: colors.text }}
          >
            Kendi Kartlarını Oluştur
          </h1>

          {/* User authentication notice */}
          {!user && (
            <div
              className="mb-6 p-4 rounded-lg text-center"
              style={{ backgroundColor: `${colors.accent}30`, color: colors.text }}
            >
              <p className="mb-2">
                Kelime kartlarını kaydetmek için giriş yapmanız gerekmektedir.
              </p>
              <div className="flex justify-center gap-4 mt-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.accent, color: 'white' }}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.cardBackground, color: colors.text }}
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          )}

          {/* Error/Success messages */}
          {error && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: 'rgb(248, 113, 113)', color: 'white' }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: 'rgb(74, 222, 128)', color: 'white' }}
            >
              {success}
            </div>
          )}

          {/* Excel Upload Section */}
          <div
            className="mb-8 p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: colors.text }}
            >
              Excel Dosyasından Yükle
            </h2>

            <ExcelUploader
              onFileUpload={handleFileUpload}
              isLoading={isFileLoading}
            />

            {/* Preview and Save */}
            {flashcards.length > 0 && (
              <div className="mt-6">
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    Set Adı
                  </label>
                  <input
                    type="text"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.accent}50`
                    }}
                    placeholder="Kelime seti adı girin..."
                  />
                </div>

                <div className="mb-4 text-sm" style={{ color: colors.text }}>
                  <p>Yüklenen kelime sayısı: <strong>{flashcards.length}</strong></p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowViewer(true)}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.cardBackground,
                      color: colors.text,
                      border: `2px solid ${colors.accent}`
                    }}
                  >
                    Önizleme
                  </button>

                  {user && (
                    <button
                      onClick={handleSaveFlashcards}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.accent, color: 'white' }}
                    >
                      {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div
              className="mt-6 p-4 rounded-lg text-sm"
              style={{ backgroundColor: colors.background }}
            >
              <p className="font-semibold mb-2" style={{ color: colors.text }}>
                Excel formatı:
              </p>
              <ul className="list-disc list-inside space-y-1" style={{ color: colors.text, opacity: 0.8 }}>
                <li>Sütun C: İngilizce kelime</li>
                <li>Sütun D: Türkçe anlamı</li>
                <li>Sütun E: Notlar (opsiyonel)</li>
              </ul>
            </div>
          </div>

          {/* Saved Sets Section */}
          {user && (
            <div
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                Kaydedilmiş Kelime Setleri
              </h2>

              {isLoading ? (
                <div className="text-center py-8" style={{ color: colors.text }}>
                  Yükleniyor...
                </div>
              ) : savedSets.length === 0 ? (
                <div className="text-center py-8" style={{ color: colors.text, opacity: 0.7 }}>
                  Henüz kaydedilmiş kelime seti bulunmuyor.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedSets.map((set) => (
                    <div
                      key={set.id}
                      className="p-4 rounded-lg flex justify-between items-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.text }}>
                          {set.name}
                        </h3>
                        <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                          {set.cardCount} kelime • {new Date(set.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewFlashcardSet(set.id)}
                          className="px-3 py-1 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: colors.accent, color: 'white' }}
                        >
                          Çalış
                        </button>
                        <button
                          onClick={() => handleDeleteFlashcardSet(set.id, set.name)}
                          disabled={isDeleting === set.id}
                          className="px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50"
                          style={{
                            backgroundColor: 'rgb(248, 113, 113)',
                            color: 'white'
                          }}
                        >
                          {isDeleting === set.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ad Banner */}
          <div className="mt-8">
            <AdBanner slot="upload-flashcards-footer" />
          </div>
        </div>
      </div>
    </div>
  );
}
