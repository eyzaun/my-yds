import { useTheme } from '@/contexts/ThemeContext';
import { Feature } from '@/types/data';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Typography';

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  const { colors } = useTheme();
  
  return (
    <Card className="mb-12 text-center">
      <Heading>YDS Sınavı için En Kapsamlı Kelime Kaynağı</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-3 p-3 rounded-full" style={{ backgroundColor: colors.accent }}>
              <div style={{ color: colors.text }}>{feature.icon}</div>
            </div>
            <h3 className="font-medium mb-2" style={{ color: colors.text }}>{feature.title}</h3>
            <p style={{ color: colors.text, opacity: 0.8 }}>{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-12">
        <Card>
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
            Kendi Kartlarınızı Oluşturun
          </h3>
          <p className="mb-4" style={{ color: colors.text, opacity: 0.8 }}>
            Excel dosyalarınızı yükleyerek kişisel kelime kartlarınızı oluşturun ve çalışın.
          </p>
          <button 
            onClick={() => window.location.href = "/upload-flashcards"} 
            className="inline-block px-6 py-2 rounded-md font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: colors.accent,
              color: "#000", // Dark text for contrast on the accent color
              boxShadow: `0 0 15px ${colors.accent}40`
            }}
          >
            Hemen Başlayın →
          </button>
        </Card>
      </div>
    </Card>
  );
}
