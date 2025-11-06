/**
 * Button Component
 * Professional button following design system rules
 */

import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing[2],
    fontFamily: designTokens.typography.fontFamily.primary,
    fontWeight: designTokens.typography.fontWeight.medium,
    borderRadius: designTokens.borders.radius.lg,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.timing.easeInOut}`,
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles = {
    sm: {
      fontSize: designTokens.typography.fontSize.sm,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      minHeight: '36px',
    },
    md: {
      fontSize: designTokens.typography.fontSize.base,
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      minHeight: '44px',
    },
    lg: {
      fontSize: designTokens.typography.fontSize.h6,
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      minHeight: '52px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: designTokens.colors.primary[600],
      color: designTokens.colors.base.white,
      boxShadow: designTokens.shadows.sm,
    },
    secondary: {
      backgroundColor: designTokens.colors.gray[600],
      color: designTokens.colors.base.white,
      boxShadow: designTokens.shadows.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      color: designTokens.colors.primary[600],
      border: `${designTokens.borders.width.medium} solid ${designTokens.colors.primary[600]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: designTokens.colors.text.primary,
    },
    success: {
      backgroundColor: designTokens.colors.accent.success.main,
      color: designTokens.colors.base.white,
      boxShadow: designTokens.shadows.sm,
    },
    warning: {
      backgroundColor: designTokens.colors.accent.warning.main,
      color: designTokens.colors.base.white,
      boxShadow: designTokens.shadows.sm,
    },
    error: {
      backgroundColor: designTokens.colors.accent.error.main,
      color: designTokens.colors.base.white,
      boxShadow: designTokens.shadows.sm,
    },
  };

  const hoverStyles = {
    primary: { backgroundColor: designTokens.colors.primary[700] },
    secondary: { backgroundColor: designTokens.colors.gray[700] },
    outline: { backgroundColor: designTokens.colors.primary[50] },
    ghost: { backgroundColor: designTokens.colors.gray[100] },
    success: { backgroundColor: designTokens.colors.accent.success.dark },
    warning: { backgroundColor: designTokens.colors.accent.warning.dark },
    error: { backgroundColor: designTokens.colors.accent.error.dark },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(isHovered && !disabled && !loading ? hoverStyles[variant] : {}),
  };

  return (
    <button
      style={combinedStyles}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      {...props}
    >
      {loading ? (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};
