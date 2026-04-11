import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/lib/razorpay';
import { supabase } from '@/integrations/supabase/client';

const CART_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  lastUpdatedAt: number | null;

  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  _checkExpiry: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      lastUpdatedAt: null,

      _checkExpiry: () => {
        const { lastUpdatedAt, items } = get();
        if (items.length > 0 && lastUpdatedAt && Date.now() - lastUpdatedAt > CART_EXPIRY_MS) {
          set({ items: [], lastUpdatedAt: null });
        }
      },

      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantTitle === item.variantTitle
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantTitle === item.variantTitle
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            lastUpdatedAt: Date.now(),
          });
        } else {
          set({ items: [...items, item], lastUpdatedAt: Date.now() });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
          lastUpdatedAt: Date.now(),
        });
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.productId !== productId);
        set({ items: newItems, lastUpdatedAt: newItems.length > 0 ? Date.now() : null });
      },

      clearCart: () => set({ items: [], lastUpdatedAt: null }),

      setLoading: (isLoading) => set({ isLoading }),

      getTotalItems: () => {
        get()._checkExpiry();
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotalPrice: () => {
        get()._checkExpiry();
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    {
      name: 'agatsa-cart-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
