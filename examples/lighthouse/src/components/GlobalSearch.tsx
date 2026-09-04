'use client';

// TODO: Replace hard-coded CATALOG with a dynamic GraphQL search query.
// Use Sitecore Search or Experience Edge GraphQL to query pages/resources at
// runtime instead of maintaining a static array of site content.

import { JSX, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComponentProps } from 'src/lib/component-props';

type Entry = {
  id: string;
  title: string;
  type: 'Page' | 'Resource' | 'Article';
  kind?: string; // e.g. "Video", "Document"
  href: string;
  blurb: string;
};

// Known searchable content across the demo site.
// Pages + articles + resources. Keep in sync with site nav / resource library.
const CATALOG: Entry[] = [
  // Pages
  { id: 'home', title: 'Home', type: 'Page', href: '/', blurb: 'Lighthouse Lifestyle — your one-stop destination for smart home, fitness, and lifestyle products.' },
  { id: 'your-health', title: 'Your Health', type: 'Page', href: '/your-health', blurb: 'Tools and resources to help you live your healthiest life.' },
  { id: 'on-the-go', title: 'On the Go', type: 'Page', href: '/on-the-go', blurb: 'Mobile phones, travel gear, and healthy eating for life on the move.' },
  { id: 'at-home', title: 'At Home', type: 'Page', href: '/at-home', blurb: 'Sleep technology, virtual fitness workouts, and healthy eating at home.' },
  { id: 'at-work', title: 'At Work', type: 'Page', href: '/at-work', blurb: 'Corporate wellness and work-from-home productivity.' },
  { id: 'articles', title: 'Articles', type: 'Page', href: '/articles', blurb: 'Latest articles on health, fitness, and connected lifestyle.' },
  { id: 'services', title: 'Services', type: 'Page', href: '/services', blurb: 'Life Made Easier — free smart home consultation, kitchen trends, connected home, mobile lifestyles.' },
  { id: 'resources', title: 'Lighthouse Resources', type: 'Page', href: '/resources', blurb: 'Guides, whitepapers, case studies, videos and audio to help you learn by example.' },
  { id: 'locations', title: 'Locations', type: 'Page', href: '/company/locations', blurb: 'Find a Lighthouse store near you to browse the latest lifestyle brands.' },
  { id: 'contact', title: 'Contact', type: 'Page', href: '/company/contact', blurb: 'How can we help? Contact Lighthouse Customer Service 24/7.' },
  { id: 'account', title: 'Login', type: 'Page', href: '/account', blurb: 'Existing customers sign in; new customers create an account to access benefits.' },

  // Sub pages
  { id: 'healthy-eating-otg', title: 'Healthy Eating (On the Go)', type: 'Page', href: '/on-the-go/healthy-eating', blurb: 'Smart, portable nutrition for your busy lifestyle.' },
  { id: 'fitness-trackers', title: 'Fitness Trackers', type: 'Page', href: '/on-the-go/fitness-trackers', blurb: 'Wearables that help you hit your goals.' },
  { id: 'travel-gear', title: 'Travel Gear', type: 'Page', href: '/on-the-go/travel-gear', blurb: 'Everything you need for the road.' },
  { id: 'healthy-eating-ah', title: 'Healthy Eating (At Home)', type: 'Page', href: '/at-home/healthy-eating', blurb: 'Cook smarter, eat better.' },
  { id: 'virtual-fitness', title: 'Virtual Fitness Workouts', type: 'Page', href: '/at-home/virtual-fitness-workouts', blurb: 'Bring the studio home.' },
  { id: 'sleep-tech', title: 'Sleep Technology', type: 'Page', href: '/at-home/sleep-technology', blurb: 'Smarter sleep for healthier days.' },
  { id: 'corp-wellness', title: 'Corporate Wellness', type: 'Page', href: '/at-work/corporate-wellness', blurb: 'Programs to keep your team healthy.' },
  { id: 'wfh', title: 'Work from Home', type: 'Page', href: '/at-work/work-from-home', blurb: 'Tools for productive remote work.' },

  // Resources (subset — mirror key entries in ResourceSearch)
  { id: '51936be2', title: '5 Tips for Living Your Strongest, Healthiest Life Yet', type: 'Resource', kind: 'Document', href: '/resources', blurb: 'Tips to feel less "off" and stay at your healthiest.' },
  { id: '7e98631c', title: 'Amazon Alexa Integration Coming Soon', type: 'Resource', kind: 'Case Study', href: '/resources', blurb: 'Ecosystem, business model and analytics for the upcoming Alexa integration.' },
  { id: '11e359c3', title: 'An Essential Guide To At Home Workout', type: 'Resource', kind: 'Whitepaper', href: '/resources', blurb: 'A comprehensive guide to building a workout routine at home.' },
  { id: 'ff55a9b4', title: "Arnold Schwarzenegger's Message to Lighthouse Lifestyle.", type: 'Resource', kind: 'Audio', href: '/resources', blurb: 'Collaboration through advanced technology — a message to our community.' },
  { id: '7954ba9b', title: 'Become Smart and Sustainable For Less', type: 'Resource', kind: 'Video', href: '/resources', blurb: 'How responsive design and lean strategy save energy and money.' },
  { id: '0e6d3477', title: 'Healthbit integration', type: 'Resource', kind: 'Case Study', href: '/resources', blurb: 'Huge partnership with Lighthouse Lifestyle integrating our tools into Healthbit.' },
  { id: '82c88d53', title: 'Healthy Eating Resources', type: 'Resource', kind: 'External', href: '/resources', blurb: 'Guidance on healthy eating for individuals, families, and workplaces.' },
  { id: '2d252439', title: 'The Importance of Promoting Healthy Lifestyles in the Workplace', type: 'Resource', kind: 'Whitepaper', href: '/resources', blurb: 'Workplace wellness programs that improve health and reduce costs.' },
  { id: 'e2410111', title: 'Healthy Living Resources', type: 'Resource', kind: 'External', href: '/resources', blurb: 'Alberta Healthy Living Program — supporting chronic conditions.' },
  { id: 'af4e6052', title: 'IT Integration for Better Healthcare', type: 'Resource', kind: 'Whitepaper', href: '/resources', blurb: 'Cloud-first healthcare IT and deployment strategies.' },
  { id: '7d91f413', title: 'Lighthouse integration with new Kamsung TV', type: 'Resource', kind: 'Case Study', href: '/resources', blurb: 'New Kamsung TV partnership for the Lighthouse workout app.' },
  { id: '602febb4', title: 'Watch Kamsung unveil Their new TV with Lighthouse Workout App', type: 'Resource', kind: 'Video', href: '/resources', blurb: 'Launch event highlights for the Kamsung + Lighthouse workout experience.' },
  { id: 'c5ed7ef5', title: 'Lighthouse Fitness App Launch on mobile and tablets', type: 'Resource', kind: 'External', href: '/resources', blurb: 'Our fitness app is now available across mobile and tablets.' },
  { id: 'd9bae376', title: 'Lighthouse Fitness Corporate Event Highlights', type: 'Resource', kind: 'Video', href: '/resources', blurb: 'Highlights from the corporate fitness launch event.' },
  { id: '2f8a98d5', title: 'Lighthouse Lifestyle Podcast Announcement', type: 'Resource', kind: 'Audio', href: '/resources', blurb: 'Introducing Lighthouse Sound — a new podcast for users and enthusiasts.' },
  { id: 'f853e3d9', title: 'Listen to Our 2020 Q4 Townhall Meeting', type: 'Resource', kind: 'Audio', href: '/resources', blurb: 'Quarterly strategy, priorities, and team updates.' },
  { id: 'c61ec9b4', title: 'Luna Square Is Now Available on Amazon', type: 'Resource', kind: 'Case Study', href: '/resources', blurb: 'Luna Square — smart device appliances available on Amazon.' },
  { id: '507286b3', title: 'Our Own Meditation Music For Your Use', type: 'Resource', kind: 'Audio', href: '/resources', blurb: 'A 25-minute guided meditation courtesy of Lighthouse Lifestyle.' },
  { id: 'fe9f6ff0', title: "Nigeria's Techpreneurs Are Using Technology To Provide Life-changing Solutions", type: 'Resource', kind: 'Document', href: '/resources', blurb: "Africa's tech industry is transforming with mobile and internet advances." },
  { id: '97ee017b', title: 'Save Money and Gain Health', type: 'Resource', kind: 'Whitepaper', href: '/resources', blurb: 'The financial benefits of health and wellness.' },
  { id: '554171d4', title: 'Schmidt Futures Announces Applications Open For Rise', type: 'Resource', kind: 'Document', href: '/resources', blurb: 'Rise — a global talent program for outstanding young people.' },
  { id: '76021e95', title: 'Smart Home Guide for Beginners', type: 'Resource', kind: 'External', href: '/resources', blurb: 'A foundation for making your home more convenient without breaking the bank.' },
  { id: 'ca95b2b8', title: 'This Smart Trainer Could Change The Way You Exercise at Home', type: 'Resource', kind: 'Document', href: '/resources', blurb: 'Samsung Health Smart Trainer with Obé, Echelon, Jillian Michaels, Calm.' },
  { id: '34f7f250', title: 'Lighthouse Lifestyle is Growing. Join Our Team.', type: 'Resource', kind: 'Video', href: '/resources', blurb: "We're hiring across the country — grow with us." },
];

