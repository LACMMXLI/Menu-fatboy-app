import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, CustomerDetails } from '@/lib/types';

interface CartState {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'cash' | 'card';
  address: string;
  reference: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      customerPhone: '',
      deliveryMethod: 'pickup',
      paymentMethod: 'cash',
      address: '',
      reference: '',
      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);
        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === productId);
        if (existingItem && existingItem.quantity > 1) {
          const updatedItems = items.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
          set({ items: updatedItems });
        } else {
          set({ items: items.filter((item) => item.id !== productId) });
        }
      },
      clearCart: () => set({ items: [], customerName: '', customerPhone: '', deliveryMethod: 'pickup', paymentMethod: 'cash', address: '', reference: '' }),
      setCustomerDetails: (details) => set((state) => ({ ...state, ...details })),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      subtotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);