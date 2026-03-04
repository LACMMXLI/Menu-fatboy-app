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
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  categoryId: z.string().min(1, 'La categoría es requerida.'),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  order: z.coerce.number().min(0, 'El orden debe ser al menos 0.'),
  isPromotion: z.boolean().default(false),
  imageUrl: z.string().url('Ingresa una URL de imagen válida.').or(z.literal('')).optional(),
});

interface AdminProductDialogProps {
  children: React.ReactNode;
  product?: Product;
  isPromotionDefault?: boolean;
}

export function AdminProductDialog({ children, product, isPromotionDefault }: AdminProductDialogProps) {
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
      shortDescription: product?.shortDescription || '',
      order: product?.order || 999,
      isPromotion: product?.isPromotion ?? isPromotionDefault ?? false,
      imageUrl: product?.imageUrl || '',
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
        shortDescription: product?.shortDescription || '',
        order: product?.order || 999,
        isPromotion: product?.isPromotion ?? isPromotionDefault ?? false,
        imageUrl: product?.imageUrl || '',
      });
    }
  }, [isOpen, product, form, isPromotionDefault]);

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
      <DialogContent className="max-w-md bg-[#111] border-white/10 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase text-primary">
            {product ? 'Editar' : 'Nueva'} {form.watch('isPromotion') ? 'Promoción' : 'Producto'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel className="text-xs font-bold uppercase text-muted-foreground">Nombre</FormLabel><FormControl><Input className="bg-black/40 border-white/10" placeholder="Nombre de la promo o producto" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-bold uppercase text-muted-foreground">Precio</FormLabel><FormControl><Input type="number" step="0.01" className="bg-black/40 border-white/10" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField name="order" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-bold uppercase text-muted-foreground">Orden</FormLabel><FormControl><Input type="number" className="bg-black/40 border-white/10" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField name="imageUrl" control={form.control} render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-bold uppercase text-muted-foreground">URL de la Imagen (Opcional)</FormLabel><FormControl><Input className="bg-black/40 border-white/10" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {!form.watch('isPromotion') && (
              <FormField name="categoryId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-black/40 border-white/10"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-[#111] border-white/10">
                      {categories?.map(c => <SelectItem key={c.id} value={c.id} className="focus:bg-primary focus:text-black">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-black/40 border-white/10"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="active" className="focus:bg-primary focus:text-black">Activo</SelectItem>
                      <SelectItem value="inactive" className="focus:bg-primary focus:text-black">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="isPromotion" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col justify-center gap-2">
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">¿Es Promoción?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={field.value} 
                        onChange={field.onChange}
                        className="h-5 w-5 rounded border-white/10 bg-black/40 accent-primary"
                      />
                      <span className="text-sm">{field.value ? 'Sí' : 'No'}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="shortDescription" control={form.control} render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-bold uppercase text-muted-foreground">Subtítulo (Opcional)</FormLabel><FormControl><Input className="bg-black/40 border-white/10" placeholder="Ej: Pizza Familiar + Refresco" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-bold uppercase text-muted-foreground">Descripción detallada (Opcional)</FormLabel><FormControl><Textarea className="bg-black/40 border-white/10 min-h-[80px]" placeholder="Detalles de la promo o ingredientes..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Button type="submit" className="btn-modern w-full py-6 text-xl text-black rounded-xl font-black italic uppercase shadow-xl hover:shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
              {product ? 'Actualizar' : 'Crear'} {form.watch('isPromotion') ? 'Promoción' : 'Producto'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}