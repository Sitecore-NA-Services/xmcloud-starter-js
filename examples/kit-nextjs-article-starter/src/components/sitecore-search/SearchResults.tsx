'use client';

/**
 * Full search-results experience built on the Sitecore Search JS SDK for React,
 * packaged as a Sitecore rendering (`Default` export) so it can be placed on a
 * Sitecore page and inherits the site layout + design system.
 *
 * Best-practice notes (this file is a teaching reference):
 *  - Data + analytics come from the SDK query hook `useSearchResults`. The hook
 *    manages keyphrase, paging, sorting and facet selection state for you and —
 *    crucially — emits the visitor events (via the WidgetsProvider) that power
 *    Search analytics and personalization.
 *  - The UI uses the site design system (shadcn primitives in `@/components/ui`
 *    and brand tokens) and a `colorScheme` rendering parameter, mirroring the
 *    pattern used by the Hero rendering.
 *  - The keyphrase comes from the `?q=` query string; facets are requested
 *    explicitly in code (content type / author / topics).
 */

import { useSearchParams } from 'next/navigation';
import { cva } from 'class-variance-authority';
import {
  WidgetDataType,
  useSearchResults,
  useSearchResultsSelectedFacets,
  widget,
  type SearchResultsInitialState,
} from '@sitecore-search/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ComponentProps } from '@/lib/component-props';
import { SEARCH_SOURCE_IDS } from './search-config';

/** Index document shape (attributes configured on the `content` entity). */
type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  description?: string;
  url?: string;
  image_url?: string;
  author?: string;
  source_id?: string;
};

type FacetValue = { id: string; text: string; count: number };
type Facet = { name: string; label: string; value: FacetValue[] };
type SortChoice = { name: string; label: string };

