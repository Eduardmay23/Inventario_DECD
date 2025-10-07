'use client';

import * as React from 'react';
import type { Loan } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

export function LoanReceipt({ loan }: { loan: Loan }) {
  
  return (
    <div 
      id="printable-receipt" 
      className="receipt-container font-sans text-foreground p-6 rounded-lg"
    >
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-300">
        <div className="flex items-center justify-start">
          <Image src="https://escarcega.gob.mx/escarcega.png" alt="Escudo de Escárcega" width={120} height={120} data-ai-hint="logo government" />
        </div>
        <div className="text-center text-sm font-semibold px-2">
          <p>HONORABLE AYUNTAMIENTO</p>
          <p>DE ESCÁRCEGA</p>
          <p>2024-2027</p>
        </div>
        <div className="flex items-center justify-end">
          <Image src="https://tse1.mm.bing.net/th/id/OIP.W6OOgA_8g2-y3CIw54Uk6gHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Logo Gobierno de Escárcega" width={150} height={84} data-ai-hint="logo city" />
        </div>
      </header>

      <main className="pt-12">
        <h2 className="text-center text-xl font-bold mb-12">Comprobante de Préstamo de Material</h2>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-32">
          <div>
            <p className="font-bold">Producto Prestado:</p>
            <p>{loan.productName}</p>
          </div>
          <div>
            <p className="font-bold">Solicitado Por:</p>
            <p>{loan.requester}</p>
          </div>
          <div>
            <p className="font-bold">Fecha de Salida:</p>
            <p>{format(new Date(loan.loanDate), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-8 pt-12">
          <div className="text-center">
            <div className="border-t border-gray-400 w-3/4 mx-auto mb-2">&nbsp;</div>
            <p className="text-sm font-semibold">Entregado por</p>
            <p className="text-xs text-gray-500 mt-2">Nombre de quien entrega</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-3/4 mx-auto mb-2">&nbsp;</div>
            <p className="text-sm font-semibold">Recibido por</p>
            <p className="text-xs text-gray-500 mt-2">Nombre de quien recibe</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
