'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface CategoryProgress {
  index: number;
  timestamp: Timestamp;
  viewedCount: number;
  totalCards: number;
}

interface UserProgress {
  [categoryId: string]: CategoryProgress;
}

export function ProgressOverview() {
  const [user] = useAuthState(auth);
  const [progress, setProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userProgressRef = doc(db, 'userProgress', user.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (userProgressDoc.exists()) {
          setProgress(userProgressDoc.data() as UserProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <Heading2 style={{ marginBottom: designTokens.spacing.md }}>
          İlerlemeniz Yükleniyor...
        </Heading2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: designTokens.colors.primary[600] }}></div>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <Heading2 style={{ marginBottom: designTokens.spacing.md }}>
          İlerlemenizi Görmek İçin Giriş Yapın
        </Heading2>
        <Text>
          Çalışma ilerlemenizi kaydetmek ve kaldığınız yerden devam etmek için giriş yapmanız gerekiyor.
        </Text>
      </Card>
    );
  }

  if (Object.keys(progress).length === 0) {
    return (
      <Card>
        <Heading2 style={{ marginBottom: designTokens.spacing.md }}>
          Henüz İlerleme Kaydedilmedi
        </Heading2>
        <Text>
          Kelime kategorilerinden birini seçerek çalışmaya başlayabilirsiniz.
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Heading2 style={{ marginBottom: designTokens.spacing.md }}>
        Çalışma İlerlemeniz
      </Heading2>

      <div className="grid" style={{ gap: designTokens.spacing.md }}>
        {Object.entries(progress).map(([categoryId, data]) => (
          <div
            key={categoryId}
            className="block cursor-pointer transition-all hover:scale-105"
            style={{
              padding: designTokens.spacing.md,
              borderRadius: designTokens.borderRadius.md,
              backgroundColor: `${designTokens.colors.primary[600]}10`,
              border: `1px solid ${designTokens.colors.primary[600]}30`
            }}
            onClick={() => {
              window.location.href = `/${categoryId}?index=${data.index}`;
            }}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: designTokens.spacing.sm }}>
              <h3 className="font-medium" style={{ color: designTokens.colors.text }}>
                {categories.find((c) => c.path === `/${categoryId}`)?.name || categoryId}
              </h3>
              <span style={{ color: designTokens.colors.primary[600] }}>Kart {data.index + 1} / {data.totalCards}</span>
            </div>

            <div className="w-full rounded-full overflow-hidden" style={{
              height: '8px',
              backgroundColor: designTokens.colors.background.secondary,
              marginBottom: designTokens.spacing.sm
            }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round((data.viewedCount / data.totalCards) * 100)}%`,
                  backgroundColor: designTokens.colors.primary[600]
                }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: designTokens.colors.textSecondary }}>
                %{Math.round((data.viewedCount / data.totalCards) * 100)} tamamlandı
              </span>
              <span style={{ color: designTokens.colors.textSecondary }}>
                Son çalışma: {new Date(data.timestamp.seconds * 1000).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
