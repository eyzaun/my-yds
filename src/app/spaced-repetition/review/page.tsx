// src/app/spaced-repetition/review/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getReviewCards } from '@/lib/firebase/spacedRepetition';
import { SpacedRepetitionCard } from '@/types/spacedRepetition';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import { FlashcardData } from '@/types/flashcard';

export default function SpacedRepetitionReviewPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [reviewCards, setReviewCards] = useState<SpacedRepetitionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Kullanıcı giriş yapmamışsa yönlendir
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=/spaced-repetition/review');
    }
  }, [user, loading, router]);

  // Tekrar edilecek kartları yükle
  useEffect(() => {
    const loadReviewCards = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { cards, error } = await getReviewCards(user.uid, 'all', 50);

        if (error) {
          console.error('Review cards loading error:', error);
        } else if (cards) {
          setReviewCards(cards);
        }
      } catch (error) {
        console.error('Data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviewCards();
  }, [user]);

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div style={{ color: colors.text }}>Kartlar yükleniyor...</div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <p style={{ color: colors.text }} className="mb-4">
            Bu sayfayı görüntülemek için giriş yapmalısınız.
          </p>
          <Link
            href="/login?redirect=/spaced-repetition/review"
            className="px-6 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  // Kart yoksa
  if (reviewCards.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
            Tebrikler!
          </h2>
          <p className="mb-6" style={{ color: colors.text, opacity: 0.7 }}>
            Bugün tekrar edilecek kart yok. Yarın tekrar gelin!
          </p>
          <Link
            href="/spaced-repetition"
            className="inline-block px-6 py-3 rounded-lg"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Kartları FlashcardData formatına dönüştür
  const flashcardData: FlashcardData[] = reviewCards.map((card) => ({
    id: card.id,
    front: card.word,
    back: card.translation,
    notes: card.categoryName ? `Kategori: ${card.categoryName}` : undefined,
  }));

  // Kart tipi belirle (çoğunluğa göre)
  const customCardsCount = reviewCards.filter((c) => c.type === 'custom').length;
  const categoryCardsCount = reviewCards.filter((c) => c.type === 'category').length;
  const cardType: 'custom' | 'category' = customCardsCount > categoryCardsCount ? 'custom' : 'category';

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Üst Bilgi Paneli */}
      <div className="sticky top-0 z-10 py-4 px-4 shadow-md" style={{ backgroundColor: colors.cardBackground }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
              📚 Bugünkü Tekrarlar
            </h1>
            <Link
              href="/spaced-repetition"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              ← Geri Dön
            </Link>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1" style={{ color: colors.text }}>
                <span>İlerleme</span>
                <span>
                  {completedCount} / {reviewCards.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedCount / reviewCards.length) * 100}%`,
                    backgroundColor: colors.accent,
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.accent }}>
                {reviewCards.length - completedCount}
              </div>
              <div className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                Kalan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Deck */}
      <div className="py-8">
        <FlashcardDeck
          flashcards={flashcardData}
          categoryId="spaced-repetition"
          categoryName="Aralıklı Tekrar"
          initialIndex={currentCardIndex}
          quizMode={true}
          cardType={cardType}
        />
      </div>

      {/* Alt Bilgi */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-4" style={{ backgroundColor: `${colors.cardBackground}E6` }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-blue-400 text-sm font-semibold">
                {reviewCards.filter((c) => c.type === 'custom').length}
              </div>
              <div className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                Kendi Kartlarım
              </div>
            </div>

            <div>
              <div className="text-yellow-400 text-sm font-semibold">
                {reviewCards.filter((c) => c.type === 'category').length}
              </div>
              <div className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                Kategori Kartları
              </div>
            </div>

            <div>
              <div style={{ color: colors.accent }} className="text-sm font-semibold">
                {Math.round(
                  (completedCount / reviewCards.length) * 100
                )}%
              </div>
              <div className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                Tamamlanan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
