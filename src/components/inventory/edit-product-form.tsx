
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";

// The ID is not part of the edit form schema, it's not editable.
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  category: z.string().min(2, {
    message: "La categoría debe tener al menos 2 caracteres.",
  }),
  location: z.string().min(2, {
    message: "La ubicación debe tener al menos 2 caracteres.",
  }),
  quantity: z.coerce.number().int().min(0, {
    message: "La cantidad no puede ser negativa.",
  }),
  reorderPoint: z.coerce.number().int().min(0, {
    message: "El punto de reorden no puede ser negativo.",
  }),
});

type EditProductFormProps = {
  onSubmit: (data: Partial<Omit<Product, 'id'>>) => void;
  product: Product | null;
  isPending: boolean;
};

export function EditProductForm({ onSubmit, product, isPending }: EditProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product ? {
        name: product.name,
        category: product.category,
        location: product.location,
        quantity: product.quantity,
        reorderPoint: product.reorderPoint
    } : {
      name: "",
      category: "",
      location: "",
      quantity: 0,
      reorderPoint: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormItem>
            <FormLabel>ID del Producto</FormLabel>
            <FormControl>
                <Input value={product?.id || ''} disabled />
            </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Lámpara de Techo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Iluminación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Almacén A, Estante 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="reorderPoint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Punto de Reorden</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>
    </Form>
  );
}
