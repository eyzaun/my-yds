'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

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
  const { tokens } = useTheme();

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing[2],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.text.primary,
  };

  const inputStyles: React.CSSProperties = {
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    fontSize: tokens.typography.fontSize.base,
    fontFamily: tokens.typography.fontFamily.base,
    borderRadius: tokens.borderRadius.md,
    border: `1px solid ${error ? tokens.colors.accent.error.main : tokens.colors.border.medium}`,
    backgroundColor: tokens.colors.background.primary,
    color: tokens.colors.text.primary,
    transition: tokens.transitions.base,
    width: '100%',
    outline: 'none',
  };

  const helperStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.sm,
    color: error ? tokens.colors.accent.error.main : tokens.colors.text.secondary,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error
      ? tokens.colors.accent.error.main
      : tokens.colors.primary[600];
    e.target.style.boxShadow = `0 0 0 3px ${error
      ? tokens.colors.accent.error.light
      : tokens.colors.primary[100]}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error
      ? tokens.colors.accent.error.main
      : tokens.colors.border.medium;
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
