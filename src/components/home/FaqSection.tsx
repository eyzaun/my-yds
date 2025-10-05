import { useTheme } from '@/contexts/ThemeContext';
import { FaqItem } from '@/types/data';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Typography';

interface FaqSectionProps {
  faqItems: FaqItem[];
}

export function FaqSection({ faqItems }: FaqSectionProps) {
  const { colors } = useTheme();
  
  return (
    <div className="mb-12">
      <Heading>Sık Sorulan Sorular</Heading>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <Card key={index}>
            <h3 className="font-medium text-lg mb-2" style={{ color: colors.text }}>
              {item.question}
            </h3>
            <p style={{ color: colors.text }}>{item.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
