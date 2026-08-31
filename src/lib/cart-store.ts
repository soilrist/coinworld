"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "damifarm-cart" }
  )
);

export function cartTotals(items: CartItem[]) {
  const itemsAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingAmount = items.length === 0 ? 0 : items.some((i) => i.shippingFee === 0) ? 0 : Math.max(...items.map((i) => i.shippingFee));
  const freeShippingThreshold = 30000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - itemsAmount);
  return {
    itemsAmount,
    shippingAmount,
    totalAmount: itemsAmount + shippingAmount,
    remainingForFreeShipping,
    freeShippingThreshold,
  };
}
