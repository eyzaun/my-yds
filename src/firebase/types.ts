// src/firebase/types.ts

// Firestore'dan dönen zaman damgası türü
export type FirebaseTimestamp = {
    seconds: number;
    nanoseconds: number;
  };
  
  // Kullanıcı belgesi türü
  export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: FirebaseTimestamp;
    lastLoginAt: FirebaseTimestamp;
  }
  
  // Kullanıcı ilerlemesi türü
  export interface UserProgress {
    userId: string;
    categoryId: string;
    studiedWords: string[];
    masteredWords?: string[];
    lastStudied: FirebaseTimestamp;
  }
  
  // Test sonucu türü
  export interface QuizScore {
    id?: string;
    userId: string;
    categoryId: string;
    score: number;
    totalQuestions: number;
    date: FirebaseTimestamp;
  }