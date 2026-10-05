import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (setId: string) => void;
  removeItem: (setId: string) => void;
  changeQuantity: (setId: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (setId) =>
        set((state) => {
          const existing = state.items.find((item) => item.setId === setId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.setId === setId ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }
          return { items: [...state.items, { setId, quantity: 1 }] };
        }),
      removeItem: (setId) =>
        set((state) => ({ items: state.items.filter((item) => item.setId !== setId) })),
      changeQuantity: (setId, delta) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.setId === setId ? { ...item, quantity: item.quantity + delta } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "sensory-book-club-cart" },
  ),
);

export const selectCartCount = (state: CartState): number =>
  state.items.reduce((total, item) => total + item.quantity, 0);
