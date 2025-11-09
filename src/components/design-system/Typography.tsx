'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Heading1: React.FC<TypographyProps> = ({
  children,
  className = '',
  style = {},
}) => {
  const { tokens } = useTheme();

  const h1Styles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: tokens.typography.fontWeight.bold,
    lineHeight: tokens.typography.lineHeight.tight,
    color: tokens.colors.text.primary,
    margin: 0,
  };

  return (
    <h1 className={className} style={{ ...h1Styles, ...style }}>
      {children}
    </h1>
  );
};

export const Heading2: React.FC<TypographyProps> = ({
  children,
  className = '',
  style = {},
}) => {
  const { tokens } = useTheme();

  const h2Styles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.bold,
    lineHeight: tokens.typography.lineHeight.tight,
    color: tokens.colors.text.primary,
    margin: 0,
  };

  return (
    <h2 className={className} style={{ ...h2Styles, ...style }}>
      {children}
    </h2>
  );
};

export const Heading3: React.FC<TypographyProps> = ({
  children,
  className = '',
  style = {},
}) => {
  const { tokens } = useTheme();

  const h3Styles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.h3,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
    color: tokens.colors.text.primary,
    margin: 0,
  };

  return (
    <h3 className={className} style={{ ...h3Styles, ...style }}>
      {children}
    </h3>
  );
};

export const Text: React.FC<TypographyProps & { variant?: 'primary' | 'secondary' | 'tertiary' }> = ({
  children,
  variant = 'primary',
  className = '',
  style = {},
}) => {
  const { tokens } = useTheme();

  const colorMap = {
    primary: tokens.colors.text.primary,
    secondary: tokens.colors.text.secondary,
    tertiary: tokens.colors.text.tertiary,
  };

  const textStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.base,
    lineHeight: tokens.typography.lineHeight.normal,
    color: colorMap[variant],
    margin: 0,
  };

  return (
    <p className={className} style={{ ...textStyles, ...style }}>
      {children}
    </p>
  );
};
