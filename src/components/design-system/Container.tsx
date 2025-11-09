import React from 'react';
import { designTokens } from '@/styles/design-tokens';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  padding?: keyof typeof designTokens.spacing;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  padding = 4,
  children,
  className = '',
  style = {},
}) => {
  const maxWidthMap = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    '3xl': '1500px',
    '4xl': '1600px',
    '5xl': '1700px',
    '6xl': '1800px',
    full: '100%',
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: maxWidthMap[maxWidth],
    margin: '0 auto',
    padding: designTokens.spacing[padding],
    width: '100%',
  };

  return (
    <div className={className} style={{ ...containerStyles, ...style }}>
      {children}
    </div>
  );
};
