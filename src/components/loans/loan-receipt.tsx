
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Boxes } from "lucide-react";

import type { Loan } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface LoanReceiptProps {
  loan: Loan;
}

export const LoanReceipt = ({ loan }: LoanReceiptProps) => {

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return "Fecha no especificada";
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const dateObject = new Date(Date.UTC(year, month - 1, day));
      if (isNaN(dateObject.getTime())) return "Fecha inválida";
      return format(dateObject, "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const loanDate = getFormattedDate(loan.loanDate);

  return (
    <div className="bg-white text-black p-8 rounded-lg max-w-2xl mx-auto font-sans">
      <header className="flex justify-between items-center pb-4 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Boxes className="size-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">StockWise</h1>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Comprobante de Préstamo</h2>
          <p className="text-sm text-gray-500">Folio: {loan.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-8 my-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">PRODUCTO PRESTADO</h3>
          <p className="text-lg font-bold">{loan.productName}</p>
          <p className="text-gray-600">ID del producto: {loan.productId}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-700 mb-2">CANTIDAD</h3>
          <p className="text-2xl font-bold">{loan.quantity}</p>
          <p className="text-gray-600">unidad(es)</p>
        </div>
      </main>

      <Separator />

      <section className="my-8">
        <h3 className="font-semibold text-gray-700 mb-2">DETALLES DEL PRÉSTAMO</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-600">Solicitante:</div>
          <div className="font-medium text-right">{loan.requester}</div>

          <div className="text-gray-600">Fecha de Préstamo:</div>
          <div className="font-medium text-right">{loanDate}</div>
        </div>
      </section>

      <Separator />

      <footer className="mt-16">
        <div className="grid grid-cols-2 gap-12 text-center">
          <div>
            <div className="border-t border-gray-400 pt-2 mt-2">
              <p className="text-sm font-semibold">Firma de Entrega</p>
              <p className="text-xs text-gray-500">(Personal de Almacén)</p>
            </div>
          </div>
          <div>
            <div className="border-t border-gray-400 pt-2 mt-2">
              <p className="text-sm font-semibold">Firma de Recibido</p>
              <p className="text-xs text-gray-500">(Solicitante)</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          Este comprobante es un registro del préstamo. El solicitante se compromete a devolver el material en las mismas condiciones en que fue recibido.
        </p>
      </footer>
    </div>
  );
};
