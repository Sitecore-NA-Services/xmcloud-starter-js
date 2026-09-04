'use client';

import { JSX, useState } from 'react';
import { Field, ImageField, LinkField, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type FooterCarouselSlide = {
  id: string;
  fields: {
    Title: Field<string>;
    Image?: ImageField;
    Link?: LinkField;
  };
};

type FooterCarouselProps = ComponentProps & {
  fields?: {
    items?: FooterCarouselSlide[];
  };
};

const FooterCarousel = ({ fields, params }: FooterCarouselProps): JSX.Element => {
  const items = fields?.items || [];
  const [current, setCurrent] = useState(0);

  if (!items.length) return <></>;

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  return (
    <div className={['footer-carousel w-full overflow-hidden relative', params?.styles].filter(Boolean).join(' ')} style={{ height: '340px' }}>
      {/* Slide track */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((slide, i) => {
          const href = slide.fields.Link?.value?.href || '#';
          const titleLines = (slide.fields.Title?.value || '').split('\n');
          const mainTitle = titleLines[0] || '';
          const subTitle = titleLines[1] || '';

          return (
            <div
              key={slide.id || i}
              className="flex-shrink-0 w-full h-full relative overflow-hidden bg-[#1a1a1a]"
            >
              {slide.fields.Image?.value?.src && (
                <Image field={slide.fields.Image} className="w-full h-full object-cover" />
              )}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Centered content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
                {mainTitle && (
                  <div className="text-3xl font-bold leading-tight drop-shadow">{mainTitle}</div>
                )}
                {subTitle && (
                  <div className="text-lg font-normal mt-1 drop-shadow">{subTitle}</div>
                )}
                <a
                  href={href}
                  className="mt-4 inline-block border border-white px-6 py-1.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
                >
                  See More
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-[#cccccc] transition-colors z-10"
      >
        &#8249;
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-[#cccccc] transition-colors z-10"
      >
        &#8250;
      </button>
    </div>
  );
};

export default FooterCarousel;
