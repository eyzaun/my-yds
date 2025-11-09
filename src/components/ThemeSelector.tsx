// components/ThemeSelector.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/design-system/Button';
import { designTokens } from '@/styles/design-tokens';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light' as const, label: 'Açık Tema', icon: '☀️' },
    { id: 'dark' as const, label: 'Koyu Tema', icon: '🌙' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing[2],
      }}
      title="Tema seç"
    >
      {themes.map((t) => (
        <Button
          key={t.id}
          onClick={() => setTheme(t.id)}
          variant={theme === t.id ? 'primary' : 'secondary'}
          size="sm"
          aria-label={t.label}
          title={t.label}
          style={{
            padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
            minWidth: 'unset',
            fontSize: '16px',
          }}
        >
          {t.icon}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;