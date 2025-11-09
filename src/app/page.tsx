
'use server';

import { Suspense } from 'react';
import HomeClient from './home-client';
import { Loader2 } from 'lucide-react';
import { ensureInitialUsers } from '@/actions/users';

export default async function HomePage() {
  
  // Garantiza que los usuarios iniciales existan en el backend
  await ensureInitialUsers();

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
