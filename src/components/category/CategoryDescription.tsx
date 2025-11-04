/**
 * CategoryDescription Component
 * Reusable description card for category pages
 * Shows category info, word count, and user authentication status
 */

import Link from 'next/link';
import { User } from 'firebase/auth';

interface CategoryDescriptionProps {
  description: string;
  wordCount: number;
  questionCount: number;
  user: User | null;
  textColor: string;
  cardBackground: string;
  accentColor: string;
}

export function CategoryDescription({
  description,
  wordCount,
  questionCount,
  user,
  textColor,
  cardBackground,
  accentColor,
}: CategoryDescriptionProps) {
  return (
    <div
      className="rounded-lg shadow-md p-4 mb-6"
      style={{ backgroundColor: cardBackground, marginBottom: '1.5rem' }}
    >
      <p style={{ color: textColor }} className="text-base mb-3">
        {description}
      </p>
      <p style={{ color: textColor }} className="text-sm">
        Bu kategoride toplam <strong>{wordCount}</strong> kelime ve{' '}
        <strong>{questionCount}</strong> test sorusu bulunmaktadır.
      </p>

      {/* User logged in message */}
      {user && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: `${accentColor}20`, color: textColor }}
        >
          <p className="text-sm">
            İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler
            ve test sonuçlarınız profil sayfanızda görüntülenebilir.
          </p>
        </div>
      )}

      {/* User not logged in message */}
      {!user && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: `${accentColor}20`, color: textColor }}
        >
          <p className="text-sm">
            İlerlemenizi kaydetmek için{' '}
            <Link href="/login" className="underline">
              giriş yapın
            </Link>{' '}
            veya{' '}
            <Link href="/register" className="underline">
              kayıt olun
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
