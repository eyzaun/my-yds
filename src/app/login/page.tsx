// src/app/login/page.tsx
'use client';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AdBanner from '../../components/AdBanner';
import { Container } from '@/components/design-system/Container';
import { Heading1, Text } from '@/components/design-system/Typography';
import { useDesignTokens } from '@/hooks/useDesignTokens';

// Replace the import using path alias with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const LoginPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: designTokens.colors.background.primary }}>
      <Container maxWidth="md" className="py-8">
        <Heading1 className="mb-8 text-center">
          Giriş Yap
        </Heading1>

        <div className="max-w-md mx-auto">
          <LoginForm />

          <div className="mt-6 text-center">
            <Text>
              Hesabınız yok mu?{' '}
              <Link href="/register" className="underline" style={{ color: designTokens.colors.primary[600] }}>
                Kayıt Ol
              </Link>
            </Text>
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
