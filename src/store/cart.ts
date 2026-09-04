'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/api';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, product.stock);
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: newQty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                imageUrl: primaryImage?.url ?? null,
                quantity: Math.min(quantity, product.stock),
                maxStock: product.stock,
              },
            ],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },
      setQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
              : i,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'modulos-cart' },
  ),
);
