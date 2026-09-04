'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type AccountSettingsProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
  };
  params?: {
    Variant?: 'changepassword' | 'editprofile' | 'deleteaccount' | 'exportdata' | string;
  };
};

const AccountSettings = ({ fields, params }: AccountSettingsProps): JSX.Element => {
  const variant = params?.Variant || 'editprofile';
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const heading = fields?.Title?.value || {
    changepassword: 'Change Password',
    editprofile: 'Edit Profile',
    deleteaccount: 'Delete Account',
    exportdata: 'Export Your Data',
  }[variant] || 'Account Settings';

  return (
    <section className="account-settings w-full bg-white py-16">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Link href="/account/portal" className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-primary)] hover:underline">
          &larr; Back to account
        </Link>
        <h2 className="mb-8 text-3xl font-bold text-gray-900">{heading}</h2>

        {done ? (
          <div className="border border-[var(--color-brand-primary)] bg-[var(--color-brand-light)] p-6 text-sm text-gray-700">
            Your request has been processed.
          </div>
        ) : variant === 'changepassword' ? (
          <form onSubmit={submit} className="space-y-4">
            <InputField id="current-pw" label="Current Password" type="password" />
            <InputField id="new-pw" label="New Password" type="password" />
            <InputField id="confirm-pw" label="Confirm New Password" type="password" />
            <SubmitButton>Update Password</SubmitButton>
          </form>
        ) : variant === 'editprofile' ? (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField id="first" label="First Name" defaultValue="Alex" />
              <InputField id="last" label="Last Name" defaultValue="Lighthouse" />
            </div>
            <InputField id="email" label="Email" type="email" defaultValue="member@lighthouse.example" />
            <InputField id="phone" label="Phone" type="tel" defaultValue="(555) 555-0100" />
            <SubmitButton>Save Changes</SubmitButton>
          </form>
        ) : variant === 'deleteaccount' ? (
          <div className="space-y-6">
            <div className="border border-red-300 bg-red-50 p-5 text-sm text-red-800">
              <p className="mb-2 font-semibold">This action is permanent.</p>
              <p>
                Deleting your Lighthouse account will remove your profile, order history,
                stored preferences, and any connected fitness trackers. This cannot be undone.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <InputField id="confirm" label='Type "DELETE" to confirm' />
              <button
                type="submit"
                className="inline-block bg-red-600 px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-700"
              >
                Delete Account
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Download an archive of the data Lighthouse has stored for your account. This
              includes your profile, preferences, order history, and activity data from
              connected fitness trackers.
            </p>
            <button
              onClick={() => setDone(true)}
              type="button"
              className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
            >
              Request Data Export
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const InputField = ({
  id,
  label,
  type = 'text',
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      defaultValue={defaultValue}
      required
      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
    />
  </div>
);

const SubmitButton = ({ children }: { children: React.ReactNode }) => (
  <button
    type="submit"
    className="inline-block bg-[var(--color-brand-primary)] px-10 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
  >
    {children}
  </button>
);

export default AccountSettings;
