// src/components/Quiz.tsx
'use client';
import React, { useState} from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizScore } from '@/firebase/firestore';
import { saveQuizResult } from '@/lib/firebase/spacedRepetition';
import AdBanner from './AdBanner';
import Link from 'next/link';

interface QuizQuestion {
  id: number;
  word: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
}

interface Word {
  en: string;
  tr: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  categoryWords: Word[];
  categoryId: string; // Kategori ID'si ekleyin
  categoryName?: string; // Kategori adı (Spaced Repetition için)
  onQuizComplete?: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, categoryWords, categoryId, categoryName, onQuizComplete }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [savingScore, setSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleSubmit = async () => {
    const totalScore = questions.reduce((acc, question) => {
      return acc + (userAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    setScore(totalScore);
    setShowResults(true);

    // onQuizComplete prop'u varsa çağır
    if (onQuizComplete) {
      onQuizComplete(totalScore);
    }

    // Kullanıcı giriş yapmışsa sonucu kaydet
    if (user && categoryId) {
      setSavingScore(true);

      try {
        // Geleneksel quiz score kaydet
        const result = await saveQuizScore(user.uid, categoryId, totalScore, questions.length);

        if (result.success) {
          setScoreSaved(true);
        }

        // Spaced Repetition: Her soru için ayrı ayrı kaydet
        const savingPromises = questions.map(async (question) => {
          const userAnswer = userAnswers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;

          // Kelimenin Türkçe karşılığını bul
          const wordData = categoryWords.find(w => w.en === question.word);
          const translation = wordData?.tr || question.word;

          try {
            await saveQuizResult(
              user.uid,
              'category',
              question.word,
              translation,
              isCorrect,
              categoryId,
              categoryName
            );
          } catch (error) {
            console.error(`Spaced repetition save error for word "${question.word}":`, error);
          }
        });

        // Tüm kayıtların tamamlanmasını bekle
        await Promise.all(savingPromises);

        console.log(`✅ Spaced Repetition: ${questions.length} kelime kaydedildi`);

      } catch (error) {
        console.error('Quiz sonucu kaydedilirken hata:', error);
      } finally {
        setSavingScore(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!showResults ? (
        <>
          {questions.map((question) => (
            <div 
              key={question.id} 
              className="mb-8 p-4 rounded-lg shadow-md"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <p style={{ color: colors.text }} className="mb-4">
                {question.id}. {question.sentence}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-opacity-80 transition-colors duration-200"
                    style={{ 
                      backgroundColor: userAnswers[question.id] === option ? 
                        colors.accent : 'transparent',
                      color: colors.text
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={userAnswers[question.id] === option}
                      onChange={() => handleAnswerSelect(question.id, option)}
                      className="text-[#14FFEC]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          {/* Kullanıcı giriş yapmamışsa uyarı mesajı */}
          {!user && (
            <div className="text-center p-3 my-4 rounded-lg" style={{ backgroundColor: `${colors.accent}30`, color: colors.text }}>
              <p className="text-sm">
                Test sonuçlarınızı kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            className="w-full p-3 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: colors.accent,
              color: colors.text
            }}
          >
            {savingScore ? 'Sınav Sonuçları Kaydediliyor...' : 'Sınavı Bitir'}
          </button>
        </>
      ) : (
        <div className="space-y-6">
          <div 
            className="p-4 rounded-lg shadow-md"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h2 
              className="text-xl mb-4"
              style={{ color: colors.text }}
            >
              Sonuçlar: {score} / {questions.length}
            </h2>
            
            {user && (
              <div className="mt-2">
                {scoreSaved ? (
                  <p className="text-sm" style={{ color: colors.text }}>
                    Sınav sonucunuz kaydedildi!
                  </p>
                ) : savingScore ? (
                  <p className="text-sm" style={{ color: colors.text }}>
                    Sınav sonucunuz kaydediliyor...
                  </p>
                ) : null}
              </div>
            )}
          </div>
          
          {questions.map((question) => (
            <div 
              key={question.id} 
              className="p-4 rounded-lg shadow-md"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <p className="mb-2" style={{ color: colors.text }}>
                {question.sentence}
              </p>
              <p className="mb-2" style={{ color: colors.text }}>
                Kullanılan kelime: <span className="font-bold">{question.word}</span> 
                ({categoryWords.find(w => w.en === question.word)?.tr})
              </p>
              <p className="mb-2">
                Sizin cevabınız: <span style={{ 
                  color: userAnswers[question.id] === question.correctAnswer ? 
                    'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'
                }}>
                  {userAnswers[question.id]}
                </span>
              </p>
              {userAnswers[question.id] !== question.correctAnswer && (
                <p style={{ color: 'rgb(74, 222, 128)' }}>
                  Doğru cevap: {question.correctAnswer}
                </p>
              )}
            </div>
          ))}
          
          {/* Test sonuçları altına reklam */}
          <div className="my-6">
            <AdBanner 
              slot="566170600" 
              format="horizontal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;