'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  style = {},
  disabled = false,
  ...props
}) => {
  const { tokens } = useTheme();

  const baseStyles: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily.base,
    fontWeight: tokens.typography.fontWeight.medium,
    borderRadius: tokens.borderRadius.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: tokens.transitions.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      fontSize: tokens.typography.fontSize.sm,
    },
    md: {
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      fontSize: tokens.typography.fontSize.base,
    },
    lg: {
      padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
      fontSize: tokens.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: tokens.colors.primary[600],
      color: tokens.colors.text.inverse,
      border: `1px solid ${tokens.colors.primary[600]}`,
    },
    secondary: {
      backgroundColor: tokens.colors.background.secondary,
      color: tokens.colors.text.primary,
      border: `1px solid ${tokens.colors.border.medium}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: tokens.colors.primary[600],
      border: `1px solid ${tokens.colors.primary[600]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: tokens.colors.text.primary,
      border: 'none',
    },
    danger: {
      backgroundColor: tokens.colors.accent.error.main,
      color: tokens.colors.text.inverse,
      border: `1px solid ${tokens.colors.accent.error.main}`,
    },
  };

  const hoverStyles: Record<string, string> = {
    primary: tokens.colors.primary[700],
    secondary: tokens.colors.border.light,
    outline: tokens.colors.primary[50],
    ghost: tokens.colors.background.secondary,
    danger: tokens.colors.accent.error.dark,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (variant === 'outline' || variant === 'ghost') {
        e.currentTarget.style.backgroundColor = hoverStyles[variant];
      } else {
        e.currentTarget.style.backgroundColor = hoverStyles[variant];
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor as string;
    }
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
