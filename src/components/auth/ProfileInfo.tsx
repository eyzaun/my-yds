// src/components/auth/ProfileInfo.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/firebase/auth';
import { useTheme } from '@/contexts/ThemeContext';

const ProfileInfo = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.cardBackground }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
        Profil Bilgileri
      </h2>
      
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
              Ad Soyad
            </label>
            <div className="p-2 rounded-md" style={{ backgroundColor: colors.background, color: colors.text }}>
              {user.displayName || 'İsimsiz Kullanıcı'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
              Email
            </label>
            <div className="p-2 rounded-md" style={{ backgroundColor: colors.background, color: colors.text }}>
              {user.email}
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 rounded-md font-medium"
        style={{ backgroundColor: colors.accent, color: colors.text }}
        disabled={loading}
      >
        {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
      </button>
    </div>
  );
};

export default ProfileInfo;