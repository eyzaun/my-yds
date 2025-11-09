// components/ThemeSelector.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/styles/config';
import { Button } from '@/components/design-system/Button';
import { designTokens } from '@/styles/design-tokens';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing[2]
      }}
    >
      {Object.keys(themes).map((themeName) => (
        <Button
          key={themeName}
          onClick={() => setTheme(themeName)}
          variant="ghost"
          size="sm"
          aria-label={`${themeName} tema`}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            padding: 0,
            minWidth: 'unset',
            backgroundColor: themes[themeName as keyof typeof themes].accent,
            border: theme === themeName ? '2px solid white' : '2px solid transparent',
          }}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;