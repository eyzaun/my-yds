// src/app/protected-page/page.tsx
'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import RequireAuth from '@/utils/requireAuth';
import AdBanner from '../../components/AdBanner';

const ProtectedPage = () => {
  const { colors } = useTheme();

  return (
    <RequireAuth>
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
            Korumalı Sayfa
          </h1>
          <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.cardBackground }}>
            <p style={{ color: colors.text }}>
              Bu içeriği sadece giriş yapmış kullanıcılar görebilir. Giriş yaptığınız için bu sayfayı görüntüleyebiliyorsunuz.
            </p>
          </div>
        </div>
        <AdBanner 
          slot="protected-page-banner"
          format="auto"
          className="my-4 mx-auto"
        />
      </div>
    </RequireAuth>
  );
};

export default ProtectedPage;