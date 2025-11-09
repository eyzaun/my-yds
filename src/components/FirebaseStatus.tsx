'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { isFirebaseSafeMode } from '@/lib/firebase/config';

export default function FirebaseStatus() {
  const [isSafeMode, setIsSafeMode] = useState(false);
  const tokens = useTheme();

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
      background: tokens.colors.status.warningBg,
      color: tokens.colors.accent.warning.dark,
      padding: '4px 8px',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '4px 0 0 0',
    }}>
      ⚠️ Çevrimdışı Mod
    </div>
  );
}