'use client';
import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link'; // Make sure Link is imported

// Import design system components
import { Card } from '@/components/design-system/Card';
import { Container } from '@/components/design-system/Container';
import { Heading1, Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ExcelUploadSection } from '@/components/home/ExcelUploadSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ProgressOverview } from '@/components/home/ProgressOverview';

// Import data
import { categories, features, faqItems, excelSampleData } from '@/data/homeData';

export default function HomePage() {
  // SEO için yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'YDS Kelime Listesi',
      'description': 'YDS sınavı için kategorilere ayrılmış İngilizce kelime listeleri. YDS sınavına hazırlanan öğrencilere özel kelime öğrenme platformu.',
      'url': 'https://my-yds.web.app/',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://my-yds.web.app/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Verify that the upload-flashcards route exists - add this on development
  useEffect(() => {
    console.log("Available routes: check that /upload-flashcards exists");
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: designTokens.colors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Kategori Kartları */}
        <Heading2>Kelime Kategorileri</Heading2>
        <CategoryGrid categories={categories} />

        {/* Progress Overview - Add this section before Site Hakkında Bilgi */}
        <Heading2>Kaldığınız Yerden Devam Edin</Heading2>
        <div className="mb-12">
          <ProgressOverview />
        </div>

        {/* Site Hakkında Bilgi */}
        <FeatureSection features={features} />

        {/* Excel Upload Feature */}
        <ExcelUploadSection exampleData={excelSampleData} />

        {/* YDS Sınavı Hakkında */}
        <Card variant="elevated" className="mb-12">
          <Heading2>YDS Sınavı Nedir?</Heading2>
          <Text>
            Yabancı Dil Sınavı (YDS), ÖSYM tarafından yılda iki kez düzenlenen ve kamu personelinin yabancı dil seviyesini ölçen bir sınavdır.
            Akademik yükselme, yurt dışı görevlendirme ve dil tazminatı gibi birçok alanda kullanılan YDS, İngilizce kelime bilgisini ölçen
            önemli bölümler içerir.
          </Text>
          <Text>
            Kelime bilgisi, YDS sınavında başarılı olmanın en önemli anahtarlarından biridir. Bu platform, YDS&apos;de çıkabilecek kelimeleri
            kategorilere ayırarak sistematik çalışmanızı sağlar ve düzenli testlerle öğrenmenizi pekiştirir.
          </Text>
        </Card>

        {/* Çalışma İpuçları */}
        <Card variant="elevated" className="mb-12">
          <Heading2>Etkili Kelime Öğrenme İpuçları</Heading2>
          <ul className="space-y-3 list-disc pl-5" style={{ color: designTokens.colors.text.primary }}>
            <li>Düzenli ve sistemli çalışın. Her gün belirli sayıda yeni kelime öğrenin.</li>
            <li>Öğrendiğiniz kelimeleri cümle içinde kullanarak pekiştirin.</li>
            <li>Benzer kelimeleri gruplandırarak çalışın.</li>
            <li>Test çözerek bilginizi ölçün ve eksik noktaları tespit edin.</li>
            <li>Görsel hafızayı kullanarak kelime kartları oluşturun.</li>
            <li>Öğrendiğiniz kelimeleri düzenli aralıklarla tekrar edin.</li>
          </ul>
        </Card>
        
        {/* Sık Sorulan Sorular */}
        <FaqSection faqItems={faqItems} />
        
        {/* Başlangıç CTA */}
        <div
          className="text-center p-8 rounded-lg shadow-lg mb-12 relative overflow-hidden"
          style={{ backgroundColor: designTokens.colors.surface, border: `1px solid ${designTokens.colors.primary}30` }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: designTokens.colors.text.primary }}>
            Kelime Öğrenmeye Hemen Başlayın!
          </h2>
          <Link
            href="/all-words"
            className="px-6 py-3 rounded-lg inline-flex items-center transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: designTokens.colors.primary,
              color: "#000",
              boxShadow: `0 0 15px ${designTokens.colors.primary}30`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Hemen Başla
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 pb-10">
          <p style={{ color: designTokens.colors.text.primary, opacity: 0.7 }}>
            © {new Date().getFullYear()} YDS Kelime Listesi - YDS Sınavına Hazırlık Platformu
          </p>
        </footer>
      </div>
    </div>
  );
}