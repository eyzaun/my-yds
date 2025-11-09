'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/firebase/auth';
import { Button } from '@/components/design-system/Button';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import ThemeSelector from '@/components/ThemeSelector';

const NavigationBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const designTokens = useDesignTokens();

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Scroll olduğunda navbar stil değişikliği
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Mobil menü açıkken sayfa kaydırmayı engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Ana kategori linkleri ve alt kategoriler - SVG path'lerini düzelttik
  const mainLinks = [
    { path: '/', label: 'Ana Sayfa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/all-words', label: 'Tüm Kelimeler', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { path: '/upload-flashcards', label: 'Kendi Kartlarım', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  ];

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
    // Hatalı SVG path içeren "Tüm Kategoriler" linki kaldırıldı veya düzeltildi
  ];

  const aboutLinks = [
    { path: '/about', label: 'Hakkımızda', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/contact', label: 'İletişim', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/privacy', label: 'Gizlilik Politikası', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const renderAuthLinks = () => {
    if (user) {
      return (
        <div className="flex items-center" style={{ marginLeft: designTokens.spacing[4], gap: designTokens.spacing[2] }}>
          <ThemeSelector />
          <Link
            href="/profile"
            className="transition-colors duration-200"
            style={{
              padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`,
              borderRadius: designTokens.borderRadius.md,
              backgroundColor: pathname === '/profile' ? designTokens.colors.primary[600] : 'transparent',
              color: designTokens.colors.text.primary
            }}
          >
            <span className="hidden md:inline mr-1">{user.displayName || 'Profil'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center" style={{ marginLeft: designTokens.spacing[4], gap: designTokens.spacing[2] }}>
        <ThemeSelector />
        <Link
          href="/login"
          className="transition-colors duration-200"
          style={{
            padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`,
            borderRadius: designTokens.borderRadius.md,
            fontSize: designTokens.typography.fontSize.sm,
            backgroundColor: designTokens.colors.surface.primary,
            color: designTokens.colors.text.primary
          }}
        >
          Giriş
        </Link>
        <Link
          href="/register"
          className="transition-colors duration-200"
          style={{
            padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`,
            borderRadius: designTokens.borderRadius.md,
            fontSize: designTokens.typography.fontSize.sm,
            backgroundColor: designTokens.colors.primary[600],
            color: designTokens.colors.text.primary
          }}
        >
          Kayıt Ol
        </Link>
      </div>
    );
  };

  const renderProfileSection = () => {
    if (user) {
      return (
        <>
          <div className="border-t opacity-20" style={{ borderColor: designTokens.colors.text.primary, margin: `${designTokens.spacing[2]} 0` }}></div>
          <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{
            padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
            color: designTokens.colors.text.primary
          }}>
            Hesap
          </h3>
          <div style={{ padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}` }}>
            <div className="font-medium" style={{
              marginBottom: designTokens.spacing[2],
              color: designTokens.colors.text.primary
            }}>
              {user.displayName || 'Kullanıcı'}
            </div>
            <div className="opacity-70" style={{
              fontSize: designTokens.typography.fontSize.sm,
              marginBottom: designTokens.spacing[3],
              color: designTokens.colors.text.primary
            }}>
              {user.email}
            </div>
            <Link
              href="/profile"
              className="flex items-center transition-colors duration-200"
              style={{
                gap: designTokens.spacing[2],
                padding: `${designTokens.spacing[2]} ${designTokens.spacing[2]}`,
                borderRadius: designTokens.borderRadius.lg,
                backgroundColor: pathname === '/profile' ? designTokens.colors.primary[600] : 'transparent',
                color: designTokens.colors.text.primary,
              }}
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil</span>
            </Link>
            <button
              onClick={async () => {
                await logoutUser();
                toggleMenu();
              }}
              className="flex items-center w-full text-left transition-colors duration-200"
              style={{
                gap: designTokens.spacing[2],
                padding: `${designTokens.spacing[2]} ${designTokens.spacing[2]}`,
                borderRadius: designTokens.borderRadius.lg,
                color: designTokens.colors.text.primary
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="border-t opacity-20" style={{ borderColor: designTokens.colors.text.primary, margin: `${designTokens.spacing[2]} 0` }}></div>
        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{
          padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
          color: designTokens.colors.text.primary
        }}>
          Hesap
        </h3>
        <div className="grid grid-cols-1" style={{ gap: designTokens.spacing[1] }}>
          <Link
            href="/login"
            className="flex items-center transition-colors duration-200"
            style={{
              gap: designTokens.spacing[2],
              padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
              borderRadius: designTokens.borderRadius.lg,
              backgroundColor: pathname === '/login' ? designTokens.colors.primary[600] : 'transparent',
              color: designTokens.colors.text.primary,
            }}
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Giriş Yap</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center transition-colors duration-200"
            style={{
              gap: designTokens.spacing[2],
              padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
              borderRadius: designTokens.borderRadius.lg,
              backgroundColor: pathname === '/register' ? designTokens.colors.primary[600] : 'transparent',
              color: designTokens.colors.text.primary,
            }}
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Kayıt Ol</span>
          </Link>
        </div>
      </>
    );
  };

  return (
    <header className="relative">
      {/* Üst Navbar */}
      <nav
        style={{
          backgroundColor: designTokens.colors.background.secondary,
          boxShadow: isScrolled ? designTokens.shadows.md : 'none',
          padding: `0 ${designTokens.spacing[4]}`,
        }}
        className="sticky top-0 z-50 transition-all duration-300"
      >
        <div className="flex items-center justify-between" style={{ height: '4rem' }}>
          {/* Logo / Site Başlığı ve toggle butonu */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="flex items-center hover:bg-opacity-20 focus:outline-none transition-colors duration-200"
              style={{
                padding: designTokens.spacing[2],
                marginRight: designTokens.spacing[2],
                borderRadius: designTokens.borderRadius.md,
                backgroundColor: isMenuOpen ? designTokens.colors.primary[600] : 'transparent',
                color: designTokens.colors.text.primary
              }}
              aria-label="Menüyü Aç/Kapat"
            >
              {isMenuOpen ? (
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
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            <Link href="/" className="flex items-center" style={{ gap: designTokens.spacing[2] }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
                style={{ color: designTokens.colors.primary[600] }}
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span className="font-bold hidden sm:inline" style={{
                fontSize: designTokens.typography.fontSize.xl,
                color: designTokens.colors.text.primary
              }}>
                YDS Kelime Listesi
              </span>
              <span className="font-bold sm:hidden" style={{
                fontSize: designTokens.typography.fontSize.xl,
                color: designTokens.colors.text.primary
              }}>
                YDS
              </span>
            </Link>
          </div>

          {/* Auth Linkleri */}
          {renderAuthLinks()}
        </div>
      </nav>

      {/* Yan Menü - Hem mobil hem de masaüstü için */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 bg-black bg-opacity-50 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            backgroundColor: designTokens.colors.background.primary,
            width: 'min(85%, 320px)',
            boxShadow: designTokens.shadows.xl
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div
            className="border-b flex items-center justify-between"
            style={{
              padding: designTokens.spacing[5],
              borderColor: `${designTokens.colors.primary[600]}40`
            }}
          >
            <h2 className="font-semibold" style={{
              color: designTokens.colors.text.primary,
              fontSize: designTokens.typography.fontSize.xl
            }}>
              Menü
            </h2>
            <button
              className="rounded-full hover:bg-opacity-10 focus:outline-none"
              style={{
                color: designTokens.colors.text.primary,
                padding: designTokens.spacing[1]
              }}
              onClick={toggleMenu}
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

          {/* Drawer Content */}
          <div className="overflow-y-auto h-[calc(100vh-64px)]" style={{ padding: designTokens.spacing[1] }}>
            {/* Ana Sayfa ve Tüm Kelimeler Linkleri */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{
                padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
                color: designTokens.colors.text.primary
              }}>
                Ana Sayfalar
              </h3>
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center transition-colors duration-200"
                  style={{
                    gap: designTokens.spacing[3],
                    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
                    borderRadius: designTokens.borderRadius.lg,
                    margin: `${designTokens.spacing[1]} 0`,
                    backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                    color: designTokens.colors.text.primary,
                  }}
                  onClick={toggleMenu}
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
              <div className="border-t opacity-20" style={{
                borderColor: designTokens.colors.text.primary,
                margin: `${designTokens.spacing[2]} 0`
              }}></div>
            </div>

            {/* Kategori Başlığı */}
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{
              padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
              color: designTokens.colors.text.primary
            }}>
              Kategoriler
            </h3>

            {/* Kategori Linkleri */}
            <div className="grid grid-cols-1" style={{ gap: designTokens.spacing[1] }}>
              {categoryLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center transition-colors duration-200"
                  style={{
                    gap: designTokens.spacing[3],
                    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                    color: designTokens.colors.text.primary,
                  }}
                  onClick={toggleMenu}
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

            {/* Ayırıcı Çizgi */}
            <div className="border-t opacity-20" style={{
              borderColor: designTokens.colors.text.primary,
              margin: `${designTokens.spacing[2]} 0`
            }}></div>

            {/* Hakkımızda ve İletişim Bölümü */}
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{
              padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
              color: designTokens.colors.text.primary
            }}>
              Site Bilgileri
            </h3>
            <div className="grid grid-cols-1" style={{ gap: designTokens.spacing[1] }}>
              {aboutLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center transition-colors duration-200"
                  style={{
                    gap: designTokens.spacing[3],
                    padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: pathname === link.path ? designTokens.colors.primary[600] : 'transparent',
                    color: designTokens.colors.text.primary,
                  }}
                  onClick={toggleMenu}
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
            
            {/* Add the profile section to the drawer menu */}
            {renderProfileSection()}
            
            {/* Yan Menü Alt Reklam */}
            <div style={{ marginTop: designTokens.spacing[6], padding: `0 ${designTokens.spacing[2]}` }}>
              <AdBanner
                slot="1423078098"
                format="rectangle"
              />
            </div>

            {/* Footer / Telif Hakkı */}
            <div className="text-center" style={{
              marginTop: designTokens.spacing[8],
              marginBottom: designTokens.spacing[4],
              padding: `0 ${designTokens.spacing[4]}`,
              fontSize: designTokens.typography.fontSize.xs,
              color: `${designTokens.colors.text.primary}80`
            }}>
              <p>© {new Date().getFullYear()} YDS Kelime Listesi</p>
              <p style={{ marginTop: designTokens.spacing[1] }}>Tüm Hakları Saklıdır</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;