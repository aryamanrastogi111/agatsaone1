// ============================================================
// CART STORE — using Zustand (already in your dependencies)
// Add this file to your repo at: src/hooks/useCart.ts
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/shop";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find((i) => i.variant_id === newItem.variant_id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variant_id === newItem.variant_id
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, newItem], isOpen: true });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variant_id !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variant_id === variantId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "agatsa-cart",
      partialize: (state) => ({ items: state.items }), // only persist items, not isOpen
    }
  )
);
