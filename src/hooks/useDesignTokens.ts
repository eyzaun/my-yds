/**
 * Custom hook to get design tokens based on current theme
 * This ensures components update when theme changes
 * Includes SSR safety check
 */
import { useTheme } from '@/contexts/ThemeContext';
import { getDesignTokensByTheme } from '@/styles/design-tokens';

export const useDesignTokens = () => {
  // For SSR: return default light theme tokens
  if (typeof window === 'undefined') {
    return getDesignTokensByTheme('light');
  }

  const { theme } = useTheme();
  return getDesignTokensByTheme(theme);
};
