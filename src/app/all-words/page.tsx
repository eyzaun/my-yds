// src/app/all-words/page.tsx
'use client';
import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Fix the import path
const AdBanner = dynamic(() => import('../../components/AdBanner'), { ssr: false });

// QuizQuestion interface'i için tanımlama
interface QuizQuestion {
  id: number;
  word: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
}

export default function AllWords() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { colors } = useTheme();
  const { user } = useAuth(); // Kullanıcı durumunu al
  
  // Kategori ID'si
  const categoryId = 'all-words';
  
  // Tüm kelimeleri birleştirelim
  const allWords = Object.values(vocabulary).flat();
  
  // Tüm testleri birleştirelim ve ID ekleyelim
  const allQuizzes = Object.values(quizData).flatMap((categoryQuestions, categoryIndex) =>
    categoryQuestions.map((question, questionIndex) => ({
      ...question,
      id: categoryIndex * 100 + questionIndex + 1
    }))
  );

  // QuizQuestion tipini kullanan fonksiyon
  const getRandomQuestions = (questions: QuizQuestion[], count: number) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomQuestions = getRandomQuestions(allQuizzes, 20);
  
  // Yapısal veriyi ekleyelim
  useEffect(() => {
    // JSON-LD yapısal verisi
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Tüm YDS Kelimeleri',
      'description': 'YDS sınavı için tüm kategorilerden İngilizce kelime listesi - Akademik, İşletme, Sosyal Bilimler, Doğa, Resmi Dil ve daha fazlası.',
      'url': 'https://my-yds.web.app/all-words',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sayfa Başlığı */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
          Tüm YDS Kelimeleri
        </h1>

        {/* Sayfa Açıklaması */}
        <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: colors.cardBackground, marginBottom: '1.5rem' }}>
          <p style={{ color: colors.text }} className="text-base mb-2">
            Bu sayfada tüm kategorilerdeki YDS kelimelerini bir arada bulabilirsiniz. İstediğiniz kelimeyi çalışabilir veya tüm kelimelerden oluşan bir test çözebilirsiniz.
          </p>
          <p style={{ color: colors.text }} className="text-sm">
            Toplam <strong>{allWords.length}</strong> kelime ve <strong>{allQuizzes.length}</strong> test sorusu bulunmaktadır.
          </p>
          
          {/* Kullanıcı giriş yapmışsa bilgilendirme mesajı */}
          {user && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20`, color: colors.text }}>
              <p className="text-sm">
                İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
              </p>
            </div>
          )}
          
          {/* Kullanıcı giriş yapmamışsa giriş yapma önerisi */}
          {!user && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20`, color: colors.text }}>
              <p className="text-sm">
                İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </p>
            </div>
          )}
        </div>

        {/* Mod Seçimi */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setShowQuiz(false)}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{ 
              backgroundColor: !showQuiz ? colors.accent : colors.cardBackground,
              color: colors.text 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Kelime Listesi
          </button>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
            style={{ 
              backgroundColor: showQuiz ? colors.accent : colors.cardBackground,
              color: colors.text 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Test
          </button>
        </div>

        {showQuiz ? (
          <div>
            {/* Test açıklaması */}
            <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: colors.cardBackground }}>
              <p style={{ color: colors.text }} className="text-sm">
                Bu test, tüm kategorilerden rastgele seçilmiş 20 soru içermektedir.
              </p>
            </div>
            
            <Quiz 
              questions={randomQuestions}
              categoryWords={allWords}
              categoryId={categoryId} // Kategori ID'sini ekleyin
              onQuizComplete={setScore}
            />
          </div>
        ) : (
          <WordList 
            words={allWords}
            categoryId={categoryId} // Kategori ID'sini ekleyin
          />
        )}

        {score !== null && (
          <div className="text-center mt-8 p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Test Sonucu
            </h2>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto" style={{ backgroundColor: colors.accent }}>
              <span className="text-2xl font-bold" style={{ color: colors.text }}>%{Math.round((score / 20) * 100)}</span>
            </div>
            <p style={{ color: colors.text }}>
              Toplam Doğru: {score} / 20
            </p>
            <button
              onClick={() => setScore(null)}
              className="mt-4 px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
              style={{ backgroundColor: colors.accent, color: colors.text }}
            >
              Tekrar Dene
            </button>
          </div>
        )}
      </div>
      
      <AdBanner 
        slot="all-words-footer" 
        format="horizontal"
        className="my-4 mx-auto max-w-6xl px-4"
      />
    </div>
  );
}