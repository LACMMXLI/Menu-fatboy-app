import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
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

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: product?.name || '',
        price: product?.price || 0,
        categoryId: product?.categoryId || '',
        status: product?.status || 'active',
        description: product?.description || '',
      });
    }
  }, [isOpen, product, form]);

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (product) {
      updateMutation.mutate({ ...product, ...values });
    } else {
      addMutation.mutate(values as Omit<Product, 'id'>);
    }
    setIsOpen(false);
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  if (isLoadingCategories) {
    return <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...</Button>;
  }

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
                    {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {product ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}