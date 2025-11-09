import React from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  style = {},
  onClick,
}) => {
  const designTokens = useDesignTokens();

  // Map padding sizes to spacing values
  const paddingMap = {
    sm: designTokens.spacing[4],
    md: designTokens.spacing[6],
    lg: designTokens.spacing[8],
    xl: designTokens.spacing[10],
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: designTokens.colors.background.card,
    borderRadius: designTokens.borderRadius.lg,
    padding: paddingMap[padding],
    transition: designTokens.transitions.base,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      border: `1px solid ${designTokens.colors.border.light}`,
    },
    elevated: {
      boxShadow: designTokens.shadows.md,
      border: `1px solid ${designTokens.colors.border.light}`,
    },
    outlined: {
      border: `1px solid ${designTokens.colors.border.medium}`,
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
