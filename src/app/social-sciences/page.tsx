/**
 * Social Sciences Page
 * Refactored to use generic CategoryPage component
 */

import { CategoryPage } from '@/components/pages/CategoryPage';
import { categoryConfigs } from '@/config/categories.config';

export default function SocialSciencesPage() {
  return <CategoryPage config={categoryConfigs['social-sciences']} />;
}
