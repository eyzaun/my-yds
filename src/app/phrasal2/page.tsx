'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function PhrasalVerbs2() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Fiil Öbekleri (Phrasal Verbs) Kelime Listesi',
      'description': 'YDS sınavı için önemli fiil öbekleri (phrasal verbs) içeren kapsamlı liste ve testler.',
      'url': 'https://my-yds.web.app/phrasal2',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="phrasal2"
        categoryName="Fiil Öbekleri 2"
        categoryTitle="Fiil Öbekleri 2"
        categoryDescription="İngilizce fiil öbekleri (phrasal verbs) devamı ve deyimsel ifadeler"
        words={vocabulary.phrasal_verbs2}
        questions={quizData.phrasal_verbs2}
        icon={icon}
      />
      <ClientOnlyAd
        slot="phrasal2-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
