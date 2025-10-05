import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface StyledCardProps {
  children: ReactNode;
  className?: string;
}

export const StyledCard = ({ children, className = "" }: StyledCardProps) => {
  const { colors } = useTheme();
  return (
    <div 
      className={`rounded-lg shadow-md p-6 ${className}`}
      style={{ backgroundColor: colors.cardBackground }}
    >
      {children}
    </div>
  );
};
