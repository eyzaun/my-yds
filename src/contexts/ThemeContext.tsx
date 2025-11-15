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
export const useThemeContext = () => useContext(ThemeContext);

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

  // Tema renglerini DOM'a uygula
  const applyTheme = (selectedTheme: Theme) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', selectedTheme);

    // CSS variables ayarla
    const tokens = getDesignTokensByTheme(selectedTheme);
    const colors = tokens.colors;

    html.style.setProperty('--color-bg-primary', colors.background.primary);
    html.style.setProperty('--color-bg-secondary', colors.background.secondary);
    html.style.setProperty('--color-bg-card', colors.background.card);
    html.style.setProperty('--color-text-primary', colors.text.primary);
    html.style.setProperty('--color-text-secondary', colors.text.secondary);
    html.style.setProperty('--color-text-tertiary', colors.text.tertiary);
    html.style.setProperty('--color-border-light', colors.border.light);
    html.style.setProperty('--color-border-medium', colors.border.medium);
    html.style.setProperty('--color-border-strong', colors.border.strong);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};