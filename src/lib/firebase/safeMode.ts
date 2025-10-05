import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Flag to track if Firebase is in safe mode
let inSafeMode = false;

// Export type for mock firestore
export type MockFirestore = {
  collection: (path: string) => MockCollection;
};

// Export mock collection type
export type MockCollection = {
  doc: (id: string) => MockDocument;
  where: () => MockCollection;
  orderBy: () => MockCollection;
  limit: () => MockCollection;
  get: () => Promise<{ docs: []; empty: boolean }>;
  add: () => Promise<{ id: string }>;
};

type MockDocument = {
  get: () => Promise<{ exists: boolean; data: () => null }>;
  set: () => Promise<void>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
};

/**
 * Type guard to check if an object is a MockFirestore
 */
export function isMockFirestore(obj: unknown): obj is MockFirestore {
  return (
    typeof obj === 'object' && 
    obj !== null && 
    'collection' in obj && 
    !('type' in obj) && // Real Firestore has a 'type' property
    !('app' in obj) // Real Firestore has an 'app' property
  );
}

/**
 * Safe Firebase app instance that won't crash on permissions errors
 */
class SafeFirebaseApp {
  private realApp: FirebaseApp | null = null;
  private mockDb: MockFirestore = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      where: () => this.mockDb.collection(''),
      orderBy: () => this.mockDb.collection(''),
      limit: () => this.mockDb.collection(''),
      get: async () => ({ docs: [], empty: true }),
      add: async () => ({ id: 'mock-id' }),
    }),
  };
  
  constructor(app: FirebaseApp | null) {
    this.realApp = app;
  }
  
  /**
   * Get safe Firestore instance with fallback behavior
   */
  getFirestore(): Firestore | MockFirestore {
    try {
      if (!this.realApp) throw new Error('No Firebase app');
      return getFirestore(this.realApp);
    } catch (err) {
      console.warn('Using mock Firestore due to error:', err);
      inSafeMode = true;
      return this.mockDb;
    }
  }
  
  /**
   * Get safe Auth instance with fallback behavior
   */
  getAuth(): Auth | Record<string, unknown> {
    try {
      if (!this.realApp) throw new Error('No Firebase app');
      return getAuth(this.realApp);
    } catch (err) {
      console.warn('Using mock Auth due to error:', err);
      inSafeMode = true;
      return {
        currentUser: null,
        onAuthStateChanged: (callback: (user: null) => void) => {
          callback(null);
          return () => {};
        },
        signInWithEmailAndPassword: async () => { throw new Error('Auth in safe mode'); },
        createUserWithEmailAndPassword: async () => { throw new Error('Auth in safe mode'); },
        signOut: async () => {},
      };
    }
  }
  
  /**
   * Check if Firebase is in safe mode (with limited functionality)
   */
  isInSafeMode(): boolean {
    return inSafeMode;
  }
}

/**
 * Initialize Firebase safely with fallback options
 */
export function initializeFirebaseSafely(config: Record<string, unknown>): SafeFirebaseApp {
  try {
    // Check if Firebase is already initialized
    let app = getApps().length ? getApps()[0] : null;
    
    if (!app) {
      app = initializeApp(config);
    }
    
    return new SafeFirebaseApp(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase, using safe mode:', error);
    inSafeMode = true;
    return new SafeFirebaseApp(null);
  }
}
