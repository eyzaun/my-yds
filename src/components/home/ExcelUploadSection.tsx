import { useTheme } from '@/contexts/ThemeContext';
import { ExcelSampleRow } from '@/types/data';

interface ExcelUploadSectionProps {
  exampleData: ExcelSampleRow[];
}

export function ExcelUploadSection({ exampleData }: ExcelUploadSectionProps) {
  const { colors } = useTheme();
  
  return (
    <div className="rounded-lg p-6 mt-8 mb-12 max-w-5xl mx-auto" style={{ backgroundColor: colors.cardBackground }}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Left column - description */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.accent }}>
            Kendi Kelime Kartlarınızı Oluşturun
          </h2>
          <p className="mb-4" style={{ color: colors.text }}>
            Excel dosyalarını yükleyerek kişiselleştirilmiş kelime kartları oluşturabilirsiniz. 
            Çalışmak istediğiniz kelimeleri Excel&apos;de hazırlayın ve hemen kullanmaya başlayın.
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1" style={{ color: colors.text }}>
            <li>Excel dosyanızda C sütununa kelimeleri, D sütununa anlamlarını yazın</li>
            <li>İsteğe bağlı notları E sütununa ekleyebilirsiniz</li>
            <li>Google Translate&apos;ten kayıtlı kelimelerinizi Excel olarak dışa aktarıp yükleyebilirsiniz</li>
            <li>Dilediğiniz kadar kelime ekleyin ve öğrenme sürecinizi takip edin</li>
          </ul>
          {/* Fix the button to use theme colors */}
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
        </div>

        {/* Right column - example table */}
        <div className="md:w-1/2">
          <div className="p-5 rounded-lg border" style={{ 
            backgroundColor: colors.background, 
            borderColor: `${colors.accent}30` 
          }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Excel Format Örneği</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.accent}30` }}>
                    <th className="py-2 px-4" style={{ backgroundColor: colors.cardBackground }}>C</th>
                    <th className="py-2 px-4" style={{ backgroundColor: colors.cardBackground }}>D</th>
                    <th className="py-2 px-4" style={{ backgroundColor: colors.cardBackground }}>E</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleData.map((row, index) => (
                    <tr key={index} style={{ 
                      borderBottom: index < exampleData.length - 1 ? `1px solid ${colors.accent}20` : 'none' 
                    }}>
                      <td className="py-2 px-4" style={{ color: colors.accent }}>{row.word}</td>
                      <td className="py-2 px-4" style={{ color: colors.text }}>{row.translation}</td>
                      <td className="py-2 px-4" style={{ color: `${colors.text}80` }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: `${colors.text}80` }}>
              Not: Google Translate kelime listesi dışa aktarımlarıyla uyumludur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
