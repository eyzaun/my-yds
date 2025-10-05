'use client';

import React, { useEffect, useRef, useState } from 'react';
import { generateAdId, safelyDisplayAd, isAdInitialized } from '../utils/adsenseHelper';

const ClientAd = ({ slot, format = 'auto', className = '', style = {} }) => {
  // Generate a unique ID for this ad instance
  const [adId] = useState(() => generateAdId(slot));
  const adRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [adCreated, setAdCreated] = useState(false);
  
  // Only render on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle ad creation
  useEffect(() => {
    if (!isClient || !adRef.current || adCreated) return;
    
    // Safety check to prevent duplicate initialization
    if (isAdInitialized(adId)) return;
    
    // Store reference to element
    const adContainer = adRef.current;
    
    try {
      // Clear existing content
      adContainer.innerHTML = '';
      
      // Create the ins element
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = 'ca-pub-3638586001556511';
      ins.dataset.adSlot = slot;
      ins.dataset.adFormat = format;
      ins.dataset.fullWidthResponsive = 'true';
      
      // Add to DOM
      adContainer.appendChild(ins);
      setAdCreated(true);
      
      // Wait for next tick to ensure DOM is updated
      setTimeout(() => {
        // Verify element is still in the DOM
        if (document.body.contains(ins)) {
          safelyDisplayAd(ins, adId);
        }
      }, 100);
    } catch (error) {
      console.error(`Error creating ad ${adId}:`, error);
    }
    
  }, [adId, format, isClient, slot, adCreated]);
  
  // Don't render anything on server side (prevents hydration mismatch)
  if (!isClient) {
    return null;
  }
  
  // Render the container
  return (
    <div 
      ref={adRef}
      data-ad-id={adId}
      className={className}
      style={{
        minHeight: '90px',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

export default ClientAd;
