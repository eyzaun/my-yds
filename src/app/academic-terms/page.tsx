'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function AcademicTermsPage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Akademik Terimler Kelime Listesi',
      'description': 'YDS sınavı için önemli akademik ve bilimsel terimleri içeren kapsamlı kelime listesi ve testler.',
      'url': 'https://my-yds.web.app/academic-terms',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="academic-terms"
        categoryName="Akademik Terimler"
        categoryTitle="Akademik Terimler"
        categoryDescription="Bilimsel metinlerde ve akademik çalışmalarda kullanılan terimler"
        words={vocabulary.academic_terms}
        questions={quizData.academic_terms}
        icon={icon}
      />
      <ClientOnlyAd
        slot="academic-terms-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
