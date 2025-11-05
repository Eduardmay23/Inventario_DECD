'use client'
import LoansClient from "@/components/loans/loans-client";
import { useCollection, firestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function LoansPage() {
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const loansQuery = useMemoFirebase(() => collection(firestore, 'loans'), []);
    const { data: loansData, isLoading: loansLoading } = useCollection(loansQuery);

    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), []);
    const { data: productsData, isLoading: productsLoading } = useCollection(productsQuery);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoadingUser(!user);
        });
        return () => unsubscribe();
    }, []);


  if (loansLoading || productsLoading || isLoadingUser) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
        <LoansClient loans={loansData || []} products={productsData || []} />
    </div>
  );
}
