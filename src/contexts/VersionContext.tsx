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
  const [latestVersion, setLatestVersion] = useState<number | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize mobile detection
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Version checking logic
  const checkAndCompareVersions = (current: number, latest: number | null) => {
    if (latest && latest > current) {
      setNeedsUpdate(true);
    } else {
      setNeedsUpdate(false);
    }
  };

  // Main version checking - fetch from app-version.json
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Fetch current version from app-version.json
        const localVersionResponse = await fetch('/app-version.json');
        if (localVersionResponse.ok) {
          const localVersion = await localVersionResponse.json();
          const buildNumber = localVersion.buildNumber;
          setCurrentVersion(buildNumber);

          // First time: set latestVersion from initial load
          if (latestVersion === null) {
            setLatestVersion(buildNumber);
          }
        }
      } catch (error) {
        console.warn('Could not fetch version:', error);
      }
    };

    // First check
    checkVersion();

    // Check every 5 minutes for updates
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [latestVersion]);

  // Check if update is needed
  useEffect(() => {
    checkAndCompareVersions(currentVersion, latestVersion);
  }, [currentVersion, latestVersion]);

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
