/**
 * Typography Components
 * Professional text components with consistent hierarchy
 */

import React from 'react';
import { designTokens } from '@/styles/design-tokens';

interface BaseTypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: 'primary' | 'secondary' | 'tertiary';
  align?: 'left' | 'center' | 'right';
}

// Heading components
export const Heading1: React.FC<BaseTypographyProps> = ({
  children,
  className = '',
  style,
  color = 'primary',
  align = 'left',
}) => {
  const colors = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    tertiary: designTokens.colors.text.tertiary,
  };

  const headingStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h1,
    fontWeight: designTokens.typography.fontWeight.bold,
    fontFamily: designTokens.typography.fontFamily.primary,
    lineHeight: designTokens.typography.lineHeight.tight,
    color: colors[color],
    textAlign: align,
    margin: 0,
  };

  return (
    <h1 style={{ ...headingStyles, ...style }} className={className}>
      {children}
    </h1>
  );
};

export const Heading2: React.FC<BaseTypographyProps> = ({
  children,
  className = '',
  style,
  color = 'primary',
  align = 'left',
}) => {
  const colors = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    tertiary: designTokens.colors.text.tertiary,
  };

  const headingStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h2,
    fontWeight: designTokens.typography.fontWeight.semibold,
    fontFamily: designTokens.typography.fontFamily.primary,
    lineHeight: designTokens.typography.lineHeight.tight,
    color: colors[color],
    textAlign: align,
    margin: 0,
  };

  return (
    <h2 style={{ ...headingStyles, ...style }} className={className}>
      {children}
    </h2>
  );
};

export const Heading3: React.FC<BaseTypographyProps> = ({
  children,
  className = '',
  style,
  color = 'primary',
  align = 'left',
}) => {
  const colors = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    tertiary: designTokens.colors.text.tertiary,
  };

  const headingStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h3,
    fontWeight: designTokens.typography.fontWeight.semibold,
    fontFamily: designTokens.typography.fontFamily.primary,
    lineHeight: designTokens.typography.lineHeight.normal,
    color: colors[color],
    textAlign: align,
    margin: 0,
  };

  return (
    <h3 style={{ ...headingStyles, ...style }} className={className}>
      {children}
    </h3>
  );
};

// Body text component
export const Text: React.FC<BaseTypographyProps & { size?: 'sm' | 'base' | 'lg' }> = ({
  children,
  className = '',
  style,
  color = 'primary',
  align = 'left',
  size = 'base',
}) => {
  const colors = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    tertiary: designTokens.colors.text.tertiary,
  };

  const sizes = {
    sm: designTokens.typography.fontSize.sm,
    base: designTokens.typography.fontSize.base,
    lg: designTokens.typography.fontSize.h6,
  };

  const textStyles: React.CSSProperties = {
    fontSize: sizes[size],
    fontWeight: designTokens.typography.fontWeight.regular,
    fontFamily: designTokens.typography.fontFamily.primary,
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: colors[color],
    textAlign: align,
    margin: 0,
  };

  return (
    <p style={{ ...textStyles, ...style }} className={className}>
      {children}
    </p>
  );
};
