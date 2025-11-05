'use client';
import { useEffect, useRef } from 'react';

// Global flag to prevent multiple script loads
let scriptLoadAttempted = false;
let scriptLoaded = false;

export default function AdSenseScriptWrapper() {
  const initAttempted = useRef(false);
  
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttempted.current || scriptLoadAttempted) return;
    initAttempted.current = true;
    scriptLoadAttempted = true;
    
    const loadAdSenseScript = () => {
      // Check if already exists
      if (document.getElementById('google-adsense-script') || scriptLoaded) {
        return;
      }
      
      try {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3638586001556511';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          scriptLoaded = true;
          window.adsbygoogle = window.adsbygoogle || [];
          // Sadece bir kez log
          if (process.env.NODE_ENV === 'development') {
            console.log('AdSense script loaded successfully');
          }
        };
        
        script.onerror = (error) => {
          console.warn('AdSense script failed to load. This may be due to ad blockers or network issues.');
          scriptLoadAttempted = false; // Allow retry on next mount
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Error loading AdSense script:', error);
        scriptLoadAttempted = false;
      }
    };

    // Load after page is interactive
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Delay to avoid blocking main thread
      setTimeout(loadAdSenseScript, 500);
    } else {
      window.addEventListener('DOMContentLoaded', loadAdSenseScript, { once: true });
    }
  }, []);

  return null;
}