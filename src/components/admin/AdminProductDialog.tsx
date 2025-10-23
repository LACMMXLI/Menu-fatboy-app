import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductStore } from '@/hooks/useProductStore';
import { useCategoryStore } from '@/hooks/useCategoryStore';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { showSuccess } from '@/utils/toast';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  price: z.coerce.number().positive('El precio debe ser positivo.'),
  categoryId: z.string().min(1, 'La categoría es requerida.'),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
});

interface AdminProductDialogProps {
  children: React.ReactNode;
  product?: Product;
}

export function AdminProductDialog({ children, product }: AdminProductDialogProps) {
  const { addProduct, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      categoryId: product?.categoryId || '',
      status: product?.status || 'active',
      description: product?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (product) {
      updateProduct({ ...product, ...values });
      showSuccess('Producto actualizado');
    } else {
      // The `values` object is validated by Zod, so we can safely assert its type.
      addProduct(values as Omit<Product, 'id'>);
      showSuccess('Producto creado');
    }
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Editar' : 'Nuevo'} Producto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Precio</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="categoryId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="status" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Descripción (opcional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full">{product ? 'Guardar Cambios' : 'Crear'}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}