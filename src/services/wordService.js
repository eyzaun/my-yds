import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// Fetch words by category
export async function getWordsByCategory(category) {
  try {
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting words for category ${category}:`, error);
    return [];
  }
}

// You can add more word-related service functions here as needed
