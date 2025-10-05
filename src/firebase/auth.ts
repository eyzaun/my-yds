// src/firebase/auth.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// İstemci tarafında mı çalışıyoruz kontrol et
const isClient = typeof window !== 'undefined';

// Yeni kullanıcı kaydı
export const registerUser = async (email: string, password: string, displayName: string) => {
  if (!isClient) return { error: 'Server-side auth operations are not supported' };
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı profilini güncelleme
    await updateProfile(user, {
      displayName
    });
    
    // Firestore'da kullanıcı dokümanı oluşturma
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });
    
    return { user };
  } catch (error) {
    return { error };
  }
};

// Kullanıcı girişi
export const loginUser = async (email: string, password: string) => {
  if (!isClient) return { error: 'Server-side auth operations are not supported' };
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

// Çıkış yapma
export const logoutUser = async () => {
  if (!isClient) return { error: 'Server-side auth operations are not supported' };
  
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Şifre sıfırlama e-postası gönderme
export const sendPasswordReset = async (email: string) => {
  if (!isClient) return { error: 'Server-side auth operations are not supported' };
  
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Auth durumu listener'ı
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!isClient) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};