// src/app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ProfileInfo from '@/components/auth/ProfileInfo';
import RequireAuth from '@/utils/requireAuth';
import { getAllCategoryProgress, getUserScores } from '@/firebase/firestore';
import Link from 'next/link';
import { UserProgress, QuizScore } from '@/firebase/types';
import dynamic from 'next/dynamic';

// Replace path alias import with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const ProfilePage = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
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
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
            Profil
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileInfo />
            </div>

            <div className="md:col-span-2">
              <div className="p-6 rounded-lg shadow-lg mb-6" style={{ backgroundColor: colors.cardBackground }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Kelime Çalışma İlerlemesi
                </h2>

                {loading ? (
                  <div style={{ color: colors.text }}>Yükleniyor...</div>
                ) : Object.keys(progress).length > 0 ? (
                  <div className="space-y-4">
                    {Object.keys(progress).map((categoryId) => {
                      const category = progress[categoryId];
                      const categoryName = categoryNames[categoryId] || categoryId;
                      const studiedCount = category.studiedWords?.length || 0;
                      
                      return (
                        <div key={categoryId} className="border-b pb-2" style={{ borderColor: `${colors.accent}40` }}>
                          <div className="flex justify-between mb-1">
                            <span style={{ color: colors.text }}>{categoryName}</span>
                            <span style={{ color: colors.accent }}>{studiedCount} kelime</span>
                          </div>
                          <Link href={`/${categoryId}`}>
                            <span className="text-sm" style={{ color: colors.accent }}>Çalışmaya Devam Et</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: colors.text }}>
                    Henüz kelime çalışmadınız. 
                    <Link href="/all-words">
                      <span className="ml-2" style={{ color: colors.accent }}>Kelimeleri Keşfedin</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.cardBackground }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Test Sonuçları
                </h2>

                {loading ? (
                  <div style={{ color: colors.text }}>Yükleniyor...</div>
                ) : scores.length > 0 ? (
                  <div className="space-y-4">
                    {scores.slice(0, 5).map((score, index) => {
                      const categoryName = categoryNames[score.categoryId] || score.categoryId;
                      const scorePercentage = ((score.score / score.totalQuestions) * 100).toFixed(0);
                      const date = new Date(score.date.seconds * 1000);
                      const formattedDate = date.toLocaleDateString('tr-TR');
                      
                      return (
                        <div key={index} className="border-b pb-2" style={{ borderColor: `${colors.accent}40` }}>
                          <div className="flex justify-between mb-1">
                            <span style={{ color: colors.text }}>{categoryName}</span>
                            <span style={{ color: Number(scorePercentage) >= 70 ? 'green' : Number(scorePercentage) >= 50 ? 'orange' : 'red' }}>
                              %{scorePercentage} ({score.score}/{score.totalQuestions})
                            </span>
                          </div>
                          <div className="text-sm" style={{ color: colors.textSecondary }}>
                            {formattedDate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: colors.text }}>
                    Henüz test çözmediniz. 
                    <Link href="/all-words">
                      <span className="ml-2" style={{ color: colors.accent }}>Testleri Keşfedin</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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