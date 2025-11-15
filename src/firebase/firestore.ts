// src/firebase/firestore.ts
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProgress } from './types';

// İstemci tarafında mı çalışıyoruz kontrol et
const isClient = typeof window !== 'undefined';

// Kullanıcı ilerlemesini kaydetme
export const saveWordProgress = async (userId: string, categoryId: string, wordId: string, isStudied: boolean) => {
  if (!isClient) return { error: 'Server-side firestore operations are not supported' };
  
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${categoryId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      // Yeni ilerleme dokümanı oluştur
      await setDoc(progressRef, {
        userId,
        categoryId,
        studiedWords: isStudied ? [wordId] : [],
        lastStudied: serverTimestamp()
      });
    } else {
      // Mevcut ilerleme dokümanını güncelle
      await updateDoc(progressRef, {
        studiedWords: isStudied 
          ? arrayUnion(wordId) 
          : arrayRemove(wordId),
        lastStudied: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Kullanıcı ilerlemesini getirme
export const getUserProgress = async (userId: string, categoryId: string) => {
  if (!isClient) return { progress: { studiedWords: [] } };
  
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${categoryId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      return { progress: { studiedWords: [] } };
    }
    
    return { progress: progressDoc.data() };
  } catch (error) {
    return { error };
  }
};

// Test sonucunu kaydetme
export const saveQuizScore = async (userId: string, categoryId: string, score: number, totalQuestions: number) => {
  if (!isClient) return { error: 'Server-side firestore operations are not supported' };
  
  try {
    const scoreRef = collection(db, 'userScores');
    await setDoc(doc(scoreRef), {
      userId,
      categoryId,
      score,
      totalQuestions,
      date: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Kullanıcının test sonuçlarını getirme
export const getUserScores = async (userId: string, categoryId?: string) => {
  if (!isClient) return { scores: [] };
  
  try {
    const scoresRef = collection(db, 'userScores');
    let q;
    
    if (categoryId) {
      q = query(
        scoresRef, 
        where('userId', '==', userId),
        where('categoryId', '==', categoryId),
        orderBy('date', 'desc')
      );
    } else {
      q = query(
        scoresRef, 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const scores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { scores };
  } catch (error) {
    return { error };
  }
};

// Tüm kategori ilerlemelerini getirme
export const getAllCategoryProgress = async (userId: string) => {
  if (!isClient) return { progressByCategory: {} };

  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId));

    const querySnapshot = await getDocs(q);
    const progressByCategory: Record<string, UserProgress> = {};

    querySnapshot.forEach(doc => {
      // Veriyi UserProgress türüne dönüştürme
      const data = doc.data();
      progressByCategory[data.categoryId] = {
        userId: data.userId,
        categoryId: data.categoryId,
        studiedWords: data.studiedWords || [],
        lastStudied: data.lastStudied
      } as UserProgress;
    });

    return { progressByCategory };
  } catch (error) {
    return { error };
  }
};

// ============================================
// VERSION MANAGEMENT
// ============================================

export interface AppVersion {
  buildNumber: number;
  version: string;
  releaseDate: any;
  minSupportedBuild: number;
  forceUpdate: boolean;
  updateMessage: string;
  changelog: string;
}

// Mevcut app versiyonunu getir
export const getAppVersion = async (): Promise<AppVersion | null> => {
  if (!isClient) return null;

  try {
    const versionRef = doc(db, 'appConfig', 'version');
    const versionDoc = await getDoc(versionRef);

    if (!versionDoc.exists()) {
      console.warn('Version document not found in Firestore');
      return null;
    }

    return versionDoc.data() as AppVersion;
  } catch (error) {
    console.error('Error fetching app version:', error);
    return null;
  }
};

// Version'ı güncelle (admin/deploy script tarafından kullanılır)
export const updateAppVersion = async (versionData: AppVersion) => {
  if (!isClient) return { error: 'Server-side only' };

  try {
    const versionRef = doc(db, 'appConfig', 'version');
    await setDoc(versionRef, versionData, { merge: true });
    return { success: true };
  } catch (error) {
    return { error };
  }
};