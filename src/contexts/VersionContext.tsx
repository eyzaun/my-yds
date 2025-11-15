'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface VersionContextType {
  currentVersion: number;
  needsUpdate: boolean;
  dismissUpdate: () => void;
  isMobile: boolean;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

// Helper to detect mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [latestVersion, setLatestVersion] = useState<number>(1);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize mobile detection
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Main version checking - simple buildNumber comparison
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Local app-version.json'dan current version'ı al
        const localVersionResponse = await fetch('/app-version.json');
        if (localVersionResponse.ok) {
          const localVersion = await localVersionResponse.json();
          const current = localVersion.buildNumber;
          setCurrentVersion(current);

          // Simple comparison: just check if there's a newer version available
          // You can manually update buildNumber in public/app-version.json
          if (current < latestVersion) {
            setNeedsUpdate(true);
          }
        }
      } catch (error) {
        console.warn('Could not fetch local version:', error);
      }
    };

    // İlk kontrol
    checkVersion();

    // Version check every 30 minutes
    const interval = setInterval(checkVersion, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [latestVersion]);

  const dismissUpdate = () => {
    setUpdateDismissed(true);
    setNeedsUpdate(false);
  };

  // Exposed context value
  const value: VersionContextType = {
    currentVersion,
    needsUpdate: needsUpdate && !updateDismissed,
    dismissUpdate,
    isMobile
  };

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within VersionProvider');
  }
  return context;
};
