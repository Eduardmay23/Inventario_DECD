"use client";

import { useState, useTransition } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { AlertTriangle, Bot, Loader2, Package, Warehouse } from "lucide-react";

import type { Product, StockLog } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateStockLevelSummary } from "@/ai/flows/generate-stock-level-summary";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";

type DashboardClientProps = {
  inventoryData: Product[];
  recentChanges: StockLog[];
};

const chartConfig = {
  quantity: {
    label: "Cantidad",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function DashboardClient({
  inventoryData,
  recentChanges,
}: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const totalProducts = inventoryData.length;
  const totalStock = inventoryData.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = inventoryData.filter(
    (p) => p.quantity <= p.reorderPoint
  );

  const handleGenerateSummary = () => {
    startTransition(async () => {
      try {
        const result = await generateStockLevelSummary({
          inventoryData: JSON.stringify(inventoryData),
          recentChangesLog: JSON.stringify(recentChanges),
        });
        setSummary(result.summary);
      } catch (error) {
        console.error("No se pudo generar el resumen:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo generar el resumen de IA. Por favor, inténtalo de nuevo.",
        });
      }
    });
  };

  const chartData = inventoryData.map(p => ({ name: p.name, quantity: p.quantity }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos Totales</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Artículos únicos en inventario</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
          <Warehouse className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Unidades totales de todos los productos</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems.length}</div>
          <p className="text-xs text-muted-foreground">Artículos que necesitan ser reordenados</p>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>Resumen con IA</CardTitle>
          </div>
          <CardDescription>
            Obtén un análisis automatizado del estado de tu inventario y actividades recientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{summary}</p>
              <Button variant="outline" size="sm" onClick={() => setSummary("")}>
                Generar Nuevo Resumen
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed bg-muted/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">Haz clic en el botón para generar un análisis de inventario usando IA.</p>
              <Button onClick={handleGenerateSummary} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar Resumen"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Niveles de Inventario</CardTitle>
          <CardDescription>Cantidad de stock actual por producto.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} angle={-45} textAnchor="end" height={80} interval={0} tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}/>
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="quantity" fill="var(--color-quantity)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Artículos con Stock Bajo</CardTitle>
          <CardDescription>Estos productos están en su punto de reorden o por debajo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.length > 0 ? lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right text-destructive font-bold">{item.quantity}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    Todos los niveles de stock están bien.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
