import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SectionTitleProps {
  children: ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  const { colors } = useTheme();
  return (
    <h2 className="text-xl md:text-2xl font-semibold mb-6" style={{ color: colors.text }}>
      {children}
    </h2>
  );
};
