'use client';

import { FaqItem } from '@/types/data';
import { Card } from '@/components/design-system/Card';
import { Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';

interface FaqSectionProps {
  faqItems: FaqItem[];
}

export function FaqSection({ faqItems }: FaqSectionProps) {
  const { tokens } = useTheme();

  return (
    <div style={{ marginBottom: tokens.spacing[12] }}>
      <Heading2>Sık Sorulan Sorular</Heading2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[6] }}>
        {faqItems.map((item, index) => (
          <Card key={index}>
            <div style={{ marginBottom: tokens.spacing[2] }}>
              <Heading3>{item.question}</Heading3>
            </div>
            <Text>{item.answer}</Text>
          </Card>
        ))}
      </div>
    </div>
  );
}
