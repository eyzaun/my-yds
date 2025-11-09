'use client';

import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading2, Text } from '@/components/design-system/Typography';
import { useTheme } from '@/hooks/useTheme';
import { ExcelSampleRow } from '@/types/data';

interface ExcelUploadSectionProps {
  exampleData: ExcelSampleRow[];
}

export function ExcelUploadSection({ exampleData }: ExcelUploadSectionProps) {
  const { tokens } = useTheme();

  return (
    <Card className="mt-8 mb-12 max-w-5xl mx-auto" style={{ padding: tokens.spacing[12] }}>
      <div className="flex flex-col md:flex-row items-center" style={{ gap: tokens.spacing[8] }}>
        {/* Left column - description */}
        <div className="md:w-1/2">
          <Heading2 style={{
            color: tokens.colors.accent,
            marginBottom: tokens.spacing[6]
          }}>
            Kendi Kelime Kartlarınızı Oluşturun
          </Heading2>
          <Text style={{ marginBottom: tokens.spacing[6] }}>
            Excel dosyalarını yükleyerek kişiselleştirilmiş kelime kartları oluşturabilirsiniz.
            Çalışmak istediğiniz kelimeleri Excel&apos;de hazırlayın ve hemen kullanmaya başlayın.
          </Text>
          <ul className="list-disc list-inside space-y-1" style={{
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing[6]
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
            padding: tokens.spacing[8],
            backgroundColor: tokens.colors.background.primary,
            borderColor: `${tokens.colors.accent}30`
          }}>
            <h3 className="text-lg font-semibold" style={{
              color: tokens.colors.text.primary,
              marginBottom: tokens.spacing[6]
            }}>
              Excel Format Örneği
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.colors.accent}30` }}>
                    <th className="py-2 px-4" style={{ backgroundColor: tokens.colors.cardBackground }}>C</th>
                    <th className="py-2 px-4" style={{ backgroundColor: tokens.colors.cardBackground }}>D</th>
                    <th className="py-2 px-4" style={{ backgroundColor: tokens.colors.cardBackground }}>E</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleData.map((row, index) => (
                    <tr key={index} style={{
                      borderBottom: index < exampleData.length - 1 ? `1px solid ${tokens.colors.accent}20` : 'none'
                    }}>
                      <td className="py-2 px-4" style={{ color: tokens.colors.accent }}>{row.word}</td>
                      <td className="py-2 px-4" style={{ color: tokens.colors.text.primary }}>{row.translation}</td>
                      <td className="py-2 px-4" style={{ color: `${tokens.colors.text.primary}80` }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Text size="sm" style={{
              marginTop: tokens.spacing[6],
              color: `${tokens.colors.text.primary}80`
            }}>
              Not: Google Translate kelime listesi dışa aktarımlarıyla uyumludur.
            </Text>
          </Card>
        </div>
      </div>
    </Card>
  );
}
