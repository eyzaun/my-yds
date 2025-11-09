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
    primary: '#FFFFFF',      // Pure white - main background
    secondary: '#F8F8F8',    // Almost white - alt backgrounds
    tertiary: '#EFEFEF',     // Light gray - section backgrounds
    card: '#FFFFFF',         // White cards
    flashcardFront: '#FFFFFF', // Flashcard front
    flashcardBack: '#F8F8F8',  // Flashcard back
  },
  surface: {
    primary: '#FFFFFF',      // Navbar, main surfaces
    elevated: '#FFFFFF',     // Elevated surfaces
  },
  text: {
    primary: '#000000',      // Pure black - main text (WCAG AAA ✓)
    secondary: '#666666',    // Medium gray - secondary text
    tertiary: '#999999',     // Light gray - tertiary text
    disabled: '#CCCCCC',     // Light gray - disabled state
    inverse: '#FFFFFF',      // White text on dark backgrounds
    link: '#0066CC',         // Blue - links
    linkHover: '#0052A3',    // Dark blue - links hover
    note: '#999999',         // Note text (light gray)
  },
  border: {
    light: 'rgba(0, 0, 0, 0.06)',      // Very subtle borders
    medium: 'rgba(0, 0, 0, 0.12)',     // Standard borders
    strong: 'rgba(0, 0, 0, 0.18)',     // Strong borders
    focus: '#0066CC',        // Blue - focus states
  },
  status: {
    success: '#27AE60',      // Green
    successBg: '#E8F5E9',    // Light green
    error: '#E74C3C',        // Red
    errorBg: '#FADBD8',      // Light red
    warning: '#F39C12',      // Orange
    warningBg: '#FEF5E7',    // Light orange
    info: '#0066CC',         // Blue
    infoBg: '#EBF2FA',       // Light blue
  },
  accent: {
    primary: '#0066CC',      // Blue
    success: {
      main: '#27AE60',
      light: '#E8F5E9',
      dark: '#1E8449',
    },
    error: {
      main: '#E74C3C',
      light: '#FADBD8',
      dark: '#C0392B',
    },
    warning: {
      main: '#F39C12',
      light: '#FEF5E7',
      dark: '#BA4A00',
    },
  },
};

// ============================================================
// DARK THEME - Figma Dark Style (White & Near-Black)
// ============================================================
const darkTheme = {
  background: {
    primary: '#111111',      // Near-black - main dark background
    secondary: '#1A1A1A',    // Dark gray - secondary backgrounds
    tertiary: '#242424',     // Lighter dark gray - section backgrounds
    card: '#1A1A1A',         // Dark cards
    flashcardFront: '#2a2a2a', // Flashcard front (dark gray)
    flashcardBack: '#1c1c1c',  // Flashcard back (darker gray)
  },
  surface: {
    primary: '#1A1A1A',      // Navbar, main surfaces
    elevated: '#242424',     // Elevated surfaces (dropdowns, menus)
  },
  text: {
    primary: '#FFFFFF',      // Pure white - main text (WCAG AAA ✓)
    secondary: '#CCCCCC',    // Light gray - secondary text
    tertiary: '#999999',     // Medium gray - tertiary text
    disabled: '#666666',     // Medium gray - disabled state
    inverse: '#111111',      // Dark text on light backgrounds
    link: '#66B2FF',         // Light blue - links in dark mode
    linkHover: '#99CCFF',    // Lighter blue - links hover in dark mode
    note: '#a3a3a3',         // Note text (light gray)
  },
  border: {
    light: 'rgba(255, 255, 255, 0.08)',   // Very subtle borders
    medium: 'rgba(255, 255, 255, 0.15)',  // Standard borders
    strong: 'rgba(255, 255, 255, 0.25)',  // Strong borders
    focus: '#66B2FF',        // Light blue - focus states
  },
  status: {
    success: '#27AE60',      // Green (same as light mode)
    successBg: 'rgba(39, 174, 96, 0.2)',
    error: '#E74C3C',        // Red (same as light mode)
    errorBg: 'rgba(231, 76, 60, 0.2)',
    warning: '#F39C12',      // Orange (same as light mode)
    warningBg: 'rgba(243, 156, 18, 0.2)',
    info: '#66B2FF',         // Light blue
    infoBg: 'rgba(102, 178, 255, 0.2)',
  },
  accent: {
    primary: '#66B2FF',      // Light blue
    success: {
      main: '#27AE60',
      light: 'rgba(39, 174, 96, 0.2)',
      dark: '#1E8449',
    },
    error: {
      main: '#E74C3C',
      light: 'rgba(231, 76, 60, 0.2)',
      dark: '#C0392B',
    },
    warning: {
      main: '#F39C12',
      light: 'rgba(243, 156, 18, 0.2)',
      dark: '#BA4A00',
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
    primary: '#0066CC',      // Blue button
    primaryHover: '#0052A3', // Darker blue on hover
    primaryActive: '#004080', // Even darker on active
    secondary: '#F0F0F0',    // Light gray secondary
    secondaryHover: '#E0E0E0',
    secondaryDark: '#2A2A2A', // Dark gray for dark mode
    secondaryDarkHover: '#3A3A3A',
    ghost: 'transparent',
  },
  input: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1A1A1A',
    borderLight: 'rgba(0, 0, 0, 0.12)',
    borderDark: 'rgba(255, 255, 255, 0.15)',
    focusBorder: '#0066CC',
  },
  card: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1A1A1A',
    borderLight: 'rgba(0, 0, 0, 0.12)',
    borderDark: 'rgba(255, 255, 255, 0.15)',
    hoverLight: '#F8F8F8',
    hoverDark: '#242424',
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
