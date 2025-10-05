'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Client-only reklam bileşeni
const ClientOnlyAd = dynamic(() => import('./ClientOnlyAd'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '100px' }} />
});

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  slot = '1423078098', // Navigation Bar reklamı için varsayılan
  format = 'auto',
  className = '',
  style = {}
}) => {
  return (
    <ClientOnlyAd
      slot={slot}
      format={format}
      className={className}
      style={style}
    />
  );
};

export default AdBanner;