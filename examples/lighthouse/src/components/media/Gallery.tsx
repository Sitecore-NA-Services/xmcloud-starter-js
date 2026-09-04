'use client';

import { JSX, useState } from 'react';
import { ImageField, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type GalleryItem = {
  id: string;
  fields: {
    Image: ImageField;
    Caption?: { value: string };
  };
};

type GalleryProps = ComponentProps & {
  fields?: {
    items?: GalleryItem[];
  };
};

const Gallery = ({ fields, params }: GalleryProps): JSX.Element => {
  const [active, setActive] = useState<number | null>(null);
  const items = fields?.items || [];
  if (!items.length) return <></>;

  return (
    <div className={['gallery', params?.styles].filter(Boolean).join(' ')}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            className="overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          >
            <Image field={item.fields.Image} className="h-32 w-full object-cover hover:opacity-90 transition-opacity" />
          </button>
        ))}
      </div>
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <div className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image field={items[active].fields.Image} className="max-h-[80vh] rounded object-contain" />
            {items[active].fields.Caption?.value && (
              <p className="mt-2 text-center text-sm text-gray-300">{items[active].fields.Caption?.value}</p>
            )}
          </div>
          <button onClick={() => setActive(null)} className="absolute right-4 top-4 text-white text-2xl">✕</button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