type SearchResultsProps = {
  defaultKeyphrase?: string;
  defaultItemsPerPage?: number;
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page'>;

const titleOf = (a: ArticleModel) => a.name || a.title || 'Untitled';

/** Friendly labels for the raw sort option names returned by the widget. */
const SORT_LABELS: Record<string, string> = {
  featured_desc: 'Relevance',
  featured_asc: 'Relevance (ascending)',
  name_asc: 'Title (A–Z)',
  name_desc: 'Title (Z–A)',
  date_desc: 'Newest first',
  date_asc: 'Oldest first',
};
const sortLabelOf = (c: SortChoice) =>
  SORT_LABELS[c.name] ||
  (c.label && c.label !== c.name ? c.label : c.name.replace(/_/g, ' '));

/** Friendly headings for the facet attribute names returned by the widget. */
const FACET_LABELS: Record<string, string> = {
  type: 'Content Type',
  tags: 'Topics',
  author: 'Author',
};
const facetLabelOf = (f: Facet) => FACET_LABELS[f.name] || f.label || f.name;

const ResultsSkeleton = () => (
  <div className="grid gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-5">
          <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
          <div className="bg-muted/60 mt-3 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted/60 mt-2 h-4 w-4/5 animate-pulse rounded" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const SearchResultsComponent = ({
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
}: SearchResultsProps) => {
  const {
    widgetRef,
    actions: { onPageNumberChange, onItemClick, onSortChange, onFacetClick, onClearFilters },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] as SortChoice[] } = {},
        facet: facets = [] as Facet[],
        content: articles = [] as ArticleModel[],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    query: (query) => {
      const request = query.getRequest();
      // Scope results to this site's source(s). The domain index is shared across
      // sites, so without this the widget would return every site's content.
      if (SEARCH_SOURCE_IDS.length) request.setSources(SEARCH_SOURCE_IDS);
      // Request the facets this experience exposes. The widget's default facet set
      // (content type + topics) does not include author, so request an explicit list
      // instead of "all" — this renders the Author filter without a console change.
      // Each name must be a facet-enabled attribute on the `content` entity in Search.
      request.setSearchFacetAll(false);
      request.setSearchFacetTypes([
        { name: 'type', max: 20 },
        { name: 'author', max: 20 },
        { name: 'tags', max: 20 },
      ]);
      return query;
    },
    state: {
      keyphrase: defaultKeyphrase,
      page: 1,
      itemsPerPage: defaultItemsPerPage,
    },
  });

  // Build a lookup of currently-selected facet values so we can mark checkboxes.
  // Selected values are keyed by `facetValueId` (the `facetid_…` token), which matches
  // the `id` on each facet value returned in the results — NOT a plain `id` field.
  const selectedFacets = useSearchResultsSelectedFacets();
  const selectedSet = new Set<string>();
  selectedFacets.forEach((f) =>
    (f.values as Array<{ facetValueId?: string }>)?.forEach((v) => {
      if (v?.facetValueId) selectedSet.add(`${f.id}:${v.facetValueId}`);
    }),
  );
  const hasSelectedFacets = selectedSet.size > 0;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const loading = isLoading || isFetching;

  return (
    <div ref={widgetRef}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        {/* ----------------------------- Facets ----------------------------- */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Filters</h2>
            {hasSelectedFacets && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-muted-foreground h-auto p-0"
                onClick={() => onClearFilters()}
              >
                Clear all
              </Button>
            )}
          </div>

          {facets.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No filters are configured for this widget yet.
            </p>
          ) : (
            facets.map((facet, facetIndex) => (
              <div key={facet.name} className="border-border space-y-3 border-b pb-5">
                <h3 className="text-sm font-medium">{facetLabelOf(facet)}</h3>
                <ul className="space-y-2">
                  {facet.value.map((value, facetValueIndex) => {
                    const checked = selectedSet.has(`${facet.name}:${value.id}`);
                    const inputId = `facet-${facet.name}-${value.id}`;
                    return (
                      <li key={value.id} className="flex items-center gap-2">
                        <Checkbox
                          id={inputId}
                          checked={checked}
                          onCheckedChange={(next) =>
                            onFacetClick({
                              facetId: facet.name,
                              facetIndex,
                              facetValueId: value.id,
                              facetValueIndex,
                              checked: next === true,
                              type: 'valueId',
                            })
                          }
                        />
                        <label
                          htmlFor={inputId}
                          className="flex flex-1 cursor-pointer items-center justify-between gap-2 text-sm"
                        >
                          <span className="truncate">{value.text}</span>
                          <span className="text-muted-foreground text-xs">{value.count}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </aside>

        {/* ----------------------------- Results ---------------------------- */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {loading
                ? 'Searching…'
                : `${totalItems} result${totalItems === 1 ? '' : 's'}${
                    defaultKeyphrase ? ` for “${defaultKeyphrase}”` : ''
                  }`}
            </p>

            {sortChoices.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Sort</span>
                <Select
                  value={sortType || sortChoices[0]?.name}
                  onValueChange={(name) => onSortChange({ name })}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortChoices.map((choice) => (
                      <SelectItem key={choice.name} value={choice.name}>
                        {sortLabelOf(choice)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loading ? (
            <ResultsSkeleton />
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="font-medium">No articles found</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Try a different keyword{hasSelectedFacets ? ' or clear your filters' : ''}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="grid gap-4">
              {articles.map((article, index) => (
                <li key={article.id}>
                  <a
                    href={article.url}
                    className="group block"
                    onClick={() =>
                      // Tracks a result-click event for Search analytics/personalization.
                      onItemClick({ id: article.id, index, sourceId: article.source_id })
                    }
                  >
                    <Card className="group-hover:border-primary transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-heading text-lg font-semibold">{titleOf(article)}</h3>
                          {article.type && (
                            <span className="bg-secondary text-secondary-foreground shrink-0 rounded-full px-2 py-0.5 text-xs">
                              {article.type}
                            </span>
                          )}
                        </div>
                        {article.description && (
                          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                            {article.description}
                          </p>
                        )}
                        {article.author && (
                          <p className="text-muted-foreground mt-3 text-xs">By {article.author}</p>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* --------------------------- Pagination -------------------------- */}
          {!loading && totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-2"
              aria-label="Search results pages"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageNumberChange({ page: page - 1 })}
              >
                Previous
              </Button>
              <span className="text-muted-foreground px-2 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageNumberChange({ page: page + 1 })}
              >
                Next
              </Button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
};

/**
 * Register the UI component as a Search Results widget. The `rfkId` must match a
 * Search Results widget configured in the Sitecore Search console. This is the
 * internal SDK widget; the Sitecore rendering entry is the `Default` export below.
 */
const SearchResultsWidget = widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, 'content');

export default SearchResultsWidget;

/** Section wrapper styling — mirrors the Hero `colorScheme` rendering parameter. */
export const searchResultsVariants = cva('search-results @container w-full py-12', {
  variants: {
    colorScheme: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-primary',
      tertiary: 'bg-tertiary text-primary',
      dark: 'bg-dark text-primary',
      light: 'bg-light text-primary',
    },
  },
  defaultVariants: {
    colorScheme: 'light',
  },
});

type ColorScheme = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'light';

/**
 * Sitecore rendering entry. Placed on a Sitecore page (the `/search` page); reads
 * the `colorScheme` rendering parameter and the `?q=` query string, then renders
 * the Search SDK widget inside a brand-styled section. `rfkId` and credentials
 * come from public env vars; if unset, a styled "not configured" notice renders so
 * the page still builds.
 */
export const Default = ({ params }: ComponentProps) => {
  const colorScheme = ((params?.colorScheme as ColorScheme) || 'light') as ColorScheme;
  const q = useSearchParams()?.get('q') ?? '';

  const rfkId = process.env.NEXT_PUBLIC_SEARCH_RESULTS_RFKID;
  const configured =
    !!process.env.NEXT_PUBLIC_SEARCH_ENV &&
    !!process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY &&
    !!process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  return (
    <section className={cn(searchResultsVariants({ colorScheme }), params?.styles)}>
      <div className="mx-auto w-full max-w-screen-xl px-4 xl:px-8">
        {configured && rfkId ? (
          <SearchResultsWidget rfkId={rfkId} defaultKeyphrase={q} />
        ) : (
          <Card>
            <CardContent className="p-8">
              <p className="font-medium">Search is not configured yet.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Set <code>NEXT_PUBLIC_SEARCH_ENV</code>, <code>NEXT_PUBLIC_SEARCH_CUSTOMER_KEY</code>
                , <code>NEXT_PUBLIC_SEARCH_API_KEY</code>, and{' '}
                <code>NEXT_PUBLIC_SEARCH_RESULTS_RFKID</code> in your environment, then redeploy.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
