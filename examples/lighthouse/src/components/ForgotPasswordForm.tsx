'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type ForgotPasswordFormProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    Intro?: Field<string>;
  };
};

const ForgotPasswordForm = ({ fields }: ForgotPasswordFormProps): JSX.Element => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const title = fields?.Title?.value || 'Forgot Your Password?';
  const intro = fields?.Intro?.value ||
    "Enter the email associated with your Lighthouse account and we will send you a link to reset your password.";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/account/forgot-password/confirmation');
  };

  return (
    <section className="forgot-password w-full bg-white py-16">
      <div className="mx-auto max-w-md px-6 md:px-10">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mb-8 text-sm text-gray-600">{intro}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700" htmlFor="fp-email">
              Email
            </label>
            <input
              id="fp-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
          >
            Send Reset Link
          </button>
          <p className="pt-2 text-xs text-gray-500">
            Remember your password?{' '}
            <Link href="/account" className="text-[var(--color-brand-primary)] hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
