import { Feature } from '@/types/data';
import { Card } from '@/components/design-system/Card';
import { Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <Card className="text-center" style={{ marginBottom: designTokens.spacing.xxl }}>
      <Heading2>YDS Sınavı için En Kapsamlı Kelime Kaynağı</Heading2>

      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: designTokens.spacing.lg,
          marginTop: designTokens.spacing.lg
        }}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="rounded-full"
              style={{
                marginBottom: designTokens.spacing.md,
                padding: designTokens.spacing.md,
                backgroundColor: designTokens.colors.accent
              }}
            >
              <div style={{ color: designTokens.colors.text }}>{feature.icon}</div>
            </div>
            <Heading3 style={{ marginBottom: designTokens.spacing.sm }}>
              {feature.title}
            </Heading3>
            <Text style={{ opacity: 0.8 }}>{feature.description}</Text>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-1"
        style={{
          gap: designTokens.spacing.lg,
          marginTop: designTokens.spacing.xxl
        }}
      >
        <Card variant="elevated">
          <Heading3 style={{ marginBottom: designTokens.spacing.md }}>
            Kendi Kartlarınızı Oluşturun
          </Heading3>
          <Text style={{ marginBottom: designTokens.spacing.lg, opacity: 0.8 }}>
            Excel dosyalarınızı yükleyerek kişisel kelime kartlarınızı oluşturun ve çalışın.
          </Text>
          <button
            onClick={() => window.location.href = "/upload-flashcards"}
            className="inline-block rounded-md font-medium transition-all hover:scale-105"
            style={{
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
              backgroundColor: designTokens.colors.accent,
              color: "#000",
              boxShadow: `0 0 15px ${designTokens.colors.accent}40`
            }}
          >
            Hemen Başlayın →
          </button>
        </Card>
      </div>
    </Card>
  );
}
