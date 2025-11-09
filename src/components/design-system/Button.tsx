import React from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'small'; // Added 'small' alias for 'sm'
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size: sizeProp = 'md',
  fullWidth = false,
  children,
  className = '',
  style = {},
  disabled = false,
  ...props
}) => {
  const designTokens = useDesignTokens();
  const { isDark } = useTheme();

  // Handle 'small' alias for backward compatibility
  const size = sizeProp === 'small' ? 'sm' : sizeProp;

  const baseStyles: React.CSSProperties = {
    fontFamily: designTokens.typography.fontFamily.base,
    fontWeight: designTokens.typography.fontWeight.medium,
    borderRadius: designTokens.borderRadius.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    filter: disabled ? 'grayscale(30%)' : 'none',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      fontSize: designTokens.typography.fontSize.sm,
    },
    md: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.base,
    },
    lg: {
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      fontSize: designTokens.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: designTokens.colors.primary[600],
      color: designTokens.colors.text.inverse,
      border: `1px solid ${designTokens.colors.primary[600]}`,
    },
    secondary: {
      backgroundColor: isDark
        ? designTokens.colors.components.button.secondaryDark
        : designTokens.colors.components.button.secondary,
      color: designTokens.colors.text.primary,
      border: `1px solid ${designTokens.colors.border.medium}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: designTokens.colors.primary[600],
      border: `1px solid ${designTokens.colors.primary[600]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: designTokens.colors.text.primary,
      border: 'none',
    },
    danger: {
      backgroundColor: designTokens.colors.status.error,
      color: designTokens.colors.text.inverse,
      border: `1px solid ${designTokens.colors.status.error}`,
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  // Generate hover background color based on variant
  const getHoverBackground = () => {
    if (disabled) return variantStyles[variant].backgroundColor;

    if (!isHovered) return variantStyles[variant].backgroundColor;

    switch (variant) {
      case 'primary':
        return designTokens.colors.primary[700];
      case 'secondary':
        return isDark
          ? designTokens.colors.components.button.secondaryDarkHover
          : designTokens.colors.components.button.secondaryHover;
      case 'outline':
        return designTokens.colors.primary[50];
      case 'ghost':
        return designTokens.colors.background.secondary;
      case 'danger':
        return designTokens.colors.status.error;
      default:
        return variantStyles[variant].backgroundColor;
    }
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        backgroundColor: getHoverBackground(),
        ...style,
      }}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};
