// src/components/auth/ProfileInfo.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/firebase/auth';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

const ProfileInfo = () => {
  const { user } = useAuth();
  const router = useRouter();
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
    <Card>
      <Heading2 className="mb-6">
        Profil Bilgileri
      </Heading2>

      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <Text className="block text-sm font-medium mb-1">
              Ad Soyad
            </Text>
            <div className="p-2 rounded-md" style={{ backgroundColor: designTokens.colors.background.primary, color: designTokens.colors.text.primary }}>
              {user.displayName || 'İsimsiz Kullanıcı'}
            </div>
          </div>

          <div>
            <Text className="block text-sm font-medium mb-1">
              Email
            </Text>
            <div className="p-2 rounded-md" style={{ backgroundColor: designTokens.colors.background.primary, color: designTokens.colors.text.primary }}>
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleLogout}
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
      </Button>
    </Card>
  );
};

export default ProfileInfo;