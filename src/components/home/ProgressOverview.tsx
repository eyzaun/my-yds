'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { categories } from '@/data/categories';

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
  const { colors } = useTheme();
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
      <div className="p-6 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
          İlerlemeniz Yükleniyor...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: colors.accent }}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
          İlerlemenizi Görmek İçin Giriş Yapın
        </h2>
        <p style={{ color: colors.text }}>
          Çalışma ilerlemenizi kaydetmek ve kaldığınız yerden devam etmek için giriş yapmanız gerekiyor.
        </p>
      </div>
    );
  }

  if (Object.keys(progress).length === 0) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
          Henüz İlerleme Kaydedilmedi
        </h2>
        <p style={{ color: colors.text }}>
          Kelime kategorilerinden birini seçerek çalışmaya başlayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
        Çalışma İlerlemeniz
      </h2>
      
      <div className="grid gap-4">
        {Object.entries(progress).map(([categoryId, data]) => (
          <div 
            key={categoryId}
            className="block p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
            style={{ 
              backgroundColor: `${colors.accent}10`,
              border: `1px solid ${colors.accent}30`
            }}
            onClick={() => {
              window.location.href = `/${categoryId}?index=${data.index}`;
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium" style={{ color: colors.text }}>
                {categories.find((c) => c.path === `/${categoryId}`)?.name || categoryId}
              </h3>
              <span style={{ color: colors.accent }}>Kart {data.index + 1} / {data.totalCards}</span>
            </div>
            
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.round((data.viewedCount / data.totalCards) * 100)}%`, 
                  backgroundColor: colors.accent
                }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span style={{ color: `${colors.text}80` }}>
                %{Math.round((data.viewedCount / data.totalCards) * 100)} tamamlandı
              </span>
              <span style={{ color: `${colors.text}80` }}>
                Son çalışma: {new Date(data.timestamp.seconds * 1000).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
