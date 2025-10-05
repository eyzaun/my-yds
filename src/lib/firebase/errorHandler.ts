import { FirebaseError } from 'firebase/app';

/**
 * Global handler for Firebase errors
 * Intercepts and handles Firebase errors gracefully
 */
export function setupFirebaseErrorHandling(): void {
  if (typeof window === 'undefined') return;
  
  // Store original console.error
  const originalConsoleError = console.error;
  
  // Override console.error to filter Firebase permission errors
  console.error = function(...args: unknown[]) {
    // Check if this is a Firebase permission error
    const isFirebasePermissionError = args.some(arg => 
      arg instanceof Error && 
      (arg instanceof FirebaseError || 
       (typeof arg === 'object' && 
        arg !== null && 
        'code' in arg && 
        typeof arg.code === 'string' && 
        arg.code.includes('permission')))
    );
    
    // If it's a Firebase permission error in production static export
    if (isFirebasePermissionError && process.env.NODE_ENV === 'production') {
      // Log a less aggressive message
      console.warn('Firebase permission issue - some features may be limited');
      return;
    }
    
    // Otherwise use the original console.error
    originalConsoleError.apply(console, args);
  };
  
  // Add global error handler for uncaught Firebase errors
  window.addEventListener('error', (event) => {
    if (event.error instanceof FirebaseError || 
        (event.message && event.message.includes('Firebase'))) {
      // Prevent the error from crashing the app
      event.preventDefault();
      console.warn('Firebase error intercepted:', event.message);
      return true;
    }
    return false;
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error instanceof FirebaseError || 
        (error && error.name && error.name.includes('Firebase'))) {
      // Prevent the promise rejection from crashing the app
      event.preventDefault();
      console.warn('Unhandled Firebase promise rejection:', error);
      return true;
    }
    return false;
  });
}
