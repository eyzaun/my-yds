import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FlashcardData } from '@/types/flashcard';

// Basit bir ID oluşturma fonksiyonu
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Flashcard setini Firebase'e kaydet
export async function saveFlashcardSet(name: string, flashcards: FlashcardData[]) {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    throw new Error('Bu fonksiyon sadece client-side çalışır');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth || !auth.currentUser) {
    throw new Error('Kullanıcı giriş yapmamış');
  }
  
  try {
    console.log(`Saving flashcard set "${name}" with ${flashcards.length} cards`);
    
    // Flashcard setini oluştur
    const docRef = await addDoc(collection(db, 'flashcardSets'), {
      name,
      userId: auth.currentUser.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      cardCount: flashcards.length
    });
    
    console.log(`Created flashcard set with ID: ${docRef.id}`);
    
    // Flashcardların benzersiz ID'lere sahip olduğundan emin ol
    const cardsWithUniqueIds = flashcards.map(card => ({
      ...card,
      id: card.id || generateId()
    }));
    
    // Flashcardları ayrı koleksiyonda depola
    const savePromises = cardsWithUniqueIds.map(card => 
      addDoc(collection(db, 'flashcards'), {
        setId: docRef.id,
        userId: auth.currentUser!.uid,
        front: card.front,
        back: card.back,
        notes: card.notes || null, // notes alanını kaydet
        createdAt: Timestamp.now()
      })
    );
    
    await Promise.all(savePromises);
    
    console.log(`Successfully saved ${flashcards.length} flashcards`);
    return docRef.id;
  } catch (error) {
    console.error('Error saving flashcard set:', error);
    throw error;
  }
}

// Kullanıcının flashcard setlerini getir
export async function getUserFlashcardSets() {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    throw new Error('Bu fonksiyon sadece client-side çalışır');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth || !auth.currentUser) {
    throw new Error('Kullanıcı giriş yapmamış');
  }
  
  try {
    console.log(`Getting user flashcard sets`);
    
    // İndeks hatası almamak için orderBy kaldırıldı
    const q = query(
      collection(db, 'flashcardSets'),
      where('userId', '==', auth.currentUser!.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const sets: {id: string, name: string, cardCount: number, createdAt: Date}[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sets.push({
        id: doc.id,
        name: data.name,
        cardCount: data.cardCount,
        createdAt: data.createdAt.toDate()
      });
    });
    
    // Seti manuel olarak tarihe göre sırala (en yeni başta)
    sets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log(`Found ${sets.length} flashcard sets`);
    return sets;
  } catch (error) {
    console.error('Error getting flashcard sets:', error);
    throw error;
  }
}

// Belirli bir setteki flashcardları getir
export async function getFlashcardsBySetId(setId: string) {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    throw new Error('Bu fonksiyon sadece client-side çalışır');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth || !auth.currentUser) {
    throw new Error('Kullanıcı giriş yapmamış');
  }
  
  try {
    console.log(`Getting flashcards for set ID: ${setId}`);
    
    const q = query(
      collection(db, 'flashcards'),
      where('setId', '==', setId),
      where('userId', '==', auth.currentUser!.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const flashcards: FlashcardData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        id: doc.id,
        front: data.front,
        back: data.back,
        notes: data.notes || undefined // notes alanını al
      });
    });
    
    console.log(`Found ${flashcards.length} flashcards`);
    return flashcards;
  } catch (error) {
    console.error('Error getting flashcards:', error);
    throw error;
  }
}

// Flashcard setini ve içindeki tüm kartları sil
export async function deleteFlashcardSet(setId: string) {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    throw new Error('Bu fonksiyon sadece client-side çalışır');
  }

  const auth = getAuth();
  const db = getFirestore();

  if (!auth || !auth.currentUser) {
    throw new Error('Kullanıcı giriş yapmamış');
  }
  
  try {
    console.log(`Deleting flashcard set with ID: ${setId}`);
    
    // Önce sete ait olan tüm flashcardları bulalım
    const flashcardsQuery = query(
      collection(db, 'flashcards'),
      where('setId', '==', setId),
      where('userId', '==', auth.currentUser!.uid)
    );
    
    const flashcardsSnapshot = await getDocs(flashcardsQuery);
    
    // Tüm flashcardları silelim
    const deletePromises = flashcardsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Şimdi flashcard setini silelim
    const setRef = doc(db, 'flashcardSets', setId);
    await deleteDoc(setRef);
    
    console.log(`Successfully deleted flashcard set and its cards`);
    return true;
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    throw error;
  }
}