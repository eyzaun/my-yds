// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, sendPasswordReset } from '@/firebase/auth';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { Card } from '@/components/design-system/Card';
import { Typography } from '@/components/design-system/Typography';
import { designTokens } from '@/components/design-system/tokens';

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
        // Başarılı giriş
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
    <Card className="max-w-md mx-auto">
      <Typography variant="h2" className="mb-6 text-center">
        Giriş Yap
      </Typography>

      {error && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: designTokens.colors.text.primary }}>
          {error}
        </div>
      )}

      {resetSent && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: designTokens.colors.text.primary }}>
          Şifre sıfırlama bağlantısı email adresinize gönderildi.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" style={{ color: designTokens.colors.text.primary }}>
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" style={{ color: designTokens.colors.text.primary }}>
            Şifre
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>

          <Button
            type="button"
            onClick={handlePasswordReset}
            variant="ghost"
            className="text-sm text-center"
          >
            Şifremi Unuttum
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;