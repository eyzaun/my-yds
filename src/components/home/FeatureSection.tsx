import { Feature } from '@/types/data';
import { Card } from '@/components/design-system/Card';
import { Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { Button } from '@/components/design-system/Button';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useRouter } from 'next/navigation';

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  const designTokens = useDesignTokens();
  const router = useRouter();

  return (
    <Card className="text-center" style={{ marginBottom: designTokens.spacing[12] }}>
      <Heading2>YDS Sınavı için En Kapsamlı Kelime Kaynağı</Heading2>

      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: designTokens.spacing[8],
          marginTop: designTokens.spacing[8]
        }}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="rounded-full"
              style={{
                marginBottom: designTokens.spacing[6],
                padding: designTokens.spacing[6],
                backgroundColor: designTokens.colors.primary[100],
              }}
            >
              <div style={{ color: designTokens.colors.primary[700] }}>{feature.icon}</div>
            </div>
            <Heading3 style={{ marginBottom: designTokens.spacing[2] }}>
              {feature.title}
            </Heading3>
            <Text variant="secondary">{feature.description}</Text>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-1"
        style={{
          gap: designTokens.spacing[8],
          marginTop: designTokens.spacing[12]
        }}
      >
        <Card variant="elevated">
          <Heading3 style={{ marginBottom: designTokens.spacing[6] }}>
            Kendi Kartlarınızı Oluşturun
          </Heading3>
          <Text variant="secondary" style={{ marginBottom: designTokens.spacing[8] }}>
            Excel dosyalarınızı yükleyerek kişisel kelime kartlarınızı oluşturun ve çalışın.
          </Text>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/upload-flashcards")}
          >
            Hemen Başlayın →
          </Button>
        </Card>
      </div>
    </Card>
  );
}
