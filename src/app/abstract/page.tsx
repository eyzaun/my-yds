'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function AbstractPage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Soyut Kavramlar Kelime Listesi',
      'description': 'YDS sınavı için soyut kavramlar, düşünce ve felsefe alanlarında kullanılan kelimeler.',
      'url': 'https://my-yds.web.app/abstract',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6" />
      <path d="M23 12h-6m-6 0H1" />
      <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24" />
      <path d="M19.78 4.22l-4.24 4.24m-7.08 7.08l-4.24 4.24" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="abstract"
        categoryName="Soyut Kavramlar"
        categoryTitle="Soyut Kavramlar"
        categoryDescription="Soyut kavramlar, düşünce ve felsefe alanlarında kullanılan terimler"
        words={vocabulary.abstract_concepts}
        questions={quizData.abstract_concepts}
        icon={icon}
      />
      <ClientOnlyAd
        slot="abstract-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
