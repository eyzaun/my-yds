import { useEffect } from 'react';

// Fix type compatibility with existing Window declaration
declare global {
  interface Window {
    // Match the type of the existing adsbygoogle declaration (unknown[])
    adsbygoogle: unknown[];
    __adsenseInitialized?: boolean;
  }
}

export default function AdSenseInit() {
  useEffect(() => {
    // Access properties directly from window object
    if (!window.__adsenseInitialized) {
      try {
        window.__adsenseInitialized = true;
        window.adsbygoogle = window.adsbygoogle || [];
        
        // Only push the page-level config once per page load
        window.adsbygoogle.push({
          google_ad_client: "ca-pub-3638586001556511",
          //enable_page_level_ads: true
        });
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    }
  }, []);

  return null;
}
