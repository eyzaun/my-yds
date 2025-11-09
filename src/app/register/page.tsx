// src/app/register/page.tsx
'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Heading1, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

// Replace path alias import with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const RegisterPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: designTokens.colors.background }}>
      <Container maxWidth="md" className="py-8">
        <Heading1 className="mb-8 text-center">
          Hesap Oluştur
        </Heading1>

        <div className="max-w-md mx-auto">
          <RegisterForm />

          <div className="mt-6 text-center">
            <Text>
              Zaten bir hesabınız var mı?{' '}
              <Link href="/login" className="underline" style={{ color: designTokens.colors.accent }}>
                Giriş Yap
              </Link>
            </Text>
          </div>
        </div>
      </Container>
      <ClientOnlyAd
        slot="register-banner"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
};

export default RegisterPage;