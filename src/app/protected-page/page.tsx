// src/app/protected-page/page.tsx
'use client';
import React from 'react';
import RequireAuth from '@/utils/requireAuth';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

// Replace path alias import with relative path
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

const ProtectedPage = () => {
  return (
    <RequireAuth>
      <div className="min-h-screen" style={{ backgroundColor: designTokens.colors.background.primary }}>
        <Container maxWidth="lg" className="py-8">
          <Heading1 className="text-3xl mb-6 text-center">
            Korumalı Sayfa
          </Heading1>
          <Card variant="elevated">
            <Text>
              Bu içeriği sadece giriş yapmış kullanıcılar görebilir. Giriş yaptığınız için bu sayfayı görüntüleyebiliyorsunuz.
            </Text>
          </Card>
        </Container>
        <ClientOnlyAd
          slot="protected-page-banner"
          format="auto"
          className="my-4 mx-auto"
        />
      </div>
    </RequireAuth>
  );
};

export default ProtectedPage;