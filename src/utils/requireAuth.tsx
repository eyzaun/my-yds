'use client';

import { ReactNode } from 'react';
//import { redirect } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { tokens } = useTheme();
  
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      
      if (!user && typeof window !== 'undefined') {
        window.location.href = `${redirectTo}?redirect=${window.location.pathname}`;
      }
    });
    
    return () => unsubscribe();
  }, [redirectTo]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12"
          style={{
            borderTop: `2px solid ${tokens.colors.accent.primary}`,
            borderBottom: `2px solid ${tokens.colors.accent.primary}`,
          }}
        ></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : null;
}