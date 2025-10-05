// src/app/register/page.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Replace path alias import with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const RegisterPage = () => {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
          Hesap Oluştur
        </h1>
        
        <div className="max-w-md mx-auto">
          <RegisterForm />
          
          <div className="mt-6 text-center" style={{ color: colors.text }}>
            <p>
              Zaten bir hesabınız var mı?{' '}
              <Link href="/login" className="underline" style={{ color: colors.accent }}>
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ClientOnlyAd 
        slot="register-banner"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
};

export default RegisterPage;