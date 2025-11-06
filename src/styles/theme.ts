/**
 * Theme System
 * Light and Dark mode based on design tokens
 */

import { designTokens } from './design-tokens';

export interface Theme {
  colors: {
    // Primary brand
    primary: string;
    primaryHover: string;
    primaryActive: string;

    // Success (correct answers, achievements)
    success: string;
    successLight: string;
    successDark: string;

    // Warning (important CTAs)
    warning: string;
    warningLight: string;
    warningDark: string;

    // Error (incorrect answers)
    error: string;
    errorLight: string;
    errorDark: string;

    // Text colors
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;

    // Background colors
    background: string;
    backgroundSecondary: string;
    card: string;

    // Borders
    border: string;
    borderLight: string;

    // Interactive states
    hover: string;
    focus: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: designTokens.colors.primary[600],
    primaryHover: designTokens.colors.primary[700],
    primaryActive: designTokens.colors.primary[800],

    success: designTokens.colors.accent.success.main,
    successLight: designTokens.colors.accent.success.light,
    successDark: designTokens.colors.accent.success.dark,

    warning: designTokens.colors.accent.warning.main,
    warningLight: designTokens.colors.accent.warning.light,
    warningDark: designTokens.colors.accent.warning.dark,

    error: designTokens.colors.accent.error.main,
    errorLight: designTokens.colors.accent.error.light,
    errorDark: designTokens.colors.accent.error.dark,

    textPrimary: designTokens.colors.text.primary,
    textSecondary: designTokens.colors.text.secondary,
    textTertiary: designTokens.colors.text.tertiary,

    background: designTokens.colors.base.offWhite,
    backgroundSecondary: designTokens.colors.gray[100],
    card: designTokens.colors.base.white,

    border: designTokens.colors.border.main,
    borderLight: designTokens.colors.border.light,

    hover: designTokens.colors.gray[100],
    focus: designTokens.colors.primary[100],
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: designTokens.colors.primary[500],
    primaryHover: designTokens.colors.primary[400],
    primaryActive: designTokens.colors.primary[300],

    success: designTokens.colors.accent.success.main,
    successLight: designTokens.colors.accent.success.light,
    successDark: designTokens.colors.accent.success.dark,

    warning: designTokens.colors.accent.warning.main,
    warningLight: designTokens.colors.accent.warning.light,
    warningDark: designTokens.colors.accent.warning.dark,

    error: designTokens.colors.accent.error.main,
    errorLight: designTokens.colors.accent.error.light,
    errorDark: designTokens.colors.accent.error.dark,

    textPrimary: designTokens.colors.text.inverse,
    textSecondary: designTokens.colors.gray[400],
    textTertiary: designTokens.colors.gray[500],

    background: designTokens.colors.base.softBlack,
    backgroundSecondary: '#1A1F26',
    card: '#1A1F26',

    border: designTokens.colors.gray[700],
    borderLight: designTokens.colors.gray[800],

    hover: designTokens.colors.gray[800],
    focus: designTokens.colors.primary[900],
  },
};
