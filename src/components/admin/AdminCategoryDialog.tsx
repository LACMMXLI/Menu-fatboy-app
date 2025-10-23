import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddCategory, useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  order: z.coerce.number().min(1, 'El orden debe ser al menos 1.'),
  status: z.enum(['active', 'inactive']),
});

interface AdminCategoryDialogProps {
  children: React.ReactNode;
  category?: Category;
}

export function AdminCategoryDialog({ children, category }: AdminCategoryDialogProps) {
  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      order: category?.order || 1,
      status: category?.status || 'active',
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: category?.name || '',
        order: category?.order || 1,
        status: category?.status || 'active',
      });
    }
  }, [isOpen, category, form]);

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    if (category) {
      updateMutation.mutate({ ...category, ...values });
    } else {
      addMutation.mutate(values as Omit<Category, 'id'>);
    }
    setIsOpen(false);
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="inactive">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {category ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}