
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  deliveredBy: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  receivedBy: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
});

type PrintConfirmationFormProps = {
  onSubmit: (data: { deliveredBy: string; receivedBy: string }) => void;
  onCancel: () => void;
};

export function PrintConfirmationForm({ onSubmit, onCancel }: PrintConfirmationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveredBy: "",
      receivedBy: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="deliveredBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de quien ENTREGA</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receivedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de quien RECIBE</FormLabel>
              <FormControl>
                <Input placeholder="Ej: María López" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Continuar para Imprimir</Button>
        </div>
      </form>
    </Form>
  );
}
