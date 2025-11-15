'use client';
import WordList from '@/components/WordList';
import { vocabulary } from '@/data/vocabulary';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading3, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function PsikolojiveSosyolojiPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();

  const categoryId = 'psychology-sociology';
  const categoryName = 'Psikoloji ve Sosyoloji';
  const categoryKey = 'psychology_and_sociology' as keyof typeof vocabulary;
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Psikoloji ve Sosyoloji Kelime Listesi',
      'description': 'Psikoloji, sosyoloji ve davranış bilimleri terimleri.',
      'url': `https://my-yds.web.app/${categoryId}`,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: tokens.colors.background.primary }}>
      <Container maxWidth="lg" className="py-8">
        <Heading1 className="text-2xl md:text-3xl mb-6 text-center">
          Psikoloji ve Sosyoloji
        </Heading1>
        
        <Card variant="elevated" className="mb-6">
          <Text className="mb-3">
            Psikoloji, sosyoloji ve davranış bilimleri terimleri.
          </Text>
          <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
            Bu kategoride toplam <strong>{vocabulary[categoryKey]?.length || 0}</strong> kelime bulunmaktadır.
          </Text>

          {user && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${tokens.colors.primary[600]}20` }}>
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemeniz otomatik olarak kaydedilmektedir.
              </Text>
            </div>
          )}

          {!user && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${tokens.colors.primary[600]}20` }}>
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </Text>
            </div>
          )}
        </Card>

        <WordList
          words={vocabulary[categoryKey] || []}
          categoryId={categoryId}
          categoryName={categoryName}
        />
        
        <Card variant="elevated" className="mt-8">
          <Heading3 className="mb-3">
            Psikoloji ve Sosyoloji Hakkında
          </Heading3>
          <Text>
            Psikoloji, sosyoloji ve davranış bilimleri terimleri. Bu kelimeler YDS sınavında sıkça karşınıza çıkabilir.
          </Text>
        </Card>
      </Container>
      
      <ClientOnlyAd
        slot="3007186106"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
}
