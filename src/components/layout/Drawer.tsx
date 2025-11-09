import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const designTokens = useDesignTokens();
  const pathname = usePathname();

  // Main navigation links
  const mainLinks = [
    { path: '/', label: 'Ana Sayfa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/spaced-repetition', label: 'Aralıklı Tekrar', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/all-words', label: 'Tüm Kelimeler', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { path: '/upload-flashcards', label: 'Kendi Kartlarım', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  ];

  // Category links
  const categoryLinks = [
    { path: '/academic-terms', label: 'Akademik Terimler', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { path: '/business', label: 'İşletme ve Ekonomi', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/social-sciences', label: 'Sosyal Bilimler', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/nature', label: 'Doğa ve Çevre', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/abstract', label: 'Soyut Kavramlar', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' },
    { path: '/official', label: 'Resmi Dil', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/conjunctions', label: 'Bağlaçlar', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { path: '/phrasal', label: 'Fiil Öbekleri', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { path: '/phrasal2', label: 'Fiil Öbekleri 2', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/category', label: 'Tüm Kategoriler', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  ];

  // About/info links
  const aboutLinks = [
    { path: '/about', label: 'Hakkımızda', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/contact', label: 'İletişim', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/privacy', label: 'Gizlilik Politikası', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ backgroundColor: designTokens.colors.utility.backdrop }}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full shadow-lg z-50 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: designTokens.colors.background.primary, width: 'min(85%, 320px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b flex justify-between items-center" style={{ padding: designTokens.spacing[6], borderColor: `${designTokens.colors.primary[200]}40` }}>
          <h2 style={{ color: designTokens.colors.text.primary }} className="text-xl font-bold">
            YDS Kelime Listesi
          </h2>
          <button
            style={{ color: designTokens.colors.text.primary }}
            className="rounded-full hover:bg-opacity-10"
            onClick={onClose}
            aria-label="Menüyü Kapat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div style={{ padding: designTokens.spacing[1] }} className="overflow-y-auto h-[calc(100vh-64px)]">
          {/* Main Links */}
          <div style={{ marginTop: designTokens.spacing[2] }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ paddingLeft: designTokens.spacing[6], paddingRight: designTokens.spacing[6], paddingTop: designTokens.spacing[2], paddingBottom: designTokens.spacing[2], color: designTokens.colors.text.primary }}>
              Ana Sayfalar
            </h3>
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="flex items-center space-x-3 rounded-lg transition-colors duration-200 hover:bg-opacity-20"
                style={{
                  paddingLeft: designTokens.spacing[6],
                  paddingRight: designTokens.spacing[6],
                  paddingTop: designTokens.spacing[2],
                  paddingBottom: designTokens.spacing[2],
                  marginTop: designTokens.spacing[1],
                  marginBottom: designTokens.spacing[1],
                  backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                  color: designTokens.colors.text.primary,
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.path) {
                    e.currentTarget.style.backgroundColor = designTokens.colors.primary[100];
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Category Links */}
          <div style={{ marginTop: designTokens.spacing[6] }}>
            <div className="border-t opacity-20" style={{ marginTop: designTokens.spacing[2], marginBottom: designTokens.spacing[2], borderColor: designTokens.colors.text.primary }}></div>
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ paddingLeft: designTokens.spacing[6], paddingRight: designTokens.spacing[6], paddingTop: designTokens.spacing[2], paddingBottom: designTokens.spacing[2], color: designTokens.colors.text.primary }}>
              Kategoriler
            </h3>
            <div className="grid grid-cols-1" style={{ gap: designTokens.spacing[1] }}>
              {categoryLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center space-x-3 rounded-lg transition-colors duration-200"
                  style={{
                    paddingLeft: designTokens.spacing[6],
                    paddingRight: designTokens.spacing[6],
                    paddingTop: designTokens.spacing[2],
                    paddingBottom: designTokens.spacing[2],
                    backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                    color: designTokens.colors.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = designTokens.colors.primary[100];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div style={{ marginTop: designTokens.spacing[6] }}>
            <div className="border-t opacity-20" style={{ marginTop: designTokens.spacing[2], marginBottom: designTokens.spacing[2], borderColor: designTokens.colors.text.primary }}></div>
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ paddingLeft: designTokens.spacing[6], paddingRight: designTokens.spacing[6], paddingTop: designTokens.spacing[2], paddingBottom: designTokens.spacing[2], color: designTokens.colors.text.primary }}>
              Site Bilgileri
            </h3>
            <div className="grid grid-cols-1" style={{ gap: designTokens.spacing[1] }}>
              {aboutLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center space-x-3 rounded-lg transition-colors duration-200"
                  style={{
                    paddingLeft: designTokens.spacing[6],
                    paddingRight: designTokens.spacing[6],
                    paddingTop: designTokens.spacing[2],
                    paddingBottom: designTokens.spacing[2],
                    backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                    color: designTokens.colors.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = designTokens.colors.primary[100];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs" style={{ marginTop: designTokens.spacing[12], marginBottom: designTokens.spacing[6], paddingLeft: designTokens.spacing[6], paddingRight: designTokens.spacing[6], color: designTokens.colors.text.secondary }}>
            <p>© {new Date().getFullYear()} YDS Kelime Listesi</p>
            <p style={{ marginTop: designTokens.spacing[1] }}>Tüm Hakları Saklıdır</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;