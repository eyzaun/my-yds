/**
 * Custom hook to get design tokens based on current theme
 * Includes proper SSR safety and hydration handling
 */
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getDesignTokensByTheme } from '@/styles/design-tokens';

export const useDesignTokens = () => {
  const [mounted, setMounted] = useState(false);

  // Always call hooks in the same order (hook rules)
  const themeContext = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR or before mount: return default light theme tokens
  // This prevents hydration mismatches and SSR errors
  if (!mounted || typeof window === 'undefined') {
    return getDesignTokensByTheme('light');
  }

  // Client-side after mount: use actual theme from context
  return getDesignTokensByTheme(themeContext.theme);
};
