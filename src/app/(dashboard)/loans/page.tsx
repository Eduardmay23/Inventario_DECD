'use client'
import LoansClient from "@/components/loans/loans-client";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function LoansPage() {
    const { firestore, isUserLoading } = useFirebase();

    const loansQuery = useMemoFirebase(() => firestore ? collection(firestore, 'loans') : null, [firestore]);
    const { data: loansData, isLoading: loansLoading } = useCollection(loansQuery);

    const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: productsData, isLoading: productsLoading } = useCollection(productsQuery);


  if (loansLoading || productsLoading || isUserLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="flex flex-1 flex-col">
        <LoansClient loans={loansData || []} products={productsData || []} />
    </div>
  );
}
