import React from 'react';
import { designTokens } from '@/styles/design-tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  style = {},
  ...props
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing[2],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    color: designTokens.colors.text.primary,
  };

  const inputStyles: React.CSSProperties = {
    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily.base,
    borderRadius: designTokens.borderRadius.md,
    border: `1px solid ${error ? designTokens.colors.accent.error.main : designTokens.colors.border.medium}`,
    backgroundColor: designTokens.colors.background.primary,
    color: designTokens.colors.text.primary,
    transition: designTokens.transitions.base,
    width: '100%',
    outline: 'none',
  };

  const helperStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.sm,
    color: error ? designTokens.colors.accent.error.main : designTokens.colors.text.secondary,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error
      ? designTokens.colors.accent.error.main
      : designTokens.colors.primary[600];
    e.target.style.boxShadow = `0 0 0 3px ${error
      ? designTokens.colors.accent.error.light
      : designTokens.colors.primary[100]}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error
      ? designTokens.colors.accent.error.main
      : designTokens.colors.border.medium;
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <input
        style={{ ...inputStyles, ...style }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {(error || helperText) && (
        <span style={helperStyles}>{error || helperText}</span>
      )}
    </div>
  );
};
