// src/components/auth/RegisterForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/firebase/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { FirebaseError } from 'firebase/app';

const RegisterForm = () => {
  const { colors } = useTheme();
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
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.cardBackground }}>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.text }}>
        Hesap Oluştur
      </h2>
      
      {error && (
        <div className="p-3 mb-4 rounded-md" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: colors.text }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" style={{ color: colors.text }}>
            Ad Soyad
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: colors.background, color: colors.text, borderColor: `${colors.accent}40` }}
            required
          />
        </div>
        
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
        
        <div className="mb-4">
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
            minLength={6}
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2" style={{ color: colors.text }}>
            Şifre Tekrar
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: colors.background, color: colors.text, borderColor: `${colors.accent}40` }}
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md font-medium"
          style={{ backgroundColor: colors.accent, color: colors.text }}
          disabled={loading}
        >
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;