import React from 'react';
import { designTokens } from '@/styles/design-tokens';

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
  const baseStyles: React.CSSProperties = {
    fontFamily: designTokens.typography.fontFamily.base,
    fontWeight: designTokens.typography.fontWeight.medium,
    borderRadius: designTokens.borderRadius.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: designTokens.transitions.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      fontSize: designTokens.typography.fontSize.sm,
    },
    md: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.base,
    },
    lg: {
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      fontSize: designTokens.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: designTokens.colors.primary[600],
      color: designTokens.colors.text.inverse,
    },
    secondary: {
      backgroundColor: designTokens.colors.background.secondary,
      color: designTokens.colors.text.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      color: designTokens.colors.primary[600],
      border: `1px solid ${designTokens.colors.primary[600]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: designTokens.colors.text.primary,
    },
    danger: {
      backgroundColor: designTokens.colors.accent.error.main,
      color: designTokens.colors.text.inverse,
    },
  };

  const hoverStyles: Record<string, string> = {
    primary: designTokens.colors.primary[700],
    secondary: designTokens.colors.border.light,
    outline: designTokens.colors.primary[50],
    ghost: designTokens.colors.background.secondary,
    danger: designTokens.colors.accent.error.dark,
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
