'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function Conjunctions() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Bağlaçlar ve Geçiş İfadeleri Kelime Listesi',
      'description': 'YDS sınavı için önemli bağlaçlar, geçiş ifadeleri ve bağlayıcı kelimeler içeren kapsamlı liste ve testler.',
      'url': 'https://my-yds.web.app/conjunctions',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="conjunctions"
        categoryName="Bağlaçlar"
        categoryTitle="Bağlaçlar"
        categoryDescription="Bağlaçlar, geçiş ifadeleri ve cümle bağlayıcıları"
        words={vocabulary.conjunctions_and_transitions}
        questions={quizData.conjunctions_and_transitions}
        icon={icon}
      />
      <ClientOnlyAd
        slot="conjunctions-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
