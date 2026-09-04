'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type TrackerRegisterProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    Intro?: Field<string>;
  };
};

const BRANDS = ['Apple Watch', 'Fitbit', 'Garmin', 'Whoop', 'Oura Ring', 'Other'];

const TrackerRegister = ({ fields }: TrackerRegisterProps): JSX.Element => {
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [serial, setSerial] = useState('');
  const router = useRouter();

  const title = fields?.Title?.value || 'Register Your Fitness Tracker';
  const intro = fields?.Intro?.value ||
    'Register your wearable device so Lighthouse Lifestyle can sync your activity and personalize your recommendations.';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/your-health/register-fitness-tracker/thank-you');
  };

  return (
    <section className="tracker-register w-full bg-white py-16">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="mb-3 text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mb-10 text-sm text-gray-600">{intro}</p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Device Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
            >
              <option value="" disabled>Choose a brand</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tracker-serial" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Serial Number / Device ID
            </label>
            <input
              id="tracker-serial"
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tracker-email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Email
            </label>
            <input
              id="tracker-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default TrackerRegister;
