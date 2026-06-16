import Link from 'next/link';
import SearchResultsWidget from '@/components/sitecore-search/SearchResults';
import { PreviewSearchBox } from '@/components/sitecore-search/PreviewSearchBox';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Search',
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

/**
 * Dedicated search results route (/search).
 *
 * This is a standalone Next.js page (not a Sitecore-routed page), so it is added
 * to the middleware matcher's skip list. The full results + facets experience is
 * the client `SearchResultsWidget`, rendered inside the global WidgetsProvider
 * (mounted in the root layout). The header preview box submits here on Enter.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;

  const configured =
    !!process.env.NEXT_PUBLIC_SEARCH_ENV &&
    !!process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY &&
    !!process.env.NEXT_PUBLIC_SEARCH_API_KEY;
  const rfkId = process.env.NEXT_PUBLIC_SEARCH_RESULTS_RFKID;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-50 flex h-[96px] w-full items-center border-b border-neutral-200 bg-white">
        <div className="@xl:px-8 mx-auto flex w-full max-w-screen-xl items-center gap-6 px-4">
          <Link href="/" className="text-lg font-semibold">
            Home
          </Link>
          <div className="flex flex-1 justify-end">
            <PreviewSearchBox />
          </div>
        </div>
      </header>

      <main className="@xl:px-8 mx-auto w-full max-w-screen-xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Search</h1>

        {configured && rfkId ? (
          <SearchResultsWidget rfkId={rfkId} defaultKeyphrase={q} />
        ) : (
          <div className="rounded-lg border border-neutral-200 p-8">
            <p className="font-medium">Search is not configured yet.</p>
            <p className="mt-1 text-sm text-neutral-500">
              Set <code>NEXT_PUBLIC_SEARCH_ENV</code>, <code>NEXT_PUBLIC_SEARCH_CUSTOMER_KEY</code>,{' '}
              <code>NEXT_PUBLIC_SEARCH_API_KEY</code>, and{' '}
              <code>NEXT_PUBLIC_SEARCH_RESULTS_RFKID</code> in your environment, then redeploy.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
