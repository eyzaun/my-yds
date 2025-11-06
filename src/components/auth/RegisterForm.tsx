// src/components/auth/RegisterForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { Input } from '@/components/design-system/Input';
import { Heading2 } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

const RegisterForm = () => {
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
    <Card variant="elevated">
      <Heading2 style={{
        marginBottom: designTokens.spacing[6],
        textAlign: 'center',
        color: designTokens.colors.text.primary
      }}>
        Hesap Oluştur
      </Heading2>

      {error && (
        <div style={{
          padding: designTokens.spacing[4],
          marginBottom: designTokens.spacing[4],
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: designTokens.colors.accent.error.light,
          color: designTokens.colors.text.primary,
          fontSize: designTokens.typography.fontSize.sm
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: designTokens.spacing[4] }}>
          <Input
            type="text"
            label="Ad Soyad"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div style={{ marginBottom: designTokens.spacing[4] }}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div style={{ marginBottom: designTokens.spacing[4] }}>
          <Input
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            minLength={6}
          />
        </div>

        <div style={{ marginBottom: designTokens.spacing[6] }}>
          <Input
            type="password"
            label="Şifre Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;
