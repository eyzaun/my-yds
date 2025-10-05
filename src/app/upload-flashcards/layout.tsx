import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel Kelime Kartları | YDS Kelime Listesi',
  description: 'Excel dosyalarınızdan kelime kartları oluşturun, kaydedin ve pratik yapın. Quiz modu ve tam ekran desteği ile etkili kelime öğrenme.',
  keywords: 'kelime kartları, flashcards, excel kelime, yds kelime, kelime öğrenme, quiz modu',
};

export default function UploadFlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}