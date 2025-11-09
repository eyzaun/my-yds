import Link from 'next/link';
import { Category } from '@/types/data';
import { Card } from '@/components/design-system/Card';
import { Heading3, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      style={{ gap: designTokens.spacing[8], marginBottom: designTokens.spacing[12] }}
    >
      {categories.map((category) => (
        <Link
          key={category.path}
          href={category.path}
          className="transition-transform duration-300 hover:scale-105"
        >
          <Card variant="elevated">
            <div className="flex items-center" style={{ gap: designTokens.spacing[6] }}>
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: designTokens.colors.accent,
                  color: designTokens.colors.text
                }}
              >
                {category.icon}
              </div>
              <div>
                <Heading3 style={{ marginBottom: designTokens.spacing[1] }}>
                  {category.name}
                </Heading3>
                <Text variant="secondary">
                  {category.description}
                </Text>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
