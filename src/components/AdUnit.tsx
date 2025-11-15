'use client';
import { useEffect, useRef } from 'react';

// Global map to track ad instances and prevent re-pushing
const adInstanceMap = new Map<string, { pushed: boolean; tries: number }>();

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', style = {}, className = '' }: AdUnitProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adIdRef = useRef(`ad-${slot}-${Math.random().toString(36).substring(2, 9)}`);
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(10);

  useEffect(() => {
    const currentRef = adContainerRef.current;

    // Minimum height hesapla
    const getMinHeight = (): string => {
      switch (format) {
        case 'rectangle':
          return '250px';
        case 'vertical':
          return '600px';
        case 'horizontal':
          return '90px';
        case 'auto':
        default:
          return '90px';
      }
    };

    // AdSense scriptinin yüklenmesini bekleyin
    const checkAndInitAd = () => {
      if (!currentRef) return;

      // Önceki elementleri temizle (innerHTML yerine removeChild kullan)
      while (currentRef.firstChild) {
        currentRef.removeChild(currentRef.firstChild);
      }

      // AdSense scriptinin yüklenip yüklenilmediğini kontrol edin
      if (typeof window.adsbygoogle === 'undefined') {
        if (retryCountRef.current < maxRetriesRef.current) {
          retryCountRef.current++;
          // Sessizce bekle, log spam'i önle
          setTimeout(checkAndInitAd, 500); // 500ms sonra tekrar dene
          return;
        } else {
          console.warn(`AdSense script not loaded after ${maxRetriesRef.current} retries for slot ${slot}`);
          return;
        }
      }

      // Reset retry counter
      retryCountRef.current = 0;

      try {
        // Reklam elementini oluştur
        const uniqueAdId = adIdRef.current;
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.id = uniqueAdId;
        ins.style.display = 'block';
        ins.style.textAlign = 'center';

        // Format'a göre stiller
        if (format === 'auto' || format === 'horizontal') {
          ins.style.width = '100%';
          ins.style.maxWidth = '100%';
          ins.dataset.fullWidthResponsive = 'true';
        } else {
          // Sabit formlar için
          ins.style.width = '100%';
          ins.style.maxWidth = '100%';
          ins.style.minHeight = getMinHeight();
        }

        ins.dataset.adClient = 'ca-pub-3638586001556511';
        ins.dataset.adSlot = slot;
        ins.dataset.adFormat = format;

        // Div'e ekleyin
        currentRef.appendChild(ins);

        // AdSense'i yükleyin - track attempt
        const adInstance = adInstanceMap.get(uniqueAdId) || { pushed: false, tries: 0 };
        if (!adInstance.pushed && adInstance.tries < 3) {
          adInstance.tries++;
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adInstance.pushed = true;
          } catch (e) {
            console.warn(`AdSense push attempt ${adInstance.tries} failed for ${slot}`);
          }
          adInstanceMap.set(uniqueAdId, adInstance);
        }

      } catch (error) {
        console.error('Error creating ad:', error);
      }
    };

    // İlk deneme
    checkAndInitAd();

    // Temizleme
    return () => {
      if (currentRef) {
        try {
          while (currentRef.firstChild) {
            currentRef.removeChild(currentRef.firstChild);
          }
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [slot, format]);

  const getMinHeight = (): string => {
    switch (format) {
      case 'rectangle':
        return '250px';
      case 'vertical':
        return '600px';
      case 'horizontal':
        return '90px';
      case 'auto':
      default:
        return '100px';
    }
  };

  return (
    <div
      ref={adContainerRef}
      id={adIdRef.current}
      className={`ad-container ${className}`}
      style={{
        width: '100%',
        minHeight: getMinHeight(),
        overflow: 'visible',
        textAlign: 'center',
        margin: '0 auto',
        ...style
      }}
    />
  );
}