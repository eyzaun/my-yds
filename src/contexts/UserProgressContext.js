import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';

const UserProgressContext = createContext();

export function useUserProgress() {
  return useContext(UserProgressContext);
}

export function UserProgressProvider({ children }) {
  const { user } = useAuth();
  const [studiedWords, setStudiedWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user progress when authenticated
  useEffect(() => {
    async function fetchUserProgress() {
      if (!user) {
        setStudiedWords([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'userProgress', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setStudiedWords(userDoc.data().studiedWords || []);
        } else {
          // Create a new document for the user if it doesn't exist
          await setDoc(userDocRef, { studiedWords: [] });
          setStudiedWords([]);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProgress();
  }, [user]);

  // Function to mark a word as studied
  const markWordAsStudied = async (wordId) => {
    if (!user) return;
    
    try {
      // Update local state first for immediate UI feedback
      if (!studiedWords.includes(wordId)) {
        setStudiedWords(prev => [...prev, wordId]);
        
        // Update Firestore
        const userDocRef = doc(db, 'userProgress', user.uid);
        
        // Check if document exists first
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          // Update existing document
          await updateDoc(userDocRef, {
            studiedWords: arrayUnion(wordId)
          });
        } else {
          // Create new document with initial studied word
          await setDoc(userDocRef, {
            studiedWords: [wordId]
          });
        }
        
        console.log("Progress saved for word:", wordId);
      }
    } catch (error) {
      console.error("Error marking word as studied:", error);
    }
  };

  // Check if a word has been studied
  const isWordStudied = (wordId) => {
    return studiedWords.includes(wordId);
  };

  const value = {
    studiedWords,
    markWordAsStudied,
    isWordStudied,
    loading
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
}
