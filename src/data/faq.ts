export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "YDS sınavında kaç kelime bilmek gerekiyor?",
    answer: "YDS sınavında başarılı olmak için genellikle 4000-5000 kelimelik bir dağarcığa sahip olmak önerilir. Ancak sadece kelime sayısı değil, kelimelerin doğru bağlamlarda kullanımını bilmek ve özellikle akademik ve teknik terimlere hakim olmak önemlidir."
  },
  // ... other FAQ items ...
];
