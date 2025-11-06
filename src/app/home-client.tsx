'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function HomeClient() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Si la carga inicial del usuario ha terminado...
    if (!isUserLoading) {
      // Si hay un usuario, lo redirigimos al panel principal.
      if (user) {
        router.replace('/dashboard');
      } else {
        // Si no hay usuario, lo enviamos a la página de inicio de sesión.
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Mientras se determina el estado de autenticación, mostramos un indicador de carga.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
