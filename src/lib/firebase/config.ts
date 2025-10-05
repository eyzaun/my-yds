
'use client';

// config.ts - minimal değişikliklerle

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// isFirebaseSafeMode değişkeni ekledik
export const isFirebaseSafeMode = false;

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

// Firebase'i yalnızca istemci tarafında başlat
let app;
let db;
let auth;

if (typeof window !== 'undefined') {
  // İstemci tarafındayız
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.log('Firebase is disabled during server-side rendering');
}

export { db, auth };