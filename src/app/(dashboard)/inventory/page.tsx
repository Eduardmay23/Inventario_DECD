
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

import InventoryClient from "@/components/inventory/inventory-client";
import AppHeader from '@/components/header';
import type { Product } from '@/lib/types';

export default function InventoryPage() {
  const firestore = useFirestore();

  const productsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsRef);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Inventario" />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
        <InventoryClient data={products || []} />
    </div>
  );
}
