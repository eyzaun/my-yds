/**
 * Official Page
 * Refactored to use generic CategoryPage component
 */

import { CategoryPage } from '@/components/pages/CategoryPage';
import { categoryConfigs } from '@/config/categories.config';

export default function OfficialPage() {
  return <CategoryPage config={categoryConfigs['official']} />;
}
