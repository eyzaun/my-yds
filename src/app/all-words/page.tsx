/**
 * All Words Page
 * Refactored to use generic CategoryPage component
 * Reduced from 190 lines to 5 lines (97% reduction!)
 */

import { CategoryPage } from '@/components/pages/CategoryPage';
import { categoryConfigs } from '@/config/categories.config';

export default function AllWordsPage() {
  return <CategoryPage config={categoryConfigs['all-words']} />;
}
