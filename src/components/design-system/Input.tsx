/**
 * Input Component
 * Professional form inputs with consistent styling
 */

import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing[2],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    color: error ? designTokens.colors.accent.error.main : designTokens.colors.text.primary,
    fontFamily: designTokens.typography.fontFamily.primary,
  };

  const inputWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
    paddingLeft: leftIcon ? designTokens.spacing[12] : designTokens.spacing[4],
    paddingRight: rightIcon ? designTokens.spacing[12] : designTokens.spacing[4],
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.text.primary,
    backgroundColor: disabled ? designTokens.colors.gray[100] : designTokens.colors.base.white,
    border: `${designTokens.borders.width.thin} solid ${
      error
        ? designTokens.colors.accent.error.main
        : isFocused
        ? designTokens.colors.primary[600]
        : designTokens.colors.border.main
    }`,
    borderRadius: designTokens.borders.radius.lg,
    outline: 'none',
    transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.timing.easeInOut}`,
    boxShadow: isFocused ? `0 0 0 3px ${designTokens.colors.primary[100]}` : 'none',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: designTokens.colors.text.secondary,
    pointerEvents: 'none',
  };

  const helperTextStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.sm,
    color: error ? designTokens.colors.accent.error.main : designTokens.colors.text.secondary,
    fontFamily: designTokens.typography.fontFamily.primary,
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputWrapperStyles}>
        {leftIcon && (
          <div style={{ ...iconStyles, left: designTokens.spacing[4] }}>{leftIcon}</div>
        )}
        <input
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div style={{ ...iconStyles, right: designTokens.spacing[4] }}>{rightIcon}</div>
        )}
      </div>
      {(error || helperText) && <span style={helperTextStyles}>{error || helperText}</span>}
    </div>
  );
};
