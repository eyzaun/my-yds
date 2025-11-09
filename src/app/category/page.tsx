'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { categories } from '@/data/categories';

export default function CategoryPage() {
  const { tokens } = useTheme();
  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ backgroundColor: tokens.colors.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: tokens.colors.text.primary }}
        >
          Kategoriler
        </h1>
        <p
          className="mb-8"
          style={{ color: tokens.colors.text.secondary }}
        >
          Lutfen asagidan bir kategori secin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <Link
              key={key}
              href={`/${key}`}
              className="p-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: tokens.colors.background.card,
                boxShadow: tokens.shadows.md,
              }}
            >
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: tokens.colors.primary[600] }}
              >
                {category.name}
              </h2>
              <p style={{ color: tokens.colors.text.secondary }}>
                {category.description || 'Kategori detaylarina goz atin'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
