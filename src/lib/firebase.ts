'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-nH1shMfMzJ6IwTk7HNGBn-BAMFwc5XQ",
  authDomain: "my-yds.firebaseapp.com",
  projectId: "my-yds",
  storageBucket: "my-yds.firebasestorage.app",
  messagingSenderId: "74476302410",
  appId: "1:74476302410:web:6f67899a42ce4a6b56b6b3",
  measurementId: "G-LCDWLFNDLK"
};

// Initialize Firebase with singleton pattern - only on client side
let app;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  // Client-side only
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.log('Firebase is disabled during server-side rendering');
}

export { db, auth };
