'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/api';
import { useCartStore } from '@/store/cart';

export default function AddToCartBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push('/carrito');
  }

  if (outOfStock) {
    return (
      <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-500">
        Sin stock disponible por el momento
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-600">Cantidad</label>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
          className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <span className="text-xs text-gray-500">{product.stock} disponibles</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className="flex-1 rounded-lg border border-brand-500 px-5 py-3 text-sm font-bold text-brand-500 hover:bg-brand-50"
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
