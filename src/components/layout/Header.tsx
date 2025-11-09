'use client';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { tokens } = useTheme();

  return (
    <header style={{ backgroundColor: tokens.colors.cardBackground, color: tokens.colors.text }}>
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div className="text-lg font-bold">My App</div>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="hover:underline"
            style={{ color: tokens.colors.text }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:underline"
            style={{ color: tokens.colors.text }}
          >
            About
          </Link>
          <Link
            href="/upload-flashcards"
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              color: tokens.colors.textSecondary,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = tokens.colors.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = tokens.colors.textSecondary)}
          >
            Kendi Kartlarım
          </Link>
        </div>
      </nav>
      <nav className="hidden md:flex space-x-4">
        <Link
          href="/"
          className="hover:underline"
          style={{ color: tokens.colors.text }}
        >
          Home
        </Link>
        <Link
          href="/about"
          className="hover:underline"
          style={{ color: tokens.colors.text }}
        >
          About
        </Link>
        <Link
          href="/upload-flashcards"
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            color: tokens.colors.textSecondary,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = tokens.colors.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = tokens.colors.textSecondary)}
        >
          Kendi Kartlarım
        </Link>
      </nav>
    </header>
  );
}