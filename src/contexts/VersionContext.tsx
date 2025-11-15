'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAppVersion, AppVersion } from '@/firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface VersionContextType {
  currentVersion: number;
  latestVersion: AppVersion | null;
  needsUpdate: boolean;
  forceUpdate: boolean;
  dismissUpdate: () => void;
  isLoading: boolean;
  isMobile: boolean;
  lastCheckTime: number;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

// Helper to detect mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [latestVersion, setLatestVersion] = useState<AppVersion | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  // Initialize mobile detection
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Version checking logic
  const checkAndCompareVersions = (current: number, latest: AppVersion) => {
    if (latest.buildNumber > current) {
      setNeedsUpdate(true);
    }

    if (latest.forceUpdate && latest.buildNumber > current) {
      setForceUpdate(true);
      setUpdateDismissed(false);
    }
  };

  // Main version checking
  useEffect(() => {
    const checkVersion = async () => {
      try {
        setIsLoading(true);
        setLastCheckTime(Date.now());

        // Local public app-version.json'dan current version'ı al
        const localVersionResponse = await fetch('/app-version.json');
        if (localVersionResponse.ok) {
          const localVersion = (await localVersionResponse.json()) as AppVersion;
          setCurrentVersion(localVersion.buildNumber);
        }

        // Firestore'dan latest version'ı al (ilk defa)
        const latest = await getAppVersion();
        if (latest) {
          setLatestVersion(latest);
          checkAndCompareVersions(currentVersion, latest);
        }
      } catch (error) {
        console.error('Error checking version:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // İlk kontrol
    checkVersion();

    // Version check every 30 minutes (daha frequent)
    const interval = setInterval(checkVersion, 30 * 60 * 1000);

    // Real-time Firestore listener for version changes
    let unsubscribe: (() => void) | null = null;
    try {
      const versionRef = doc(db, 'appConfig', 'version');
      unsubscribe = onSnapshot(versionRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const latest = docSnapshot.data() as AppVersion;
          setLatestVersion(latest);
          // Get current version from state
          const currentVer = currentVersion || 1;
          checkAndCompareVersions(currentVer, latest);
        }
      });
    } catch (error) {
      console.warn('Real-time version listening not available:', error);
    }

    return () => {
      clearInterval(interval);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentVersion]);

  const dismissUpdate = () => {
    if (!forceUpdate) {
      setUpdateDismissed(true);
      setNeedsUpdate(false);
    }
  };

  // Exposed context value
  const value: VersionContextType = {
    currentVersion,
    latestVersion,
    needsUpdate: needsUpdate && !updateDismissed,
    forceUpdate,
    dismissUpdate,
    isLoading,
    isMobile,
    lastCheckTime
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
