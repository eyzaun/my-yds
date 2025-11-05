'use client';
import React from 'react';
import AdUnit from './AdUnit';

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
    <AdUnit
      slot={slot}
      format={format}
      className={className}
      style={style}
    />
  );
};

export default AdBanner;