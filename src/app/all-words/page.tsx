// src/app/all-words/page.tsx
'use client';
import WordList from '@/components/WordList';
import { vocabulary } from '@/data/vocabulary2';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card } from '@/components/design-system/Card';
import { Heading1, Text } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Container';
import { useTheme } from '@/hooks/useTheme';

// Fix the import path
const AdBanner = dynamic(() => import('../../components/AdBanner'), { ssr: false });

export default function AllWords() {
  const { tokens } = useTheme();
  const { user } = useAuth(); // Kullanıcı durumunu al

  // Kategori ID'si
  const categoryId = 'all-words';

  // Tüm kelimeleri birleştirelim
  const allWords = Object.values(vocabulary).flat();

  // Yapısal veriyi ekleyelim
  useEffect(() => {
    // JSON-LD yapısal verisi
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Tüm YDS Kelimeleri',
      'description': 'YDS sınavı için tüm kategorilerden İngilizce kelime listesi - Akademik, İşletme, Sosyal Bilimler, Doğa, Resmi Dil ve daha fazlası.',
      'url': 'https://my-yds.web.app/all-words',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingBottom: tokens.spacing[16],
        backgroundColor: tokens.colors.background.primary
      }}
    >
      <Container maxWidth="lg" style={{ paddingTop: tokens.spacing[8], paddingBottom: tokens.spacing[8] }}>
        {/* Sayfa Başlığı */}
        <Heading1 style={{ marginBottom: tokens.spacing[6], textAlign: 'center' }}>
          Tüm YDS Kelimeleri
        </Heading1>

        {/* Sayfa Açıklaması */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing[6] }}>
          <Text style={{ marginBottom: tokens.spacing[2] }}>
            Bu sayfada tüm kategorilerdeki YDS kelimelerini bir arada bulabilirsiniz. İstediğiniz kelimeyi çalışabilirsiniz.
          </Text>
          <Text variant="secondary" style={{ fontSize: tokens.typography.fontSize.sm }}>
            Toplam <strong>{allWords.length}</strong> kelime bulunmaktadır.
          </Text>

          {/* Kullanıcı giriş yapmışsa bilgilendirme mesajı */}
          {user && (
            <div
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.primary[50],
              }}
            >
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
              </Text>
            </div>
          )}

          {/* Kullanıcı giriş yapmamışsa giriş yapma önerisi */}
          {!user && (
            <div
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.primary[50],
              }}
            >
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </Text>
            </div>
          )}
        </Card>

        {/* Kelime Listesi */}
        <WordList
          words={allWords}
          categoryId={categoryId}
        />
      </Container>

      <AdBanner
        slot="all-words-footer"
        format="horizontal"
        className="my-4 mx-auto max-w-6xl px-4"
      />
    </div>
  );
}
