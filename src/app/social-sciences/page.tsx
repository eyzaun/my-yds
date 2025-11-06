'use client';

import { useEffect } from 'react';
import { CategoryPageTemplate } from '@/components/CategoryPageTemplate';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import dynamic from 'next/dynamic';

const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function SocialSciencesPage() {
  // SEO and structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'YDS Sosyal Bilimler Kelimeleri Listesi',
      'description': 'YDS sınavı için sosyoloji, psikoloji, antropoloji ve sosyal bilimler alanlarında kullanılan kelimeler.',
      'url': 'https://my-yds.web.app/social-sciences',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const icon = (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  return (
    <>
      <CategoryPageTemplate
        categoryId="social-sciences"
        categoryName="Sosyal Bilimler"
        categoryTitle="Sosyal Bilimler"
        categoryDescription="Sosyoloji, psikoloji, antropoloji ve sosyal bilimler alanlarında kullanılan terimler"
        words={vocabulary.social_sciences}
        questions={quizData.social_sciences}
        icon={icon}
      />
      <ClientOnlyAd
        slot="social-sciences-footer"
        format="auto"
        className="my-4 mx-auto"
      />
    </>
  );
}
