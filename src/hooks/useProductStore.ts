import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/data';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: uuidv4() }],
        })),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
    }),
    {
      name: 'product-storage',
    }
  )
);