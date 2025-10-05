import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { Category } from '@/types/data';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { colors } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {categories.map((category) => (
        <Link 
          key={category.path} 
          href={category.path}
          className="p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent, color: colors.text }}>
              {category.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>
                {category.name}
              </h3>
              <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                {category.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
