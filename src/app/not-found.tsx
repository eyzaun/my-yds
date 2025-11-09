'use client'

import Link from 'next/link'
import { designTokens } from '@/styles/design-tokens'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: designTokens.colors.background.primary }}
    >
      <div className="text-center max-w-md">
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: designTokens.colors.primary[600] }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: designTokens.colors.text.primary }}
        >
          Sayfa Bulunamadi
        </h2>
        <p
          className="mb-8"
          style={{ color: designTokens.colors.text.secondary }}
        >
          Aradiginiz sayfa mevcut degil veya tasinmis olabilir.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          style={{
            backgroundColor: designTokens.colors.primary[600],
            color: designTokens.colors.text.inverse,
            boxShadow: designTokens.shadows.md,
          }}
        >
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  )
}