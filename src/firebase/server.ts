
'use server';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Inicializa los SDK de Firebase en el servidor de forma segura.
 * Esta función no realiza ninguna autenticación por sí misma,
 * sino que confía en que el contexto de autenticación del usuario
 * es manejado por el SDK de cliente de Firebase cuando se invoca la acción del servidor,
 * y que las reglas de seguridad de Firestore son la principal línea de defensa.
 */
export async function getSdks() {
    // Inicializa la app de Firebase (si aún no se ha hecho).
    // Esta instancia del servidor es principalmente para acceso administrativo
    // o para realizar operaciones que no dependen del usuario actual (como el seeder).
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // Devuelve los SDK inicializados.
    // Las Server Actions en Next.js se ejecutan en un contexto donde el SDK
    // del cliente ya ha establecido un estado de autenticación. Cuando se realiza
    // una operación de Firestore desde aquí, el SDK subyacente adjunta
    // la información de autenticación necesaria a la solicitud, que luego es
    // validada por las reglas de seguridad de Firestore (`request.auth`).
    // No se necesita una autenticación explícita en el servidor aquí.
    return {
        firebaseApp: app,
        auth: auth,
        firestore: firestore,
    };
}
