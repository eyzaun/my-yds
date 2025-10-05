// components/ThemeSelector.tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/styles/config';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {Object.keys(themes).map((themeName) => (
        <button
          key={themeName}
          onClick={() => setTheme(themeName)}
          className={`w-6 h-6 rounded-full border-2 ${
            theme === themeName ? 'border-white' : 'border-transparent'
          }`}
          style={{ backgroundColor: themes[themeName as keyof typeof themes].accent }}
          aria-label={`${themeName} tema`}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;