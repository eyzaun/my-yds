// src/app/login/page.tsx
'use client';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AdBanner from '../../components/AdBanner';
import { Heading1 } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Container';
import { designTokens } from '@/styles/design-tokens';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const LoginPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: designTokens.colors.background.primary,
      paddingBottom: designTokens.spacing[16]
    }}>
      <Container maxWidth="md">
        <div style={{
          paddingTop: designTokens.spacing[8],
          paddingBottom: designTokens.spacing[8]
        }}>
          <Heading1 style={{
            marginBottom: designTokens.spacing[8],
            textAlign: 'center',
            color: designTokens.colors.text.primary
          }}>
            Giriş Yap
          </Heading1>

          <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
            <LoginForm />

            <div style={{
              marginTop: designTokens.spacing[6],
              textAlign: 'center',
              color: designTokens.colors.text.secondary
            }}>
              <p>
                Hesabınız yok mu?{' '}
                <Link href="/register" style={{
                  textDecoration: 'underline',
                  color: designTokens.colors.primary[600],
                  fontWeight: designTokens.typography.fontWeight.semibold
                }}>
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <AdBanner
        slot="login-footer"
        format="horizontal"
        className="my-4 mx-auto max-w-6xl px-4"
      />
      <ClientOnlyAd
        slot="login-banner"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
};

export default LoginPage;
