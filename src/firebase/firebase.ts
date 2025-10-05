// src/firebase/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyA-nH1shMfMzJ6IwTk7HNGBn-BAMFwc5XQ",
  authDomain: "my-yds.firebaseapp.com",
  projectId: "my-yds",
  storageBucket: "my-yds.firebasestorage.app",
  messagingSenderId: "74476302410",
  appId: "1:74476302410:web:6f67899a42ce4a6b56b6b3",
  measurementId: "G-LCDWLFNDLK"
};

// Firebase'i başlat
let auth: Auth;
let db: Firestore;
//let analytics: any = null;

// Tarayıcı ortamında mı çalışıyoruz?
if (typeof window !== 'undefined') {
  try {
    // İstemci tarafında Firebase'i başlat
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    //analytics = getAnalytics(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Hata durumunda güvenli varsayılan değerler oluştur
    auth = {} as Auth;
    db = {} as Firestore;
  }
} else {
  // Sunucu tarafında Firebase'i devre dışı bırak
  console.log("Firebase is disabled during server-side rendering");
  // TypeScript'i memnun etmek için varsayılan değerler
  auth = {} as Auth;
  db = {} as Firestore;
}

export { auth, db };






