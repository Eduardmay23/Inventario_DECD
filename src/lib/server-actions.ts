'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import type { User } from './types';

// Centralized Firebase Admin SDK initialization
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
}

const DUMMY_DOMAIN = 'decd.local';

/**
 * Creates a new user in Firebase Authentication and stores their profile in Firestore.
 * This is a server action and should only be called from the server.
 *
 * @param newUser - The user data for creation, including a plain-text password.
 * @returns An object indicating success or failure with a message.
 */
export async function createNewUser(newUser: Omit<User, 'id' | 'role' | 'uid'>) {
  initializeFirebaseAdmin();

  const email = `${newUser.username}@${DUMMY_DOMAIN}`;

  try {
    const userRecord: UserRecord = await admin.auth().createUser({
      email: email,
      password: newUser.password!,
      displayName: newUser.name,
    });

    const userDocData: Omit<User, 'password'> = {
      uid: userRecord.uid,
      name: newUser.name,
      username: newUser.username,
      role: 'user', // All manually created users have the 'user' role
      permissions: newUser.permissions || [],
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(userDocData);
    
    // Revalidate the settings page to show the new user
    revalidatePath('/settings');

    return { success: true, message: `Usuario "${newUser.username}" creado con éxito.` };
  } catch (error: any) {
    let message = 'No se pudo crear el usuario.';
    if (error.code === 'auth/email-already-exists') {
      message = 'Este nombre de usuario ya está en uso.';
    } else if (error.code === 'auth/invalid-password') {
        message = 'La contraseña no es válida. Debe tener al menos 6 caracteres.';
    }
    console.error("Error creating user:", error);
    return { success: false, message };
  }
}

/**
 * Deletes a user from Firebase Authentication and their profile from Firestore.
 * This is a server action and should only be called from the server.
 *
 * @param uid - The UID of the user to delete.
 * @returns An object indicating success or failure with a message.
 */
export async function deleteExistingUser(uid: string) {
    initializeFirebaseAdmin();

    try {
        // Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);

        // Delete from Firestore
        await admin.firestore().collection('users').doc(uid).delete();
        
        // Revalidate the settings page to remove the user from the list
        revalidatePath('/settings');

        return { success: true, message: 'Usuario eliminado completamente.' };
    } catch (error: any) {
        console.error(`Failed to delete user ${uid}:`, error);
        return { 
            success: false, 
            message: error.message || 'Ocurrió un error desconocido al eliminar el usuario.' 
        };
    }
}
