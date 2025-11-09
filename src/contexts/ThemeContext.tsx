// contexts/ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, themes, getDesignTokensByTheme } from '@/styles/design-tokens';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Sayfa yüklendiğinde localStorage'dan tema tercihi al
  useEffect(() => {
    // System preference veya localStorage'dan tema al
    let savedTheme: Theme = 'light';

    if (typeof window !== 'undefined') {
      // localStorage'dan kontrol et
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) {
        savedTheme = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Sistem preferansı kontrol et
        savedTheme = 'dark';
      }

      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }

    setMounted(true);
  }, []);

  // Tema değiştiğinde DOM ve localStorage güncelle
  const handleSetTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Tema renglerini DOM'a uygula - TÜM renkleri CSS variables olarak ayarla
  const applyTheme = (selectedTheme: Theme) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', selectedTheme);

    // CSS variables ayarla - COMPLETE COLOR SYSTEM
    const tokens = getDesignTokensByTheme(selectedTheme);
    const colors = tokens.colors;

    // Background colors
    html.style.setProperty('--color-bg-primary', colors.background.primary);
    html.style.setProperty('--color-bg-secondary', colors.background.secondary);
    html.style.setProperty('--color-bg-tertiary', colors.background.tertiary);
    html.style.setProperty('--color-bg-card', colors.background.card);

    // Surface colors
    html.style.setProperty('--color-surface-primary', colors.surface.primary);
    html.style.setProperty('--color-surface-elevated', colors.surface.elevated);

    // Text colors
    html.style.setProperty('--color-text-primary', colors.text.primary);
    html.style.setProperty('--color-text-secondary', colors.text.secondary);
    html.style.setProperty('--color-text-tertiary', colors.text.tertiary);
    html.style.setProperty('--color-text-disabled', colors.text.disabled);
    html.style.setProperty('--color-text-inverse', colors.text.inverse);
    html.style.setProperty('--color-text-link', colors.text.link);
    html.style.setProperty('--color-text-link-hover', colors.text.linkHover);

    // Border colors
    html.style.setProperty('--color-border-light', colors.border.light);
    html.style.setProperty('--color-border-medium', colors.border.medium);
    html.style.setProperty('--color-border-strong', colors.border.strong);
    html.style.setProperty('--color-border-focus', colors.border.focus);

    // Status colors
    html.style.setProperty('--color-success', colors.status.success);
    html.style.setProperty('--color-success-bg', colors.status.successBg);
    html.style.setProperty('--color-error', colors.status.error);
    html.style.setProperty('--color-error-bg', colors.status.errorBg);
    html.style.setProperty('--color-warning', colors.status.warning);
    html.style.setProperty('--color-warning-bg', colors.status.warningBg);
    html.style.setProperty('--color-info', colors.status.info);
    html.style.setProperty('--color-info-bg', colors.status.infoBg);

    // Primary brand colors (full palette)
    html.style.setProperty('--color-primary-50', colors.primary[50]);
    html.style.setProperty('--color-primary-100', colors.primary[100]);
    html.style.setProperty('--color-primary-200', colors.primary[200]);
    html.style.setProperty('--color-primary-300', colors.primary[300]);
    html.style.setProperty('--color-primary-400', colors.primary[400]);
    html.style.setProperty('--color-primary-500', colors.primary[500]);
    html.style.setProperty('--color-primary-600', colors.primary[600]);
    html.style.setProperty('--color-primary-700', colors.primary[700]);
    html.style.setProperty('--color-primary-800', colors.primary[800]);
    html.style.setProperty('--color-primary-900', colors.primary[900]);

    // Shortcuts
    html.style.setProperty('--color-accent', colors.accent);
    html.style.setProperty('--color-card-background', colors.cardBackground);

    // Component colors
    html.style.setProperty('--color-button-primary', colors.components.button.primary);
    html.style.setProperty('--color-button-primary-hover', colors.components.button.primaryHover);
    html.style.setProperty('--color-button-secondary', selectedTheme === 'dark'
      ? colors.components.button.secondaryDark
      : colors.components.button.secondary);
    html.style.setProperty('--color-button-secondary-hover', selectedTheme === 'dark'
      ? colors.components.button.secondaryDarkHover
      : colors.components.button.secondaryHover);
  };

  // Always provide context, even during SSR and before mount
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};