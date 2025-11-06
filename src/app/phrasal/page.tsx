'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function PhrasalPage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Fiil Öbekleri (Phrasal Verbs) Listesi',
      'description': 'YDS sınavı için İngilizce fiil öbekleri (phrasal verbs) ve deyimsel ifadelerin kapsamlı listesi ve testleri.',
      'url': 'https://my-yds.web.app/phrasal',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="phrasal"
        categoryName="Fiil Öbekleri"
        categoryTitle="Fiil Öbekleri"
        categoryDescription="İngilizce fiil öbekleri (phrasal verbs) ve deyimsel ifadeler"
        words={vocabulary.phrasal_verbs}
        questions={quizData.phrasal_verbs}
        icon={icon}
      />
      <ClientOnlyAd
        slot="phrasal-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
