'use client';

/**
 * Full search-results experience built on the Sitecore Search JS SDK for React.
 *
 * Best-practice notes (this file is a teaching reference):
 *  - Data + analytics come from the SDK query hook `useSearchResults`. The hook
 *    manages keyphrase, paging, sorting and facet selection state for you and —
 *    crucially — emits the visitor events (via the WidgetsProvider) that power
 *    Search analytics and personalization. That event tracking is the main reason
 *    to use the SDK over calling the REST API by hand.
 *  - The UI uses theme-independent (neutral) styling with native form controls so
 *    it renders correctly on the standalone /search route, which is outside the
 *    Sitecore-injected brand theme.
 *  - Facets only appear if your administrator has enabled facet attributes on the
 *    widget (rfkId) in the Sitecore Search console. The component renders whatever
 *    facets the API returns, so no code change is needed when facets are added.
 */

import {
  WidgetDataType,
  useSearchResults,
  useSearchResultsSelectedFacets,
  widget,
  type SearchResultsInitialState,
} from '@sitecore-search/react';
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

const ResultsSkeleton = () => (
  <div className="grid gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-100" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
      </div>
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
      // Scope results to this site's source(s). The domain index is shared across
      // sites, so without this the widget would return every site's content.
      if (SEARCH_SOURCE_IDS.length) query.getRequest().setSources(SEARCH_SOURCE_IDS);
      return query;
    },
    state: {
      keyphrase: defaultKeyphrase,
      page: 1,
      itemsPerPage: defaultItemsPerPage,
    },
  });

  // Build a lookup of currently-selected facet values so we can mark checkboxes.
  const selectedFacets = useSearchResultsSelectedFacets();
  const selectedSet = new Set<string>();
  selectedFacets.forEach((f) =>
    (f.values as Array<{ id?: string }>)?.forEach((v) => {
      if (v?.id) selectedSet.add(`${f.id}:${v.id}`);
    }),
  );
  const hasSelectedFacets = selectedSet.size > 0;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const loading = isLoading || isFetching;

  return (
    <div ref={widgetRef} className="text-neutral-900">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        {/* ----------------------------- Facets ----------------------------- */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasSelectedFacets && (
              <button
                type="button"
                className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                onClick={() => onClearFilters()}
              >
                Clear all
              </button>
            )}
          </div>

          {facets.length === 0 ? (
            <p className="text-sm text-neutral-500">No filters are configured for this widget yet.</p>
          ) : (
            facets.map((facet, facetIndex) => (
              <div key={facet.name} className="space-y-3 border-b border-neutral-200 pb-5">
                <h3 className="text-sm font-medium">{facet.label || facet.name}</h3>
                <ul className="space-y-2">
                  {facet.value.map((value, facetValueIndex) => {
                    const checked = selectedSet.has(`${facet.name}:${value.id}`);
                    const inputId = `facet-${facet.name}-${value.id}`;
                    return (
                      <li key={value.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={inputId}
                          checked={checked}
                          onChange={(e) =>
                            onFacetClick({
                              facetId: facet.name,
                              facetIndex,
                              facetValueId: value.id,
                              facetValueIndex,
                              checked: e.target.checked,
                              type: 'valueId',
                            })
                          }
                          className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                        />
                        <label
                          htmlFor={inputId}
                          className="flex flex-1 items-center justify-between gap-2 text-sm"
                        >
                          <span className="truncate">{value.text}</span>
                          <span className="text-xs text-neutral-500">{value.count}</span>
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
            <p className="text-sm text-neutral-600" aria-live="polite">
              {loading
                ? 'Searching…'
                : `${totalItems} result${totalItems === 1 ? '' : 's'}${
                    defaultKeyphrase ? ` for “${defaultKeyphrase}”` : ''
                  }`}
            </p>

            {sortChoices.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                Sort
                <select
                  value={sortType || sortChoices[0]?.name}
                  onChange={(e) => onSortChange({ name: e.target.value })}
                  className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-900"
                >
                  {sortChoices.map((choice) => (
                    <option key={choice.name} value={choice.name}>
                      {sortLabelOf(choice)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {loading ? (
            <ResultsSkeleton />
          ) : articles.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
              <p className="font-medium">No articles found</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try a different keyword{hasSelectedFacets ? ' or clear your filters' : ''}.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4">
              {articles.map((article, index) => (
                <li key={article.id}>
                  <a
                    href={article.url}
                    className="block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
                    onClick={() =>
                      // Tracks a result-click event for Search analytics/personalization.
                      onItemClick({ id: article.id, index, sourceId: article.source_id })
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold">{titleOf(article)}</h3>
                      {article.type && (
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                          {article.type}
                        </span>
                      )}
                    </div>
                    {article.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{article.description}</p>
                    )}
                    {article.author && (
                      <p className="mt-3 text-xs text-neutral-500">By {article.author}</p>
                    )}
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
              <button
                type="button"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => onPageNumberChange({ page: page - 1 })}
              >
                Previous
              </button>
              <span className="px-2 text-sm text-neutral-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40"
                disabled={page >= totalPages}
                onClick={() => onPageNumberChange({ page: page + 1 })}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
};

/**
 * Register the UI component as a Search Results widget. The `rfkId` is supplied
 * where the widget is rendered (see /search) and must match a Search Results
 * widget configured in the Sitecore Search console.
 */
const SearchResultsWidget = widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, 'content');

export default SearchResultsWidget;
