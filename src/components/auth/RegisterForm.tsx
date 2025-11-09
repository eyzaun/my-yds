// src/components/auth/RegisterForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { Card } from '@/components/design-system/Card';
import { Heading2 } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';

const RegisterForm = () => {
  const { tokens } = useTheme();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setLoading(true);

    try {
      const result = await registerUser(email, password, displayName);
      
      if (result.error) {
        // Firebase hata kodlarına göre özelleştirilmiş mesajlar
        const errorCode = (result.error as FirebaseError).code;
        if (errorCode === 'auth/email-already-in-use') {
          setError('Bu email adresi zaten kullanılıyor.');
        } else if (errorCode === 'auth/invalid-email') {
          setError('Geçersiz email adresi.');
        } else {
          setError('Kayıt işlemi başarısız. Lütfen daha sonra tekrar deneyin.');
        }
        console.error(result.error);
      } else {
        // Başarılı kayıt
        router.push('/');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Heading2 className="mb-6 text-center">
        Hesap Oluştur
      </Heading2>

      {error && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: tokens.colors.status.errorBg, color: tokens.colors.status.error }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" style={{ color: tokens.colors.text.primary }}>
            Ad Soyad
          </label>
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" style={{ color: tokens.colors.text.primary }}>
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" style={{ color: tokens.colors.text.primary }}>
            Şifre
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" style={{ color: tokens.colors.text.primary }}>
            Şifre Tekrar
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;