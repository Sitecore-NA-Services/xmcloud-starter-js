'use client';

import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'src/lib/component-props';

type SectionChild = {
  title: string;
  href: string;
};

type Section = {
  /** Small intro sentence rendered above the page title on XP. */
  intro?: string;
  title: string;
  children: SectionChild[];
};

// XP parity: landing-pages and campaign-pages render an intro sentence,
// a large page title, then a plain bordered list of child pages.
const SECTIONS: Record<string, Section> = {
  '/landing-pages': {
    intro: 'Use this section of pages to create landing pages for demo scenarios.',
    title: 'Landing Pages',
    children: [
      { title: 'Active AB Test Example', href: '/landing-pages/healthy-living' },
      { title: 'GDPR Form Example', href: '/landing-pages/gdpr-form-example' },
      { title: 'Sample Landing Page', href: '/landing-pages/sample' },
      { title: 'Sample Landing Page with Form', href: '/landing-pages/sample-with-form' },
    ],
  },
  '/campaign-pages': {
    intro: "Here is a list of campaign pages to start your journey. Don't forget a new browser session to trigger Sitecore campaigns!",
    title: 'Campaign Pages',
    children: [
      { title: 'Bing Smart Home Gym', href: '/campaign-pages/bing-smart-home-gym' },
      { title: 'Bing Smart Home Design', href: '/campaign-pages/bing-smart-home-design' },
      { title: 'Facebook', href: '/campaign-pages/facebook' },
    ],
  },
};

type SectionIndexProps = ComponentProps;

const SectionIndex = ({}: SectionIndexProps): JSX.Element => {
  const pathname = usePathname() || '/';
  const key = Object.keys(SECTIONS).find((p) => pathname === p || pathname.startsWith(p + '/')) ?? '/landing-pages';
  const section = SECTIONS[key];

  return (
    <section className="section-index w-full bg-white py-10">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {section.intro && (
          <p className="mb-6 text-sm text-gray-600">{section.intro}</p>
        )}
        <h1 className="mb-6 text-4xl font-bold text-[#272727] md:text-5xl">{section.title}</h1>
        <ul className="border-t border-gray-200">
          {section.children.map((c) => (
            <li key={c.href} className="border-b border-gray-200">
              <a
                href={c.href}
                className="block py-3 text-sm text-[#272727] hover:text-[var(--color-brand-primary)] no-underline"
              >
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionIndex;
