/**
 * Design Tokens - Based on Figma's Professional Color System
 * Light Mode: Black (#000000) on White (#FFFFFF)
 * Dark Mode: White (#FFFFFF) on Near-Black (#111111)
 *
 * Inspired by: Figma, Notion, Vercel - minimalist professional design
 */

// ============================================================
// LIGHT THEME - Figma Style (Black & White)
// ============================================================
const lightTheme = {
  background: {
    primary: '#f8f9fa',      // Soft light gray - main background
    secondary: '#ffffff',    // Pure white - alt backgrounds
    tertiary: '#f0f2f5',     // Light gray - section backgrounds
    card: '#ffffff',         // White cards
    flashcardFront: '#ffffff', // Flashcard front
    flashcardBack: '#f8fafb',  // Flashcard back
  },
  surface: {
    primary: '#ffffff',      // Navbar, main surfaces
    elevated: '#ffffff',     // Elevated surfaces
  },
  text: {
    primary: '#1a1a1a',      // Near black - main text (WCAG AAA ✓)
    secondary: '#4a5568',    // Medium gray - secondary text
    tertiary: '#718096',     // Light gray - tertiary text
    disabled: '#a0aec0',     // Light gray - disabled state
    inverse: '#ffffff',      // White text on dark backgrounds
    link: '#5b8ec6',         // Soft blue - links
    linkHover: '#4a7ab5',    // Darker blue - links hover
    note: '#718096',         // Note text (light gray)
  },
  border: {
    light: '#edf2f7',        // Very subtle borders
    medium: '#e2e8f0',       // Standard borders
    strong: '#cbd5e0',       // Strong borders
    focus: '#5b8ec6',        // Soft blue - focus states
  },
  status: {
    success: '#6bc490',      // Soft green
    successBg: '#e8f5e9',    // Light green
    error: '#e57373',        // Soft red
    errorBg: '#fee2e2',      // Light red
    warning: '#f6b93b',      // Soft orange
    warningBg: '#fef3c7',    // Light orange
    info: '#64b5f6',         // Soft blue
    infoBg: '#ebf2fa',       // Light blue
  },
  accent: {
    primary: '#5b8ec6',      // Soft blue
    success: {
      main: '#6bc490',
      light: '#e8f5e9',
      dark: '#5aae7e',
    },
    error: {
      main: '#e57373',
      light: '#fee2e2',
      dark: '#d75a5a',
    },
    warning: {
      main: '#f6b93b',
      light: '#fef3c7',
      dark: '#e5a82a',
    },
  },
};

// ============================================================
// DARK THEME - Figma Dark Style (White & Near-Black)
// ============================================================
const darkTheme = {
  background: {
    primary: '#121212',      // Pure black - main dark background
    secondary: '#1e1e1e',    // Dark gray - secondary backgrounds
    tertiary: '#2a2a2a',     // Lighter dark gray - section backgrounds
    card: '#1e1e1e',         // Dark cards
    flashcardFront: '#2a2a2a', // Flashcard front (dark gray)
    flashcardBack: '#1e1e1e',  // Flashcard back (darker gray)
  },
  surface: {
    primary: '#1e1e1e',      // Navbar, main surfaces
    elevated: '#2a2a2a',     // Elevated surfaces (dropdowns, menus)
  },
  text: {
    primary: '#f5f5f5',      // Light gray - main text (WCAG AAA ✓)
    secondary: '#b8b8b8',    // Medium gray - secondary text
    tertiary: '#8a8a8a',     // Gray - tertiary text
    disabled: '#5a5a5a',     // Dark gray - disabled state
    inverse: '#121212',      // Dark text on light backgrounds
    link: '#e0e0e0',         // Light gray - links in dark mode
    linkHover: '#f0f0f0',    // Lighter gray - links hover in dark mode
    note: '#a3a3a3',         // Note text (gray)
  },
  border: {
    light: '#2a2a2a',        // Very subtle borders
    medium: '#3a3a3a',       // Standard borders
    strong: '#4a4a4a',       // Strong borders
    focus: '#e0e0e0',        // Light gray - focus states
  },
  status: {
    success: '#b8b8b8',      // Light gray (monochrome success)
    successBg: 'rgba(184, 184, 184, 0.2)',
    error: '#c8c8c8',        // Lighter gray (monochrome error)
    errorBg: 'rgba(200, 200, 200, 0.2)',
    warning: '#d0d0d0',      // Very light gray (monochrome warning)
    warningBg: 'rgba(208, 208, 208, 0.2)',
    info: '#a8a8a8',         // Medium gray (monochrome info)
    infoBg: 'rgba(168, 168, 168, 0.2)',
  },
  accent: {
    primary: '#e0e0e0',      // Light gray (monochrome)
    success: {
      main: '#b8b8b8',
      light: 'rgba(184, 184, 184, 0.2)',
      dark: '#a0a0a0',
    },
    error: {
      main: '#c8c8c8',
      light: 'rgba(200, 200, 200, 0.2)',
      dark: '#b0b0b0',
    },
    warning: {
      main: '#d0d0d0',
      light: 'rgba(208, 208, 208, 0.2)',
      dark: '#b8b8b8',
    },
  },
};

// ============================================================
// SHARED TOKENS (Both Themes)
// ============================================================

// Primary Brand Colors (Blue palette)
const primaryColors = {
  50: '#EBF2FA',
  100: '#D6E4F5',
  200: '#B3CEEC',
  300: '#80B3E0',
  400: '#4D97D4',
  500: '#0066CC',
  600: '#0052A3',
  700: '#004080',
  800: '#002E59',
  900: '#001A33',
};

// Utility Color Palettes
const grayColors = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

const redColors = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

const greenColors = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

const cyanColors = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
  bright: '#14FFEC', // Special bright cyan
};

// Component Backgrounds & Interactive States
const components = {
  button: {
    primary: '#5b8ec6',      // Soft blue button (light theme)
    primaryHover: '#4a7ab5', // Darker blue on hover
    primaryActive: '#3d6699', // Even darker on active
    secondary: '#f0f2f5',    // Light gray secondary
    secondaryHover: '#e2e6ea',
    secondaryDark: '#2a2a2a', // Dark gray for dark mode
    secondaryDarkHover: '#3a3a3a',
    ghost: 'transparent',
  },
  input: {
    backgroundLight: '#ffffff',
    backgroundDark: '#1e1e1e',
    borderLight: '#e2e8f0',
    borderDark: '#3a3a3a',
    focusBorder: '#5b8ec6',
  },
  card: {
    backgroundLight: '#ffffff',
    backgroundDark: '#1e1e1e',
    borderLight: '#e2e8f0',
    borderDark: '#3a3a3a',
    hoverLight: '#f8fafb',
    hoverDark: '#2a2a2a',
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
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
    gray: grayColors,
    red: redColors,
    green: greenColors,
    cyan: cyanColors,
    components: components,
  },
  dark: {
    ...darkTheme,
    primary: primaryColors,
    gray: grayColors,
    red: redColors,
    green: greenColors,
    cyan: cyanColors,
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
    gray: grayColors,
    red: redColors,
    green: greenColors,
    cyan: cyanColors,
    border: lightTheme.border,
    status: lightTheme.status,
    accent: lightTheme.accent,
    components: components,
  },
  ...sharedTokens,
} as const;

export type DesignTokens = typeof designTokens;