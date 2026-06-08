'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type SearchResultItem = {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  author?: string;
  contentType?: string;
  topics?: string[];
};

type SearchResponse = {
  query: string;
  page: number;
  pageSize: number;
  total?: number;
  items: SearchResultItem[];
};

export function ArticleSearchBox() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setItems([]);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search/articles?q=${encodeURIComponent(trimmedQuery)}&pageSize=5`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setItems([]);
          setHasSearched(true);
          return;
        }

        const payload = (await response.json()) as SearchResponse;
        setItems(payload.items || []);
        setHasSearched(true);
      } catch {
        if (!controller.signal.aborted) {
          setItems([]);
          setHasSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
      setIsLoading(false);
    };
  }, [trimmedQuery]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles"
          className="border-input bg-background h-10 w-full rounded-full border py-2 pr-4 pl-9 text-sm"
          aria-label="Search articles"
        />
      </div>

      {(isLoading || (hasSearched && trimmedQuery.length >= 2)) && (
        <div className="bg-popover absolute top-12 right-0 left-0 z-50 overflow-hidden rounded-xl border shadow-lg">
          {isLoading ? (
            <div className="text-muted-foreground px-4 py-3 text-sm">Searching...</div>
          ) : items.length > 0 ? (
            <ul className="max-h-96 overflow-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="hover:bg-accent block px-4 py-3 transition-colors"
                    onClick={() => {
                      setQuery('');
                      setItems([]);
                      setHasSearched(false);
                    }}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.excerpt && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{item.excerpt}</p>
                    )}
                    {(item.author || item.contentType) && (
                      <p className="text-muted-foreground mt-2 text-xs">
                        {[item.author, item.contentType].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    {item.topics && item.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.topics.slice(0, 3).map((topic) => (
                          <span
                            key={`${item.id}-${topic}`}
                            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground px-4 py-3 text-sm">No matching articles found.</div>
          )}
        </div>
      )}
    </div>
  );
}
