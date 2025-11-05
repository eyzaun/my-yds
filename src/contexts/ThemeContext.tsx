// contexts/ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { colorThemes, ThemeName } from '@/styles/designSystem';

type Colors = typeof colorThemes.blue;

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'blue',
  setTheme: () => {},
  colors: colorThemes.blue
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // localStorage yalnızca tarayıcıda çalışır
  const [theme, setTheme] = useState<ThemeName>('blue');
  const [colors, setColors] = useState(colorThemes.blue);

  // Sayfa yüklendiğinde localStorage'dan tema tercihi al
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') || 'blue') as ThemeName;
    setTheme(savedTheme);
    setColors(colorThemes[savedTheme] || colorThemes.blue);
  }, []);

  // Tema değiştiğinde localStorage'a kaydet ve renkleri güncelle
  const handleSetTheme = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setColors(colorThemes[newTheme] || colorThemes.blue);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};