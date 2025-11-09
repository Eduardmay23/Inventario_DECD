
'use server';

import { Suspense } from 'react';
import HomeClient from './home-client';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdminApp } from '@/firebase/server';
import { headers } from 'next/headers';

// Initialize Firebase Admin SDK if not already done
if (!getApps().length) {
  initFirebaseAdminApp();
}

async function getUserSession() {
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      // Invalid or expired token
      return null;
    }
  }
  return null;
}

export default async function HomePage() {
  const session = await getUserSession();
  
  if (!session) {
    // If there is no session, redirect to the login page
    redirect('/login');
  }

  // If there is a session, let the client-side component handle redirection to dashboard
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
