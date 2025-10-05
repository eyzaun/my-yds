// src/types/quiz.ts
export interface QuizQuestion {
    id: number;
    word: string;
    sentence: string;
    options: string[];
    correctAnswer: string;
  }
  