
import { Suspense } from 'react';
import HomeClient from './home-client';
import { Loader2 } from 'lucide-react';

export default function HomePage() {

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
