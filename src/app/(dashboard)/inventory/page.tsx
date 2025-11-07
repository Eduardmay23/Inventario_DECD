
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
  const [hasSeedingBeenAttempted, setHasSeedingBeenAttempted] = useState(false);

  const productsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsRef);
  
  useEffect(() => {
    if (!isLoading && products?.length === 0 && !hasSeedingBeenAttempted) {
        setHasSeedingBeenAttempted(true);
        startSeedingTransition(async () => {
            toast({
                title: "Base de Datos Vacía",
                description: "Migrando productos iniciales a la base de datos...",
            });
            const result = await seedProducts();
            if (result.success && (result.count ?? 0) > 0) {
                toast({
                    title: "Migración Completa",
                    description: `${result.count} productos han sido añadidos. Los datos aparecerán en breve.`,
                });
            } else if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error en Migración",
                    description: result.error,
                });
            } else if (result.count === 0) {
                 toast({
                    title: "Base de Datos ya Poblada",
                    description: "No se encontraron nuevos productos para migrar o el archivo está vacío.",
                });
            }
        });
    }
  }, [products, isLoading, hasSeedingBeenAttempted, toast]);

  if (isLoading || isSeeding) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Inventario" />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{isSeeding ? 'Migrando datos iniciales...' : 'Cargando inventario...'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
        <AppHeader
            title="Inventario"
            search={{
            value: "",
            onChange: () => {},
            placeholder: "Buscar por nombre, ID, categoría...",
            }}
        >
        </AppHeader>
        <InventoryClient data={products || []} />
    </div>
  );
}
