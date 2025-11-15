'use client';
import React, { useEffect, useRef, useState } from 'react';

const AD_LOAD_TIMEOUT = 10000; // 10 saniye timeout

export default function ClientOnlyAd({ slot, format = 'auto', className = '', style = {} }) {
  const adRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const currentRef = adRef.current;
    if (!currentRef) return;

    const initAd = () => {
      try {
        // Temizle
        currentRef.innerHTML = '';

        // AdSense scripti yüklenene kadar bekle
        if (typeof window.adsbygoogle === 'undefined') {
          if (retryCountRef.current < maxRetriesRef.current) {
            retryCountRef.current++;
            setTimeout(initAd, 500);
          } else {
            console.warn(`AdSense script not loaded after ${maxRetriesRef.current} retries for slot ${slot}`);
          }
          return;
        }

        // Reset retry counter on success
        retryCountRef.current = 0;

        // ins elementini oluştur
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.textAlign = 'center';
        ins.dataset.adClient = 'ca-pub-3638586001556511';
        ins.dataset.adSlot = slot;
        ins.dataset.adFormat = format;

        // fullWidthResponsive doğru olmalı
        if (format === 'auto' || format === 'horizontal') {
          ins.dataset.fullWidthResponsive = 'true';
          ins.style.width = '100%';
          ins.style.maxWidth = '100%';
        }

        currentRef.appendChild(ins);

        // AdSense'i push et
        (window.adsbygoogle = window.adsbygoogle || []).push({});

      } catch (error) {
        console.error(`AdSense error for slot ${slot}:`, error);
      }
    };

    initAd();

    return () => {
      if (currentRef) {
        try {
          currentRef.innerHTML = '';
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [mounted, slot, format]);

  if (!mounted) {
    return <div className={className} style={{ minHeight: '100px', ...style }} />;
  }

  return (
    <div
      ref={adRef}
      className={className}
      style={{
        width: '100%',
        minHeight: '100px',
        display: 'block',
        textAlign: 'center',
        ...style
      }}
    />
  );
}