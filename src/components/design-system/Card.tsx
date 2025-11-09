'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof tokens.spacing;
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
  const { tokens } = useTheme();

  const baseStyles: React.CSSProperties = {
    backgroundColor: tokens.colors.background.card,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing[padding],
    transition: tokens.transitions.base,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      border: `1px solid ${tokens.colors.border.light}`,
    },
    elevated: {
      boxShadow: tokens.shadows.md,
      border: `1px solid ${tokens.colors.border.light}`,
    },
    outlined: {
      border: `1px solid ${tokens.colors.border.medium}`,
    },
  };

  const clickableStyles: React.CSSProperties = onClick
    ? {
        cursor: 'pointer',
      }
    : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && variant === 'elevated') {
      e.currentTarget.style.boxShadow = tokens.shadows.lg;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && variant === 'elevated') {
      e.currentTarget.style.boxShadow = tokens.shadows.md;
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
