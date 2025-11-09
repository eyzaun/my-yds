'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getDesignTokensByTheme } from '@/styles/design-tokens';

interface CategoryStatsProps {
  wordCount: number;
}

export default function CategoryStats({ wordCount }: CategoryStatsProps) {
  const { theme } = useTheme();
  const tokens = getDesignTokensByTheme(theme);
  const colors = tokens.colors;

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: colors.status.infoBg,
        borderRadius: '0.5rem',
        color: colors.text.secondary,
      }}
    >
      <p
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.5,
        }}
      >
        Bu kategoride toplam <strong>{wordCount}</strong> kelime ve <strong>{wordCount}</strong> test sorusu bulunmaktadır.
      </p>
      <p
        style={{
          marginTop: '0.5rem',
          lineHeight: 1.5,
        }}
      >
        İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
      </p>
    </div>
  );
}
