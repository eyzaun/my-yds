import React from 'react';
import { designTokens } from '@/styles/design-tokens';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof designTokens.spacing;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 6,
  children,
  className = '',
  style = {},
  onClick,
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: designTokens.colors.surface.primary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing[padding],
    transition: designTokens.transitions.base,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      border: 'none',
    },
    elevated: {
      boxShadow: designTokens.shadows.md,
      border: 'none',
    },
    outlined: {
      border: `1px solid ${designTokens.colors.border.light}`,
    },
  };

  const clickableStyles: React.CSSProperties = onClick
    ? {
        cursor: 'pointer',
      }
    : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && variant === 'elevated') {
      e.currentTarget.style.boxShadow = designTokens.shadows.lg;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && variant === 'elevated') {
      e.currentTarget.style.boxShadow = designTokens.shadows.md;
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...clickableStyles,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
