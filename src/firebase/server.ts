
'use server';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Inicializa los SDK de Firebase en el servidor de forma segura.
 * Esta función se llama al inicio de cada Server Action.
 * La autenticación se maneja en el lado del cliente y se valida
 * mediante las reglas de seguridad de Firestore, por lo que este
 * entorno de servidor no necesita manejar la autenticación del usuario.
 */
export async function getSdks() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  return {
      firebaseApp: app,
      auth: auth,
      firestore: firestore,
  };
}
