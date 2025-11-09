import React from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';

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
  const designTokens = useDesignTokens();

  const h1Styles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h1,
    fontWeight: designTokens.typography.fontWeight.bold,
    lineHeight: designTokens.typography.lineHeight.tight,
    color: designTokens.colors.text.primary,
    margin: 0,
    marginBottom: designTokens.spacing[4], // Default spacing for better UX
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
  const designTokens = useDesignTokens();

  const h2Styles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h2,
    fontWeight: designTokens.typography.fontWeight.bold,
    lineHeight: designTokens.typography.lineHeight.tight,
    color: designTokens.colors.text.primary,
    margin: 0,
    marginBottom: designTokens.spacing[3], // Default spacing for better UX
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
  const designTokens = useDesignTokens();

  const h3Styles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.h3,
    fontWeight: designTokens.typography.fontWeight.semibold,
    lineHeight: designTokens.typography.lineHeight.tight,
    color: designTokens.colors.text.primary,
    margin: 0,
    marginBottom: designTokens.spacing[2], // Default spacing for better UX
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
  const designTokens = useDesignTokens();

  const colorMap = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    tertiary: designTokens.colors.text.tertiary,
  };

  const textStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.base,
    lineHeight: designTokens.typography.lineHeight.normal,
    color: colorMap[variant],
    margin: 0,
  };

  return (
    <p className={className} style={{ ...textStyles, ...style }}>
      {children}
    </p>
  );
};
