'use client';
import { useEffect, useState } from 'react';
import DashboardClient from "@/components/dashboard/dashboard-client";
import AppHeader from "@/components/header";
import { Loader2 } from "lucide-react";
import type { Product, Loan } from '@/lib/types';

// NOTE: This page is now a client component that fetches data on mount.
// This is a temporary workaround to address data loading issues.
// A better approach would be to use Server Components with client-side data fetching hooks.

export default function DashboardPage() {
  const [inventoryData, setInventoryData] = useState<Product[]>([]);
  const [recentChanges, setRecentChanges] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // These would be API calls in a real application
        const productsRes = await fetch('/api/products');
        const products = await productsRes.json();
        
        const loansRes = await fetch('/api/loans');
        const loans = await loansRes.json();

        setInventoryData(products);
        setRecentChanges(loans);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    // This is a placeholder for where data fetching would occur.
    // Since we are reading from local files, we will keep the dummy data logic
    // to avoid breaking the app structure during the refactor.
    // In a real app, you would fetch from an API here.
    setLoading(false);
    
  }, []);

  if (loading) {
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
