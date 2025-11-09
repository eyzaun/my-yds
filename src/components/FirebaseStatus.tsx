'use client';

import { useState, useEffect } from 'react';
import { isFirebaseSafeMode } from '@/lib/firebase/config';

export default function FirebaseStatus() {
  const [isSafeMode, setIsSafeMode] = useState(false);
  
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
      background: '#fff3cd',
      color: '#856404',
      padding: '4px 8px',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '4px 0 0 0',
    }}>
      ⚠️ Çevrimdışı Mod
    </div>
  );
}