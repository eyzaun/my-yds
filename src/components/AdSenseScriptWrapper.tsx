'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
    __adsenseScriptLoaded?: boolean;
  }
}

export default function AdSenseScriptWrapper() {
  useEffect(() => {
    // Bu yaklaşım Next.js Script bileşeninin oluşturduğu sorunları aşıyor
    const loadAdSenseScript = () => {
      if (document.getElementById('google-adsense-script') || window.__adsenseScriptLoaded) return;

      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3638586001556511';
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        window.__adsenseScriptLoaded = true;
        window.adsbygoogle = window.adsbygoogle || [];
        console.log('AdSense script loaded successfully');
      };

      script.onerror = (e) => {
        console.error('AdSense script failed to load:', e);
      };

      document.head.appendChild(script);
    };

    // Sayfa yüklendikten sonra AdSense scriptini ekle
    if (document.readyState === 'complete') {
      loadAdSenseScript();
    } else {
      window.addEventListener('load', loadAdSenseScript);
      return () => window.removeEventListener('load', loadAdSenseScript);
    }
  }, []);

  // Bileşen herhangi bir şey render etmiyor
  return null;
}