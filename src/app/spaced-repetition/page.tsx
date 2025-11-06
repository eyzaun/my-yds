// src/app/spaced-repetition/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getUserProgress,
  getReviewCards,
  getCategoryProgress,
} from '@/lib/firebase/spacedRepetition';
import {
  UserProgress,
  SpacedRepetitionCard,
  CategoryProgress,
} from '@/types/spacedRepetition';

export default function SpacedRepetitionPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [reviewCards, setReviewCards] = useState<SpacedRepetitionCard[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);

  // Kullanıcı giriş yapmamışsa yönlendir
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=/spaced-repetition');
    }
  }, [user, loading, router]);

  // İlerleme ve kartları yükle
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Kullanıcı ilerlemesini getir
        const { progress: userProgress, error: progressError } = await getUserProgress(user.uid);

        if (progressError) {
          console.error('Progress loading error:', progressError);
        } else if (userProgress) {
          setProgress(userProgress);
        }

        // Bugün tekrar edilecek kartları getir
        const { cards, error: cardsError } = await getReviewCards(user.uid, 'all', 50);

        if (cardsError) {
          console.error('Review cards loading error:', cardsError);
        } else if (cards) {
          setReviewCards(cards);
        }

        // Kategori ilerlemelerini getir
        const { categories, error: categoriesError } = await getCategoryProgress(user.uid);

        if (categoriesError) {
          console.error('Category progress loading error:', categoriesError);
        } else if (categories) {
          setCategoryProgress(categories);
        }
      } catch (error) {
        console.error('Data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div style={{ color: colors.text }}>Yükleniyor...</div>
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
            Aralıklı tekrar sistemini kullanmak için giriş yapmalısınız.
          </p>
          <Link
            href="/login?redirect=/spaced-repetition"
            className="px-6 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            📚 Aralıklı Tekrar Sistemi
          </h1>
          <p style={{ color: colors.text, opacity: 0.7 }}>
            Kelime öğrenmenizi optimize edin - SM-2 algoritması ile
          </p>
        </div>

        {/* Dashboard Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Bugün Tekrar Et */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.accent }}>
                {progress?.dueToday || 0}
              </div>
              <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                Bugün Tekrar Edilecek
              </div>
            </div>
          </div>

          {/* Tamamlanan */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.accent }}>
                {progress?.completedToday || 0}
              </div>
              <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                Bugün Tamamlanan
              </div>
            </div>
          </div>

          {/* Toplam Öğrenilen */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.accent }}>
                {progress?.totalCards || 0}
              </div>
              <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                Toplam Kart
              </div>
            </div>
          </div>

          {/* Günlük Seri */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.accent }}>
                {progress?.currentStreak || 0}
              </div>
              <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                Günlük Seri
              </div>
            </div>
          </div>
        </div>

        {/* Bugün Çalış Butonu */}
        {progress && progress.dueToday > 0 && (
          <div className="mb-8 text-center">
            <Link
              href="/spaced-repetition/review"
              className="inline-block px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              🚀 Bugünkü Kelimeleri Tekrar Et ({progress.dueToday} kart)
            </Link>
          </div>
        )}

        {/* İlerleme İstatistikleri */}
        {progress && progress.totalCards > 0 && (
          <div
            className="p-6 rounded-lg shadow-lg mb-8"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              📈 Genel İlerleme
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Yeni Kartlar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: colors.text }}>Yeni Kartlar</span>
                  <span style={{ color: colors.accent }}>{progress.newCards}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(progress.newCards / progress.totalCards) * 100}%`,
                      backgroundColor: '#60A5FA',
                    }}
                  />
                </div>
              </div>

              {/* Öğreniliyor */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: colors.text }}>Öğreniliyor</span>
                  <span style={{ color: colors.accent }}>{progress.learningCards}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(progress.learningCards / progress.totalCards) * 100}%`,
                      backgroundColor: '#FBBF24',
                    }}
                  />
                </div>
              </div>

              {/* Ustalaşıldı */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: colors.text }}>Ustalaşıldı</span>
                  <span style={{ color: colors.accent }}>{progress.masteredCards}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(progress.masteredCards / progress.totalCards) * 100}%`,
                      backgroundColor: '#34D399',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Doğruluk Oranı */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span style={{ color: colors.text }}>Genel Doğruluk Oranı</span>
                <span style={{ color: colors.accent }} className="font-bold">
                  %{progress.overallAccuracy}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${progress.overallAccuracy}%`,
                    backgroundColor: colors.accent,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Kart Kategorileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Kendi Kartlarım */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
              📝 Kendi Kartlarım
            </h3>
            <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
              Yüklediğiniz flashcard setlerinden oluşan kartlar
            </p>
            <div className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
              {progress?.customCards || 0} kart
            </div>
            <Link
              href="/upload-flashcards"
              className="inline-block px-6 py-2 rounded-lg"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              Kartları Görüntüle
            </Link>
          </div>

          {/* Kategori Kartları */}
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
              📚 Kategori Kartları
            </h3>
            <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
              Sitedeki kategorilerden çalıştığınız kelimeler
            </p>
            <div className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
              {progress?.categoryCards || 0} kart
            </div>
            <Link
              href="/category"
              className="inline-block px-6 py-2 rounded-lg"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              Kategorileri Görüntüle
            </Link>
          </div>
        </div>

        {/* Kategori İlerlemeleri */}
        {categoryProgress.length > 0 && (
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              📊 Kategori İlerlemeleri
            </h2>

            <div className="space-y-4">
              {categoryProgress.map((cat) => (
                <div key={cat.categoryId} className="border-b pb-4" style={{ borderColor: `${colors.accent}30` }}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold" style={{ color: colors.text }}>
                      {cat.categoryName}
                    </h3>
                    <span style={{ color: colors.accent }}>
                      {cat.learnedWords} / {cat.totalWords} öğrenildi
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(cat.learnedWords / cat.totalWords) * 100}%`,
                        backgroundColor: colors.accent,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                    <span>Doğruluk: %{cat.accuracy}</span>
                    {cat.lastStudied && (
                      <span>
                        Son çalışma: {new Date(cat.lastStudied).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İlk Kullanım Mesajı */}
        {progress && progress.totalCards === 0 && (
          <div
            className="p-8 rounded-lg shadow-lg text-center"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              Henüz hiç kart yok!
            </h2>
            <p className="mb-6" style={{ color: colors.text, opacity: 0.7 }}>
              Aralıklı tekrar sistemini kullanmaya başlamak için quiz modunda kelime çalışın.
            </p>
            <div className="space-y-3">
              <p style={{ color: colors.text }}>Kelime çalışmak için:</p>
              <Link
                href="/category"
                className="inline-block px-6 py-3 rounded-lg mr-3"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                Kategorilerden Çalış
              </Link>
              <Link
                href="/upload-flashcards"
                className="inline-block px-6 py-3 rounded-lg"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                Kendi Kartlarını Yükle
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
