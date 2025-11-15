'use client';
import WordList from '@/components/WordList';
import { vocabulary } from '@/data/vocabulary2';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading3, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function İşDünyasıveİletişimPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();

  const categoryId = 'business-communication';
  const categoryName = 'İş Dünyası ve İletişim';
  const categoryKey = 'business_and_communication' as keyof typeof vocabulary;
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS İş Dünyası ve İletişim Kelime Listesi',
      'description': 'İş dünyası, ekonomi ve iletişim alanlarındaki terimler.',
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
          İş Dünyası ve İletişim
        </Heading1>
        
        <Card variant="elevated" className="mb-6">
          <Text className="mb-3">
            İş dünyası, ekonomi ve iletişim alanlarındaki terimler.
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
            İş Dünyası ve İletişim Hakkında
          </Heading3>
          <Text>
            İş dünyası, ekonomi ve iletişim alanlarındaki terimler. Bu kelimeler YDS sınavında sıkça karşınıza çıkabilir.
          </Text>
        </Card>
      </Container>
      
      <ClientOnlyAd 
        slot="business-communication-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
}
