'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { imageUrl } from '@/lib/api';

function money(v: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);
}

export default function CartPage() {
  const { items, removeItem, setQuantity, total } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
        <p className="text-lg font-semibold text-gray-700">Tu carrito está vacío</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-brand-500 px-5 py-2 text-sm font-bold text-white">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.imageUrl ? (
                <Image src={imageUrl(item.imageUrl)} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">📷</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{money(item.price)} c/u</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.maxStock}
              value={item.quantity}
              onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
              className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm"
            />
            <div className="w-24 text-right font-bold">{money(item.price * item.quantity)}</div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm font-semibold text-red-500 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-bold text-gray-900">Resumen</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{money(total())}</span>
        </div>
        <div className="my-4 border-t border-gray-200" />
        <div className="flex justify-between text-lg font-extrabold">
          <span>Total</span>
          <span>{money(total())}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block rounded-lg bg-brand-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-brand-600"
        >
          Continuar con la compra
        </Link>
      </aside>
    </div>
  );
}
