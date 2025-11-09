'use client';

import { useState, useEffect } from 'react';
import { isFirebaseSafeMode } from '@/lib/firebase/config';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export default function FirebaseStatus() {
  const [isSafeMode, setIsSafeMode] = useState(false);
  const designTokens = useDesignTokens();

  useEffect(() => {
    setIsSafeMode(isFirebaseSafeMode);
  }, []);

  // Normal modda hiçbir şey gösterme
  if (!isSafeMode) return null;

  // Güvenli modda minimal uyarı göster
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      background: designTokens.colors.status.warningBg,
      color: designTokens.colors.status.warning,
      padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
      fontSize: designTokens.typography.fontSize.xs,
      zIndex: designTokens.zIndex.tooltip,
      borderRadius: `${designTokens.borderRadius.sm} 0 0 0`,
      border: `1px solid ${designTokens.colors.status.warning}`,
      borderBottom: 'none',
      borderRight: 'none',
    }}>
      ⚠️ Çevrimdışı Mod
    </div>
  );
}