import { designTokens } from '@/styles/design-tokens';

/**
 * Hook to access design tokens for theme-aware styling
 * Returns the design tokens object for use in component styling
 */
export const useTheme = () => {
  return {
    tokens: designTokens,
  };
};
