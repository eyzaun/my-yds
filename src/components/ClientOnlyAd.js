'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function ClientOnlyAd({ slot, format = 'auto', className = '', style = {} }) {
  const adRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const currentRef = adRef.current;
    if (!currentRef) return;
    
    try {
      // Clear any existing content
      currentRef.innerHTML = '';
      
      // Create the ins element with proper attributes
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = 'ca-pub-3638586001556511';
      ins.dataset.adSlot = slot;
      ins.dataset.adFormat = format;
      ins.dataset.fullWidthResponsive = 'true';
      
      // Append the ins element to our container
      currentRef.appendChild(ins);
      
      // Initialize AdSense for this ad
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } else {
        console.error('AdSense not initialized');
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
    
    return () => {
      if (currentRef) {
        try {
          currentRef.innerHTML = '';
        } catch {
          // Ignore cleanup errors (no parameter)
        }
      }
    };
  }, [mounted, slot, format]);
  
  if (!mounted) {
    // Placeholder until client-side rendering
    return <div className={className} style={{ minHeight: '100px', ...style }} />;
  }
  
  return (
    <div 
      ref={adRef}
      className={className}
      style={{ minHeight: '100px', display: 'block', ...style }}
    />
  );
}