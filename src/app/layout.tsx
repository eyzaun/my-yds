import type { Metadata } from 'next';
import './globals.css';
import '@/styles/global.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
// Import the client wrapper instead of using dynamic directly
import AdSenseScriptWrapper from '@/components/AdSenseScriptWrapper';
import FirebaseStatus from '@/components/FirebaseStatus';

export const metadata: Metadata = {
  metadataBase: new URL('https://my-yds.web.app'),
  title: {
    default: 'YDS Kelime Listesi - YDS Hazırlık Platformu',
    template: '%s | YDS Kelime Listesi'
  },
  description: 'YDS sınavı için kategorilere ayrılmış kapsamlı İngilizce kelime listesi ve test platformu. 8 farklı kategoride kelimeler, testler ve çalışma araçları.',
  keywords: 'YDS, kelime listesi, YDS sınavı, İngilizce, sınav hazırlık, akademik terimler, işletme terimleri, doğa bilimleri, sosyal bilimler, YDS kelime, YDS hazırlık, fiil öbekleri, bağlaçlar, YDS çalışma, dil sınavı',
  authors: [{ name: 'YDS Kelime Listesi' }],
  creator: 'YDS Kelime Listesi',
  publisher: 'YDS Kelime Listesi',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'YDS Kelime Listesi',
  openGraph: {
    title: 'YDS Kelime Listesi - YDS Hazırlık Platformu',
    description: 'YDS sınavına hazırlananlar için kategorilere ayrılmış kapsamlı kelime listesi ve test platformu. 8 farklı kategoride YDS kelimelerini öğrenin ve testlerle pekiştirin.',
    url: 'https://my-yds.web.app/',
    siteName: 'YDS Kelime Listesi',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://my-yds.web.app/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'YDS Kelime Listesi Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YDS Kelime Listesi - YDS Hazırlık Platformu',
    description: 'YDS sınavı için kategorilere ayrılmış kelime listesi ve test platformu',
    images: ['https://my-yds.web.app/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://my-yds.web.app/',
  },
  verification: {
    google: 'MxHshOWbTo5f8k1BB4spzO6zEH9cYPiiGKLVoEXuVT0', // Google Search Console doğrulama kodunuzu buraya ekleyin
  },
  category: 'education',
  appleWebApp: {
    title: 'YDS Kelime Listesi',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  other: {
    'msapplication-TileColor': '#212121',
    'theme-color': '#212121',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Remove direct CSS link */}
        {/* <link
          rel="stylesheet"
          href="/_next/static/css/d2536480af877ca2.css"
          precedence="default"
        /> */}
        
        {/* Google Search Console doğrulama meta etiketi */}
        <meta name="google-site-verification" content="google-site-verification-code" />
        
        {/* Favicon ve site kimliği için ek meta etiketler */}
        <meta name="application-name" content="YDS Kelime Listesi" />
        <meta name="apple-mobile-web-app-title" content="YDS Kelime Listesi" />
        <link rel="manifest" href="/site.webmanifest" />
                
        {/* Web sitesi için yapısal veri - Geliştirilmiş */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'YDS Kelime Listesi',
              alternateName: 'YDS Vocabulary',
              url: 'https://my-yds.web.app/',
              potentialAction: {
                '@type': 'SearchAction',
                'target': 'https://my-yds.web.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              },
              description: 'YDS sınavı için kategorilere ayrılmış İngilizce kelime listeleri ve testler',
              inLanguage: 'tr-TR',
              audience: {
                '@type': 'Audience',
                name: 'YDS Sınavına Hazırlananlar',
              },
              isAccessibleForFree: 'True',
              keywords: 'YDS, kelime listesi, İngilizce, sınav hazırlık, YDS sınavı',
              author: {
                '@type': 'Organization',
                name: 'YDS Kelime Listesi',
                url: 'https://my-yds.web.app/',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://my-yds.web.app/android-chrome-512x512.png',
                  width: 512,
                  height: 512
                }
              },
              publisher: {
                '@type': 'Organization',
                name: 'YDS Kelime Listesi',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://my-yds.web.app/android-chrome-512x512.png',
                  width: 512,
                  height: 512
                }
              },
              copyrightYear: new Date().getFullYear(),
              educationalUse: 'Öğretim Amaçlı',
              educationalLevel: 'Yetişkin Eğitimi',
            })
          }}
        />
        
        {/* Eğitimsel içerik yapısal verisi - Düzeltilmiş */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: 'YDS Kelime Hazırlık Kursu',
              description: 'YDS sınavı için ihtiyaç duyulan kelime bilgisini 8 farklı kategoride öğreten online bir platform.',
              provider: {
                '@type': 'Organization',
                name: 'YDS Kelime Listesi',
                sameAs: 'https://my-yds.web.app/',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://my-yds.web.app/android-chrome-512x512.png'
                }
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'TRY',
                availability: 'https://schema.org/InStock',
                validFrom: '2025-01-01',
                category: 'Education'
              },
              hasCourseInstance: {
                '@type': 'CourseInstance',
                courseMode: 'online',
                educationalLevel: 'Yetişkin Eğitimi',
                courseWorkload: 'PT10H',
                courseSchedule: {
                  '@type': 'Schedule',
                  repeatFrequency: 'Weekly',
                  repeatCount: 52,
                  name: 'Esnek, kendi belirlediğiniz zamanlarda çalışabilirsiniz.'
                }
              },
              about: {
                '@type': 'Thing',
                name: 'YDS Sınavı',
              },
              audience: {
                '@type': 'Audience', 
                audienceType: 'YDS Sınavına Hazırlananlar'
              },
              inLanguage: 'tr',
              teaches: 'YDS Sınavı İçin Gerekli İngilizce Kelimeler',
            })
          }}
        />
        
        {/* Organization yapısal verisi - Google arama sonuçlarında marka adı için önemli */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'YDS Kelime Listesi',
              url: 'https://my-yds.web.app/',
              logo: {
                '@type': 'ImageObject',
                url: 'https://my-yds.web.app/android-chrome-512x512.png',
                width: 512,
                height: 512
              }
            })
          }}
        />
        
        {/* BreadcrumbList yapısal verisi - Arama sonuçlarında site yapısı için */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Ana Sayfa',
                  item: 'https://my-yds.web.app/'
                }
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Use the client wrapper component */}
        <AdSenseScriptWrapper />
        
        {/* Add FirebaseStatus component to show when in safe mode */}
        <FirebaseStatus />
        
        <AuthProvider>
          <ThemeProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}