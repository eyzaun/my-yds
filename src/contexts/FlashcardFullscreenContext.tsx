'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FlashcardFullscreenContextType {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const FlashcardFullscreenContext = createContext<FlashcardFullscreenContextType | undefined>(undefined);

export function FlashcardFullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <FlashcardFullscreenContext.Provider value={{ isFullscreen, setIsFullscreen }}>
      {children}
    </FlashcardFullscreenContext.Provider>
  );
}

export function useFlashcardFullscreen() {
  const context = useContext(FlashcardFullscreenContext);
  if (!context) {
    throw new Error('useFlashcardFullscreen must be used within FlashcardFullscreenProvider');
  }
  return context;
}
