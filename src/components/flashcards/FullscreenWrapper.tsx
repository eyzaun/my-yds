'use client';

import React, { useEffect, useState } from 'react';
import { designTokens } from '@/styles/design-tokens';

interface FullscreenWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
  onExit: () => void;
  isQuizMode?: boolean;
}

export default function FullscreenWrapper({ 
  children, 
  isActive,
  onExit,
  //isQuizMode = false
}: FullscreenWrapperProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Mobil uyumluluk için boyut kontrolü
  const isMobile = windowDimensions.width <= 768;
  
  // Ekran boyutu değişikliklerini izle
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);
  
  // Quiz modunda ekstra adımlar
  useEffect(() => {
    if (isActive && typeof document !== 'undefined') {
      // Sayfanın kaydırılmasını önle
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";
      
      // Sayfayı üste sabitle
      window.scrollTo(0, 0);
      
      return () => {
        // Temizlik
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.height = "";
        document.body.style.top = "";
        document.body.style.left = "";
      };
    }
  }, [isActive]);
  
  // ESC tuşu ile tam ekrandan çıkış
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        onExit();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive, onExit]);
  
  if (!isActive) return <>{children}</>;
  
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col h-screen"
      style={{
        backgroundColor: designTokens.colors.background.primary,
      }}
    >
      <div className="absolute top-2 right-2 z-50">
        <button
          onClick={onExit}
          className="p-2 rounded-full hover:bg-opacity-30 transition-colors"
          style={{
            backgroundColor: `${designTokens.colors.primary[600]}30`,
            color: designTokens.colors.text.primary,
            border: 'none',
            outline: 'none',
            boxShadow: `0 0 ${designTokens.spacing[2]} ${designTokens.colors.primary[600]}30`
          }}
          aria-label="Tam ekrandan çık"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Flashcard ve navigasyon içeren ana kısım */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-[800px] flex flex-col">
          {children}
        </div>
      </div>
      
      <style jsx global>{`
        .fullscreen-quiz-form {
          margin-bottom: ${isMobile ? designTokens.spacing[3] : designTokens.spacing[5]};
          margin-top: 0;
        }

        .nav-buttons-wrapper {
          margin-bottom: ${designTokens.spacing[2]};
        }

        /* Mobil için optimize edilmiş stiller */
        @media (max-width: 768px) {
          .nav-buttons-wrapper {
            margin-top: ${designTokens.spacing[2]};
            margin-bottom: ${designTokens.spacing[3]};
          }
        }
      `}</style>
    </div>
  );
}