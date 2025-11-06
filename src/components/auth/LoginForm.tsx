// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, sendPasswordReset } from '@/firebase/auth';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { Input } from '@/components/design-system/Input';
import { Heading2 } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.error) {
        setError('Giriş başarısız. Lütfen email ve şifrenizi kontrol edin.');
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

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Şifre sıfırlama için lütfen email adresinizi girin.');
      return;
    }

    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setResetSent(true);
        setError('');
      } else {
        setError('Şifre sıfırlama işlemi başarısız. Lütfen geçerli bir email girin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error(err);
    }
  };

  return (
    <Card variant="elevated">
      <Heading2 style={{
        marginBottom: designTokens.spacing[6],
        textAlign: 'center',
        color: designTokens.colors.text.primary
      }}>
        Giriş Yap
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

      {resetSent && (
        <div style={{
          padding: designTokens.spacing[4],
          marginBottom: designTokens.spacing[4],
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: designTokens.colors.accent.success.light,
          color: designTokens.colors.text.primary,
          fontSize: designTokens.typography.fontSize.sm
        }}>
          Şifre sıfırlama bağlantısı email adresinize gönderildi.
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div style={{ marginBottom: designTokens.spacing[6] }}>
          <Input
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: designTokens.spacing[3]
        }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>

          <button
            type="button"
            onClick={handlePasswordReset}
            style={{
              fontSize: designTokens.typography.fontSize.sm,
              textAlign: 'center',
              color: designTokens.colors.primary[600],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: designTokens.spacing[2],
              textDecoration: 'underline'
            }}
          >
            Şifremi Unuttum
          </button>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
