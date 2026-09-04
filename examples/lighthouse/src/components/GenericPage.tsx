'use client';

// TODO: Replace hard-coded PAGES content with Sitecore-driven fields.
// Each page that uses GenericPage should instead have Hero, RichText, and Promo
// components placed via partial designs, reading from page-level fields.
// The PAGES map below is a transitional stub from the XP migration.

import { JSX, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'src/lib/component-props';

type PageDef = {
  /** Page hero — mirrors the XP Hero component (big title over image). */
  heroTitle: string;
  heroImage?: string;
  /** Optional page title rendered as a heading in the body (XP's Title rendering). Defaults to heroTitle when undefined. Set to an empty string to hide. */
  bodyTitle?: string;
  /** Optional extended content. Each block renders as a heading + rich-text block. */
  body: Array<{ heading?: string; html: string }>;
  /** Optional promo shown after the body (image + title + paragraph + optional CTA). */
  promo?: {
    title: string;
    text: string;
    image?: string;
    cta?: { label: string; href: string };
  };
  showForm?: 'basic' | 'gdpr';
  /** Optional helper text rendered above the hero — used by the Active A/B Test example. */
  helperText?: string;
  /** Iframe stub for Demo Pages (Bing / Facebook simulations). */
  iframeLabel?: string;
  iframeReferrer?: string;
};

// Media copied from XP into the Next.js /public/media/migrated/ folder so they
// can be served directly without going through Sitecore's signed-URL pipeline.
const MEDIA = {
  privacyHero: '/media/migrated/privacy-hero.jpg',
  privacyIcon: '/media/migrated/privacy-icon.jpg',
  healthyHero: '/media/migrated/healthy-living-hero.jpg',
  gdprHero: '/media/migrated/gdpr-hero.jpg',
  sampleHero: '/media/migrated/sample-hero.jpg',
  samplePromo: '/media/migrated/sample-promo.jpg',
};

const PAGES: Record<string, PageDef> = {
  '/company/privacy-policy': {
    heroTitle: 'Privacy Policy',
    heroImage: MEDIA.privacyHero,
    body: [],
    promo: {
      title: 'Your privacy',
      image: MEDIA.privacyIcon,
      text:
        '<p>Here is the short version of our Privacy Policy:</p>' +
        '<p>We will not sell your personal information that you give to us, including your email, and will only use it for internal purposes.</p>' +
        '<p>We place various cookies on your browser to understand how you interact with our site so we can improve the experience. Some of those cookies are set by analytics partners and advertising networks.</p>' +
        '<p>You can opt out of non-essential cookies at any time, and you can contact us to access, correct, or delete the information we hold about you.</p>',
    },
  },
  '/landing-pages/healthy-living': {
    helperText:
      'A/B Test Example — the call to action component shown below is an example of an active A/B test with 3 different test variants. A test variant is displayed to each site visitor for the duration of their session. In order to see different variants, open this page in multiple fresh browser sessions.',
    heroTitle: 'Healthy Living',
    heroImage: MEDIA.healthyHero,
    body: [
      {
        html: '<p>Let us help you achieve your fitness goals faster with a personalized virtual trainer!</p>',
      },
    ],
    showForm: 'basic',
  },
  '/landing-pages/gdpr-form-example': {
    heroTitle: 'GDPR Form Example',
    heroImage: MEDIA.gdprHero,
    body: [
      {
        html:
          '<p>The <em>Sample Lead Gen Form</em> shown here has a <strong>GDPR consent checkbox</strong>. If the visitor selects the checkbox, the value will be <strong>recorded in Sitecore Experience Database</strong>.</p>' +
          '<p>After completing this form, an email is sent to the visitor with information they have requested. The consent state drives whether or not the visitor can be targeted with follow-up marketing communications.</p>',
      },
    ],
    showForm: 'gdpr',
  },
  '/landing-pages/sample': {
    heroTitle: 'Sample Landing Page',
    heroImage: MEDIA.sampleHero,
    body: [
      {
        html:
          '<p>Bacon ipsum dolor amet jowl swine sausage capicola fatback meatloaf. Tongue beef shoulder biltong. Pancetta salami shankle pork belly buffalo, prosciutto shoulder pastrami sausage hamburger brisket doner cow sirloin tri-tip. T-bone andouille flank spare ribs picanha jowl turkey pork chop frankfurter shank pork loin ham hock ground round ribeye.</p>',
      },
    ],
    promo: {
      title: 'Lorem Ipsum Dolr Sit Amet',
      image: MEDIA.samplePromo,
      text:
        '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
      cta: { label: 'Learn More', href: '/landing-pages/sample-with-form' },
    },
  },
  '/landing-pages/sample-with-form': {
    heroTitle: 'Sample Landing Page with Form',
    heroImage: MEDIA.sampleHero,
    body: [
      {
        html:
          '<p>Bacon ipsum dolor amet chicken corned beef turkey fatback spare ribs drumstick sausage ham short loin pig. Fatback sausage pastrami spare ribs, frankfurter jowl chuck flank ground round hamburger. Picanha kevin pork belly, bacon ham hock brisket meatloaf shoulder prosciutto andouille biltong landjaeger turkey.</p>',
      },
    ],
    showForm: 'basic',
  },
  '/campaign-pages/bing-smart-home-design': {
    heroTitle: 'Bing — smart home design',
    body: [
      {
        html:
          '<p>This page simulates a visitor arriving on the site after searching Bing for <em>smart home design</em>. The original XP page embeds a cached Bing search-results snapshot as its body so Sitecore marketing tracks the referrer and triggers the matching campaign.</p>' +
          '<p>The full HTML simulation has not been migrated for the XM Cloud demo — use the link below to jump into the connected-home content itself.</p>',
      },
    ],
    promo: {
      title: 'Design Your Perfect Connected Home',
      text: '<p>Starter bundles for lighting, climate, and security — start small and scale as you go.</p>',
      cta: { label: 'Go to At Home', href: '/at-home' },
    },
    iframeLabel: 'Bing (simulated)',
    iframeReferrer: 'https://www.bing.com',
  },
  '/campaign-pages/bing-smart-home-gym': {
    heroTitle: 'Bing — how to build a smart home gym',
    body: [
      {
        html:
          '<p>This page simulates a visitor arriving on the site after searching Bing for <em>how to build a smart home gym</em>. In XP the body is an embedded Bing search-results snapshot used to trigger a matching Sitecore campaign.</p>' +
          '<p>Skip straight into the fitness tracker pages below.</p>',
      },
    ],
    promo: {
      title: 'Build a Smart Home Gym Without the Sprawl',
      text: '<p>Space-saving kit that pairs with your Lighthouse fitness tracker.</p>',
      cta: { label: 'See Fitness Trackers', href: '/on-the-go/fitness-trackers' },
    },
    iframeLabel: 'Bing (simulated)',
    iframeReferrer: 'https://www.bing.com',
  },
  '/campaign-pages/facebook': {
    heroTitle: 'Facebook — Lighthouse Health',
    body: [
      {
        html:
          '<p>This page simulates a visitor clicking through from a Facebook post. In XP the full body is a simulated Facebook profile page used to set the referrer and trigger a Sitecore campaign.</p>' +
          '<p>Jump into the health content below.</p>',
      },
    ],
    promo: {
      title: 'Welcome from Facebook',
      text: '<p>Start your tour of Lighthouse Lifestyle with Your Health.</p>',
      cta: { label: 'Explore Your Health', href: '/your-health' },
    },
    iframeLabel: 'Facebook (simulated)',
    iframeReferrer: 'https://www.facebook.com',
  },
};

const DEFAULT_PAGE: PageDef = {
  heroTitle: 'Page',
  body: [{ html: '<p>This page is a stub — content coming soon.</p>' }],
};

type GenericPageProps = ComponentProps;

const GenericPage = ({}: GenericPageProps): JSX.Element => {
  const pathname = usePathname() || '/';
  const def = PAGES[pathname] ?? DEFAULT_PAGE;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="generic-page w-full bg-white">
      {def.helperText && (
        <div className="w-full bg-[#f7f7f7] border-b border-gray-200">
          <div className="mx-auto max-w-5xl px-6 py-3 md:px-10 text-xs text-gray-600">{def.helperText}</div>
        </div>
      )}

      <div className="hero relative w-full overflow-hidden bg-gray-900 text-white">
        {def.heroImage && (
          <div className="absolute inset-0">
            <Image src={def.heroImage} alt="" fill className="object-cover opacity-80" sizes="100vw" priority />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-10 md:px-12 md:pt-52 md:pb-14">
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">{def.heroTitle}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
        {(() => {
          const title = def.bodyTitle ?? def.heroTitle;
          return title ? <h1 className="mb-6 text-3xl font-bold text-[#272727] md:text-4xl">{title}</h1> : null;
        })()}
        {def.body.map((b, i) => (
          <div key={i} className="mb-8">
            {b.heading && <h2 className="mb-3 text-2xl font-semibold text-[#272727]">{b.heading}</h2>}
            <div
              className="text-base leading-relaxed text-gray-700 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-1 [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: b.html }}
            />
          </div>
        ))}

        {def.showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border border-gray-200 bg-[#f7f7f7] p-6">
            <h2 className="text-xl font-semibold text-[#272727]">Get started</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">Full name</label>
              <input type="text" className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">Email</label>
              <input type="email" className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none" required />
            </div>
            {def.showForm === 'gdpr' && (
              <>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1" required />
                  <span>I consent to Lighthouse Lifestyle processing my personal data for the purposes of this enquiry.</span>
                </label>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1" />
                  <span>I would like to receive marketing communications about new products and offers.</span>
                </label>
              </>
            )}
            <button
              type="submit"
              className="bg-[var(--color-brand-primary)] px-8 py-2.5 text-xs font-semibold uppercase tracking-[2px] text-white hover:bg-[var(--color-brand-dark)]"
            >
              Submit
            </button>
            {submitted && (
              <p className="text-sm text-[var(--color-brand-primary)]">Thanks! In a real site you would receive a confirmation email. This is a demo.</p>
            )}
          </form>
        )}
      </div>

      {def.promo && (
        <div className="promo promo-right w-full bg-white text-gray-900">
          <div className="mx-auto flex flex-col md:flex-row items-stretch" style={{ maxWidth: '1200px' }}>
            {def.promo.image && (
              <div className="relative md:w-[45%] overflow-hidden flex-shrink-0 self-stretch min-h-[280px]">
                <Image src={def.promo.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" />
              </div>
            )}
            <div className="flex-1 px-8 md:px-12 py-10 md:py-14 flex flex-col justify-center">
              <h2 className="font-bold leading-tight text-gray-900 text-[28px] md:text-[32px] m-0">{def.promo.title}</h2>
              <div
                className="mt-4 text-sm md:text-base leading-relaxed text-gray-600 [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: def.promo.text }}
              />
              {def.promo.cta && (
                <div className="mt-6">
                  <a
                    href={def.promo.cta.href}
                    className="inline-block rounded-none bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
                  >
                    {def.promo.cta.label}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {def.iframeLabel && (
        <div className="w-full bg-[#f7f7f7] border-t border-gray-200">
          <div className="mx-auto max-w-4xl px-6 py-6 md:px-10 text-xs text-gray-500">
            <p>
              <strong>{def.iframeLabel}.</strong>{' '}
              The original XP demo embeds a cached HTML snapshot of <a href={def.iframeReferrer} className="text-[var(--color-brand-primary)] hover:underline">{def.iframeReferrer}</a> here to simulate the referrer and trigger a Sitecore campaign. The simulation HTML has not been ported.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GenericPage;
