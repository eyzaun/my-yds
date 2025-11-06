/**
 * Card Component
 * Professional card with consistent styling
 */

import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  style,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const paddingStyles = {
    none: '0',
    sm: designTokens.spacing[4],
    md: designTokens.spacing[6],
    lg: designTokens.spacing[8],
  };

  const variantStyles = {
    default: {
      backgroundColor: designTokens.colors.base.white,
      border: 'none',
      boxShadow: designTokens.shadows.sm,
    },
    outlined: {
      backgroundColor: designTokens.colors.base.white,
      border: `${designTokens.borders.width.thin} solid ${designTokens.colors.border.light}`,
      boxShadow: 'none',
    },
    elevated: {
      backgroundColor: designTokens.colors.base.white,
      border: 'none',
      boxShadow: designTokens.shadows.lg,
    },
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: designTokens.borders.radius.xl,
    padding: paddingStyles[padding],
    transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.timing.easeInOut}`,
    cursor: clickable ? 'pointer' : 'default',
    ...variantStyles[variant],
  };

  const hoverStyles: React.CSSProperties = (hover || clickable) && isHovered ? {
    boxShadow: designTokens.shadows.md,
    transform: 'translateY(-2px)',
  } : {};

  return (
    <div
      style={{ ...baseStyles, ...hoverStyles, ...style }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};
