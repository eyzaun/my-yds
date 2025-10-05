import { ReactNode } from 'react';

export interface Category {
  name: string;
  path: string;
  description: string;
  icon: ReactNode;
}

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ExcelSampleRow {
  word: string;
  translation: string;
  note: string;
}
