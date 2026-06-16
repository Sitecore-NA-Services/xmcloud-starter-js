'use client';

/**
 * Header preview-search (typeahead) built on the Sitecore Search JS SDK.
 *
 * `usePreviewSearch` returns a small, contextual result set as the visitor types
 * and tracks the interaction events that feed Search analytics/personalization.
 * Submitting (Enter) or "View all results" navigates to the full /search page.
 *
 * If the Search credentials are not configured, a plain input is rendered that
 * still routes to /search on submit — so the header keeps working without the SDK.
 */

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  WidgetDataType,
  usePreviewSearch,
  widget,
  type PreviewSearchInitialState,
} from '@sitecore-search/react';
import { SEARCH_SOURCE_IDS } from './search-config';

type ArticleModel = {
  id: string;
  name?: string;
  title?: string;
  url?: string;
  image_url?: string;
  source_id?: string;
};

type InitialState = PreviewSearchInitialState<'itemsPerPage'>;

const inputClass =
  'h-10 w-full rounded-full border border-neutral-300 bg-white py-2 pr-4 pl-9 text-sm text-neutral-900';

function goToSearch(router: ReturnType<typeof useRouter>, query: string) {
  const q = query.trim();
  router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
}

/** SDK-powered typeahead, rendered only when Search credentials are present. */
const PreviewSearchComponent = ({ defaultItemsPerPage = 6 }: { defaultItemsPerPage?: number }) => {
  const router = useRouter();
  const [value, setValue] = useState('');

  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    queryResult: {
      isFetching,
      isLoading,
      data: { content: articles = [] as ArticleModel[] } = {},
    },
  } = usePreviewSearch<ArticleModel, InitialState>({
    query: (query) => {
      // Scope the typeahead to this site's source(s) (shared domain index).
      if (SEARCH_SOURCE_IDS.length) query.getRequest().setSources(SEARCH_SOURCE_IDS);
      return query;
    },
    state: { itemsPerPage: defaultItemsPerPage },
  });

  const loading = isLoading || isFetching;

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setValue(next);
      onKeyphraseChange({ keyphrase: next });
    },
    [onKeyphraseChange],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    goToSearch(router, value);
  };

  const showDropdown = value.trim().length >= 2;

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={value}
          onChange={onChange}
          autoComplete="off"
          placeholder="Search articles"
          aria-label="Search articles"
          className={inputClass}
        />
      </div>

      {showDropdown && (
        <div
          ref={widgetRef}
          className="absolute top-12 right-0 left-0 z-50 overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-lg"
        >
          {loading ? (
            <div className="px-4 py-3 text-sm text-neutral-500">Searching…</div>
          ) : articles.length > 0 ? (
            <ul className="max-h-96 overflow-auto">
              {articles.map((article, index) => (
                <li key={article.id}>
                  <a
                    href={article.url}
                    className="block px-4 py-3 transition-colors hover:bg-neutral-100"
                    onClick={(e) => {
                      e.preventDefault();
                      onItemClick({ id: article.id, index, sourceId: article.source_id });
                      if (article.url) router.push(article.url);
                    }}
                  >
                    <p className="text-sm font-medium">{article.name || article.title}</p>
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="block w-full px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-100"
                  onClick={() => goToSearch(router, value)}
                >
                  View all results →
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-neutral-500">No matching articles found.</div>
          )}
        </div>
      )}
    </form>
  );
};

const PreviewSearchWidget = widget(PreviewSearchComponent, WidgetDataType.PREVIEW_SEARCH, 'content');

/** Fallback used when Search is not configured: routes to /search on submit. */
function PlainSearchInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        goToSearch(router, value);
      }}
      className="relative w-full max-w-sm"
    >
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search articles"
        aria-label="Search articles"
        className={inputClass}
      />
    </form>
  );
}

export function PreviewSearchBox() {
  const configured =
    !!process.env.NEXT_PUBLIC_SEARCH_ENV &&
    !!process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY &&
    !!process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  const rfkId = process.env.NEXT_PUBLIC_SEARCH_PREVIEW_RFKID;

  if (!configured || !rfkId) {
    return <PlainSearchInput />;
  }

  return <PreviewSearchWidget rfkId={rfkId} />;
}
