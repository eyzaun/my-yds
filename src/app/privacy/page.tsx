'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

export default function Privacy() {
  // Sayfa için SEO ve yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      'name': 'YDS Kelime Listesi Gizlilik Politikası',
      'description': 'YDS Kelime Listesi projesi gizlilik politikası ve veri kullanım bilgileri.',
      'url': 'https://my-yds.web.app/privacy',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: designTokens.spacing[16],
      backgroundColor: designTokens.colors.background.primary
    }}>
      <Container maxWidth="md">
        <div style={{
          paddingTop: designTokens.spacing[8],
          paddingBottom: designTokens.spacing[8]
        }}>
          <Heading1 style={{
            marginBottom: designTokens.spacing[6],
            textAlign: 'center',
            color: designTokens.colors.text.primary
          }}>
            Gizlilik Politikası
          </Heading1>

          <div style={{
            marginTop: designTokens.spacing[8],
            display: 'flex',
            flexDirection: 'column',
            gap: designTokens.spacing[6]
          }}>
            <Card variant="elevated">
              <Heading2 style={{ marginBottom: designTokens.spacing[4], color: designTokens.colors.text.primary }}>
                Giriş
              </Heading2>
              <Text style={{ marginBottom: designTokens.spacing[3], color: designTokens.colors.text.primary }}>
                Bu gizlilik politikası, YDS Kelime Listesi (&quot;biz&quot;, &quot;bizim&quot; veya &quot;sitemiz&quot; olarak anılacaktır) web sitesini
                kullanırken topladığımız verilerin nasıl kullanıldığı, korunduğu ve ifşa edildiği hakkında bilgi vermek
                amacıyla oluşturulmuştur.
              </Text>
              <Text style={{ color: designTokens.colors.text.primary }}>
                Web sitemizi kullanarak, bu politika kapsamında belirtilen veri toplama ve kullanma uygulamalarını
                kabul etmiş olursunuz. Bu politika, kişisel veriler de dahil olmak üzere sitemizde toplanan tüm bilgileri kapsar.
              </Text>
            </Card>

            <Card variant="elevated">
              <Heading2 style={{ marginBottom: designTokens.spacing[4], color: designTokens.colors.text.primary }}>
                Topladığımız Veriler
              </Heading2>
              <Text style={{ marginBottom: designTokens.spacing[3], color: designTokens.colors.text.primary }}>
                Sitemizi kullanırken, aşağıdaki verileri otomatik olarak toplayabiliriz:
              </Text>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: designTokens.spacing[5],
                marginBottom: designTokens.spacing[3],
                color: designTokens.colors.text.primary,
                display: 'flex',
                flexDirection: 'column',
                gap: designTokens.spacing[2]
              }}>
                <li>
                  <strong>Cihaz Bilgileri:</strong> Kullandığınız tarayıcı tipi, işletim sistemi, cihaz türü,
                  ekran çözünürlüğü gibi teknik bilgiler.
                </li>
                <li>
                  <strong>Log Verileri:</strong> IP adresi, ziyaret saati ve tarihi, görüntülediğiniz sayfalar,
                  sitemizde geçirdiğiniz süre gibi bilgiler.
                </li>
                <li>
                  <strong>Çerezler:</strong> Sitemizi nasıl kullandığınızı hatırlamak için çerezler ve benzer
                  teknolojiler kullanabiliriz.
                </li>
              </ul>
            </Card>

            <Card variant="elevated">
              <Heading2 style={{ marginBottom: designTokens.spacing[4], color: designTokens.colors.text.primary }}>
                Google AdSense ve Çerezler
              </Heading2>
              <Text style={{ marginBottom: designTokens.spacing[3], color: designTokens.colors.text.primary }}>
                Sitemizde Google AdSense reklamları kullanılmaktadır. Bu hizmet, site içeriğinize ve ziyaretçilerinizin
                ilgi alanlarına göre hedeflenmiş reklamlar sunmak için çerezleri kullanabilir.
              </Text>
              <Text style={{ marginBottom: designTokens.spacing[3], color: designTokens.colors.text.primary }}>
                Google&apos;ın veri toplama ve kullanma uygulamaları hakkında daha fazla bilgi edinmek için,{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'underline',
                    color: designTokens.colors.primary[600]
                  }}
                >
                  Google Gizlilik Politikası
                </a>
                {' '}adresini ziyaret edebilirsiniz.
              </Text>
            </Card>

            <Card variant="elevated">
              <Heading2 style={{ marginBottom: designTokens.spacing[4], color: designTokens.colors.text.primary }}>
                Bize Ulaşın
              </Heading2>
              <Text style={{ marginBottom: designTokens.spacing[3], color: designTokens.colors.text.primary }}>
                Bu gizlilik politikası hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
              </Text>
              <Text style={{ color: designTokens.colors.text.primary }}>
                <Link
                  href="/contact"
                  style={{
                    textDecoration: 'underline',
                    color: designTokens.colors.primary[600],
                    fontWeight: designTokens.typography.fontWeight.semibold
                  }}
                >
                  İletişim Sayfası
                </Link>
              </Text>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
