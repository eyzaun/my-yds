// 🎨 Modern Design System
// Merkezi tasarım konfigürasyonu - tüm sayfalar buradan yönetilir

export interface DesignTokens {
  // Renkler
  colors: {
    background: string;
    cardBackground: string;
    accent: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    disabled: string;
    success: string;
    successLight: string;
    error: string;
    errorLight: string;
    warning: string;
    warningLight: string;
    info: string;
    border: string;
    hover: string;
    neutral: string;
    neutralLight: string;
    neutralDark: string;
  };

  // Gölgeler
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    card: string;
    cardHover: string;
  };

  // Animasyonlar
  animations: {
    fast: string;
    normal: string;
    slow: string;
    easing: string;
  };

  // Spacing (rem cinsinden)
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  // Border radius
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  // Opacity değerleri
  opacity: {
    disabled: string;
    hover: string;
    light: string;
    medium: string;
    heavy: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}

// 🎨 Tema Renkleri
export const colorThemes = {
  blue: {
    background: '#1a1a2e',
    cardBackground: '#16213e',
    accent: '#0f3460',
    text: '#e94560',
    textSecondary: '#e9456080',
    textTertiary: '#e9456060',
    disabled: '#16213e80',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#3b82f6',
    border: '#0f346040',
    hover: '#0f346020',
    neutral: '#374151',
    neutralLight: '#6b7280',
    neutralDark: '#1f2937',
  },
  purple: {
    background: '#1a1625',
    cardBackground: '#2d1b3d',
    accent: '#8b5cf6',
    text: '#e9d5ff',
    textSecondary: '#e9d5ff80',
    textTertiary: '#e9d5ff60',
    disabled: '#2d1b3d80',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#8b5cf6',
    border: '#8b5cf640',
    hover: '#8b5cf620',
    neutral: '#374151',
    neutralLight: '#6b7280',
    neutralDark: '#1f2937',
  },
  green: {
    background: '#1a2519',
    cardBackground: '#1e3a1e',
    accent: '#10b981',
    text: '#86efac',
    textSecondary: '#86efac80',
    textTertiary: '#86efac60',
    disabled: '#1e3a1e80',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#3b82f6',
    border: '#10b98140',
    hover: '#10b98120',
    neutral: '#374151',
    neutralLight: '#6b7280',
    neutralDark: '#1f2937',
  },
  orange: {
    background: '#251a1a',
    cardBackground: '#3a1e1e',
    accent: '#f97316',
    text: '#fed7aa',
    textSecondary: '#fed7aa80',
    textTertiary: '#fed7aa60',
    disabled: '#3a1e1e80',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#3b82f6',
    border: '#f9731640',
    hover: '#f9731620',
    neutral: '#374151',
    neutralLight: '#6b7280',
    neutralDark: '#1f2937',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    accent: '#0ea5e9',
    text: '#f1f5f9',
    textSecondary: '#f1f5f980',
    textTertiary: '#f1f5f960',
    disabled: '#1e293b80',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#0ea5e9',
    border: '#0ea5e940',
    hover: '#0ea5e920',
    neutral: '#475569',
    neutralLight: '#64748b',
    neutralDark: '#334155',
  },
  light: {
    background: '#f8fafc',
    cardBackground: '#ffffff',
    accent: '#3b82f6',
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    disabled: '#e2e8f0',
    success: '#10b981',
    successLight: '#059669',
    error: '#ef4444',
    errorLight: '#dc2626',
    warning: '#f59e0b',
    warningLight: '#d97706',
    info: '#3b82f6',
    border: '#cbd5e1',
    hover: '#e2e8f0',
    neutral: '#64748b',
    neutralLight: '#94a3b8',
    neutralDark: '#475569',
  },
};

// 🎨 Design Tokens (tema-bağımsız)
export const designTokens: Omit<DesignTokens, 'colors'> = {
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    card: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },

  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },

  radius: {
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },

  opacity: {
    disabled: '0.4',
    hover: '0.8',
    light: '0.1',
    medium: '0.5',
    heavy: '0.9',
  },

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
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
};

// 🎨 Tema oluşturma fonksiyonu
export const getDesignSystem = (themeName: keyof typeof colorThemes = 'blue'): DesignTokens => {
  return {
    colors: colorThemes[themeName],
    ...designTokens,
  };
};

// 🎨 Component Stilleri (reusable)
export const componentStyles = {
  // Button stilleri
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variants: {
      primary: 'shadow-md hover:shadow-lg transform hover:scale-105',
      secondary: 'shadow-sm hover:shadow-md',
      outline: 'border-2',
      ghost: 'hover:bg-opacity-10',
    },
  },

  // Card stilleri
  card: {
    base: 'rounded-xl transition-all duration-300',
    variants: {
      elevated: 'shadow-card hover:shadow-cardHover transform hover:scale-[1.02]',
      flat: 'border',
      interactive: 'cursor-pointer shadow-card hover:shadow-cardHover transform hover:scale-105',
    },
  },

  // Input stilleri
  input: {
    base: 'w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    },
  },
};

// 🎨 Layout stilleri
export const layoutStyles = {
  container: {
    full: 'w-full px-4 py-8',
    narrow: 'max-w-2xl mx-auto px-4 py-8',
    medium: 'max-w-4xl mx-auto px-4 py-8',
    wide: 'max-w-6xl mx-auto px-4 py-8',
    full_width: 'max-w-7xl mx-auto px-4 py-8',
  },

  grid: {
    cols1: 'grid grid-cols-1 gap-6',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  },
};

export type ThemeName = keyof typeof colorThemes;
export default getDesignSystem;
