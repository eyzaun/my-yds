'use client';
import Script from 'next/script';

export default function AdSenseScript() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3638586001556511"
      crossOrigin="anonymous"
      onLoad={() => {
        console.log('AdSense script loaded');
        // No TypeScript directive needed since we've already declared the type
        window.adsbygoogle = window.adsbygoogle || [];
      }}
    />
  );
}
