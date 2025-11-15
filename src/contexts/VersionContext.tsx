'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAppVersion, AppVersion } from '@/firebase/firestore';

interface VersionContextType {
  currentVersion: number;
  latestVersion: AppVersion | null;
  needsUpdate: boolean;
  forceUpdate: boolean;
  dismissUpdate: () => void;
  isLoading: boolean;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [latestVersion, setLatestVersion] = useState<AppVersion | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateDismissed, setUpdateDismissed] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        setIsLoading(true);

        // Local public app-version.json'dan current version'ı al
        const localVersionResponse = await fetch('/app-version.json');
        if (localVersionResponse.ok) {
          const localVersion = (await localVersionResponse.json()) as AppVersion;
          setCurrentVersion(localVersion.buildNumber);
        }

        // Firestore'dan latest version'ı al
        const latest = await getAppVersion();
        if (latest) {
          setLatestVersion(latest);

          // Check if update is needed
          if (latest.buildNumber > currentVersion) {
            setNeedsUpdate(true);
          }

          // Check if force update is required
          if (latest.forceUpdate && latest.buildNumber > currentVersion) {
            setForceUpdate(true);
            // Clear dismissed state for force updates
            setUpdateDismissed(false);
          }
        }
      } catch (error) {
        console.error('Error checking version:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVersion();

    // Check version every hour
    const interval = setInterval(checkVersion, 60 * 60 * 1000);
    return () => clearInterval(interval);
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
    isLoading
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
