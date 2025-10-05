'use client';
import { useEffect } from 'react';

export default function AdSenseScriptWrapper() {
  useEffect(() => {
    // Bu yaklaşım Next.js Script bileşeninin oluşturduğu sorunları aşıyor
    const loadAdSenseScript = () => {
      if (document.getElementById('google-adsense-script')) return;
      
      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3638586001556511';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('AdSense script loaded via DOM method');
        window.adsbygoogle = window.adsbygoogle || [];
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