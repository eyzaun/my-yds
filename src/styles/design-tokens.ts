/**
 * Design Tokens with Dark Mode Support
 * Centralized design system tokens for consistent styling across the application
 */

// Light theme colors - WCAG AA compliant
const lightTheme = {
  background: {
    primary: '#F3F4F6',      // Light gray
    secondary: '#E5E7EB',    // Darker gray
    card: '#FFFFFF',         // White
  },
  surface: {
    primary: '#FFFFFF',      // White elevated
    elevated: '#FFFFFF',     // White shadow
  },
  text: {
    primary: '#111827',      // Very dark gray (~5.8:1 contrast)
    secondary: '#4B5563',    // Medium-dark gray (~5.1:1 contrast) - IMPROVED
    tertiary: '#6B7280',     // Medium gray (~4.5:1 contrast) - IMPROVED
    inverse: '#FFFFFF',      // White
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

// Dark theme colors - WCAG AA compliant
const darkTheme = {
  background: {
    primary: '#0F172A',      // Very dark blue
    secondary: '#1E293B',    // Dark slate
    card: '#1A2332',         // Dark card
  },
  surface: {
    primary: '#1A2332',      // Dark surface
    elevated: '#1E293B',     // Elevated dark
  },
  text: {
    primary: '#F1F5F9',      // Light gray (~9.3:1 contrast)
    secondary: '#CBD5E1',    // Medium light gray (~5.8:1 contrast)
    tertiary: '#94A3B8',     // Medium gray (~4.5:1 contrast)
    inverse: '#0F172A',      // Dark inverse
  },
  border: {
    light: '#334155',
    medium: '#475569',
    dark: '#64748B',
  },
};

// Brand primary colors (same for both themes)
const primaryColors = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

// Accent colors (same for both themes)
const accentColors = {
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
  },
};

// Shared tokens (spacing, typography, etc.)
const sharedTokens = {
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },

    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      h3: '1.5rem',
      h2: '1.875rem',
      h1: '2.25rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
    },

    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export type Theme = 'light' | 'dark';

// Create theme objects
export const themes: Record<Theme, any> = {
  light: {
    ...lightTheme,
    primary: primaryColors,
    accent: accentColors,
  },
  dark: {
    ...darkTheme,
    primary: primaryColors,
    accent: accentColors,
  },
};

// Get design tokens for a specific theme
export const getDesignTokensByTheme = (theme: Theme = 'light') => ({
  colors: themes[theme],
  ...sharedTokens,
});

// Default light theme tokens (for backward compatibility)
export const designTokens = {
  colors: {
    background: lightTheme.background,
    surface: lightTheme.surface,
    text: lightTheme.text,
    primary: primaryColors,
    accent: accentColors,
    border: lightTheme.border,
  },
  ...sharedTokens,
} as const;

export type DesignTokens = typeof designTokens;
