import { MetadataRoute } from 'next';

// Add this line to make it compatible with static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-yds.web.app';
  
  // Static routes for your site
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/business',
    '/login',
    // Add your new pages here
    '/dictionary',
    '/word-lists',
    '/grammar',
    '/exercises',
    '/upload-flashcards',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Return all routes
  return staticRoutes;
}
