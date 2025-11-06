// src/app/register/page.tsx
'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Heading1 } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Container';
import { designTokens } from '@/styles/design-tokens';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const RegisterPage = () => {
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
            Hesap Oluştur
          </Heading1>

          <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
            <RegisterForm />

            <div style={{
              marginTop: designTokens.spacing[6],
              textAlign: 'center',
              color: designTokens.colors.text.secondary
            }}>
              <p>
                Zaten bir hesabınız var mı?{' '}
                <Link href="/login" style={{
                  textDecoration: 'underline',
                  color: designTokens.colors.primary[600],
                  fontWeight: designTokens.typography.fontWeight.semibold
                }}>
                  Giriş Yap
                </Link>
              </p>
            </div>
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
