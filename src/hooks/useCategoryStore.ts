import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '@/lib/types';
import { categories as initialCategories } from '@/lib/data';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: initialCategories,
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: uuidv4() }],
        })),
      updateCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === updatedCategory.id ? updatedCategory : c
          ),
        })),
      deleteCategory: (categoryId) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
        })),
    }),
    {
      name: 'category-storage',
    }
  )
);