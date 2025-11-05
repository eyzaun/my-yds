// src/app/login/page.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import AdBanner from '../../components/AdBanner';

const LoginPage = () => {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
          Giriş Yap
        </h1>
        
        <div className="max-w-md mx-auto">
          <LoginForm />
          
          <div className="mt-6 text-center" style={{ color: colors.text }}>
            <p>
              Hesabınız yok mu?{' '}
              <Link href="/register" className="underline" style={{ color: colors.accent }}>
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AdBanner 
        slot="login-footer" 
        format="horizontal" 
        className="my-4 mx-auto max-w-6xl px-4"
      />
      <AdBanner 
        slot="login-banner"
        format="auto"
        className="my-4 mx-auto"
      />
    </div>
  );
};

export default LoginPage;