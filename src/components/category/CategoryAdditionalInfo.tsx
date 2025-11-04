/**
 * CategoryAdditionalInfo Component
 * Reusable additional information card for categories
 * Displays extra context about the category
 */

interface CategoryAdditionalInfoProps {
  title: string;
  content: string;
  textColor: string;
  cardBackground: string;
}

export function CategoryAdditionalInfo({
  title,
  content,
  textColor,
  cardBackground,
}: CategoryAdditionalInfoProps) {
  // Split content by newlines to create paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div
      className="rounded-lg shadow-md p-4 mb-6"
      style={{ backgroundColor: cardBackground, marginTop: '2rem' }}
    >
      <h3 className="text-lg font-semibold mb-3" style={{ color: textColor }}>
        {title}
      </h3>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          style={{ color: textColor }}
          className={index < paragraphs.length - 1 ? 'mb-3' : ''}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
