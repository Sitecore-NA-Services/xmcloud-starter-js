'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type ContentFinderProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    Intro?: Field<string>;
  };
};

const TOPICS = [
  { value: 'nutrition', label: 'Healthy Eating' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'sleep', label: 'Sleep & Recovery' },
  { value: 'travel', label: 'Travel Gear' },
  { value: 'smart-home', label: 'Smart Home' },
  { value: 'wearables', label: 'Wearables' },
];

const ContentFinder = ({ fields }: ContentFinderProps): JSX.Element => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();

  const title = fields?.Title?.value || 'What topics interest you most?';
  const intro = fields?.Intro?.value ||
    'Select one or more topics below and we will recommend guides tailored to you.';

  const toggle = (v: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const go = () => {
    if (!selected.size) return;
    const q = Array.from(selected).join(',');
    router.push(`/content-finder/recommendations?topics=${q}`);
  };

  return (
    <section className="content-finder w-full bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mb-10 max-w-2xl text-sm text-gray-600">{intro}</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {TOPICS.map((t) => {
            const active = selected.has(t.value);
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => toggle(t.value)}
                className={`border px-4 py-6 text-sm transition-colors ${
                  active
                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-light)] font-semibold text-[var(--color-brand-dark)]'
                    : 'border-gray-300 text-gray-700 hover:border-[var(--color-brand-primary)]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={go}
            disabled={!selected.size}
            className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Find Guides
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContentFinder;
