// src/components/Quiz.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizScore } from '@/firebase/firestore';
import AdBanner from './AdBanner';
import Link from 'next/link';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { Heading2, Heading3, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

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
  categoryId: string;
  onQuizComplete?: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, categoryWords, categoryId, onQuizComplete }) => {
  const { user } = useAuth();
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

    if (onQuizComplete) {
      onQuizComplete(totalScore);
    }

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

  const fullscreenIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {isFullscreen ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
      )}
    </svg>
  );

  return (
    <div
      className={isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : 'max-w-4xl mx-auto'}
      style={{
        backgroundColor: isFullscreen ? designTokens.colors.background.primary : 'transparent',
        padding: designTokens.spacing[4]
      }}
    >
      {/* Tam ekran toggle butonu */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: designTokens.spacing[4]
      }}>
        <Button
          variant={isFullscreen ? 'primary' : 'secondary'}
          size="md"
          leftIcon={fullscreenIcon}
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? 'Normal Ekran' : 'Tam Ekran'}
        </Button>
      </div>

      {!showResults ? (
        <>
          {questions.map((question) => (
            <Card
              key={question.id}
              variant="elevated"
              style={{ marginBottom: designTokens.spacing[6] }}
            >
              <Text style={{
                marginBottom: designTokens.spacing[4],
                color: designTokens.colors.text.primary
              }}>
                {question.id}. {question.sentence}
              </Text>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: designTokens.spacing[2]
              }}>
                {question.options.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing[2],
                      cursor: 'pointer',
                      padding: designTokens.spacing[3],
                      borderRadius: designTokens.borderRadius.md,
                      backgroundColor: userAnswers[question.id] === option ?
                        designTokens.colors.primary[100] : 'transparent',
                      border: `2px solid ${userAnswers[question.id] === option ?
                        designTokens.colors.primary[500] : 'transparent'}`,
                      transition: 'all 0.2s',
                      color: designTokens.colors.text.primary
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={userAnswers[question.id] === option}
                      onChange={() => handleAnswerSelect(question.id, option)}
                      style={{
                        accentColor: designTokens.colors.primary[600],
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}

          {/* Kullanıcı giriş yapmamışsa uyarı mesajı */}
          {!user && (
            <Card
              variant="flat"
              style={{
                marginTop: designTokens.spacing[4],
                marginBottom: designTokens.spacing[4],
                backgroundColor: designTokens.colors.accent.warning.light,
                textAlign: 'center'
              }}
            >
              <Text style={{
                fontSize: designTokens.typography.fontSize.sm,
                color: designTokens.colors.text.primary
              }}>
                Test sonuçlarınızı kaydetmek için <Link href="/login" style={{
                  textDecoration: 'underline',
                  color: designTokens.colors.primary[700]
                }}>giriş yapın</Link> veya <Link href="/register" style={{
                  textDecoration: 'underline',
                  color: designTokens.colors.primary[700]
                }}>kayıt olun</Link>.
              </Text>
            </Card>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            loading={savingScore}
          >
            {savingScore ? 'Sınav Sonuçları Kaydediliyor...' : 'Sınavı Bitir'}
          </Button>
        </>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: designTokens.spacing[6]
        }}>
          <Card variant="elevated">
            <Heading2 style={{
              marginBottom: designTokens.spacing[4],
              color: designTokens.colors.text.primary
            }}>
              Sonuçlar: {score} / {questions.length}
            </Heading2>

            {user && (
              <div style={{ marginTop: designTokens.spacing[3] }}>
                {scoreSaved ? (
                  <Text style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.accent.success.dark
                  }}>
                    Sınav sonucunuz kaydedildi!
                  </Text>
                ) : savingScore ? (
                  <Text style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.text.secondary
                  }}>
                    Sınav sonucunuz kaydediliyor...
                  </Text>
                ) : null}
              </div>
            )}
          </Card>

          {questions.map((question) => (
            <Card
              key={question.id}
              variant="elevated"
            >
              <Text style={{
                marginBottom: designTokens.spacing[3],
                color: designTokens.colors.text.primary
              }}>
                {question.sentence}
              </Text>

              <Text style={{
                marginBottom: designTokens.spacing[3],
                color: designTokens.colors.text.secondary
              }}>
                Kullanılan kelime: <span style={{
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary
                }}>
                  {question.word}
                </span> ({categoryWords.find(w => w.en === question.word)?.tr})
              </Text>

              <Text style={{ marginBottom: designTokens.spacing[3] }}>
                Sizin cevabınız: <span style={{
                  color: userAnswers[question.id] === question.correctAnswer ?
                    designTokens.colors.accent.success.dark :
                    designTokens.colors.accent.error.main,
                  fontWeight: designTokens.typography.fontWeight.semibold
                }}>
                  {userAnswers[question.id]}
                </span>
              </Text>

              {userAnswers[question.id] !== question.correctAnswer && (
                <Text style={{
                  color: designTokens.colors.accent.success.dark,
                  fontWeight: designTokens.typography.fontWeight.semibold
                }}>
                  Doğru cevap: {question.correctAnswer}
                </Text>
              )}
            </Card>
          ))}

          {/* Test sonuçları altına reklam */}
          <div style={{ marginTop: designTokens.spacing[6] }}>
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
