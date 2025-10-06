'use client'
import InventoryClient from "@/components/inventory/inventory-client";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function InventoryPage() {
    const { firestore, isUserLoading } = useFirebase();

    const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: inventoryData, isLoading } = useCollection(productsQuery);

    if (isLoading || isUserLoading) {
        return <div>Cargando...</div>
    }

  return (
    <div className="flex flex-1 flex-col">
        <InventoryClient data={inventoryData || []} />
    </div>
  );
}
