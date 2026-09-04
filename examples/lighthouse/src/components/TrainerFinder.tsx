'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type TrainerFinderProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    Intro?: Field<string>;
    Subtitle?: Field<string>;
  };
};

const OPTIONS = [
  { value: 'yoga', label: 'Yoga', icon: 'M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8h-4v-1c0-.83-.67-1.5-1.5-1.5S11 8.17 11 9v1H7c-.55 0-1 .45-1 1v4h2v7h2v-4h2v4h2v-7h2v-4h2c.55 0 1-.45 1-1s-.45-1-1-1z' },
  { value: 'aerobics', label: 'Aerobics', icon: 'M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm2 6h-4c-.55 0-1 .45-1 1v5h2v8h2v-8h2v-5c0-.55-.45-1-1-1z' },
  { value: 'cardio', label: 'Cardio', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { value: 'strength', label: 'Strength', icon: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z' },
  { value: 'weightlifting', label: 'Weight Lifting', icon: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 4.14 8.43l-1.43-1.44-1.42 1.42 1.43 1.43L2 11.28l1.43 1.43L2 14.14l1.43 1.42L4.86 15.14l8.57 8.57 1.43-1.43-1.43-1.43 1.43-1.42z' },
  { value: 'unknown', label: "I don't know", icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
];

const TrainerFinder = ({ fields }: TrainerFinderProps): JSX.Element => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const title = fields?.Title?.value || 'What type of exercise are you interested in?';
  const intro = fields?.Intro?.value ||
    'By selecting the type of fitness program you are interested in Lighthouse Health will personalize your experience to match your interest. You can change your interest at any time.';
  const subtitle = fields?.Subtitle?.value || 'Select the interest that matches you best.';

  const next = () => {
    if (!selected) return;
    router.push(`/your-health/trainer-finder/recommendations?interest=${selected}`);
  };

  return (
    <section className="trainer-finder w-full bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="mb-12 text-3xl font-bold text-gray-900">{title}</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
          <div className="text-sm text-gray-600">
            <p className="mb-6 leading-relaxed">{intro}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">{subtitle}</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {OPTIONS.map((opt) => {
                const active = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelected(opt.value)}
                    className={`flex flex-col items-center justify-center border p-6 transition-colors ${
                      active
                        ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-light)] ring-2 ring-[var(--color-brand-primary)]'
                        : 'border-gray-300 hover:border-[var(--color-brand-primary)]'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mb-3 h-12 w-12 fill-[var(--color-brand-primary)]"
                      aria-hidden="true"
                    >
                      <path d={opt.icon} />
                    </svg>
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={next}
                disabled={!selected}
                className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerFinder;
