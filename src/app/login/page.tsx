
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Boxes, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, type Auth } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, type Firestore } from 'firebase/firestore';


const DUMMY_DOMAIN = 'decd.local';

async function createInitialUsers(auth: Auth, firestore: Firestore) {
  // Helper to ensure a user exists in both Auth and Firestore without duplicates.
  const ensureUserExists = async (username: string, password: string, userData: any) => {
    const email = `${username}@${DUMMY_DOMAIN}`;
    
    try {
      // Step 1: Create the Auth user. It will fail if it already exists, which is fine.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // If we reach here, the auth user was created. Now create their Firestore document.
      const userDocRef = doc(firestore, "users", userCredential.user.uid);
      // Check if doc exists to prevent overwriting, though it shouldn't for a new auth user.
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { ...userData, uid: userCredential.user.uid });
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // This is expected after the first run. The auth user exists.
        // We DO NOT attempt to create the firestore doc here, as we can't get the UID easily.
        // We rely on the fact that it was created correctly on the very first run.
        // This logic is simplified to prevent race conditions or duplicate doc creations.
      } else {
        // Log other unexpected errors during initial setup.
        console.error(`Error ensuring initial user ${username}:`, error);
      }
    }
  };

  const adminUserData = {
    name: 'Administrador',
    username: 'admin',
    role: 'admin' as const,
    permissions: ['dashboard', 'inventory', 'loans', 'reports', 'settings'],
  };

  const educacionUserData = {
    name: 'Centro educativo',
    username: 'educacion',
    role: 'user' as const,
    permissions: ['dashboard', 'inventory', 'loans'],
  };

  // Create both users. The function is designed to be safe to call multiple times.
  await ensureUserExists('admin', 'password123', adminUserData);
  await ensureUserExists('educacion', '123456', educacionUserData);
}


export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!auth || !firestore) {
        setError('Los servicios de Firebase no están disponibles. Inténtalo de nuevo más tarde.');
        setIsLoading(false);
        return;
    }

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const email = `${username}@${DUMMY_DOMAIN}`;

    try {
      // First, silently ensure the initial users exist.
      // This is now safe to run on every login attempt.
      await createInitialUsers(auth, firestore);
      
      // After ensuring users exist, attempt to sign in.
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');

    } catch (e) {
        let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        if (e instanceof FirebaseError) {
          switch (e.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
              errorMessage = 'Usuario o contraseña incorrectos.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'El formato del nombre de usuario no es válido.';
              break;
            default:
              errorMessage = 'Error de autenticación. Por favor, revisa tus credenciales.';
              break;
          }
        }
        setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <Boxes className="size-8 text-primary" />
          <h1 className="text-2xl font-semibold">D.E.C.D</h1>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Introduce tu nombre de usuario y contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Error de Acceso</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  required
                  defaultValue="admin"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="password123"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Accediendo...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Usuarios de prueba: <strong>admin</strong> (pass: password123) y <strong>educacion</strong> (pass: 123456).
        </p>
      </div>
    </main>
  );
}
