/**
 * Homepage - Professional Redesign
 * Clean, accessible, emoji-free design following UI/UX best practices
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, Container, Heading1, Heading2, Heading3, Text } from '@/components/design-system';
import { designTokens } from '@/styles/design-tokens';

// Category data
const categories = [
  {
    id: 'spaced-repetition',
    title: 'Aralıklı Tekrar Sistemi',
    description: 'SM-2 algoritması ile bilimsel kelime öğrenme',
    path: '/spaced-repetition',
    isPrimary: true,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'academic-terms',
    title: 'Akademik Terimler',
    description: 'Bilimsel metinlerde kullanılan terimler',
    path: '/academic-terms',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'business',
    title: 'İşletme ve Ekonomi',
    description: 'İş dünyası ve ekonomi terimleri',
    path: '/business',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'social-sciences',
    title: 'Sosyal Bilimler',
    description: 'Psikoloji, sosyoloji ve tarih terimleri',
    path: '/social-sciences',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'nature',
    title: 'Doğa ve Çevre',
    description: 'Ekoloji, biyoloji ve çevre terimleri',
    path: '/nature',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'abstract',
    title: 'Soyut Kavramlar',
    description: 'Duygular ve felsefi terimler',
    path: '/abstract',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
  },
  {
    id: 'official',
    title: 'Resmi Dil',
    description: 'Resmi yazışma ve dokümantasyon',
    path: '/official',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'conjunctions',
    title: 'Bağlaçlar',
    description: 'Bağlaç ve geçiş ifadeleri',
    path: '/conjunctions',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    id: 'phrasal',
    title: 'Fiil Öbekleri',
    description: 'Phrasal verbs ve deyimler',
    path: '/phrasal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${designTokens.colors.primary[600]} 0%, ${designTokens.colors.primary[800]} 100%)`,
        paddingTop: designTokens.spacing[16],
        paddingBottom: designTokens.spacing[16],
      }}>
        <Container maxWidth="lg">
          <div style={{ textAlign: 'center', color: designTokens.colors.base.white }} className="fade-in">
            <Heading1
              style={{
                color: designTokens.colors.base.white,
                marginBottom: designTokens.spacing[4],
                fontSize: designTokens.typography.fontSize.display,
              }}
            >
              YDS Kelime Öğrenme Platformu
            </Heading1>
            <Text
              size="lg"
              style={{
                color: designTokens.colors.base.white,
                opacity: 0.9,
                marginBottom: designTokens.spacing[8],
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Bilimsel yöntemlerle kelime öğrenin. 9 farklı kategoride kelimeler, testler ve aralıklı tekrar sistemi ile YDS sınavına hazırlanın.
            </Text>

            <div style={{
              display: 'flex',
              gap: designTokens.spacing[4],
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <Link href="/spaced-repetition">
                <Button size="lg" variant="warning">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Aralıklı Tekrar Sistemi
                </Button>
              </Link>
              <Link href="/all-words">
                <Button size="lg" variant="outline" style={{
                  backgroundColor: designTokens.colors.base.white,
                  color: designTokens.colors.primary[600],
                  borderColor: designTokens.colors.base.white,
                }}>
                  Tüm Kelimeleri Gör
                </Button>
              </Link>
            </div>

            {!user && (
              <Text
                size="sm"
                style={{
                  color: designTokens.colors.base.white,
                  opacity: 0.8,
                  marginTop: designTokens.spacing[6],
                }}
              >
                İlerlemenizi kaydetmek için{' '}
                <Link href="/register" style={{
                  color: designTokens.colors.base.white,
                  textDecoration: 'underline',
                  fontWeight: designTokens.typography.fontWeight.semibold,
                }}>
                  ücretsiz kayıt olun
                </Link>
              </Text>
            )}
          </div>
        </Container>
      </section>

      {/* Categories Grid */}
      <section style={{
        paddingTop: designTokens.spacing[16],
        paddingBottom: designTokens.spacing[16],
      }}>
        <Container maxWidth="xl">
          <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[12] }}>
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              Kelime Kategorileri
            </Heading2>
            <Text color="secondary" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              YDS sınavında çıkan konulara göre düzenlenmiş kapsamlı kelime listelerine erişin
            </Text>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: designTokens.spacing[6],
          }}>
            {categories.map((category) => (
              <Link key={category.id} href={category.path}>
                <Card
                  hover
                  clickable
                  variant={category.isPrimary ? 'elevated' : 'outlined'}
                  padding="lg"
                  style={category.isPrimary ? {
                    background: `linear-gradient(135deg, ${designTokens.colors.accent.warning.light} 0%, ${designTokens.colors.accent.warning.main}20 100%)`,
                    border: `2px solid ${designTokens.colors.accent.warning.main}`,
                  } : undefined}
                  className="slide-up"
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: designTokens.spacing[4],
                  }}>
                    <div style={{
                      padding: designTokens.spacing[3],
                      backgroundColor: category.isPrimary
                        ? designTokens.colors.accent.warning.main
                        : designTokens.colors.primary[100],
                      borderRadius: designTokens.borders.radius.lg,
                      color: category.isPrimary
                        ? designTokens.colors.base.white
                        : designTokens.colors.primary[600],
                      flexShrink: 0,
                    }}>
                      {category.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Heading3 style={{ marginBottom: designTokens.spacing[2] }}>
                        {category.title}
                      </Heading3>
                      <Text size="sm" color="secondary">
                        {category.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{
        backgroundColor: designTokens.colors.gray[50],
        paddingTop: designTokens.spacing[16],
        paddingBottom: designTokens.spacing[16],
      }}>
        <Container maxWidth="lg">
          <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[12] }}>
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              Neden YDS Kelime Listesi?
            </Heading2>
            <Text color="secondary">
              Bilimsel yöntemler ve kullanıcı dostu arayüz ile etkili öğrenme
            </Text>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: designTokens.spacing[8],
          }}>
            <Card padding="lg" variant="default" className="scale-in">
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: designTokens.colors.accent.success.light,
                borderRadius: designTokens.borders.radius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: designTokens.spacing[4],
              }}>
                <svg className="w-6 h-6" style={{ color: designTokens.colors.accent.success.main }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <Heading3 style={{ marginBottom: designTokens.spacing[3] }}>
                İlerleme Takibi
              </Heading3>
              <Text size="sm" color="secondary">
                Çalıştığınız kelimeleri ve test sonuçlarınızı otomatik olarak kaydedin. Detaylı istatistikler ile ilerlemenizi takip edin.
              </Text>
            </Card>

            <Card padding="lg" variant="default" className="scale-in" style={{ animationDelay: '0.1s' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: designTokens.colors.primary[100],
                borderRadius: designTokens.borders.radius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: designTokens.spacing[4],
              }}>
                <svg className="w-6 h-6" style={{ color: designTokens.colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Heading3 style={{ marginBottom: designTokens.spacing[3] }}>
                Aralıklı Tekrar
              </Heading3>
              <Text size="sm" color="secondary">
                SM-2 algoritması ile bilimsel olarak kanıtlanmış aralıklı tekrar yöntemi. Kelimeler tam unutmadan önce tekrar edilir.
              </Text>
            </Card>

            <Card padding="lg" variant="default" className="scale-in" style={{ animationDelay: '0.2s' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: designTokens.colors.accent.warning.light,
                borderRadius: designTokens.borders.radius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: designTokens.spacing[4],
              }}>
                <svg className="w-6 h-6" style={{ color: designTokens.colors.accent.warning.main }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <Heading3 style={{ marginBottom: designTokens.spacing[3] }}>
                Testler ve Quizler
              </Heading3>
              <Text size="sm" color="secondary">
                Her kategoride çoktan seçmeli testler. Bilginizi ölçün, eksik noktalarınızı tespit edin ve pekiştirin.
              </Text>
            </Card>
          </div>
        </Container>
      </section>

      {/* Study Tips */}
      <section style={{
        paddingTop: designTokens.spacing[16],
        paddingBottom: designTokens.spacing[16],
      }}>
        <Container maxWidth="md">
          <Card padding="lg" variant="outlined">
            <Heading2 style={{ marginBottom: designTokens.spacing[6] }}>
              Etkili Kelime Öğrenme İpuçları
            </Heading2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: designTokens.spacing[4],
            }}>
              {[
                'Düzenli ve sistemli çalışın. Her gün belirli sayıda yeni kelime öğrenin.',
                'Öğrendiğiniz kelimeleri cümle içinde kullanarak pekiştirin.',
                'Benzer kelimeleri gruplandırarak çalışın.',
                'Test çözerek bilginizi ölçün ve eksik noktaları tespit edin.',
                'Aralıklı tekrar sistemini kullanarak kalıcı öğrenme sağlayın.',
              ].map((tip, index) => (
                <li key={index} style={{ display: 'flex', gap: designTokens.spacing[3], alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: designTokens.colors.primary[100],
                    borderRadius: designTokens.borders.radius.full,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    <svg className="w-3 h-3" style={{ color: designTokens.colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Text size="sm">{tip}</Text>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: designTokens.colors.primary[600],
        paddingTop: designTokens.spacing[12],
        paddingBottom: designTokens.spacing[12],
      }}>
        <Container maxWidth="md">
          <div style={{ textAlign: 'center', color: designTokens.colors.base.white }}>
            <Heading2 style={{ color: designTokens.colors.base.white, marginBottom: designTokens.spacing[4] }}>
              Kelime Öğrenmeye Hemen Başlayın
            </Heading2>
            <Text style={{ color: designTokens.colors.base.white, opacity: 0.9, marginBottom: designTokens.spacing[6] }}>
              Ücretsiz hesap oluşturun ve ilerlemenizi takip etmeye başlayın
            </Text>
            <div style={{ display: 'flex', gap: designTokens.spacing[4], justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register">
                <Button size="lg" variant="warning">
                  Ücretsiz Kayıt Ol
                </Button>
              </Link>
              <Link href="/all-words">
                <Button size="lg" variant="ghost" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: designTokens.colors.base.white,
                }}>
                  Kelimeleri İncele
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: designTokens.colors.gray[900],
        color: designTokens.colors.gray[400],
        paddingTop: designTokens.spacing[8],
        paddingBottom: designTokens.spacing[8],
      }}>
        <Container maxWidth="lg">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: designTokens.spacing[8],
            marginBottom: designTokens.spacing[8],
          }}>
            <div>
              <Heading3 style={{ color: designTokens.colors.base.white, marginBottom: designTokens.spacing[4] }}>
                YDS Kelime Listesi
              </Heading3>
              <Text size="sm" style={{ color: designTokens.colors.gray[400] }}>
                YDS sınavına hazırlık için kategorilere ayrılmış kelime listesi ve test platformu
              </Text>
            </div>
            <div>
              <Heading3 style={{ color: designTokens.colors.base.white, marginBottom: designTokens.spacing[4], fontSize: designTokens.typography.fontSize.h5 }}>
                Kategoriler
              </Heading3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: designTokens.spacing[2] }}>
                <li><Link href="/academic-terms" style={{ color: designTokens.colors.gray[400] }}>Akademik Terimler</Link></li>
                <li><Link href="/business" style={{ color: designTokens.colors.gray[400] }}>İşletme ve Ekonomi</Link></li>
                <li><Link href="/nature" style={{ color: designTokens.colors.gray[400] }}>Doğa ve Çevre</Link></li>
              </ul>
            </div>
            <div>
              <Heading3 style={{ color: designTokens.colors.base.white, marginBottom: designTokens.spacing[4], fontSize: designTokens.typography.fontSize.h5 }}>
                Bilgi
              </Heading3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: designTokens.spacing[2] }}>
                <li><Link href="/about" style={{ color: designTokens.colors.gray[400] }}>Hakkımızda</Link></li>
                <li><Link href="/contact" style={{ color: designTokens.colors.gray[400] }}>İletişim</Link></li>
                <li><Link href="/privacy" style={{ color: designTokens.colors.gray[400] }}>Gizlilik Politikası</Link></li>
              </ul>
            </div>
          </div>
          <div style={{
            borderTop: `1px solid ${designTokens.colors.gray[800]}`,
            paddingTop: designTokens.spacing[6],
            textAlign: 'center',
          }}>
            <Text size="sm" style={{ color: designTokens.colors.gray[500] }}>
              © {new Date().getFullYear()} YDS Kelime Listesi. Tüm Hakları Saklıdır.
            </Text>
          </div>
        </Container>
      </footer>
    </div>
  );
}
