'use client';
import NavigationBar from './NavigationBar';
import { usePathname } from 'next/navigation';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useFlashcardFullscreen } from '@/contexts/FlashcardFullscreenContext';

// Doğrudan bileşeni import edin
import AdUnit from '@/components/AdUnit';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isFullscreen } = useFlashcardFullscreen();
  const designTokens = useDesignTokens();

  // Bazı sayfalarda reklam göstermek istemiyorsanız
  const excludedPaths = ['/login', '/register'];
  const shouldShowAds = !excludedPaths.includes(pathname || '') && !isFullscreen;

  return (
    <div style={{ backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {!isFullscreen && <NavigationBar />}

      {/* Üst reklam - Ana Sayfa Üst Banner */}
      {shouldShowAds && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <AdUnit
            slot="6727613341" /* Ana Sayfa Üst Banner */
            format="horizontal"
            className="my-4"
          />
        </div>
      )}
      
      <main>
        {children}
      </main>
      
      {/* Alt reklam - Site Alt Reklam */}
      {shouldShowAds && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <AdUnit
            slot="3007186106" /* Site Alt Reklam */
            format="auto"
            className="my-4"
          />
        </div>
      )}
    </div>
  );
}