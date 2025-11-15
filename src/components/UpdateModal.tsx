'use client';

import React from 'react';
import { useVersion } from '@/contexts/VersionContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/design-system/Button';
import { Heading2, Text } from '@/components/design-system/Typography';

export default function UpdateModal() {
  const { needsUpdate, forceUpdate, latestVersion, dismissUpdate } = useVersion();
  const { tokens } = useTheme();

  if (!needsUpdate) return null;

  const handleUpdate = () => {
    // Clear service worker cache and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Reload page
    window.location.reload();
  };

  const handleDismiss = () => {
    if (!forceUpdate) {
      dismissUpdate();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        style={{
          backgroundColor: tokens.colors.background.primary,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${tokens.colors.primary[200]}`
        }}
      >
        <Heading2 className="mb-4">Yeni Sürüm Mevcut</Heading2>

        <Text className="mb-2" style={{ color: tokens.colors.text.secondary }}>
          Uygulamanın yeni bir sürümü kullanılabilir.
        </Text>

        {latestVersion?.updateMessage && (
          <div
            style={{
              backgroundColor: `${tokens.colors.primary[50]}40`,
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              borderLeft: `4px solid ${tokens.colors.primary[600]}`
            }}
          >
            <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
              {latestVersion.updateMessage}
            </Text>
          </div>
        )}

        {latestVersion?.changelog && (
          <div
            style={{
              backgroundColor: `${tokens.colors.background.secondary}80`,
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.fontSize.xs,
                whiteSpace: 'pre-wrap',
                color: tokens.colors.text.secondary
              }}
            >
              {latestVersion.changelog}
            </Text>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {!forceUpdate && (
            <Button
              variant="outlined"
              onClick={handleDismiss}
              style={{
                borderColor: tokens.colors.primary[600],
                color: tokens.colors.primary[600]
              }}
            >
              Daha Sonra
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleUpdate}
            style={{
              backgroundColor: tokens.colors.primary[600],
              color: tokens.colors.background.primary
            }}
          >
            {forceUpdate ? 'Güncelle' : 'Şimdi Güncelle'}
          </Button>
        </div>

        {forceUpdate && (
          <Text
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.accent.warning.main,
              marginTop: '12px',
              textAlign: 'center'
            }}
          >
            Bu güncelleme zorunludur. Lütfen uygulamayı güncelleyin.
          </Text>
        )}
      </div>
    </div>
  );
}
