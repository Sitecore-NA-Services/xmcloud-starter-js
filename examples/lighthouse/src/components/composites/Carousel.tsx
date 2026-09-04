'use client';

import { JSX, useEffect, useState } from 'react';
import { Field, ImageField, LinkField, Image, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import SitecoreLink from 'lib/sitecore-link';

type CarouselSlide = {
  id: string;
  fields: {
    Title: Field<string>;
    Text?: Field<string>;
    Image?: ImageField;
    Link?: LinkField;
  };
};

type CarouselProps = ComponentProps & {
  fields?: {
    items?: CarouselSlide[];
  };
  params?: {
    Timeout?: string;       // auto-advance interval in ms; omit or 0 to disable
    Navigation?: string;    // '0' to hide prev/next arrows
    styles?: string;
  };
};

// Static home carousel slides — path-based media URLs (work without security tokens via /-/media/ proxy)
const HOME_CAROUSEL_SLIDES = [
  {
    text: 'Your Health\nYour Way',
    linkHref: '/your-health',
    linkText: 'Your Health',
    imageSrc: '/-/media/Project/Demo-Shared-SXA-Sites/LighthouseLifestyle/Images/Home/Your-Health-Carousel.jpg?h=700&iar=0&w=1800',
    imageAlt: 'Your Health',
  },
  {
    text: 'Take Care of Your Family\nAt Home',
    linkHref: '/at-home',
    linkText: 'At Home',
    imageSrc: '/-/media/Project/Demo-Shared-SXA-Sites/LighthouseLifestyle/Images/Home/At-Home-Carousel.jpg?h=700&iar=0&w=1800',
    imageAlt: 'At Home',
  },
  {
    text: 'Take Care of Yourself\nOn the Go',
    linkHref: '/on-the-go',
    linkText: 'On the Go',
    imageSrc: '/-/media/Project/Demo-Shared-SXA-Sites/LighthouseLifestyle/Images/Home/On-the-Go-Carousel.jpg?h=700&iar=0&w=1800',
    imageAlt: 'On the Go',
  },
];

const SlideContent = ({ text, linkHref, linkText }: { text: string; linkHref: string; linkText: string }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
    <div className="field-slidetext text-4xl md:text-5xl font-bold whitespace-pre-line mb-6 drop-shadow">
      {text}
    </div>
    <div className="field-slidelink">
      <a
        href={linkHref}
        className="inline-block border-2 border-white px-8 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-[#272727] transition-colors"
      >
        {linkText}
      </a>
    </div>
  </div>
);

const StaticCarousel = (): JSX.Element => {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + HOME_CAROUSEL_SLIDES.length) % HOME_CAROUSEL_SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % HOME_CAROUSEL_SLIDES.length);

  // Auto-advance every 3500ms
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % HOME_CAROUSEL_SLIDES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="carousel home-carousel relative overflow-hidden"
      style={{ width: '100vw', height: '700px', backgroundColor: '#111111' }}
    >
      {/* All slides stacked; fade in/out via opacity */}
      {HOME_CAROUSEL_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageSrc}
            alt={slide.imageAlt}
            className="w-full h-full object-cover"
          />
          {/* Uniform dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          <SlideContent text={slide.text} linkHref={slide.linkHref} linkText={slide.linkText} />
        </div>
      ))}

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-gray-300 z-10"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-gray-300 z-10"
      >
        ›
      </button>

      {/* Bullet nav — rectangular bars */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
        {HOME_CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={i === current ? 'h-1 bg-white transition-all' : 'h-1 bg-white/50'}
            style={{ width: i === current ? '48px' : '12px' }}
          />
        ))}
      </div>
    </div>
  );
};

const Carousel = ({ fields, params }: CarouselProps): JSX.Element => {
  const items = fields?.items || [];
  const [current, setCurrent] = useState(0);
  const timeout = parseInt(params?.Timeout || '3500', 10);
  const itemsLength = items.length;

  // Auto-advance — disabled when timeout is 0 or very large (XP default 2147483647 = disabled).
  // Must run before any early return to keep Rules of Hooks happy.
  useEffect(() => {
    if (!itemsLength || !timeout || timeout > 2000000) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % itemsLength), timeout);
    return () => clearInterval(timer);
  }, [itemsLength, timeout]);

  // Use static home carousel when no items from Layout Service
  if (!itemsLength) return <StaticCarousel />;

  const showNavigation = params?.Navigation !== '0';

  const prev = () => setCurrent((c) => (c - 1 + itemsLength) % itemsLength);
  const next = () => setCurrent((c) => (c + 1) % itemsLength);

  return (
    <div
      className={['carousel relative overflow-hidden', params?.styles].filter(Boolean).join(' ')}
      style={{ width: '100vw', height: '700px', backgroundColor: '#111111' }}
    >
      {items.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.fields.Image?.value?.src && (
            <Image field={slide.fields.Image} className="w-full h-full object-cover" />
          )}
          {/* Uniform dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
            <Text
              field={slide.fields.Title}
              tag="div"
              className="field-slidetext text-4xl md:text-5xl font-bold whitespace-pre-line mb-6 drop-shadow"
            />
            {slide.fields.Text?.value && (
              <Text field={slide.fields.Text} tag="p" className="mt-1 text-sm opacity-90" />
            )}
            {slide.fields.Link?.value?.href && (
              <div className="field-slidelink mt-4">
                <SitecoreLink
                  field={slide.fields.Link}
                  className="inline-block border-2 border-white px-8 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-[#272727] transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <>
          {showNavigation && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-gray-300 z-10"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl leading-none select-none hover:text-gray-300 z-10"
              >
                ›
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={i === current ? 'h-1 bg-white transition-all' : 'h-1 bg-white/50'}
                style={{ width: i === current ? '48px' : '12px' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
