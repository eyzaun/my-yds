'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  getCardStatistics,
  getCardGroupSummaries,
  getReviewCards,
  getRecentStatistics,
  calculateStreaks,
} from '@/lib/firebase/spacedRepetition';
import {
  UserStatistics,
  CardGroupSummary,
  SpacedRepetitionCard,
  DailyStatistics,
} from '@/types/spacedRepetition';
import dynamic from 'next/dynamic';

const SpacedRepetitionQuiz = dynamic(
  () => import('@/components/SpacedRepetitionQuiz'),
  { ssr: false }
);

export default function SpacedRepetitionPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [groupSummaries, setGroupSummaries] = useState<CardGroupSummary[]>([]);
  const [recentStats, setRecentStats] = useState<DailyStatistics[]>([]);
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0 });

  // Quiz mode
  const [quizMode, setQuizMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    type: 'custom' | 'category' | 'all';
    categoryId?: string;
    categoryName?: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Don't redirect, just show loading as false
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load statistics in parallel
      const [stats, groups, recent, streakData] = await Promise.all([
        getCardStatistics(user.uid),
        getCardGroupSummaries(user.uid),
        getRecentStatistics(user.uid, 7),
        calculateStreaks(user.uid),
      ]);

      // Update streaks in statistics
      stats.currentStreak = streakData.currentStreak;
      stats.longestStreak = streakData.longestStreak;

      setStatistics(stats);
      setGroupSummaries(groups);
      setRecentStats(recent);
      setStreaks(streakData);
    } catch (error) {
      console.error('Error loading spaced repetition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (
    type: 'custom' | 'category' | 'all',
    categoryId?: string,
    categoryName?: string
  ) => {
    setSelectedGroup({ type, categoryId, categoryName });
    setQuizMode(true);
  };

  const endQuiz = () => {
    setQuizMode(false);
    setSelectedGroup(null);
    loadData(); // Refresh data after quiz
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.accent }}
          />
          <p style={{ color: colors.text }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show quiz if in quiz mode
  if (quizMode && selectedGroup && user) {
    return (
      <SpacedRepetitionQuiz
        userId={user.uid}
        type={selectedGroup.type}
        categoryId={selectedGroup.categoryId}
        categoryName={selectedGroup.categoryName}
        onExit={endQuiz}
      />
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
                📚 Aralıklı Tekrar Sistemi
              </h1>
              <p className="text-lg opacity-70 mb-6" style={{ color: colors.text }}>
                Bilimsel SM-2 algoritması ile kelime öğrenin
              </p>
            </div>

            <div
              className="rounded-xl p-8 mb-8 max-w-2xl mx-auto"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="mb-4">
                <svg className="w-16 h-16" style={{ color: colors.text, margin: '0 auto', opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                Giriş Yapmanız Gerekiyor
              </h2>
              <p className="mb-6 opacity-80" style={{ color: colors.text }}>
                Aralıklı tekrar sistemini kullanabilmek ve ilerlemenizi takip edebilmek için
                giriş yapmanız gerekmektedir.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/login?redirect=/spaced-repetition')}
                  className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.accent }}
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-8 py-3 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    border: `2px solid ${colors.accent}`,
                  }}
                >
                  Kayıt Ol
                </button>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.cardBackground }}
              >
                <div className="text-4xl mb-3">
                <svg className="w-10 h-10" style={{ color: colors.accent, margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                  Günlük Seri
                </h3>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  Her gün çalışarak serinizi koruyun ve motivasyonunuzu artırın
                </p>
              </div>

              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.cardBackground }}
              >
                <div className="text-4xl mb-3">
                <svg className="w-10 h-10" style={{ color: colors.accent, margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                  İlerleme Takibi
                </h3>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  Detaylı istatistikler ile öğrenme ilerlemenizi görselleştirin
                </p>
              </div>

              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.cardBackground }}
              >
                <div className="text-4xl mb-3">
                <svg className="w-10 h-10" style={{ color: colors.accent, margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                  Akıllı Algoritma
                </h3>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  SM-2 algoritması en uygun tekrar zamanlarını belirler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.text }}>
            Aralıklı Tekrar Sistemi
          </h1>
          <p className="opacity-70" style={{ color: colors.text }}>
            Bilimsel yöntemlerle kelime öğrenin
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Due Today */}
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: colors.accent }}>
                {statistics.dueToday}
              </div>
              <div className="text-sm opacity-70" style={{ color: colors.text }}>
                Bugün Tekrar Et
              </div>
            </div>

            {/* Total Cards */}
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: colors.text }}>
                {statistics.totalCards}
              </div>
              <div className="text-sm opacity-70" style={{ color: colors.text }}>
                Toplam Kelime
              </div>
            </div>

            {/* Accuracy */}
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: colors.accent }}>
                {statistics.overallAccuracy}%
              </div>
              <div className="text-sm opacity-70" style={{ color: colors.text }}>
                Doğruluk Oranı
              </div>
            </div>

            {/* Current Streak */}
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2" style={{ color: colors.accent }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                {streaks.currentStreak}
              </div>
              <div className="text-sm opacity-70" style={{ color: colors.text }}>
                Günlük Seri
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {statistics && statistics.totalCards > 0 && (
          <div
            className="rounded-xl p-6 mb-8"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              İlerleme Durumu
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {statistics.newCards}
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.text }}>
                  Yeni
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.accent }}>
                  {statistics.learningCards}
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.text }}>
                  Öğreniliyor
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1 text-green-500">
                  {statistics.masteredCards}
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.text }}>
                  Ustalaşıldı
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Review - All Cards */}
        {statistics && statistics.dueToday > 0 && (
          <div
            className="rounded-xl p-8 mb-8 text-center cursor-pointer hover:opacity-90 transition-all"
            style={{ backgroundColor: colors.accent }}
            onClick={() => startQuiz('all')}
          >
            <h2 className="text-2xl font-bold mb-2 text-white">
              Tüm Kartları Tekrar Et
            </h2>
            <p className="text-white opacity-90">
              {statistics.dueToday} kart bugün için hazır
            </p>
          </div>
        )}

        {/* Category Groups */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text }}>
            Kategoriler
          </h2>

          {groupSummaries.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="mb-4">
                <svg className="w-16 h-16" style={{ color: colors.text, margin: '0 auto', opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                Henüz kelime kartınız yok
              </h3>
              <p className="mb-6 opacity-70" style={{ color: colors.text }}>
                Quiz modunu kullanarak kelime öğrenmeye başlayın!
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-lg font-medium text-white"
                style={{ backgroundColor: colors.accent }}
              >
                Kategorilere Git
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {groupSummaries.map((group, index) => (
                <div
                  key={`${group.type}-${group.categoryId || 'custom'}-${index}`}
                  className="rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
                  style={{ backgroundColor: colors.cardBackground }}
                  onClick={() =>
                    group.dueToday > 0 &&
                    startQuiz(group.type, group.categoryId, group.categoryName)
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                        {group.categoryName}
                      </h3>
                      <p className="text-sm opacity-70" style={{ color: colors.text }}>
                        {group.totalCards} kelime
                      </p>
                    </div>
                    {group.dueToday > 0 && (
                      <div
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: colors.accent }}
                      >
                        {group.dueToday} hazır
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div>
                      <div className="font-semibold" style={{ color: colors.text }}>
                        {group.newCards}
                      </div>
                      <div className="opacity-60" style={{ color: colors.text }}>
                        Yeni
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.accent }}>
                        {group.learningCards}
                      </div>
                      <div className="opacity-60" style={{ color: colors.text }}>
                        Öğreniliyor
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-green-500">
                        {group.masteredCards}
                      </div>
                      <div className="opacity-60" style={{ color: colors.text }}>
                        Ustalaşıldı
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-center opacity-70" style={{ color: colors.text }}>
                    Doğruluk: {group.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentStats.length > 0 && (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Son 7 Günlük Aktivite
            </h2>
            <div className="space-y-2">
              {recentStats.map((stat) => (
                <div
                  key={stat.date}
                  className="flex items-center justify-between py-2 border-b border-opacity-10"
                  style={{ borderColor: colors.text }}
                >
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: colors.text }}>
                      {new Date(stat.date).toLocaleDateString('tr-TR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div style={{ color: colors.text }}>
                      <span className="font-semibold">{stat.reviewedCards}</span> kart
                    </div>
                    <div className="text-green-500">
                      ✓ {stat.correctAnswers}
                    </div>
                    <div className="text-red-500">
                      ✗ {stat.incorrectAnswers}
                    </div>
                    <div style={{ color: colors.text }} className="opacity-70">
                      {stat.reviewedCards > 0
                        ? Math.round((stat.correctAnswers / stat.reviewedCards) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
