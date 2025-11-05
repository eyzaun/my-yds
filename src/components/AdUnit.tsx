'use client';
import { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', style = {}, className = '' }: AdUnitProps) {
  const [mounted, setMounted] = useState(false);
  const [adError, setAdError] = useState(false);
  const pushAttemptedRef = useRef(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted || pushAttemptedRef.current) return;
    
    // Prevent multiple push attempts for the same ad
    pushAttemptedRef.current = true;
    
    // Wait for AdSense script to be ready
    const initAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        // Silently handle AdSense errors
        setAdError(true);
      }
    };
    
    // Delay to prevent race conditions
    const timeoutId = setTimeout(initAd, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [mounted]);
  
  if (!mounted) {
    return (
      <div 
        className={className}
        style={{
          width: '100%',
          minHeight: format === 'rectangle' ? '250px' : '90px',
          ...style
        }}
      />
    );
  }
  
  return (
    <ins 
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        width: '100%',
        minHeight: format === 'rectangle' ? '250px' : '90px',
        ...style
      }}
      data-ad-client="ca-pub-3638586001556511"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}