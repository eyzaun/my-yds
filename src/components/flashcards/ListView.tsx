'use client';

import React, { useState, useCallback } from 'react';
import { FlashcardData } from '@/types/flashcard';
import { useTheme } from '@/contexts/ThemeContext';

interface ListViewProps {
  flashcards: FlashcardData[];
  studiedCards: Set<number>;
  onCardStudied: (index: number) => void;
  onCardClick?: (index: number) => void;
}

/**
 * ListView Component
 * Liste formatında flashcard'ları gösterir
 * - Tıklayınca kelime anlamını gösterir/gizler
 * - Çalışılan kartları takip eder
 * - Firebase entegrasyonu ile ilerleme kaydeder
 */
export default function ListView({
  flashcards,
  studiedCards,
  onCardStudied,
  onCardClick
}: ListViewProps) {
  const { colors } = useTheme();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  // Karta tıklama handler
  const handleCardClick = useCallback((index: number) => {
    // Aynı karta tekrar tıklanırsa seçimi kaldır
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
    } else {
      setSelectedCardIndex(index);
    }

    // Kartı çalışılmış olarak işaretle
    onCardStudied(index);

    // Dış callback varsa çağır
    if (onCardClick) {
      onCardClick(index);
    }
  }, [selectedCardIndex, onCardStudied, onCardClick]);

  // Boş liste kontrolü
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center p-8" style={{ color: colors.text }}>
        Henüz kart bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 py-4">
      <div className="grid grid-cols-1 gap-3">
        {flashcards.map((card, index) => {
          const isStudied = studiedCards.has(index);
          const isSelected = selectedCardIndex === index;

          return (
            <div
              key={card.id || `card-${index}`}
              className="p-4 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: isStudied
                  ? colors.accent
                  : colors.cardBackground,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
              onClick={() => handleCardClick(index)}
            >
              {/* Ön yüz - Her zaman görünür */}
              <div
                style={{ color: colors.text }}
                className="text-lg font-semibold"
              >
                {card.front}
              </div>

              {/* Arka yüz - Sadece seçili ise görünür */}
              {isSelected && (
                <div
                  style={{ color: colors.text, opacity: 0.9 }}
                  className="mt-2 text-base"
                >
                  {card.back}
                </div>
              )}

              {/* Notlar - Varsa ve seçili ise göster */}
              {isSelected && card.notes && (
                <div
                  style={{ color: colors.text, opacity: 0.7 }}
                  className="mt-2 text-sm italic"
                >
                  {card.notes}
                </div>
              )}

              {/* Çalışıldı işareti */}
              {isStudied && (
                <div
                  className="mt-2 flex items-center text-xs"
                  style={{ color: colors.text, opacity: 0.8 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Çalışıldı
                </div>
              )}

              {/* Tıklama talimatı - Seçili değilse göster */}
              {!isSelected && (
                <div
                  className="mt-2 text-xs opacity-60"
                  style={{ color: colors.text }}
                >
                  Anlamını görmek için tıklayın
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alt bilgi */}
      <div
        className="mt-6 text-center text-sm"
        style={{ color: colors.text, opacity: 0.7 }}
      >
        <p>
          Toplam {flashcards.length} kart • Çalışılan {studiedCards.size} kart
        </p>
        <p className="mt-1">
          İlerleme: %{Math.round((studiedCards.size / flashcards.length) * 100)}
        </p>
      </div>
    </div>
  );
}
