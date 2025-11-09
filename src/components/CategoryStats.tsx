'use client';
import React from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface CategoryStatsProps {
  wordCount: number;
}

export default function CategoryStats({ wordCount }: CategoryStatsProps) {
  const designTokens = useDesignTokens();

  return (
    <div
      className="mb-6 p-4 rounded-lg"
      style={{
        backgroundColor: designTokens.colors.status.infoBg,
        color: designTokens.colors.text.primary
      }}
    >
      <p className="text-lg">
        Bu kategoride toplam <strong>{wordCount}</strong> kelime ve <strong>{wordCount}</strong> test sorusu bulunmaktadır.
      </p>
      <p className="mt-2">
        İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
      </p>
    </div>
  );
}
