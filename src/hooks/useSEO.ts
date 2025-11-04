/**
 * useSEO Hook
 * Handles SEO structured data injection
 * Eliminates duplicate SEO code across category pages
 */

import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  url: string;
}

/**
 * Injects JSON-LD structured data for SEO
 * Automatically cleans up on component unmount
 */
export function useSEO({ title, description, url }: SEOProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `seo-${url}`; // Unique ID for cleanup
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
    });

    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const existingScript = document.getElementById(`seo-${url}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [title, description, url]);
}
