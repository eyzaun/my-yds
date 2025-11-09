import React from 'react';
import { useDesignTokens } from '@/hooks/useDesignTokens';

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
  id: providedId,
  required = false,
  ...props
}) => {
  const designTokens = useDesignTokens();

  // Generate unique ID for label-input association
  const generatedId = React.useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

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
    color: designTokens.colors.text.primary,
  };

  const inputStyles: React.CSSProperties = {
    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily.base,
    borderRadius: designTokens.borderRadius.md,
    border: `2px solid ${error ? designTokens.colors.status.error : designTokens.colors.border.medium}`,
    backgroundColor: designTokens.colors.surface.primary,
    color: designTokens.colors.text.primary,
    transition: 'all 0.2s ease-in-out',
    width: '100%',
    outline: 'none',
    boxShadow: isFocused
      ? `0 0 0 3px ${error ? designTokens.colors.status.errorBg : designTokens.colors.primary[100]}`
      : 'none',
  };

  const helperStyles: React.CSSProperties = {
    fontSize: designTokens.typography.fontSize.sm,
    color: error ? designTokens.colors.status.error : designTokens.colors.text.secondary,
  };

  const requiredIndicatorStyles: React.CSSProperties = {
    color: designTokens.colors.status.error,
    marginLeft: designTokens.spacing[1],
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label style={labelStyles} htmlFor={inputId}>
          {label}
          {required && <span style={requiredIndicatorStyles} aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        style={{ ...inputStyles, ...style }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        aria-required={required}
        required={required}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert" style={helperStyles}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={helperId} style={helperStyles}>
          {helperText}
        </span>
      )}
    </div>
  );
};
