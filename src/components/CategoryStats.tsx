import React from 'react';

interface CategoryStatsProps {
  wordCount: number;
}

export default function CategoryStats({ wordCount }: CategoryStatsProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg text-gray-700">
      <p className="text-lg">
        Bu kategoride toplam <strong>{wordCount}</strong> kelime ve <strong>{wordCount}</strong> test sorusu bulunmaktadır.
      </p>
      <p className="mt-2">
        İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
      </p>
    </div>
  );
}
