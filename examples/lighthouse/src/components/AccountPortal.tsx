import { JSX } from 'react';
import Link from 'next/link';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type AccountPortalProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    MemberName?: Field<string>;
    MemberLevel?: Field<string>;
    DiscountCode?: Field<string>;
  };
};

const AccountPortal = ({ fields }: AccountPortalProps): JSX.Element => {
  const name = fields?.MemberName?.value || 'Lighthouse Member';
  const level = (fields?.MemberLevel?.value || 'Gold').toLowerCase();
  const discount = fields?.DiscountCode?.value || 'FreeGiftForGold';

  const levelConfig = {
    bronze: { color: '#B08D57', label: 'Bronze', text: 'You are currently a bronze member based on your activity.' },
    silver: { color: '#8A8F9A', label: 'Silver', text: 'You are currently a silver member based on your activity.' },
    gold: { color: '#D4AF37', label: 'Gold', text: 'Well done! You are a gold member and have unlocked a member discount code.' },
  } as const;

  const cfg = levelConfig[level as keyof typeof levelConfig] || levelConfig.gold;

  return (
    <section className="account-portal w-full bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <header className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Welcome back</p>
            <h2 className="text-3xl font-bold text-gray-900">{name}</h2>
          </div>
          <div className="flex gap-3">
            <Link href="/account/portal/editprofile" className="border border-gray-300 px-4 py-2 text-xs uppercase tracking-wider text-gray-700 hover:bg-gray-50">
              Edit Profile
            </Link>
            <Link href="/account" className="bg-[var(--color-brand-primary)] px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]">
              Sign Out
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="border border-gray-200 p-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Member Status</h3>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="inline-block h-10 w-10 rounded-full"
                style={{ background: cfg.color }}
                aria-hidden="true"
              />
              <h4 className="text-2xl font-bold text-gray-900">{cfg.label} Level</h4>
            </div>
            <p className="text-sm text-gray-600">{cfg.text}</p>
            {level === 'gold' && (
              <div className="mt-4 rounded border border-[var(--color-brand-primary)] bg-[var(--color-brand-light)] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-600">Discount code</p>
                <p className="font-mono text-lg font-bold text-[var(--color-brand-dark)]">{discount}</p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Profile</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">Name</dt>
                <dd className="text-gray-900">{name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">Email</dt>
                <dd className="text-gray-900">member@lighthouse.example</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">Member since</dt>
                <dd className="text-gray-900">2024</dd>
              </div>
            </dl>
            <Link
              href="/account/portal/changepassword"
              className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-primary)] hover:underline"
            >
              Change password
            </Link>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Account Tools</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/account/portal/editprofile" className="text-gray-700 hover:text-[var(--color-brand-primary)]">
                  Edit profile details
                </Link>
              </li>
              <li>
                <Link href="/account/portal/changepassword" className="text-gray-700 hover:text-[var(--color-brand-primary)]">
                  Change password
                </Link>
              </li>
              <li>
                <Link href="/account/portal/export-data" className="text-gray-700 hover:text-[var(--color-brand-primary)]">
                  Export your data
                </Link>
              </li>
              <li>
                <Link href="/account/portal/deleteaccount" className="text-red-600 hover:underline">
                  Delete account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountPortal;
