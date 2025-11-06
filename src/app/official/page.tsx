'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function OfficialPage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Resmi Dil Kelimeleri Listesi',
      'description': 'YDS sınavı için resmi yazışmalar, dokümantasyon ve akademik dilde kullanılan İngilizce kelime ve ifadeler.',
      'url': 'https://my-yds.web.app/official',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="official"
        categoryName="Resmi Dil"
        categoryTitle="Resmi Dil"
        categoryDescription="Resmi yazışmalar, dokümantasyon ve akademik dilde kullanılan ifadeler"
        words={vocabulary.official_language}
        questions={quizData.official_language}
        icon={icon}
      />
      <ClientOnlyAd
        slot="official-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
