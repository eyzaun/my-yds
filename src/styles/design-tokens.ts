/**
 * Design Tokens with Professional Light & Dark Mode
 * Based on modern design systems (Figma, Tailwind, Vercel, GitHub)
 */

// ============================================================
// LIGHT THEME - Professional & Accessible
// ============================================================
const lightTheme = {
  background: {
    primary: '#FFFFFF',      // Pure white
    secondary: '#F8FAFC',    // Slate-50
    tertiary: '#F1F5F9',     // Slate-100
    card: '#FFFFFF',         // White cards
  },
  surface: {
    primary: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',      // Slate-900 (14:1 contrast)
    secondary: '#475569',    // Slate-600 (7:1 contrast)
    tertiary: '#64748B',     // Slate-500 (4.5:1 contrast)
    disabled: '#94A3B8',     // Slate-400
    inverse: '#FFFFFF',
    link: '#2563EB',         // Blue-600
    linkHover: '#1D4ED8',    // Blue-700
  },
  border: {
    light: '#F1F5F9',        // Slate-100
    medium: '#E2E8F0',       // Slate-200
    strong: '#CBD5E1',       // Slate-300
    focus: '#3B82F6',        // Blue-500
  },
  status: {
    success: '#10B981',      // Green-500
    successBg: '#D1FAE5',    // Green-100
    error: '#EF4444',        // Red-500
    errorBg: '#FEE2E2',      // Red-100
    warning: '#F59E0B',      // Amber-500
    warningBg: '#FEF3C7',    // Amber-100
    info: '#3B82F6',         // Blue-500
    infoBg: '#DBEAFE',       // Blue-100
  },
  accent: {
    primary: '#3B82F6',      // Blue-500
    success: {
      main: '#10B981',       // Green-500
      light: '#D1FAE5',      // Green-100
      dark: '#059669',       // Green-600
    },
    error: {
      main: '#EF4444',       // Red-500
      light: '#FEE2E2',      // Red-100
      dark: '#DC2626',       // Red-600
    },
    warning: {
      main: '#F59E0B',       // Amber-500
      light: '#FEF3C7',      // Amber-100
      dark: '#D97706',       // Amber-600
    },
  },
};

// ============================================================
// DARK THEME - Professional & Accessible
// ============================================================
const darkTheme = {
  background: {
    primary: '#0F172A',      // Slate-900 (pure dark)
    secondary: '#1E293B',    // Slate-800
    tertiary: '#334155',     // Slate-700
    card: '#1E293B',         // Slate-800 cards
  },
  surface: {
    primary: '#1E293B',
    elevated: '#334155',
  },
  text: {
    primary: '#F8FAFC',      // Slate-50 (13:1 contrast)
    secondary: '#CBD5E1',    // Slate-300 (7.5:1 contrast)
    tertiary: '#94A3B8',     // Slate-400 (4.6:1 contrast)
    disabled: '#64748B',     // Slate-500
    inverse: '#0F172A',
    link: '#60A5FA',         // Blue-400
    linkHover: '#93C5FD',    // Blue-300
  },
  border: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
    focus: '#3B82F6',
  },
  status: {
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.1)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.1)',
  },
  accent: {
    primary: '#60A5FA',      // Blue-400 (lighter for dark mode)
    success: {
      main: '#10B981',       // Green-500
      light: 'rgba(16, 185, 129, 0.2)',
      dark: '#059669',       // Green-600
    },
    error: {
      main: '#EF4444',       // Red-500
      light: 'rgba(239, 68, 68, 0.2)',
      dark: '#DC2626',       // Red-600
    },
    warning: {
      main: '#F59E0B',       // Amber-500
      light: 'rgba(245, 158, 11, 0.2)',
      dark: '#D97706',       // Amber-600
    },
  },
};

// ============================================================
// SHARED TOKENS (Both Themes)
// ============================================================

// Brand Primary Colors
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

// Component Backgrounds & Interactive States
const components = {
  button: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryActive: '#1D4ED8',
    secondary: '#F1F5F9', // Light
    secondaryHover: '#E2E8F0',
    secondaryDark: '#334155', // Dark
    secondaryDarkHover: '#475569',
    ghost: 'transparent',
  },
  input: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1E293B',
    borderLight: '#E2E8F0',
    borderDark: 'rgba(255, 255, 255, 0.1)',
    focusBorder: '#3B82F6',
  },
  card: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1E293B',
    borderLight: '#E2E8F0',
    borderDark: 'rgba(255, 255, 255, 0.1)',
    hoverLight: '#FAFBFC',
    hoverDark: '#334155',
  },
};

const sharedTokens = {
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
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

// ============================================================
// EXPORTS
// ============================================================

export type Theme = 'light' | 'dark';

export const themes: Record<Theme, any> = {
  light: {
    ...lightTheme,
    primary: primaryColors,
    components: components,
  },
  dark: {
    ...darkTheme,
    primary: primaryColors,
    components: components,
  },
};

export const getDesignTokensByTheme = (theme: Theme = 'light') => ({
  colors: themes[theme],
  ...sharedTokens,
});

// Default light theme (backward compatibility)
export const designTokens = {
  colors: {
    background: lightTheme.background,
    surface: lightTheme.surface,
    text: lightTheme.text,
    primary: primaryColors,
    border: lightTheme.border,
    status: lightTheme.status,
    accent: lightTheme.accent,
    components: components,
  },
  ...sharedTokens,
} as const;

export type DesignTokens = typeof designTokens;
