
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { seedProducts } from '@/app/actions';

import InventoryClient from "@/components/inventory/inventory-client";
import AppHeader from '@/components/header';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, startSeedingTransition] = useTransition();

  const productsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsRef);
  
  useEffect(() => {
    // Only run this logic once when the data has been loaded and is empty.
    if (!isLoading && products && products.length === 0 && !isSeeding) {
        startSeedingTransition(async () => {
            toast({
                title: "Base de Datos Vacía",
                description: "Migrando productos iniciales a la base de datos...",
            });
            const result = await seedProducts();
            if (result.success) {
                toast({
                    title: "Migración Completa",
                    description: `${result.count} productos han sido añadidos a la base de datos.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error en Migración",
                    description: result.error || "No se pudieron migrar los productos iniciales.",
                });
            }
        });
    }
  }, [products, isLoading, isSeeding, toast]);

  if (isLoading || isSeeding) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Inventario" />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{isSeeding ? 'Migrando datos...' : 'Cargando inventario...'}</p>
          </div>
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
