/**
 * Design Tokens - Based on Figma's Professional Color System
 * Light Mode: Black (#000000) on White (#FFFFFF)
 * Dark Mode: White (#FFFFFF) on Near-Black (#111111)
 *
 * Inspired by: Figma, Notion, Vercel - minimalist professional design
 */

// ============================================================
// LIGHT THEME - Figma Style (Improved Contrast & Readability)
// ============================================================
const lightTheme = {
  background: {
    primary: '#F5F5F5',      // Light gray - main background (better contrast)
    secondary: '#ECECEC',    // Medium gray - alt backgrounds
    tertiary: '#E0E0E0',     // Darker gray - section backgrounds
    card: '#FFFFFF',         // Pure white - cards stand out from background
  },
  surface: {
    primary: '#FFFFFF',      // Navbar, main surfaces - pure white
    elevated: '#FFFFFF',     // Elevated surfaces - pure white
  },
  text: {
    primary: '#1A1A1A',      // Near-black - better than pure black (WCAG AAA ✓)
    secondary: '#4A4A4A',    // Dark gray - secondary text (better contrast)
    tertiary: '#757575',     // Medium gray - tertiary text
    disabled: '#BDBDBD',     // Light gray - disabled state
    inverse: '#FFFFFF',      // White text on dark backgrounds
    link: '#0066CC',         // Blue - links
    linkHover: '#0052A3',    // Dark blue - links hover
  },
  border: {
    light: 'rgba(0, 0, 0, 0.08)',      // Subtle borders (slightly stronger)
    medium: 'rgba(0, 0, 0, 0.16)',     // Standard borders (more visible)
    strong: 'rgba(0, 0, 0, 0.24)',     // Strong borders (clearly visible)
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

// Component Backgrounds & Interactive States
const components = {
  button: {
    primary: '#0066CC',      // Blue button
    primaryHover: '#0052A3', // Darker blue on hover
    primaryActive: '#004080', // Even darker on active
    secondary: '#E8E8E8',    // Light gray secondary (better contrast)
    secondaryHover: '#D6D6D6', // Darker on hover
    secondaryDark: '#2A2A2A', // Dark gray for dark mode
    secondaryDarkHover: '#3A3A3A',
    ghost: 'transparent',
  },
  input: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1A1A1A',
    borderLight: 'rgba(0, 0, 0, 0.16)',  // More visible border
    borderDark: 'rgba(255, 255, 255, 0.15)',
    focusBorder: '#0066CC',
  },
  card: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#1A1A1A',
    borderLight: 'rgba(0, 0, 0, 0.08)',  // Subtle but visible
    borderDark: 'rgba(255, 255, 255, 0.15)',
    hoverLight: '#FAFAFA',    // Very subtle hover
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
    components: components,
    // Shortcuts for backward compatibility and easier access
    accent: primaryColors[500],        // Shortcut to primary blue
    cardBackground: lightTheme.background.card,  // Shortcut to card background
    success: lightTheme.status.success,  // Shortcut to success color
    error: lightTheme.status.error,      // Shortcut to error color
    warning: lightTheme.status.warning,  // Shortcut to warning color
    info: lightTheme.status.info,        // Shortcut to info color
  },
  dark: {
    ...darkTheme,
    primary: primaryColors,
    components: components,
    // Shortcuts for backward compatibility and easier access
    accent: darkTheme.accent.primary,    // Shortcut to dark mode accent (light blue)
    cardBackground: darkTheme.background.card,  // Shortcut to card background
    success: darkTheme.status.success,   // Shortcut to success color
    error: darkTheme.status.error,       // Shortcut to error color
    warning: darkTheme.status.warning,   // Shortcut to warning color
    info: darkTheme.status.info,         // Shortcut to info color
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
    // Shortcuts for backward compatibility and easier access (light theme defaults)
    cardBackground: lightTheme.background.card,
    success: lightTheme.status.success,
    error: lightTheme.status.error,
    warning: lightTheme.status.warning,
    info: lightTheme.status.info,
  },
  ...sharedTokens,
} as const;

export type DesignTokens = typeof designTokens;
