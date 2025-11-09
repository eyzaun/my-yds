'use client';
import { useEffect } from 'react';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

export default function Contact() {
  // Sayfa için SEO ve yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'YDS Kelime Listesi İletişim',
      'description': 'YDS Kelime Listesi projesi iletişim bilgileri ve iletişim kanalları.',
      'url': 'https://my-yds.web.app/contact',
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
        paddingBottom: designTokens.spacing[16],
        backgroundColor: designTokens.colors.background.primary
      }}
    >
      <Container maxWidth="md" style={{ paddingTop: designTokens.spacing[8], paddingBottom: designTokens.spacing[8] }}>
        <Heading1 style={{ marginBottom: designTokens.spacing[6], textAlign: 'center' }}>
          İletişim
        </Heading1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[6] }}>
          <Card variant="elevated">
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              Bizimle İletişime Geçin
            </Heading2>
            <Text style={{ marginBottom: designTokens.spacing[4] }}>
              YDS Kelime Listesi platformu hakkında sorularınız, önerileriniz veya geri bildirimleriniz varsa,
              aşağıdaki iletişim kanallarından bizimle iletişime geçebilirsiniz.
            </Text>
            <Text>
              Her türlü soru, öneri ve geri bildirimlerinize en geç 1 iş günü içerisinde yanıt vermeye çalışıyoruz.
            </Text>
          </Card>

          <Card variant="elevated">
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              İletişim Bilgileri
            </Heading2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[4] }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: designTokens.spacing[1] }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: '1.25rem', width: '1.25rem', color: designTokens.colors.primary[600] }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div style={{ marginLeft: designTokens.spacing[3] }}>
                  <Heading3 style={{ fontSize: designTokens.typography.fontSize.base }}>E-posta</Heading3>
                  <Text style={{ marginTop: designTokens.spacing[1] }}>
                    <a href="mailto:eyzaun@gmail.com" className="hover:underline">eyzaun@gmail.com</a>
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: designTokens.spacing[1] }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: '1.25rem', width: '1.25rem', color: designTokens.colors.primary[600] }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 4a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM10 3a1 1 0 011 1v1.5a1 1 0 01-2 0V4a1 1 0 011-1zM2 10a8 8 0 1116 0v1h-2v-1a6 6 0 10-12 0v1H2v-1z" />
                  </svg>
                </div>
                <div style={{ marginLeft: designTokens.spacing[3] }}>
                  <Heading3 style={{ fontSize: designTokens.typography.fontSize.base }}>Instagram</Heading3>
                  <Text style={{ marginTop: designTokens.spacing[1] }}>
                    <a href="https://www.instagram.com/eyzaun/" target="_blank" rel="noopener noreferrer" className="hover:underline">@eyzaun</a>
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: designTokens.spacing[1] }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: '1.25rem', width: '1.25rem', color: designTokens.colors.primary[600] }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div style={{ marginLeft: designTokens.spacing[3] }}>
                  <Heading3 style={{ fontSize: designTokens.typography.fontSize.base }}>Kick</Heading3>
                  <Text style={{ marginTop: designTokens.spacing[1] }}>
                    <a href="https://kick.com/eyzaun" target="_blank" rel="noopener noreferrer" className="hover:underline">kick.com/eyzaun</a>
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              İletişim Konuları
            </Heading2>
            <Text style={{ marginBottom: designTokens.spacing[3] }}>
              Aşağıdaki konularda bizimle iletişime geçebilirsiniz:
            </Text>
            <ul
              style={{
                paddingLeft: designTokens.spacing[5],
                color: designTokens.colors.text.primary,
                display: 'flex',
                flexDirection: 'column',
                gap: designTokens.spacing[2]
              }}
            >
              <li>Platform hakkında öneri ve geri bildirimler</li>
              <li>Hata bildirimleri</li>
              <li>Kelime listelerine eklemek istediğiniz kelimeler</li>
              <li>Test soruları hakkında düzeltmeler</li>
              <li>İşbirliği talepleri</li>
              <li>Diğer soru ve önerileriniz</li>
            </ul>
          </Card>

          <Card variant="elevated">
            <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
              Yanıt Süresi
            </Heading2>
            <Text>
              Tüm mesajlarınıza en kısa sürede yanıt vermeye çalışıyoruz. Genellikle yanıt süremiz 24 saat içerisindedir.
              Yoğun dönemlerde bu süre maksimum 1 iş gününe uzayabilir. Anlayışınız için teşekkür ederiz.
            </Text>
          </Card>
        </div>
      </Container>
    </div>
  );
}
