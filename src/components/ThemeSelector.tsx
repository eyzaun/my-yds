// components/ThemeSelector.tsx
'use client';
import { useTheme } from '@/hooks/useTheme';

const ThemeSelector = () => {
  const { theme, setTheme, tokens } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleToggle}
      title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
      aria-label={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.border.medium}`,
        backgroundColor: tokens.colors.background.secondary,
        color: tokens.colors.text.primary,
        cursor: 'pointer',
        transition: tokens.transitions.base,
        fontSize: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors.border.light;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors.background.secondary;
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeSelector;