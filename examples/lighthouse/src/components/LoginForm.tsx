'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import SitecoreLink from 'lib/sitecore-link';
import { sanitizeLink } from 'src/lib/link-utils';

type LoginFormProps = ComponentProps & {
  fields?: {
    ExistingCustomersTitle?: Field<string>;
    ExistingCustomersText?: Field<string>;
    RegisterTitle?: Field<string>;
    RegisterText?: Field<string>;
    RegisterLink?: LinkField;
  };
};

const LoginForm = ({ fields }: LoginFormProps): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const existingTitle = fields?.ExistingCustomersTitle?.value || 'Existing Customers';
  const existingText = fields?.ExistingCustomersText?.value || '<p>If you have an account, please login below.</p>';
  const registerTitle = fields?.RegisterTitle?.value || "Don't have an account?";
  const registerText =
    fields?.RegisterText?.value ||
    '<p>Having an account enables you to do a number of things, including:</p><p><strong>Benefits:</strong></p><ul><li>Save your account information for future visits</li><li>Check the status of your orders</li><li>Store products in your Wish List</li></ul>';
  const registerLink = sanitizeLink(fields?.RegisterLink);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo only — no real auth
    alert(`Demo login attempted for: ${email}`);
  };

  return (
    <section className="login-form w-full bg-white py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-10">
        <div className="existing-customers">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{existingTitle}</h2>
          <div
            className="mb-6 text-sm text-gray-600 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: existingText }}
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-block rounded-none bg-[var(--color-brand-primary)] px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
            >
              Login
            </button>
            <div className="pt-2">
              <a href="#" className="text-xs text-gray-500 hover:text-[var(--color-brand-primary)]">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
        <div className="register-cta">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{registerTitle}</h2>
          <div
            className="mb-6 text-sm text-gray-600 [&_p]:m-0 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: registerText }}
          />
          {registerLink?.value?.href ? (
            <SitecoreLink
              field={registerLink}
              className="inline-block rounded-none bg-[var(--color-brand-primary)] px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
            />
          ) : (
            <Link
              href="/account/register"
              className="inline-block rounded-none bg-[var(--color-brand-primary)] px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
