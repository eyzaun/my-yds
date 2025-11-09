// src/app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileInfo from '@/components/auth/ProfileInfo';
import RequireAuth from '@/utils/requireAuth';
import { getAllCategoryProgress, getUserScores } from '@/firebase/firestore';
import Link from 'next/link';
import { UserProgress, QuizScore } from '@/firebase/types';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading1, Heading2 } from '@/components/design-system/Typography';
import { useDesignTokens } from '@/hooks/useDesignTokens';

// Replace path alias import with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const ProfilePage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategori isimlerini eşleştirme
  const categoryNames: Record<string, string> = {
    'academic-terms': 'Akademik Terimler',
    'abstract': 'Soyut Kavramlar',
    'nature': 'Doğa ve Çevre',
    'business': 'İş Dünyası',
    'official': 'Resmi İletişim',
    'social-sciences': 'Sosyal Bilimler',
    'conjunctions': 'Bağlaçlar',
    'phrasal': 'Deyimsel İfadeler',
    'phrasal2': 'Deyimsel İfadeler 2',
    'all-words': 'Tüm Kelimeler'
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Tüm kategorilerdeki ilerlemeyi alma
          const progressResult = await getAllCategoryProgress(user.uid);
          if (progressResult.progressByCategory) {
            setProgress(progressResult.progressByCategory);
          }

          // Test sonuçlarını alma
          const scoresResult = await getUserScores(user.uid);
          if (scoresResult.scores) {
            setScores(scoresResult.scores as QuizScore[]);
          }
        } catch (error) {
          console.error('Kullanıcı verileri alınırken hata oluştu:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <RequireAuth>
      <div className="min-h-screen" style={{ backgroundColor: designTokens.colors.background.primary }}>
        <Container maxWidth="4xl">
          <Heading1 className="mb-8 text-center">
            Profil
          </Heading1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileInfo />
            </div>

            <div className="md:col-span-2">
              <Card variant="elevated" className="mb-6">
                <Heading2 className="mb-4">
                  Kelime Çalışma İlerlemesi
                </Heading2>

                {loading ? (
                  <div style={{ color: designTokens.colors.text.primary }}>Yükleniyor...</div>
                ) : Object.keys(progress).length > 0 ? (
                  <div className="space-y-4">
                    {Object.keys(progress).map((categoryId) => {
                      const category = progress[categoryId];
                      const categoryName = categoryNames[categoryId] || categoryId;
                      const studiedCount = category.studiedWords?.length || 0;

                      return (
                        <div key={categoryId} className="border-b pb-2" style={{ borderColor: `${designTokens.colors.primary[600]}40` }}>
                          <div className="flex justify-between mb-1">
                            <span style={{ color: designTokens.colors.text.primary }}>{categoryName}</span>
                            <span style={{ color: designTokens.colors.primary[600] }}>{studiedCount} kelime</span>
                          </div>
                          <Link href={`/${categoryId}`}>
                            <span className="text-sm" style={{ color: designTokens.colors.primary[600] }}>Çalışmaya Devam Et</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: designTokens.colors.text.primary }}>
                    Henüz kelime çalışmadınız.
                    <Link href="/all-words">
                      <span className="ml-2" style={{ color: designTokens.colors.primary[600] }}>Kelimeleri Keşfedin</span>
                    </Link>
                  </div>
                )}
              </Card>

              <Card variant="elevated">
                <Heading2 className="mb-4">
                  Test Sonuçları
                </Heading2>

                {loading ? (
                  <div style={{ color: designTokens.colors.text.primary }}>Yükleniyor...</div>
                ) : scores.length > 0 ? (
                  <div className="space-y-4">
                    {scores.slice(0, 5).map((score, index) => {
                      const categoryName = categoryNames[score.categoryId] || score.categoryId;
                      const scorePercentage = ((score.score / score.totalQuestions) * 100).toFixed(0);
                      const date = new Date(score.date.seconds * 1000);
                      const formattedDate = date.toLocaleDateString('tr-TR');

                      return (
                        <div key={index} className="border-b pb-2" style={{ borderColor: `${designTokens.colors.primary[600]}40` }}>
                          <div className="flex justify-between mb-1">
                            <span style={{ color: designTokens.colors.text.primary }}>{categoryName}</span>
                            <span style={{ color: Number(scorePercentage) >= 70 ? designTokens.colors.status.success : Number(scorePercentage) >= 50 ? designTokens.colors.status.warning : designTokens.colors.status.error }}>
                              %{scorePercentage} ({score.score}/{score.totalQuestions})
                            </span>
                          </div>
                          <div className="text-sm" style={{ color: designTokens.colors.text.secondary }}>
                            {formattedDate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: designTokens.colors.text.primary }}>
                    Henüz test çözmediniz.
                    <Link href="/all-words">
                      <span className="ml-2" style={{ color: designTokens.colors.primary[600] }}>Testleri Keşfedin</span>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Container>
        <ClientOnlyAd
          slot="profile-banner"
          format="auto"
          className="my-4 mx-auto"
        />
        <ClientOnlyAd
          slot="profile-footer"
          format="horizontal"
          className="my-4 mx-auto max-w-6xl px-4"
        />
      </div>
    </RequireAuth>
  );
};

export default ProfilePage;
