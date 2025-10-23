import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Category } from '@/lib/types';
import { showSuccess, showError } from '@/utils/toast';

// --- Fetch Logic ---
const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, order, status')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  
  return data.map(c => ({
    ...c,
    id: String(c.id),
    order: Number(c.order),
    status: c.status as Category['status'],
  })) as Category[];
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

// --- Mutation Logic ---

// Add Category
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: category.name, order: category.order, status: category.status }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoría creada exitosamente.');
    },
    onError: (error) => {
      showError(`Error al crear categoría: ${error.message}`);
    },
  });
};

// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: Category) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: category.name, order: category.order, status: category.status })
        .eq('id', category.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoría actualizada exitosamente.');
    },
    onError: (error) => {
      showError(`Error al actualizar categoría: ${error.message}`);
    },
  });
};

// Delete Category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoría eliminada exitosamente.');
    },
    onError: (error) => {
      showError(`Error al eliminar categoría: ${error.message}`);
    },
  });
};