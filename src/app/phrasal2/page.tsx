/**
 * Phrasal2 Page
 * Refactored to use generic CategoryPage component
 */

import { CategoryPage } from '@/components/pages/CategoryPage';
import { categoryConfigs } from '@/config/categories.config';

export default function Phrasal2Page() {
  return <CategoryPage config={categoryConfigs['phrasal2']} />;
}
