'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', style = {}, className = '' }: AdUnitProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adId = `ad-${slot}-${Math.random().toString(36).substring(2, 9)}`;
  
  useEffect(() => {
    // Ref'i değişkende tutuyoruz (cleanup için)
    const currentRef = adContainerRef.current;
    
    // AdSense scriptinin yüklenmesini bekleyin
    const checkAndInitAd = () => {
      if (!currentRef) return;
      
      // Önceki içeriği temizleyin
      currentRef.innerHTML = '';
      
      // AdSense scriptinin yüklenip yüklenmediğini kontrol edin
      if (typeof window.adsbygoogle === 'undefined') {
        console.log('AdSense script is not loaded yet. Waiting...');
        setTimeout(checkAndInitAd, 200); // 200ms sonra tekrar dene
        return;
      }
      
      try {
        // Çok basit bir şekilde reklam elementini ekleyin
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.width = '100%';
        ins.style.height = format === 'rectangle' ? '250px' : '90px';
        ins.dataset.adClient = 'ca-pub-3638586001556511';
        ins.dataset.adSlot = slot;
        ins.dataset.adFormat = format;
        ins.dataset.fullWidthResponsive = 'true';
        
        // Div'e ekleyin
        currentRef.appendChild(ins);
        
        // AdSense'i yükleyin
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`Ad pushed to queue: ${slot}`);
        } catch (pushError) {
          console.error('Error pushing ad to queue:', pushError);
        }
      } catch (error) {
        console.error('Error creating ad:', error);
      }
    };
    
    // İlk deneme
    checkAndInitAd();
    
    // Temizleme - currentRef değişkenini kullan
    return () => {
      if (currentRef) {
        currentRef.innerHTML = '';
      }
    };
  }, [slot, format, adId]);
  
  return (
    <div 
      ref={adContainerRef}
      id={adId}
      className={`ad-container ${className}`}
      style={{
        width: '100%',
        minHeight: format === 'rectangle' ? '250px' : '90px', 
        overflow: 'hidden',
        textAlign: 'center',
        margin: '0 auto',
        ...style
      }}
    />
  );
}