/**
 * Design Tokens
 * Professional design system based on UI/UX best practices
 * No emojis - clean and professional
 */

export const designTokens = {
  // ============================================
  // COLORS - 60-30-10 Rule
  // ============================================
  colors: {
    // 60% - Base/Background colors
    base: {
      white: '#FFFFFF',
      offWhite: '#FAFBFC',
      black: '#000000',
      softBlack: '#0F1419',
    },

    // 30% - Primary brand colors (Trust blue)
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6', // Main primary
      600: '#2563EB', // Interactive elements
      700: '#1D4ED8',
      800: '#1E40AF', // Headers
      900: '#1E3A8A',
    },

    // 10% - Accent colors (CTA)
    accent: {
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
    },

    // Grayscale (Neutral)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#F9FAFB',
    },

    border: {
      light: '#E5E7EB',
      main: '#D1D5DB',
      dark: '#9CA3AF',
    },

    background: {
      primary: '#FAFBFC',
      secondary: '#F3F4F6',
      tertiary: '#FFFFFF',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      accent: "'Poppins', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },

    fontSize: {
      // Display
      display: '3rem', // 48px

      // Headings
      h1: '2.25rem', // 36px
      h2: '1.875rem', // 30px
      h3: '1.5rem', // 24px
      h4: '1.25rem', // 20px
      h5: '1.125rem', // 18px
      h6: '1rem', // 16px

      // Body
      base: '1rem', // 16px - minimum for accessibility
      sm: '0.875rem', // 14px
      xs: '0.75rem', // 12px
    },

    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },

  // ============================================
  // SPACING (8px grid system)
  // ============================================
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px - base unit
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============================================
  // BORDERS & RADIUS
  // ============================================
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
    radius: {
      none: '0',
      sm: '0.25rem', // 4px
      md: '0.5rem', // 8px
      lg: '0.75rem', // 12px
      xl: '1rem', // 16px
      '2xl': '1.5rem', // 24px
      full: '9999px',
    },
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    timing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Export type for TypeScript
export type DesignTokens = typeof designTokens;
