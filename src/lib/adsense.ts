// Global AdSense management singleton
let adsenseInitialized = false;

// Use declaration merging instead of extending Window
declare global {
  interface Window {
    adsbygoogle: unknown[];
    __adsenseInitialized?: boolean;
  }
}

export const initializeAdsense = (): void => {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Don't initialize twice
  if (window.__adsenseInitialized || adsenseInitialized) return;
  
  try {
    // Mark as initialized locally AND on window object
    adsenseInitialized = true;
    window.__adsenseInitialized = true;
    
    // Initialize adsbygoogle array
    window.adsbygoogle = window.adsbygoogle || [];
    
    // Push page-level ads configuration only once
    window.adsbygoogle.push({
      google_ad_client: "ca-pub-3638586001556511",
      //enable_page_level_ads: true,
      // Add an overlay to help debug
      overlays: { bottom: true }
    });
    
    console.log("AdSense initialization successful");
  } catch (error) {
    console.error("AdSense initialization error:", error);
  }
};
