// src/app/register/page.tsx
'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Heading1, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';


const RegisterPage = () => {
  const { tokens } = useTheme();
  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background.primary }}>
      <Container maxWidth="md" className="py-8">
        <Heading1 className="mb-8 text-center">
          Hesap Oluştur
        </Heading1>

        <div className="max-w-md mx-auto">
          <RegisterForm />

          <div className="mt-6 text-center">
            <Text>
              Zaten bir hesabınız var mı?{' '}
              <Link href="/login" className="underline" style={{ color: tokens.colors.primary[600] }}>
                Giriş Yap
              </Link>
            </Text>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegisterPage;