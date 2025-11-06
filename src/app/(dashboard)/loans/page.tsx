'use client'
import LoansClient from "@/components/loans/loans-client";
import { Loader2 } from "lucide-react";
import type { Loan, Product } from '@/lib/types';
import { useState, useEffect } from 'react';

// NOTE: Converted to a client component to fetch data dynamically.
// This is to address issues with static data loading.

async function getLoans(): Promise<Loan[]> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'loans.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data).loans || [];
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
        console.error("Error reading loans", e);
        return [];
    }
}

async function getProducts(): Promise<Product[]> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'products.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data).products || [];
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
        console.error("Error reading products", e);
        return [];
    }
}


export default function LoansPage() {
    const [loansData, setLoansData] = useState<Loan[]>([]);
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Data fetching logic would go here, e.g., in a useEffect hook
    // For now, we'll rely on the client component structure
    // and assume data is passed, though it will be empty initially
    // until real data fetching is wired up.
    useEffect(() => {
        // Placeholder for client-side data fetching
        setLoading(false);
    }, []);


  if (loading) {
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
