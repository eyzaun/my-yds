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
  // cachedVersion: version the user currently has (from last successful deployment they loaded)
  // deployedVersion: version currently on the server (from app-version.json)
  const [cachedVersion, setCachedVersion] = useState<number>(1);
  const [deployedVersion, setDeployedVersion] = useState<number | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mobile detection
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Main version checking - fetch from app-version.json
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Fetch deployed version from app-version.json
        const response = await fetch('/app-version.json', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const buildNumber = data.buildNumber;

          // On first load, set cached version to deployed version (user has current version)
          if (!isInitialized) {
            setCachedVersion(buildNumber);
            setIsInitialized(true);
          }

          // Always update deployed version (what's on server)
          setDeployedVersion(buildNumber);
        }
      } catch (error) {
        console.warn('Could not fetch version:', error);
      }
    };

    // First check immediately
    checkVersion();

    // Check every 5 minutes for updates
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isInitialized]);

  // Check if update is needed
  useEffect(() => {
    if (deployedVersion !== null && deployedVersion > cachedVersion) {
      setNeedsUpdate(true);
    } else {
      setNeedsUpdate(false);
    }

    // Debug logging
    if (typeof window !== 'undefined') {
      console.log('[Version Check]', {
        cachedVersion,
        deployedVersion,
        needsUpdate,
        updateDismissed,
        isInitialized
      });
    }
  }, [cachedVersion, deployedVersion, needsUpdate, updateDismissed, isInitialized]);

  const dismissUpdate = () => {
    setUpdateDismissed(true);
    setNeedsUpdate(false);
  };

  // Exposed context value
  const value: VersionContextType = {
    currentVersion: cachedVersion,
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
