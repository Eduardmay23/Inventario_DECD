
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

import LoansClient from "@/components/loans/loans-client";
import type { Loan, Product } from '@/lib/types';

export default function LoansPage() {
  const firestore = useFirestore();

  const loansRef = useMemoFirebase(() => firestore ? collection(firestore, 'loans') : null, [firestore]);
  const productsRef = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);

  const { data: loans, isLoading: isLoadingLoans } = useCollection<Loan>(loansRef);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsRef);

  if (isLoadingLoans || isLoadingProducts) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="text-muted-foreground mt-2">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
        <LoansClient loans={loans || []} products={products || []} />
    </div>
  );
}
