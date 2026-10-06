'use client';

import { useState } from 'react';
import Image from 'next/image';
import { imageUrl, type ProductImage } from '@/lib/api';

export default function ProductGallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const primaryIndex = Math.max(0, images.findIndex((i) => i.isPrimary));
  const [selected, setSelected] = useState(primaryIndex);
  const current = images[selected];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        {current ? (
          <Image src={imageUrl(current.url)} alt={alt} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">📷</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100 ring-2 transition ${
                idx === selected ? 'ring-brand-500' : 'ring-transparent hover:ring-gray-300'
              }`}
            >
              <Image src={imageUrl(img.url)} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
