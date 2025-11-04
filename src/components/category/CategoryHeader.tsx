/**
 * CategoryHeader Component
 * Reusable header for category pages
 * Eliminates duplicate header code across category pages
 */

interface CategoryHeaderProps {
  title: string;
  textColor: string;
}

export function CategoryHeader({ title, textColor }: CategoryHeaderProps) {
  return (
    <h1
      className="text-2xl md:text-3xl font-bold mb-6 text-center"
      style={{ color: textColor }}
    >
      {title}
    </h1>
  );
}
