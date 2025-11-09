// src/components/Quiz.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { designTokens } from '@/styles/design-tokens';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { saveQuizScore } from '@/firebase/firestore';
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
  onQuizComplete?: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, categoryWords, categoryId, onQuizComplete }) => {
  const { user } = useAuth();
  const { tokens } = useTheme();
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [savingScore, setSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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
        const result = await saveQuizScore(user.uid, categoryId, totalScore, questions.length);
        
        if (result.success) {
          setScoreSaved(true);
        }
      } catch (error) {
        console.error('Quiz sonucu kaydedilirken hata:', error);
      } finally {
        setSavingScore(false);
      }
    }
  };

  // Fullscreen mode için ESC tuşu desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isFullscreen]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : 'max-w-4xl mx-auto'} p-4`}
         style={isFullscreen ? { backgroundColor: designTokens.colors.background.primary } : {}}>
      {/* Tam ekran toggle butonu */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
          style={{
            backgroundColor: isFullscreen ? designTokens.colors.accent : designTokens.colors.cardBackground,
            color: designTokens.colors.text
          }}
          title="Tam Ekran"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            )}
          </svg>
          {isFullscreen ? 'Normal Ekran' : 'Tam Ekran'}
        </button>
      </div>

      {!showResults ? (
        <>
          {questions.map((question) => (
            <div
              key={question.id}
              className="mb-8 p-4 rounded-lg shadow-md"
              style={{ backgroundColor: designTokens.colors.cardBackground }}
            >
              <p style={{ color: designTokens.colors.text.primary }} className="mb-4">
                {question.id}. {question.sentence}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-opacity-80 transition-colors duration-200"
                    style={{
                      backgroundColor: userAnswers[question.id] === option ?
                        designTokens.colors.accent : 'transparent',
                      color: designTokens.colors.text
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={userAnswers[question.id] === option}
                      onChange={() => handleAnswerSelect(question.id, option)}
                      style={{ accentColor: tokens.colors.accent }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          {/* Kullanıcı giriş yapmamışsa uyarı mesajı */}
          {!user && (
            <div className="text-center p-3 my-4 rounded-lg" style={{ backgroundColor: `${designTokens.colors.accent}30`, color: designTokens.colors.text.primary }}>
              <p className="text-sm">
                Test sonuçlarınızı kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            className="w-full p-3 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: designTokens.colors.accent,
              color: designTokens.colors.text
            }}
          >
            {savingScore ? 'Sınav Sonuçları Kaydediliyor...' : 'Sınavı Bitir'}
          </button>
        </>
      ) : (
        <div className="space-y-6">
          <div
            className="p-4 rounded-lg shadow-md"
            style={{ backgroundColor: designTokens.colors.cardBackground }}
          >
            <h2
              className="text-xl mb-4"
              style={{ color: designTokens.colors.text.primary }}
            >
              Sonuçlar: {score} / {questions.length}
            </h2>

            {user && (
              <div className="mt-2">
                {scoreSaved ? (
                  <p className="text-sm" style={{ color: designTokens.colors.text.primary }}>
                    Sınav sonucunuz kaydedildi!
                  </p>
                ) : savingScore ? (
                  <p className="text-sm" style={{ color: designTokens.colors.text.primary }}>
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
              style={{ backgroundColor: designTokens.colors.cardBackground }}
            >
              <p className="mb-2" style={{ color: designTokens.colors.text.primary }}>
                {question.sentence}
              </p>
              <p className="mb-2" style={{ color: designTokens.colors.text.primary }}>
                Kullanılan kelime: <span className="font-bold">{question.word}</span>
                ({categoryWords.find(w => w.en === question.word)?.tr})
              </p>
              <p className="mb-2">
                Sizin cevabınız: <span style={{
                  color: userAnswers[question.id] === question.correctAnswer ?
                    tokens.colors.success : tokens.colors.error
                }}>
                  {userAnswers[question.id]}
                </span>
              </p>
              {userAnswers[question.id] !== question.correctAnswer && (
                <p style={{ color: tokens.colors.success }}>
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