
import { getFirebaseAdmin } from '@/app/firebase-admin';
import { NextResponse } from 'next/server';

// This route handler will act as a one-time script to create the initial admin user.
export async function GET() {
  const { auth, firestore } = getFirebaseAdmin();

  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';

  try {
    // Check if the user already exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, so create them
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: 'Admin User',
        });
      } else {
        // Another error occurred
        throw error;
      }
    }

    // Now, ensure the user has the 'admin' role in Firestore
    const userDocRef = firestore.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      await userDocRef.set({
        name: 'Admin User',
        email: adminEmail,
        role: 'admin',
      });
      return NextResponse.json({ message: 'Admin user created successfully.' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Admin user already exists.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error seeding admin user:', error);
    return NextResponse.json({ error: 'Failed to seed admin user.', details: error.message }, { status: 500 });
  }
}
