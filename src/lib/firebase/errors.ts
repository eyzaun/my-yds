import { FirebaseError } from 'firebase/app';

/**
 * Normalized Firebase error types
 */
export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'unauthenticated'
  | 'not-found'
  | 'network-error'
  | 'unknown';

export interface NormalizedFirebaseError {
  code: FirebaseErrorCode;
  message: string;
  original?: FirebaseError;
}

/**
 * Normalizes Firebase errors for consistent handling
 */
export function normalizeFirebaseError(error: unknown): NormalizedFirebaseError {
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied' || error.code.includes('permission')) {
      return {
        code: 'permission-denied',
        message: 'You don\'t have permission to access this resource.',
        original: error
      };
    }
    
    if (error.code.includes('auth') || error.code.includes('login')) {
      return {
        code: 'unauthenticated',
        message: 'Please sign in to access this feature.',
        original: error
      };
    }
    
    // Other Firebase error types
    // ...
  }
  
  return {
    code: 'unknown',
    message: 'An unexpected error occurred. Please try again later.',
    original: error instanceof FirebaseError ? error : undefined
  };
}
