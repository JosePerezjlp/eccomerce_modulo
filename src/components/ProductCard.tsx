import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api';
import { imageUrl } from '@/lib/api';

function money(v: string | number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v));
}

export default function ProductCard({ product }: { product: Product }) {
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-gray-100">
        {primary ? (
          <Image
            src={imageUrl(primary.url)}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">📷</div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-2 py-1 text-xs font-bold text-white">
            Sin stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          {product.brand} · {product.model}
        </span>
        <h3 className="line-clamp-2 font-semibold text-gray-900">{product.name}</h3>
        <div className="mt-auto pt-2 text-lg font-extrabold text-gray-900">{money(product.price)}</div>
      </div>
    </Link>
  );
}
