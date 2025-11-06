
import { Suspense } from 'react';
import HomeClient from './home-client';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  return (
    // Usamos Suspense para mostrar un loader mientras el componente de cliente se carga.
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
