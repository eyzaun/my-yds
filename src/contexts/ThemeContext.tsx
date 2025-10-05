// contexts/ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '@/styles/config';

type Colors = typeof themes.blue;

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'blue',
  setTheme: () => {},
  colors: themes.blue
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // localStorage yalnızca tarayıcıda çalışır
  const [theme, setTheme] = useState('blue');
  const [colors, setColors] = useState(themes.blue);

  // Sayfa yüklendiğinde localStorage'dan tema tercihi al
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'blue';
    setTheme(savedTheme);
    setColors(themes[savedTheme as keyof typeof themes] || themes.blue);
  }, []);

  // Tema değiştiğinde localStorage'a kaydet ve renkleri güncelle
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    setColors(themes[newTheme as keyof typeof themes] || themes.blue);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};