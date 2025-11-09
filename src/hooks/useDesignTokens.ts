/**
 * Custom hook to get design tokens based on current theme
 * This ensures components update when theme changes
 */
import { useTheme } from '@/contexts/ThemeContext';
import { getDesignTokensByTheme } from '@/styles/design-tokens';

export const useDesignTokens = () => {
  const { theme } = useTheme();
  return getDesignTokensByTheme(theme);
};
