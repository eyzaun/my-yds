/**
 * Container Component
 * Responsive container with max-width control
 */

import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  className = '',
  style,
}) => {
  const maxWidthStyles = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: maxWidthStyles[maxWidth],
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: padding ? designTokens.spacing[4] : '0',
    paddingRight: padding ? designTokens.spacing[4] : '0',
    width: '100%',
  };

  return (
    <div style={{ ...containerStyles, ...style }} className={className}>
      {children}
    </div>
  );
};
