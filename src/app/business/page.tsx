'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function Business() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS İşletme ve Ekonomi Terimleri Kelime Listesi',
      'description': 'YDS sınavı için işletme, finans, ekonomi ve ticaret alanlarında kullanılan terimler ve kelimeler.',
      'url': 'https://my-yds.web.app/business',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="business"
        categoryName="İşletme ve Ekonomi"
        categoryTitle="İşletme ve Ekonomi"
        categoryDescription="İşletme, finans, ekonomi ve ticaret alanlarında kullanılan terimler"
        words={vocabulary.business_and_economy}
        questions={quizData.business_and_economy}
        icon={icon}
      />
      <ClientOnlyAd
        slot="business-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
