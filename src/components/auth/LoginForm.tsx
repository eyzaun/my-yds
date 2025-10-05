// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, sendPasswordReset } from '@/firebase/auth';
import { useTheme } from '@/contexts/ThemeContext';

const LoginForm = () => {
  const { colors } = useTheme();
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
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.cardBackground }}>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.text }}>
        Giriş Yap
      </h2>
      
      {error && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: colors.text }}>
          {error}
        </div>
      )}
      
      {resetSent && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: colors.text }}>
          Şifre sıfırlama bağlantısı email adresinize gönderildi.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" style={{ color: colors.text }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: colors.background, color: colors.text, borderColor: `${colors.accent}40` }}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2" style={{ color: colors.text }}>
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: colors.background, color: colors.text, borderColor: `${colors.accent}40` }}
            required
          />
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md font-medium"
            style={{ backgroundColor: colors.accent, color: colors.text }}
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm text-center"
            style={{ color: colors.accent }}
          >
            Şifremi Unuttum
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;