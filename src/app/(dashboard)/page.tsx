'use client';

import { useCollection, firestore, useMemoFirebase } from "@/firebase";
import DashboardClient from "@/components/dashboard/dashboard-client";
import AppHeader from "@/components/header";
import { collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), []);
  const { data: inventoryData, isLoading: productsLoading } = useCollection(productsQuery);

  const loansQuery = useMemoFirebase(() => collection(firestore, 'loans'), []);
  const { data: recentChanges, isLoading: loansLoading } = useCollection(loansQuery);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoadingUser(!user);
    });
    return () => unsubscribe();
  }, []);


  if (productsLoading || loansLoading || isLoadingUser) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Panel" />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Panel" />
      <main className="flex-1 p-4 md:p-6 print-hide">
        <DashboardClient
          inventoryData={inventoryData || []}
          recentChanges={recentChanges || []}
        />
      </main>
    </div>
  );
}
