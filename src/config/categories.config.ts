/**
 * Category Configuration
 * Central configuration for all category pages
 * Eliminates code duplication across 8+ category page files
 */

import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';

export interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  metaDescription: string;
  vocabularyKey: keyof typeof vocabulary | 'all';
  quizKey: keyof typeof quizData | 'all';
  additionalInfo?: string;
  adSlot: string;
}

/**
 * All category configurations in one place
 * Adding a new category is as simple as adding a new entry here
 */
export const categoryConfigs: Record<string, CategoryConfig> = {
  'all-words': {
    id: 'all-words',
    title: 'Tüm YDS Kelimeleri',
    description: 'Bu sayfada tüm kategorilerdeki YDS kelimelerini bir arada bulabilirsiniz. İstediğiniz kelimeyi çalışabilir veya tüm kelimelerden oluşan bir test çözebilirsiniz.',
    metaDescription: 'YDS sınavı için tüm kategorilerden İngilizce kelime listesi - Akademik, İşletme, Sosyal Bilimler, Doğa, Resmi Dil ve daha fazlası.',
    vocabularyKey: 'all',
    quizKey: 'all',
    adSlot: 'all-words-footer',
  },

  'academic-terms': {
    id: 'academic-terms',
    title: 'Akademik Terimler',
    description: 'Akademik terimler, YDS sınavında özellikle bilimsel metinlerde ve akademik çalışmalarda sıkça karşınıza çıkan kelimelerdir. Bu bölümde araştırma, metodoloji, analiz ve bilimsel süreçlerle ilgili önemli terimleri bulabilirsiniz.',
    metaDescription: 'YDS sınavı için önemli akademik ve bilimsel terimleri içeren kapsamlı kelime listesi ve testler.',
    vocabularyKey: 'academic_terms',
    quizKey: 'academic_terms',
    additionalInfo: `Akademik terimler, YDS sınavının özellikle bilimsel metin okuma ve anlama bölümlerinde karşınıza çıkar. Bu terimler, bilimsel araştırma yöntemleri, veri analizi, hipotez oluşturma ve akademik yaklaşımları ifade eden kelime ve deyimlerdir.

Akademik terimleri öğrenirken, terimler arasındaki ilişkileri ve bilimsel süreçlerdeki kullanımlarını anlamak önemlidir. Bu kelimeler genellikle yalnızca akademik metinlerde karşınıza çıksa da, YDS sınavındaki okuma parçalarını doğru şekilde anlamlandırmak için kritik öneme sahiptir.`,
    adSlot: 'academic-terms-footer',
  },

  'business': {
    id: 'business',
    title: 'İşletme ve Ekonomi',
    description: 'İşletme ve ekonomi kelimeleri, YDS sınavında özellikle iş dünyası, ticaret, finans ve ekonomi alanlarındaki metinlerde karşınıza çıkan terimlerdir. Bu kategori, ekonomik göstergeler, finansal raporlar, iş stratejileri ve ticari faaliyetleri içeren metinleri anlamak için kritik öneme sahiptir.',
    metaDescription: 'YDS sınavı için işletme, finans, ekonomi ve ticaret alanlarında kullanılan terimler ve kelimeler.',
    vocabularyKey: 'business_and_economy',
    quizKey: 'business_and_economy',
    additionalInfo: `YDS sınavında işletme ve ekonomi terimleri, özellikle ekonomik haberler, finansal analizler veya iş dünyası ile ilgili metinlerde karşınıza çıkmaktadır. Bu terimler, güncel ekonomik olayları, şirket yönetimini ve finansal stratejileri anlatan metinlerde sıkça kullanılır.

Bu kategorideki kelimeleri öğrenirken, ekonomi haberleri okumak, finans dergilerini takip etmek ve iş dünyası ile ilgili İngilizce kaynakları incelemek faydalı olacaktır. Bu terimleri günlük haberler ve ekonomik gelişmeler bağlamında öğrenmek, hafızada kalıcılığı artıracaktır.`,
    adSlot: 'business-footer',
  },

  'social-sciences': {
    id: 'social-sciences',
    title: 'Sosyal Bilimler',
    description: 'Sosyoloji, psikoloji, tarih ve diğer sosyal bilim alanlarına ait terimler. Bu kategori, toplumsal olayları, insan davranışlarını ve sosyal yapıları anlatan metinleri anlamak için gerekli kelimeleri içerir.',
    metaDescription: 'YDS sınavı için sosyoloji, psikoloji, tarih ve sosyal bilim terimlerini içeren kelime listesi.',
    vocabularyKey: 'social_sciences',
    quizKey: 'social_sciences',
    additionalInfo: `Sosyal bilimler kelimeleri, YDS sınavında toplumsal olaylar, insan davranışları, kültürel yapılar ve tarihi süreçlerle ilgili metinlerde karşınıza çıkar. Bu terimler, sosyoloji, psikoloji, antropoloji ve tarih gibi disiplinlerde kullanılır.

Bu kategorideki kelimeleri öğrenirken, sosyal bilimlerle ilgili İngilizce makaleler okumak ve belgeseller izlemek faydalı olacaktır.`,
    adSlot: 'social-sciences-footer',
  },

  'nature': {
    id: 'nature',
    title: 'Doğa ve Çevre',
    description: 'Doğa ve çevre kelimeleri, YDS sınavında ekoloji, doğal yaşam, biyolojik çeşitlilik, çevre sorunları ve sürdürülebilirlik konularını içeren metinlerde karşınıza çıkan terimlerdir. Bu kategori, güncel çevre konuları ve bilimsel araştırmaları anlamak için önemlidir.',
    metaDescription: 'YDS sınavı için doğa, çevre, ekoloji ve biyoloji alanlarında kullanılan İngilizce kelime ve terimler.',
    vocabularyKey: 'nature_and_environment',
    quizKey: 'nature_and_environment',
    additionalInfo: `Doğa ve çevre ile ilgili metinler YDS sınavında sıkça karşınıza çıkar. Özellikle son yıllarda çevre sorunları, iklim değişikliği, sürdürülebilirlik ve ekoloji konuları popüler okuma parçası konularından biridir.

Bu kategorideki kelimeleri öğrenirken, National Geographic, Discovery gibi kaynaklardan çevre ile ilgili makaleler okumak kelime bilginizi pekiştirebilir. Ayrıca çevre ile ilgili güncel haberler ve bilimsel araştırmaları takip etmek, bu kelimeleri bağlamlarında görmenize yardımcı olacaktır.`,
    adSlot: 'nature-footer',
  },

  'abstract': {
    id: 'abstract',
    title: 'Soyut Kavramlar',
    description: 'Soyut kavramlar, felsefi terimler ve düşünce yapıları. Bu kategori, soyut fikirleri, kavramları ve teorileri ifade eden kelimeleri içerir.',
    metaDescription: 'YDS sınavı için soyut kavramlar, felsefi terimler ve düşünce yapılarını içeren kelime listesi.',
    vocabularyKey: 'abstract_concepts',
    quizKey: 'abstract_concepts',
    additionalInfo: `Soyut kavramlar, YDS sınavında felsefi metinlerde, düşünce tarihiyle ilgili okuma parçalarında ve teorik tartışmalarda karşınıza çıkar. Bu kelimeler, somut nesnelerden ziyade, fikirler, duygular ve teorileri ifade eder.`,
    adSlot: 'abstract-footer',
  },

  'official': {
    id: 'official',
    title: 'Resmi Dil',
    description: 'Resmi yazışmalarda, hukuk metinlerinde ve diplomaside kullanılan terimler. Bu kategori, formal dil ve resmi iletişim için gerekli kelimeleri içerir.',
    metaDescription: 'YDS sınavı için resmi dil, hukuk ve diplomasi terimlerini içeren kelime listesi.',
    vocabularyKey: 'formal_language',
    quizKey: 'formal_language',
    additionalInfo: `Resmi dil terimleri, YDS sınavında hukuki metinler, resmi belgeler ve diplomasi ile ilgili okuma parçalarında karşınıza çıkar. Bu kelimeler, formal yazışmalarda ve resmi iletişimde kullanılır.`,
    adSlot: 'official-footer',
  },

  'conjunctions': {
    id: 'conjunctions',
    title: 'Bağlaçlar',
    description: 'Cümleleri ve fikirleri birbirine bağlayan önemli bağlaçlar. Bu kategori, metinlerin akışını anlamak ve cümleler arası ilişkileri kavramak için kritik öneme sahiptir.',
    metaDescription: 'YDS sınavı için önemli İngilizce bağlaçları ve bağlantı kelimelerini içeren liste.',
    vocabularyKey: 'conjunctions',
    quizKey: 'conjunctions',
    additionalInfo: `Bağlaçlar, YDS sınavında metinlerin mantıksal akışını anlamak için çok önemlidir. Sebep-sonuç, karşıtlık, ekleme gibi ilişkileri gösteren bu kelimeler, okuma anlama sorularında kritik rol oynar.`,
    adSlot: 'conjunctions-footer',
  },

  'phrasal': {
    id: 'phrasal',
    title: 'Fiil Öbekleri',
    description: 'İngilizce fiil öbekleri ve deyimler. Bu kategori, phrasal verb\'leri ve yaygın kullanılan deyimsel ifadeleri içerir.',
    metaDescription: 'YDS sınavı için önemli İngilizce phrasal verb\'ler ve fiil öbeklerini içeren liste.',
    vocabularyKey: 'phrasal_verbs',
    quizKey: 'phrasal_verbs',
    additionalInfo: `Phrasal verb\'ler, YDS sınavında hem okuma parçalarında hem de kelime sorularında sıkça karşınıza çıkar. Bu yapılar, İngilizce\'nin en karakteristik özelliklerinden biridir.`,
    adSlot: 'phrasal-footer',
  },

  'phrasal2': {
    id: 'phrasal2',
    title: 'Fiil Öbekleri 2',
    description: 'İngilizce fiil öbekleri ve deyimler - İkinci grup. Bu kategori, daha fazla phrasal verb ve deyimsel ifade içerir.',
    metaDescription: 'YDS sınavı için ek İngilizce phrasal verb\'ler ve fiil öbeklerini içeren ikinci liste.',
    vocabularyKey: 'phrasal_verbs_2',
    quizKey: 'phrasal_verbs_2',
    additionalInfo: `İkinci grup phrasal verb\'ler, ileri seviye İngilizce için gerekli olan daha karmaşık fiil öbeklerini içerir.`,
    adSlot: 'phrasal2-footer',
  },
};

/**
 * Get category config by ID with type safety
 */
export function getCategoryConfig(categoryId: string): CategoryConfig | undefined {
  return categoryConfigs[categoryId];
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return Object.keys(categoryConfigs);
}

/**
 * Check if a category exists
 */
export function categoryExists(categoryId: string): boolean {
  return categoryId in categoryConfigs;
}
