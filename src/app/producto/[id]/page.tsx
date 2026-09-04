import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct, imageUrl } from '@/lib/api';
import AddToCartBox from '@/components/AddToCartBox';

function money(v: string | number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id).catch(() => null);
  if (!product) return notFound();

  const images = product.images.length ? product.images : [];
  const primary = images.find((i) => i.isPrimary) ?? images[0];

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {primary ? (
            <Image src={imageUrl(primary.url)} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">📷</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                <Image src={imageUrl(img.url)} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          {product.brand} · {product.model}
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">{product.name}</h1>
        <div className="mt-3 text-3xl font-extrabold text-gray-900">{money(product.price)}</div>

        {product.description && <p className="mt-4 text-gray-600">{product.description}</p>}

        <div className="mt-6">
          <AddToCartBox product={product} />
        </div>

        {product.characteristics && Object.keys(product.characteristics).length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 font-bold text-gray-900">Características</h2>
            <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {Object.entries(product.characteristics).map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-2 text-sm">
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
