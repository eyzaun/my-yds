import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import { fetchFirebaseDataSafely, userCanAccess } from './utils';
import { isMockFirestore, MockCollection, MockFirestore } from './safeMode';
import type { Firestore, DocumentData, CollectionReference, Query } from 'firebase/firestore';

/**
 * Type guard to check if a collection is a mock collection
 */
function isMockCollection(collection: unknown): collection is MockCollection {
  return typeof collection === 'object' && 
         collection !== null &&
         'where' in collection &&
         typeof (collection as Record<string, unknown>).where === 'function';
}

/**
 * Type-safe collection function that works with both real and mock Firestore
 */
function safeCollection(dbInstance: Firestore | MockFirestore, path: string) {
  // Check if using mock Firestore
  if (isMockFirestore(dbInstance)) {
    return dbInstance.collection(path);
  }
  // Use real Firestore collection
  return collection(dbInstance, path);
}

/**
 * Fetches word lists with graceful error handling
 */
export async function fetchWordLists(category?: string) {
  const path = 'wordLists';
  
  // Return empty array if user lacks permissions
  if (!userCanAccess(path)) {
    console.warn('User lacks permission to access word lists');
    return [];
  }
  
  return fetchFirebaseDataSafely(
    async () => {
      const wordListsRef = safeCollection(db, path);
      let wordListsQuery: CollectionReference<DocumentData> | Query<DocumentData> | MockCollection = wordListsRef;
      
      if (category) {
        // Handle category filtering for both real and mock
        if (isMockCollection(wordListsRef)) {
          // For mock collection that has a direct where method
          wordListsQuery = wordListsRef.where();
        } else {
          // For real Firestore collection
          wordListsQuery = query(wordListsRef as CollectionReference<DocumentData>, 
                                where('category', '==', category));
        }
      }
      
      // Kullanılan API'ye göre get() fonksiyonunu çağır
      const snapshot = isMockCollection(wordListsQuery) 
        ? await wordListsQuery.get()
        : await getDocs(wordListsQuery);
      
      return snapshot.docs.map((doc: DocumentData) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    },
    [] // Fallback to empty array
  );
}

/**
 * Fetches user data with graceful error handling
 */
export async function fetchUserData(userId: string) {
  const path = `users/${userId}`;
  
  if (!userCanAccess(path)) {
    console.warn('User lacks permission to access this user data');
    return null;
  }
  
  return fetchFirebaseDataSafely(
    async () => {
      // ...existing user data fetching logic...
      return null; // Placeholder for actual implementation
    },
    null // Fallback to null for user data
  );
}

/**
 * Fetches category stats with proper initialization
 */
export async function fetchCategoryStats() {
  // Create a placeholder words array or fetch real data
  const words = []; // Initialize with empty array or fetch data
  
  return {
    wordCount: words.length,
    questionCount: words.length, // Make sure this is equal to wordCount
  };
}