import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = [...get().items];
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          items.push({ ...item, quantity: 1 });
        }
        set({ items, total: calculateTotal(items) });
      },
      removeItem: (itemId) => {
        const items = get().items.filter((i) => i.id !== itemId);
        set({ items, total: calculateTotal(items) });
      },
      updateQuantity: (itemId, delta) => {
        const items = get().items.map((i) => {
          if (i.id === itemId) {
            const newQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQty };
          }
          return i;
        });
        set({ items, total: calculateTotal(items) });
      },
      clearCart: () => set({ items: [], total: 0 }),
      total: 0,
    }),
    { name: 'foodpilot-cart' }
  )
);

function calculateTotal(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
}
