
'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { initFirebaseAdminApp } from '@/firebase/server';
import type { User } from '@/lib/types';

// Inicializa Firebase Admin SDK una sola vez cuando el módulo se carga
initFirebaseAdminApp();

/**
 * Garantiza que los usuarios iniciales 'admin' y 'educacion' existan tanto en
 * Firebase Auth como en Firestore, creándolos solo si faltan.
 * Esta acción del servidor es idempotente y segura para llamar varias veces.
 */
export async function ensureInitialUsers() {
    try {
        const auth = getAuth();
        const firestore = getFirestore();

        const processUser = async (userData: any) => {
            let userRecord: UserRecord;
            
            // 1. Obtener usuario de Auth. Crear si no se encuentra.
            try {
                userRecord = await auth.getUserByEmail(userData.email);
            } catch (error: any) {
                if (error.code === 'auth/user-not-found') {
                    console.log(`Usuario ${userData.email} no encontrado en Auth, creando...`);
                    userRecord = await auth.createUser({
                        email: userData.email,
                        password: userData.password,
                        displayName: userData.displayName,
                    });
                     console.log(`Usuario ${userData.email} creado en Auth con UID: ${userRecord.uid}`);
                } else {
                    // Volver a lanzar otros errores de autenticación
                    throw error;
                }
            }
            
            const uid = userRecord.uid;

            // 2. Establecer Custom Claims en Auth (idempotente)
            await auth.setCustomUserClaims(uid, userData.customClaims);

            // 3. Comprobar si el perfil de usuario existe en Firestore. Crear SOLO si no existe.
            const userDocRef = firestore.collection('users').doc(uid);
            const docSnap = await userDocRef.get();

            if (!docSnap.exists) {
                console.log(`Perfil de usuario para UID ${uid} no encontrado en Firestore, creando...`);
                // Asegurarse de que el UID de Auth se almacena en el documento.
                const profileData = {
                  ...userData.firestoreProfile,
                  uid: uid, // Este es el campo clave que faltaba
                };
                await userDocRef.set(profileData);
                console.log(`Perfil de usuario para UID ${uid} creado en Firestore.`);
            } else {
                 console.log(`Perfil de usuario para UID ${uid} ya existe en Firestore. No se necesita acción.`);
            }
        };

        const adminUserData = {
            email: 'admin@decd.local',
            password: 'password123',
            displayName: 'Administrador',
            customClaims: { role: 'admin' },
            firestoreProfile: {
                name: 'Administrador',
                username: 'admin',
                role: 'admin' as const,
                permissions: ['dashboard', 'inventory', 'loans', 'reports', 'settings'],
            },
        };

        const educacionUserData = {
            email: 'educacion@decd.local',
            password: '123456',
            displayName: 'Centro educativo',
            customClaims: { role: 'user' },
            firestoreProfile: {
                name: 'Centro educativo',
                username: 'educacion',
                role: 'user' as const,
                permissions: ['dashboard', 'inventory', 'loans'],
            },
        };
        
        await processUser(adminUserData);
        await processUser(educacionUserData);

        return { success: true };

    } catch (error: any) {
        console.error("Error al garantizar los usuarios iniciales:", error);
        return { error: 'No se pudieron configurar los usuarios iniciales en el servidor.' };
    }
}


/**
 * Actualiza los detalles de un usuario tanto en Firebase Auth como en Firestore.
 * Esta es una acción del servidor para garantizar la seguridad.
 * @param uid El UID del usuario a actualizar.
 * @param data Los datos del usuario a actualizar.
 * @returns Un objeto que indica éxito o un mensaje de error.
 */
export async function updateUserAction(uid: string, data: Partial<Omit<User, 'id' | 'uid' | 'password'>>) {
  try {
    const auth = getAuth();
    const firestore = getFirestore();
    const userDocRef = firestore.collection('users').doc(uid);

    const firestoreUpdatePayload: { [key: string]: any } = {};

    // Construir el payload para la actualización de Firestore
    if (data.name) {
      firestoreUpdatePayload.name = data.name;
    }
    
    // Siempre actualizar los permisos. Si es undefined o null, se convierte en un array vacío.
    firestoreUpdatePayload.permissions = Array.isArray(data.permissions) ? data.permissions : [];
    
    // Esta lógica maneja un posible campo 'role', aunque no está actualmente en la UI.
    if (data.role) {
       firestoreUpdatePayload.role = data.role;
       // Los administradores obtienen todos los permisos.
       if (data.role === 'admin') {
         firestoreUpdatePayload.permissions = ['dashboard', 'inventory', 'loans', 'reports', 'settings'];
       }
    }

    // Realizar la actualización de Firestore si hay algo que actualizar
    if (Object.keys(firestoreUpdatePayload).length > 0) {
      await userDocRef.update(firestoreUpdatePayload);
    }
    
    // Actualizar el nombre de visualización de Auth si se proporciona
    if (data.name) {
      await auth.updateUser(uid, { displayName: data.name });
    }

    // Actualizar los custom claims de Auth (rol) si se proporciona
    if (data.role) {
      await auth.setCustomUserClaims(uid, { role: data.role });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar el usuario:", error);
    let message = 'No se pudo actualizar el usuario.';
    if (error.code === 'auth/user-not-found') {
      message = 'El usuario no fue encontrado en el sistema de autenticación.';
    } else if (error.message) {
      message = error.message;
    }
    return { error: message };
  }
}
