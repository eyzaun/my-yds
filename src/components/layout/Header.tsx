'use client';
import Link from 'next/link';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export default function Header() {
  const designTokens = useDesignTokens();

  return (
    <header style={{ backgroundColor: designTokens.colors.gray[800], color: designTokens.colors.text.inverse }}>
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div className="text-lg font-bold">My App</div>
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link
            href="/upload-flashcards"
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              color: designTokens.colors.text.secondary,
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = designTokens.colors.primary[600]}
            onMouseLeave={(e) => e.currentTarget.style.color = designTokens.colors.text.secondary}
          >
            Kendi Kartlarım
          </Link>
        </div>
      </nav>
      <nav className="hidden md:flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link
          href="/upload-flashcards"
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            color: designTokens.colors.text.secondary,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = designTokens.colors.primary[600]}
          onMouseLeave={(e) => e.currentTarget.style.color = designTokens.colors.text.secondary}
        >
          Kendi Kartlarım
        </Link>
      </nav>
    </header>
  );
}