'use client';

import { useEffect, useState } from 'react';

export default function HydrationSafePage({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state to true once we're in the client
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    // Return a minimal version for server rendering
    return (
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: '20px' }}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }
  
  // Return the full page content on the client
  return (
    <>
      {children}
    </>
  );
}
