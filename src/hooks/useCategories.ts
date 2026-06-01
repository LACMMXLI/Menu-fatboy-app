import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@/lib/types';
import { showSuccess, showError } from '@/utils/toast';

// --- Fetch Logic ---
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  
  return data.map((c: any) => ({
    ...c,
    id: String(c.id),
    order: Number(c.order),
    status: c.status,
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
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
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
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
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete category');
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