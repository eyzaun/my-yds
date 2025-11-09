'use client';
import { Feature } from '@/types/data';
import { Card } from '@/components/design-system/Card';
import { Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  const { tokens } = useTheme();

  return (
    <Card className="text-center" style={{ marginBottom: tokens.spacing.xxl }}>
      <Heading2>YDS Sınavı için En Kapsamlı Kelime Kaynağı</Heading2>

      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: tokens.spacing[8],
          marginTop: tokens.spacing[8]
        }}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="rounded-full"
              style={{
                marginBottom: tokens.spacing[6],
                padding: tokens.spacing[6],
                backgroundColor: tokens.colors.accent
              }}
            >
              <div style={{ color: tokens.colors.text.primary }}>{feature.icon}</div>
            </div>
            <Heading3 style={{ marginBottom: tokens.spacing[2] }}>
              {feature.title}
            </Heading3>
            <Text style={{ opacity: 0.8 }}>{feature.description}</Text>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-1"
        style={{
          gap: tokens.spacing[8],
          marginTop: tokens.spacing.xxl
        }}
      >
        <Card variant="elevated">
          <Heading3 style={{ marginBottom: tokens.spacing[6] }}>
            Kendi Kartlarınızı Oluşturun
          </Heading3>
          <Text style={{ marginBottom: tokens.spacing[8], opacity: 0.8 }}>
            Excel dosyalarınızı yükleyerek kişisel kelime kartlarınızı oluşturun ve çalışın.
          </Text>
          <button
            onClick={() => window.location.href = "/upload-flashcards"}
            className="inline-block rounded-md font-medium transition-all hover:scale-105"
            style={{
              padding: `${tokens.spacing[2]} ${tokens.spacing[8]}`,
              backgroundColor: tokens.colors.accent,
              color: tokens.colors.text.inverse,
              boxShadow: `0 0 15px ${tokens.colors.accent}40`
            }}
          >
            Hemen Başlayın →
          </button>
        </Card>
      </div>
    </Card>
  );
}
