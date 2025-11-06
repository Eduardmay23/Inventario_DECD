
'use client';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

import AppHeader from '@/components/header';
import type { User } from '@/lib/types';
import SettingsClient from '@/components/users/settings-client';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const firestore = useFirestore();
  const usersRef = collection(firestore, 'users');
  const { data: users, isLoading } = useCollection<User>(usersRef);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Configuración" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return <SettingsClient initialUsers={users || []} />;
}
