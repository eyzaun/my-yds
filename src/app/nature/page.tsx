'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function NaturePage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Doğa ve Çevre Kelimeleri Listesi',
      'description': 'YDS sınavı için doğa, çevre, ekoloji ve biyoloji alanlarında kullanılan İngilizce kelime ve terimler.',
      'url': 'https://my-yds.web.app/nature',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="nature"
        categoryName="Doğa ve Çevre"
        categoryTitle="Doğa ve Çevre"
        categoryDescription="Doğa, çevre, ekoloji ve biyoloji alanlarında kullanılan terimler"
        words={vocabulary.nature_and_environment}
        questions={quizData.nature_and_environment}
        icon={icon}
      />
      <ClientOnlyAd
        slot="nature-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
