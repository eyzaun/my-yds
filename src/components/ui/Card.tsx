import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'accent';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  variant = 'default',
  hover = false
}: CardProps) {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    switch(variant) {
      case 'dark': return '#1d1d1d';
      case 'accent': return colors.accent;
      default: return colors.cardBackground;
    }
  };
  
  return (
    <div 
      className={`rounded-lg shadow-md p-6 ${hover ? 'transition-all hover:shadow-lg hover:scale-105' : ''} ${className}`}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {children}
    </div>
  );
}
