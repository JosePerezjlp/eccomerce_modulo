'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { createOrder } from '@/lib/api';

function money(v: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);
}

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', customerNote: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0 && !orderPlaced) {
      router.replace('/carrito');
    }
  }, [mounted, items.length, orderPlaced, router]);

  if (!mounted) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const order = await createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        customerNote: form.customerNote || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setOrderPlaced(true);
      clear();
      router.push(`/ticket/${order.id}`);
    } catch (e: any) {
      setError(e.message ?? 'No se pudo generar el pedido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Tus datos</h1>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">Nombre y apellido</label>
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">Teléfono / WhatsApp</label>
          <input
            required
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">Email (opcional)</label>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">Nota (opcional)</label>
          <textarea
            rows={3}
            value={form.customerNote}
            onChange={(e) => setForm({ ...form, customerNote: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="mt-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? 'Generando ticket...' : 'Confirmar pedido y generar ticket'}
        </button>
        <p className="text-xs text-gray-500">
          Al confirmar se generará un ticket con los datos para transferir. Tenés tiempo limitado para pagar
          antes de que se libere el stock reservado.
        </p>
      </form>

      <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-bold text-gray-900">Tu pedido</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>{money(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="my-4 border-t border-gray-200" />
        <div className="flex justify-between text-lg font-extrabold">
          <span>Total</span>
          <span>{money(total())}</span>
        </div>
      </aside>
    </div>
  );
}
