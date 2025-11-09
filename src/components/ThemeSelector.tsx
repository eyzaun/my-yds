// components/ThemeSelector.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { useDesignTokens } from '@/hooks/useDesignTokens';

const ThemeSelector = () => {
  const designTokens = useDesignTokens();
  const { theme, setTheme } = useTheme();

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
        borderRadius: designTokens.borderRadius.md,
        border: `1px solid ${designTokens.colors.border.medium}`,
        backgroundColor: designTokens.colors.background.secondary,
        color: designTokens.colors.text.primary,
        cursor: 'pointer',
        transition: designTokens.transitions.base,
        fontSize: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = designTokens.colors.border.light;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = designTokens.colors.background.secondary;
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeSelector;