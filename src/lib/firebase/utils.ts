import { getAuth } from 'firebase/auth';
import { normalizeFirebaseError } from './errors';

/**
 * Checks if user is authenticated before making Firebase requests
 * @returns True if authenticated, throws error if not
 */
export function ensureAuthenticated(): boolean {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    throw new Error('Authentication check can only run on client-side');
  }

  const auth = getAuth();
  if (!auth || !auth.currentUser) {
    throw new Error('User must be authenticated');
  }
  return true;
}

/**
 * Wrapper for Firebase operations that handles authentication and error normalization
 * @param operation Function that performs Firebase operation
 * @param requireAuth Whether authentication is required
 * @returns Promise with operation result
 */
export async function withFirebaseErrorHandling<T>(
  operation: () => Promise<T>,
  requireAuth = true
): Promise<T> {
  try {
    // Check authentication if required
    if (requireAuth) {
      ensureAuthenticated();
    }
    
    // Perform the operation
    return await operation();
  } catch (error) {
    // Normalize error for consistent handling
    const normalizedError = normalizeFirebaseError(error);
    
    // Log for debugging
    console.error('Firebase operation error:', normalizedError);
    
    // Rethrow normalized error
    throw normalizedError;
  }
}

/**
 * Safe Firebase data fetching with error handling
 */
export async function fetchFirebaseDataSafely<T>(
  fetchFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    console.error('Firebase data fetch error:', error);
    // Return fallback data instead of crashing
    return fallback;
  }
}

/**
 * Checks if user is authenticated and has necessary permissions
 */
export function userCanAccess(path: string): boolean {
  // SSR kontrolü
  if (typeof window === 'undefined') {
    // Public paths anyone can access on SSR
    const publicPaths = ['wordLists', 'categories'];
    if (publicPaths.some(p => path.startsWith(p))) {
      return true;
    }
    return false;
  }

  const auth = getAuth();
  const user = auth?.currentUser;

  // Public paths anyone can access
  const publicPaths = ['wordLists', 'categories'];
  if (publicPaths.some(p => path.startsWith(p))) {
    return true;
  }

  // User-specific paths require auth
  if (path.includes('users/') && user) {
    // Check if accessing own data
    return path.includes(`users/${user.uid}`);
  }

  // Default to requiring authentication
  return !!user;
}
