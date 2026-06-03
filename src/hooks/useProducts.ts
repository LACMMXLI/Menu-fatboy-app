import { API_URL } from '@/lib/config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@/lib/types';
import { showSuccess, showError } from '@/utils/toast';

// --- Fetch Logic ---
const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    categoryId: p.categoryId,
    status: p.status,
    description: p.description,
    shortDescription: p.shortDescription,
    order: p.order,
    isPromotion: p.isPromotion,
    imageUrl: p.imageUrl,
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
      const response = await fetch(`${API_URL}/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
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
      const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
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
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
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