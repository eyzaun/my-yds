import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface TextProps {
  children: ReactNode;
  className?: string;
  color?: 'text' | 'accent' | 'muted' | 'white' | 'custom';
  customColor?: string;
}

export function Heading({ 
  children, 
  className = "", 
  color = 'text',
  customColor
}: TextProps) {
  const { colors } = useTheme();
  
  const getColor = () => {
    if (customColor) return customColor;
    switch(color) {
      case 'accent': return '#06b6d4';
      case 'muted': return 'rgba(255, 255, 255, 0.7)';
      case 'white': return '#ffffff';
      default: return colors.text;
    }
  };
  
  return (
    <h2 
      className={`text-xl md:text-2xl font-semibold mb-6 ${className}`}
      style={{ color: getColor() }}
    >
      {children}
    </h2>
  );
}

export function Paragraph({ 
  children, 
  className = "", 
  color = 'text',
  customColor
}: TextProps) {
  const { colors } = useTheme();
  
  const getColor = () => {
    if (customColor) return customColor;
    switch(color) {
      case 'accent': return '#06b6d4';
      case 'muted': return 'rgba(255, 255, 255, 0.7)';
      case 'white': return '#ffffff';
      default: return colors.text;
    }
  };
  
  return (
    <p 
      className={`mb-4 ${className}`}
      style={{ color: getColor() }}
    >
      {children}
    </p>
  );
}
