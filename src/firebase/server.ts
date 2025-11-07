
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { headers } from 'next/headers';

// This is a polyfill for the 'atob' function, which is not available in the Node.js server environment.
if (typeof atob === 'undefined') {
  global.atob = (b64: string) => Buffer.from(b64, 'base64').toString('binary');
}

/**
 * Parses a JWT token to extract its payload without verifying the signature.
 * This is used to get the user's UID from the session cookie.
 */
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Initializes and returns Firebase SDK instances for server-side use.
 * This function handles authentication by reading the Firebase session cookie
 * and creating a custom token for the user.
 */
export async function getSdks() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  try {
    const headersList = headers();
    const sessionCookie = headersList.get('x-session-cookie');

    if (sessionCookie) {
      // If a session cookie is present, we try to authenticate with it.
      const decodedToken = parseJwt(sessionCookie);
      if (decodedToken && auth.currentUser?.uid !== decodedToken.uid) {
        // We sign in with a custom token.
        // NOTE: In a real production app, you would mint a custom token on your backend
        // and sign in with that. For this internal tool, we are re-using the session token
        // for simplicity, but this is not standard practice.
        await signInWithCustomToken(auth, sessionCookie);
      }
    }
  } catch (error) {
    console.error('Server-side auth error:', error);
    // If auth fails, we proceed with an unauthenticated instance.
    // Security rules will then handle access control.
  }
  
  return {
      firebaseApp: app,
      auth: auth,
      firestore: firestore,
  };
}
