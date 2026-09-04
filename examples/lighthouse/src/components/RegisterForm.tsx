'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type RegisterFormProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    Intro?: Field<string>;
    FacebookText?: Field<string>;
  };
};

const RegisterForm = ({ fields }: RegisterFormProps): JSX.Element => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });

  const title = fields?.Title?.value || 'Create Your Account';
  const intro = fields?.Intro?.value ||
    'Register today to shop faster, keep track of orders, and manage your Lighthouse membership.';
  const fbText = fields?.FacebookText?.value ||
    'Login with Facebook to receive 10% OFF your first purchase!';

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Demo registration complete.');
  };

  return (
    <section className="register-form w-full bg-white py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-[2fr_1fr] md:px-10">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mb-8 text-sm text-gray-600">{intro}</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="reg-first">
                  First Name
                </label>
                <input id="reg-first" type="text" required value={form.firstName} onChange={update('firstName')}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="reg-last">
                  Last Name
                </label>
                <input id="reg-last" type="text" required value={form.lastName} onChange={update('lastName')}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="reg-email">
                Email
              </label>
              <input id="reg-email" type="email" required value={form.email} onChange={update('email')}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="reg-pw">
                  Password
                </label>
                <input id="reg-pw" type="password" required value={form.password} onChange={update('password')}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="reg-pw2">
                  Confirm Password
                </label>
                <input id="reg-pw2" type="password" required value={form.confirm} onChange={update('confirm')}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" />
              </div>
            </div>
            <button type="submit"
              className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]">
              Create Account
            </button>
            <p className="pt-2 text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/account" className="text-[var(--color-brand-primary)] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
        <aside className="border-l border-gray-100 pl-12">
          <h3 className="mb-3 text-lg font-bold text-gray-900">Quick Sign-Up</h3>
          <p className="mb-6 text-sm text-gray-600">{fbText}</p>
          <button type="button"
            className="inline-flex items-center gap-2 bg-[#1877F2] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1566d4]">
            <span className="social-links-facebook" aria-hidden="true"></span>
            Continue with Facebook
          </button>
        </aside>
      </div>
    </section>
  );
};

export default RegisterForm;
