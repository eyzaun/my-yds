'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
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
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading1, Heading2, Heading3, Text } from '@/components/design-system/Typography';

const SpacedRepetitionQuiz = dynamic(
  () => import('@/components/SpacedRepetitionQuiz'),
  { ssr: false }
);

export default function SpacedRepetitionPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();
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
    if (!user) {
      router.push('/login?redirect=/spaced-repetition');
      return;
    }

    loadData();
  }, [user, router]);

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

  if (!user) {
    return null; // Will redirect
  }

  if (quizMode && selectedGroup) {
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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: tokens.colors.background.primary }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: tokens.colors.primary[600] }}
          />
          <Text>Yükleniyor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: tokens.colors.background.primary }}>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Heading1>📚 Aralıklı Tekrar Sistemi</Heading1>
          <Text className="opacity-70">
            Bilimsel yöntemlerle kelime öğrenin
          </Text>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Due Today */}
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tokens.colors.primary[600] }}>
                {statistics.dueToday}
              </div>
              <Text className="text-sm opacity-70">
                Bugün Tekrar Et
              </Text>
            </Card>

            {/* Total Cards */}
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tokens.colors.text.primary }}>
                {statistics.totalCards}
              </div>
              <Text className="text-sm opacity-70">
                Toplam Kelime
              </Text>
            </Card>

            {/* Accuracy */}
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tokens.colors.primary[600] }}>
                {statistics.overallAccuracy}%
              </div>
              <Text className="text-sm opacity-70">
                Doğruluk Oranı
              </Text>
            </Card>

            {/* Current Streak */}
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tokens.colors.primary[600] }}>
                🔥 {streaks.currentStreak}
              </div>
              <Text className="text-sm opacity-70">
                Günlük Seri
              </Text>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        {statistics && statistics.totalCards > 0 && (
          <Card className="p-6 mb-8">
            <Heading2>📊 İlerleme Durumu</Heading2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: tokens.colors.text.primary }}>
                  {statistics.newCards}
                </div>
                <Text className="text-sm opacity-70">
                  Yeni
                </Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: tokens.colors.primary[600] }}>
                  {statistics.learningCards}
                </div>
                <Text className="text-sm opacity-70">
                  Öğreniliyor
                </Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: tokens.colors.green[500] }}>
                  {statistics.masteredCards}
                </div>
                <Text className="text-sm opacity-70">
                  Ustalaşıldı
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Start Review - All Cards */}
        {statistics && statistics.dueToday > 0 && (
          <Card
            className="p-8 mb-8 text-center cursor-pointer hover:opacity-90 transition-all"
            style={{ backgroundColor: tokens.colors.primary[600] }}
            onClick={() => startQuiz('all')}
          >
            <Heading2 style={{ color: tokens.colors.text.inverse }}>
              🎯 Tüm Kartları Tekrar Et
            </Heading2>
            <Text style={{ color: tokens.colors.text.inverse, opacity: 0.9 }}>
              {statistics.dueToday} kart bugün için hazır
            </Text>
          </Card>
        )}

        {/* Category Groups */}
        <div className="mb-8">
          <Heading2>📂 Kategoriler</Heading2>

          {groupSummaries.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <Heading3>Henüz kelime kartınız yok</Heading3>
              <Text className="mb-6 opacity-70">
                Quiz modunu kullanarak kelime öğrenmeye başlayın!
              </Text>
              <Button
                onClick={() => router.push('/')}
              >
                Kategorilere Git
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {groupSummaries.map((group, index) => (
                <Card
                  key={`${group.type}-${group.categoryId || 'custom'}-${index}`}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() =>
                    group.dueToday > 0 &&
                    startQuiz(group.type, group.categoryId, group.categoryName)
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Heading3>{group.categoryName}</Heading3>
                      <Text className="text-sm opacity-70">
                        {group.totalCards} kelime
                      </Text>
                    </div>
                    {group.dueToday > 0 && (
                      <div
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: tokens.colors.primary[600], color: tokens.colors.text.inverse }}
                      >
                        {group.dueToday} hazır
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div>
                      <div className="font-semibold" style={{ color: tokens.colors.text.primary }}>
                        {group.newCards}
                      </div>
                      <Text className="opacity-60 text-sm">
                        Yeni
                      </Text>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: tokens.colors.primary[600] }}>
                        {group.learningCards}
                      </div>
                      <Text className="opacity-60 text-sm">
                        Öğreniliyor
                      </Text>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: tokens.colors.green[500] }}>
                        {group.masteredCards}
                      </div>
                      <Text className="opacity-60 text-sm">
                        Ustalaşıldı
                      </Text>
                    </div>
                  </div>

                  <Text className="text-sm text-center opacity-70">
                    Doğruluk: {group.accuracy}%
                  </Text>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentStats.length > 0 && (
          <Card className="p-6">
            <Heading2>📈 Son 7 Günlük Aktivite</Heading2>
            <div className="space-y-2">
              {recentStats.map((stat) => (
                <div
                  key={stat.date}
                  className="flex items-center justify-between py-2 border-b border-opacity-10"
                  style={{ borderColor: tokens.colors.text.primary }}
                >
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: tokens.colors.text.primary }}>
                      {new Date(stat.date).toLocaleDateString('tr-TR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div style={{ color: tokens.colors.text.primary }}>
                      <span className="font-semibold">{stat.reviewedCards}</span> kart
                    </div>
                    <div style={{ color: tokens.colors.green[500] }}>
                      ✓ {stat.correctAnswers}
                    </div>
                    <div style={{ color: tokens.colors.red[500] }}>
                      ✗ {stat.incorrectAnswers}
                    </div>
                    <div style={{ color: tokens.colors.text.primary }} className="opacity-70">
                      {stat.reviewedCards > 0
                        ? Math.round((stat.correctAnswers / stat.reviewedCards) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
