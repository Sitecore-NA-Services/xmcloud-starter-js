/**
 * Server-side query helper for the Sitecore Search runtime API
 * (`POST /discover/v2/{domainId}`), used by the chat API routes to retrieve
 * article content for tool-calling (agent) and RAG grounding.
 *
 * Reuses the same Search credentials as the front-end SDK widgets
 * (see `src/components/sitecore-search/search-config.ts`), falling back to the
 * dedicated server-only `SITECORE_SEARCH_*` vars when set.
 */

const DOMAIN_ID =
  process.env.SITECORE_SEARCH_DOMAIN_ID ||
  process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY?.split('-')[1] ||
  '';

const API_URL = process.env.SITECORE_SEARCH_API_URL || `https://discover.sitecorecloud.io/discover/v2/${DOMAIN_ID}`;

const API_KEY = process.env.SITECORE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_SEARCH_API_KEY || '';

const RFK_ID = process.env.SITECORE_SEARCH_WIDGET_ID || process.env.NEXT_PUBLIC_SEARCH_RESULTS_RFKID || '';

const ENTITY = process.env.SITECORE_SEARCH_ENTITY || 'content';

const SOURCE_IDS = (process.env.SITECORE_SEARCH_SOURCE_IDS || process.env.NEXT_PUBLIC_SEARCH_SOURCE_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const LOCALE = process.env.SITECORE_SEARCH_DEFAULT_LOCALE || 'en';

export type SearchDoc = {
  id: string;
  title: string;
  description?: string;
  url?: string;
};

/** Query the Sitecore Search index and return a small set of article documents. */
export async function querySitecoreSearch(keyphrase: string, limit = 5): Promise<SearchDoc[]> {
  if (!DOMAIN_ID || !API_KEY || !RFK_ID) return [];

  const body = {
    context: {
      locale: { language: LOCALE, country: LOCALE === 'es' ? 'mx' : 'us' },
      page: { uri: '/chat' },
    },
    widget: {
      items: [
        {
          rfk_id: RFK_ID,
          entity: ENTITY,
          ...(SOURCE_IDS.length ? { sources: SOURCE_IDS } : {}),
          search: {
            content: {},
            query: { keyphrase: keyphrase?.trim() || 'the' },
            limit,
            offset: 0,
          },
        },
      ],
    },
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: API_KEY },
      body: JSON.stringify(body),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: Array<{ id: string; name?: string; title?: string; description?: string; url?: string }> =
      json?.widgets?.[0]?.content ?? [];
    return items.map((i) => ({
      id: i.id,
      title: i.name || i.title || 'Untitled',
      description: i.description,
      url: i.url,
    }));
  } catch {
    return [];
  }
}
