
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes and returns Firebase SDK instances for server-side use.
 * Ensures that Firebase is initialized only once.
 * This function should be called at the beginning of each Server Action
 * that needs to interact with Firebase.
 *
 * @returns An object containing the initialized `firestore`, `auth`, and `firebaseApp` instances.
 */
export function getSdks() {
  // Use getApps() to check if Firebase has already been initialized.
  if (!getApps().length) {
    // If not initialized, initialize with the config object.
    // This is the correct approach for server-side code (Server Actions, API routes).
    const firebaseApp = initializeApp(firebaseConfig);
    return {
        firebaseApp: firebaseApp,
        auth: getAuth(firebaseApp),
        firestore: getFirestore(firebaseApp)
    };
  }
  
  // If already initialized, get the existing app instance and return the SDKs.
  const app = getApp();
  return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
  };
}
