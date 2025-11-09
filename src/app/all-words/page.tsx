// src/app/all-words/page.tsx
'use client';
import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading2, Text } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Container';
import { useTheme } from '@/hooks/useTheme';

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
  const { tokens } = useTheme();
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);
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
    <div
      style={{
        minHeight: '100vh',
        paddingBottom: tokens.spacing[16],
        backgroundColor: tokens.colors.background.primary
      }}
    >
      <Container maxWidth="lg" style={{ paddingTop: tokens.spacing[8], paddingBottom: tokens.spacing[8] }}>
        {/* Sayfa Başlığı */}
        <Heading1 style={{ marginBottom: tokens.spacing[6], textAlign: 'center' }}>
          Tüm YDS Kelimeleri
        </Heading1>

        {/* Sayfa Açıklaması */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing[6] }}>
          <Text style={{ marginBottom: tokens.spacing[2] }}>
            Bu sayfada tüm kategorilerdeki YDS kelimelerini bir arada bulabilirsiniz. İstediğiniz kelimeyi çalışabilir veya tüm kelimelerden oluşan bir test çözebilirsiniz.
          </Text>
          <Text variant="secondary" style={{ fontSize: tokens.typography.fontSize.sm }}>
            Toplam <strong>{allWords.length}</strong> kelime ve <strong>{allQuizzes.length}</strong> test sorusu bulunmaktadır.
          </Text>

          {/* Kullanıcı giriş yapmışsa bilgilendirme mesajı */}
          {user && (
            <div
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.primary[50],
              }}
            >
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
              </Text>
            </div>
          )}

          {/* Kullanıcı giriş yapmamışsa giriş yapma önerisi */}
          {!user && (
            <div
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.primary[50],
              }}
            >
              <Text style={{ fontSize: tokens.typography.fontSize.sm }}>
                İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </Text>
            </div>
          )}
        </Card>

        {/* Mod Seçimi */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: tokens.spacing[4],
            marginBottom: tokens.spacing[6]
          }}
        >
          <Button
            variant={!showQuiz ? 'primary' : 'secondary'}
            onClick={() => setShowQuiz(false)}
            style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Kelime Listesi
          </Button>
          <Button
            variant={showQuiz ? 'primary' : 'secondary'}
            onClick={() => setShowQuiz(true)}
            style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Test
          </Button>
        </div>

        {showQuiz ? (
          <div>
            {/* Test açıklaması */}
            <Card variant="elevated" style={{ marginBottom: tokens.spacing[6] }}>
              <Text variant="secondary" style={{ fontSize: tokens.typography.fontSize.sm }}>
                Bu test, tüm kategorilerden rastgele seçilmiş 20 soru içermektedir.
              </Text>
            </Card>

            <Quiz
              questions={randomQuestions}
              categoryWords={allWords}
              categoryId={categoryId}
              onQuizComplete={setScore}
            />
          </div>
        ) : (
          <WordList
            words={allWords}
            categoryId={categoryId}
          />
        )}

        {score !== null && (
          <Card variant="elevated" style={{ textAlign: 'center', marginTop: tokens.spacing[8] }}>
            <Heading2 style={{ marginBottom: tokens.spacing[4] }}>
              Test Sonucu
            </Heading2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '6rem',
                height: '6rem',
                borderRadius: tokens.borderRadius.full,
                marginBottom: tokens.spacing[4],
                backgroundColor: tokens.colors.primary[600],
              }}
            >
              <span
                style={{
                  fontSize: tokens.typography.fontSize['2xl'],
                  fontWeight: tokens.typography.fontWeight.bold,
                  color: tokens.colors.text.inverse
                }}
              >
                %{Math.round((score / 20) * 100)}
              </span>
            </div>
            <Text>
              Toplam Doğru: {score} / 20
            </Text>
            <Button
              variant="primary"
              onClick={() => setScore(null)}
              style={{ marginTop: tokens.spacing[4] }}
            >
              Tekrar Dene
            </Button>
          </Card>
        )}
      </Container>

      <AdBanner
        slot="all-words-footer"
        format="horizontal"
        className="my-4 mx-auto max-w-6xl px-4"
      />
    </div>
  );
}