const PAGE_SIZE = 10;

const typeBadge: Record<string, string> = {
  Page: 'bg-[#232323] text-white',
  Resource: 'bg-[var(--color-brand-primary)] text-white',
  Article: 'bg-[#7aa7b0] text-white',
};

type GlobalSearchProps = ComponentProps;

const GlobalSearch = ({}: GlobalSearchProps): JSX.Element => {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const [submittedQuery, setSubmittedQuery] = useState(initialQ);
  const [page, setPage] = useState(0);

  // Keep state in sync if the URL query changes (e.g. user clicks nav search again)
  useEffect(() => {
    setQuery(initialQ);
    setSubmittedQuery(initialQ);
    setPage(0);
  }, [initialQ]);

  const q = submittedQuery.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return CATALOG.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.blurb.toLowerCase().includes(q) ||
        (e.kind ?? '').toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setPage(0);
    // Reflect the query in the URL so the result is shareable/bookmarkable
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (query.trim()) url.searchParams.set('q', query.trim());
      else url.searchParams.delete('q');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="global-search w-full bg-white py-10">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <h1 className="mb-6 text-3xl font-bold text-[#272727] md:text-4xl">Search</h1>

        <form onSubmit={handleSubmit} className="mb-4 flex">
          <input
            type="text"
            placeholder="search for pages, resources, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 bg-[#f7f7f7] px-4 py-3 text-sm focus:border-[var(--color-brand-primary)] focus:bg-white focus:outline-none"
            aria-label="Search the site"
            autoFocus
          />
          <button
            type="submit"
            className="bg-[var(--color-brand-primary)] px-10 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
          >
            Search
          </button>
        </form>

        <div className="mb-4 text-sm text-gray-700">
          {q ? (
            <>
              There {total === 1 ? 'is' : 'are'} <span className="font-semibold">{total}</span> result{total === 1 ? '' : 's'}
              {' '}for <span className="font-semibold">&ldquo;{submittedQuery}&rdquo;</span>
            </>
          ) : (
            <span className="text-gray-500">Type something above and press Search.</span>
          )}
        </div>

        {q && total === 0 && (
          <p className="py-6 text-sm text-gray-500">No results</p>
        )}

        {pageItems.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {pageItems.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-start md:gap-4">
                <span className={`${typeBadge[r.type] ?? 'bg-gray-200 text-gray-800'} inline-block shrink-0 self-start px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px]`}>
                  {r.kind ? `${r.type} · ${r.kind}` : r.type}
                </span>
                <div className="flex-1">
                  <a
                    href={r.href}
                    className="text-base font-semibold leading-snug text-[#272727] hover:text-[var(--color-brand-primary)]"
                  >
                    {r.title}
                  </a>
                  <p className="mt-1 text-sm text-gray-600">{r.blurb}</p>
                  <span className="mt-1 block text-xs text-gray-400">{r.href}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2 text-xs text-gray-600">
            <button
              type="button"
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const GlobalSearchWithSuspense = (props: GlobalSearchProps): JSX.Element => (
  <Suspense fallback={null}>
    <GlobalSearch {...props} />
  </Suspense>
);

export default GlobalSearchWithSuspense;
