import Link from 'next/link';
import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  href?: string;
  onClick?: () => void;
}

export function Button({ 
  children, 
  className = "", 
  variant = 'primary',
  href,
  onClick
}: ButtonProps) {
  const { colors } = useTheme();
  
  const getStyles = () => {
    switch(variant) {
      case 'primary': 
        return {
          bg: colors.accent,
          text: '#000', // Dark text for contrast
          classes: 'px-6 py-3 rounded-lg font-medium'
        };
      case 'secondary': 
        return {
          bg: colors.cardBackground,
          text: colors.text,
          classes: 'px-6 py-3 rounded-lg font-medium'
        };
      case 'accent':
        return {
          bg: colors.accent,
          text: '#000', // Dark text for contrast
          classes: 'px-6 py-2 rounded-md font-medium'
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.accent,
          classes: 'px-4 py-2 rounded-lg font-medium border border-current'
        };
    }
  };
  
  const styles = getStyles();
  const buttonStyle = {
    backgroundColor: styles.bg,
    color: styles.text,
    boxShadow: variant !== 'outline' ? `0 0 15px ${colors.accent}30` : 'none'
  };
  
  const buttonClass = `${styles.classes} ${className} transition-all duration-300 hover:scale-105`;
  
  if (href) {
    return (
      <Link 
        href={href}
        className={buttonClass}
        style={buttonStyle}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={buttonClass}
      style={buttonStyle}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
