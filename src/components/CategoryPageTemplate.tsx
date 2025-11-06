/**
 * Category Page Template
 * Reusable template for all category pages
 * Professional design following UI/UX best practices
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { Button, Card, Container, Heading1, Heading2, Text } from '@/components/design-system';
import { designTokens } from '@/styles/design-tokens';

interface Word {
  en: string;
  tr: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CategoryPageProps {
  categoryId: string;
  categoryName: string;
  categoryTitle: string;
  categoryDescription: string;
  words: Word[];
  questions: Question[];
  icon: React.ReactNode;
}

export const CategoryPageTemplate: React.FC<CategoryPageProps> = ({
  categoryId,
  categoryName,
  categoryTitle,
  categoryDescription,
  words,
  questions,
  icon,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { user } = useAuth();

  return (
    <div style={{
      backgroundColor: designTokens.colors.background.primary,
      minHeight: '100vh',
      paddingBottom: designTokens.spacing[16],
    }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: designTokens.colors.primary[600],
        paddingTop: designTokens.spacing[12],
        paddingBottom: designTokens.spacing[12],
      }}>
        <Container maxWidth="lg">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing[6],
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: designTokens.colors.base.white,
              borderRadius: designTokens.borders.radius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.primary[600],
              flexShrink: 0,
            }}>
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Heading1 style={{
                color: designTokens.colors.base.white,
                marginBottom: designTokens.spacing[2],
              }}>
                {categoryTitle}
              </Heading1>
              <Text style={{
                color: designTokens.colors.base.white,
                opacity: 0.9,
              }}>
                {categoryDescription}
              </Text>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section style={{
        marginTop: `-${designTokens.spacing[8]}`,
        position: 'relative',
        zIndex: 10,
      }}>
        <Container maxWidth="lg">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: designTokens.spacing[4],
          }}>
            <Card variant="elevated" padding="md">
              <Text size="sm" color="secondary" style={{ marginBottom: designTokens.spacing[1] }}>
                Toplam Kelime
              </Text>
              <Heading2 style={{ color: designTokens.colors.primary[600] }}>
                {words.length}
              </Heading2>
            </Card>
            <Card variant="elevated" padding="md">
              <Text size="sm" color="secondary" style={{ marginBottom: designTokens.spacing[1] }}>
                Test Soruları
              </Text>
              <Heading2 style={{ color: designTokens.colors.accent.success.main }}>
                {questions.length}
              </Heading2>
            </Card>
            {user && (
              <Card variant="elevated" padding="md" style={{
                background: `linear-gradient(135deg, ${designTokens.colors.accent.warning.light} 0%, ${designTokens.colors.accent.warning.main}20 100%)`,
              }}>
                <Text size="sm" color="secondary" style={{ marginBottom: designTokens.spacing[1] }}>
                  İlerleme Kaydediliyor
                </Text>
                <Heading2 style={{ color: designTokens.colors.accent.warning.dark }}>
                  Aktif
                </Heading2>
              </Card>
            )}
          </div>
        </Container>
      </section>

      {/* Info Section */}
      {!user && (
        <section style={{ paddingTop: designTokens.spacing[8] }}>
          <Container maxWidth="lg">
            <Card variant="outlined" padding="md" style={{
              backgroundColor: designTokens.colors.accent.info.light,
              borderColor: designTokens.colors.accent.info.main,
            }}>
              <Text size="sm">
                İlerlemenizi kaydetmek için{' '}
                <Link href="/login" style={{
                  color: designTokens.colors.primary[600],
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  textDecoration: 'underline',
                }}>
                  giriş yapın
                </Link>
                {' '}veya{' '}
                <Link href="/register" style={{
                  color: designTokens.colors.primary[600],
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  textDecoration: 'underline',
                }}>
                  kayıt olun
                </Link>
                .
              </Text>
            </Card>
          </Container>
        </section>
      )}

      {/* Mode Toggle */}
      <section style={{ paddingTop: designTokens.spacing[8] }}>
        <Container maxWidth="lg">
          <div style={{
            display: 'flex',
            gap: designTokens.spacing[4],
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Button
              size="lg"
              variant={!showQuiz ? 'primary' : 'outline'}
              onClick={() => setShowQuiz(false)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            >
              Kelime Listesi
            </Button>
            <Button
              size="lg"
              variant={showQuiz ? 'primary' : 'outline'}
              onClick={() => setShowQuiz(true)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            >
              Test Çöz
            </Button>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section style={{ paddingTop: designTokens.spacing[8] }}>
        <Container maxWidth="lg">
          {showQuiz ? (
            <>
              {score === null ? (
                <Card variant="default" padding="lg">
                  <Quiz
                    questions={questions}
                    categoryWords={words}
                    categoryId={categoryId}
                    onQuizComplete={setScore}
                  />
                </Card>
              ) : (
                <Card variant="elevated" padding="lg">
                  <div style={{ textAlign: 'center' }}>
                    <Heading2 style={{ marginBottom: designTokens.spacing[4] }}>
                      Test Sonucu
                    </Heading2>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: score / questions.length >= 0.7
                        ? designTokens.colors.accent.success.light
                        : designTokens.colors.accent.warning.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: `${designTokens.spacing[6]} auto`,
                    }}>
                      <Text style={{
                        fontSize: designTokens.typography.fontSize.h1,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        color: score / questions.length >= 0.7
                          ? designTokens.colors.accent.success.dark
                          : designTokens.colors.accent.warning.dark,
                      }}>
                        {Math.round((score / questions.length) * 100)}%
                      </Text>
                    </div>
                    <Text style={{ marginBottom: designTokens.spacing[6] }}>
                      {score} / {questions.length} doğru cevap
                    </Text>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setScore(null)}
                    >
                      Tekrar Dene
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <WordList
              words={words}
              categoryId={categoryId}
              categoryName={categoryName}
            />
          )}
        </Container>
      </section>
    </div>
  );
};
