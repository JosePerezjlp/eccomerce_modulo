'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const count = useCartStore((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold text-gray-900">
          📱 Módulos<span className="text-brand-500">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Catálogo
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-2 hover:text-gray-900">
            🛒 Carrito
            {mounted && count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
