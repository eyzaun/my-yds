'use client';
import NavigationBar from './NavigationBar';
import { usePathname } from 'next/navigation';
import { useFlashcardFullscreen } from '@/contexts/FlashcardFullscreenContext';
import { useTheme } from '@/hooks/useTheme';

// Doğrudan bileşeni import edin
import AdUnit from '@/components/AdUnit';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isFullscreen } = useFlashcardFullscreen();
  const { tokens } = useTheme();

  // Tema renglerini al
  const themeTokens = tokens;

  // Bazı sayfalarda reklam göstermek istemiyorsanız
  const excludedPaths = ['/login', '/register'];
  const shouldShowAds = !excludedPaths.includes(pathname || '') && !isFullscreen;

  return (
    <div style={{ backgroundColor: themeTokens.colors.background.primary, minHeight: '100vh' }}>
      {!isFullscreen && <NavigationBar />}

      {/* Üst reklam - Ana Sayfa Üst Banner */}
      {shouldShowAds && (
        <div className="w-full" style={{ padding: '1rem 0' }}>
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <AdUnit
              slot="6727613341" /* Ana Sayfa Üst Banner */
              format="horizontal"
              className="my-2"
            />
          </div>
        </div>
      )}

      <main>
        {children}
      </main>

      {/* Alt reklam - Site Alt Reklam */}
      {shouldShowAds && (
        <div className="w-full" style={{ padding: '1rem 0' }}>
          <div className="max-w-6xl mx-auto px-2 sm:px-4 mb-8">
            <AdUnit
              slot="3007186106" /* Site Alt Reklam */
              format="auto"
              className="my-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}