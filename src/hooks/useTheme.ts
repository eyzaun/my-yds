import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { getDesignTokensByTheme } from '@/styles/design-tokens';

/**
 * Hook to access design tokens for theme-aware styling
 * Returns dynamic design tokens based on current theme + theme controls
 */
export const useTheme = () => {
  const { theme, setTheme, isDark } = useThemeContext();
  return {
    tokens: getDesignTokensByTheme(theme),
    theme,
    setTheme,
    isDark,
  };
};
