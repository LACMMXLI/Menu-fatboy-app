import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/lib/types';
import { showSuccess, showError } from '@/utils/toast';

// --- Fetch Logic ---
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, category_id, status, description');

  if (error) throw new Error(error.message);
  
  return data.map(p => ({
    id: String(p.id),
    name: p.name,
    price: Number(p.price),
    categoryId: String(p.category_id),
    status: p.status as Product['status'],
    description: p.description || undefined,
  })) as Product[];
};

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

// --- Mutation Logic ---

// Add Product
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name: product.name, 
          price: product.price, 
          category_id: product.categoryId, 
          status: product.status, 
          description: product.description 
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Producto creado exitosamente.');
    },
    onError: (error) => {
      showError(`Error al crear producto: ${error.message}`);
    },
  });
};

// Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          name: product.name, 
          price: product.price, 
          category_id: product.categoryId, 
          status: product.status, 
          description: product.description 
        })
        .eq('id', product.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Producto actualizado exitosamente.');
    },
    onError: (error) => {
      showError(`Error al actualizar producto: ${error.message}`);
    },
  });
};

// Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Producto eliminado exitosamente.');
    },
    onError: (error) => {
      showError(`Error al eliminar producto: ${error.message}`);
    },
  });
};