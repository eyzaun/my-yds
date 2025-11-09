import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';
import { ExcelSampleRow } from '@/types/data';

interface ExcelUploadSectionProps {
  exampleData: ExcelSampleRow[];
}

export function ExcelUploadSection({ exampleData }: ExcelUploadSectionProps) {
  return (
    <Card className="mt-8 mb-12 max-w-5xl mx-auto" style={{ padding: designTokens.spacing.xl }}>
      <div className="flex flex-col md:flex-row items-center" style={{ gap: designTokens.spacing.lg }}>
        {/* Left column - description */}
        <div className="md:w-1/2">
          <Heading2 style={{
            color: designTokens.colors.accent,
            marginBottom: designTokens.spacing.md
          }}>
            Kendi Kelime Kartlarınızı Oluşturun
          </Heading2>
          <Text style={{ marginBottom: designTokens.spacing.md }}>
            Excel dosyalarını yükleyerek kişiselleştirilmiş kelime kartları oluşturabilirsiniz.
            Çalışmak istediğiniz kelimeleri Excel&apos;de hazırlayın ve hemen kullanmaya başlayın.
          </Text>
          <ul className="list-disc list-inside space-y-1" style={{
            color: designTokens.colors.text,
            marginBottom: designTokens.spacing.md
          }}>
            <li>Excel dosyanızda C sütununa kelimeleri, D sütununa anlamlarını yazın</li>
            <li>İsteğe bağlı notları E sütununa ekleyebilirsiniz</li>
            <li>Google Translate&apos;ten kayıtlı kelimelerinizi Excel olarak dışa aktarıp yükleyebilirsiniz</li>
            <li>Dilediğiniz kadar kelime ekleyin ve öğrenme sürecinizi takip edin</li>
          </ul>
          <Button
            onClick={() => window.location.href = "/upload-flashcards"}
            variant="primary"
          >
            Hemen Başlayın →
          </Button>
        </div>

        {/* Right column - example table */}
        <div className="md:w-1/2">
          <Card style={{
            padding: designTokens.spacing.lg,
            backgroundColor: designTokens.colors.background,
            borderColor: `${designTokens.colors.accent}30`
          }}>
            <h3 className="text-lg font-semibold" style={{
              color: designTokens.colors.text,
              marginBottom: designTokens.spacing.md
            }}>
              Excel Format Örneği
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${designTokens.colors.accent}30` }}>
                    <th className="py-2 px-4" style={{ backgroundColor: designTokens.colors.cardBackground }}>C</th>
                    <th className="py-2 px-4" style={{ backgroundColor: designTokens.colors.cardBackground }}>D</th>
                    <th className="py-2 px-4" style={{ backgroundColor: designTokens.colors.cardBackground }}>E</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleData.map((row, index) => (
                    <tr key={index} style={{
                      borderBottom: index < exampleData.length - 1 ? `1px solid ${designTokens.colors.accent}20` : 'none'
                    }}>
                      <td className="py-2 px-4" style={{ color: designTokens.colors.accent }}>{row.word}</td>
                      <td className="py-2 px-4" style={{ color: designTokens.colors.text }}>{row.translation}</td>
                      <td className="py-2 px-4" style={{ color: `${designTokens.colors.text}80` }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Text size="sm" style={{
              marginTop: designTokens.spacing.md,
              color: `${designTokens.colors.text}80`
            }}>
              Not: Google Translate kelime listesi dışa aktarımlarıyla uyumludur.
            </Text>
          </Card>
        </div>
      </div>
    </Card>
  );
}
