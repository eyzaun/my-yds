/**
 * Academic Terms Page
 * Refactored to use generic CategoryPage component
 * Reduced from 181 lines to 5 lines (97% reduction!)
 */

import { CategoryPage } from '@/components/pages/CategoryPage';
import { categoryConfigs } from '@/config/categories.config';

export default function AcademicTermsPage() {
  return <CategoryPage config={categoryConfigs['academic-terms']} />;
}
