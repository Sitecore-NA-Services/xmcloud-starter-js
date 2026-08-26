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
  /** Cosine similarity (0-1) vs the query, added by rerankByRelevance(). Absent until reranked. */
  relevanceScore?: number;
};

/** Facet filters supported by the `content` entity's indexed attributes. */
export type SearchFacets = {
  /** Filters on the `type` facet (e.g. "Project Update", "Case Study"). */
  contentType?: string;
  /** Filters on the `author` facet. */
  author?: string;
  /** Filters on the `tags` facet (topics). Matches articles tagged with ANY of the given values. */
  tags?: string[];
};

type FacetTypeRequest = {
  name: string;
  filter: { type: 'or'; values: string[] };
};

/** Builds the `search.facet.types[]` entries for whichever facets were provided. */
function buildFacetTypes(facets?: SearchFacets): FacetTypeRequest[] | undefined {
  if (!facets) return undefined;
  const types: FacetTypeRequest[] = [];
  if (facets.contentType) types.push({ name: 'type', filter: { type: 'or', values: [facets.contentType] } });
  if (facets.author) types.push({ name: 'author', filter: { type: 'or', values: [facets.author] } });
  if (facets.tags?.length) types.push({ name: 'tags', filter: { type: 'or', values: facets.tags } });
  return types.length ? types : undefined;
}

/**
 * Query the Sitecore Search index and return a small set of article documents.
 * Optional `facets` narrow results by content type, author, and/or topic tags,
 * in addition to the free-text keyphrase.
 */
export async function querySitecoreSearch(keyphrase: string, limit = 5, facets?: SearchFacets): Promise<SearchDoc[]> {
  if (!DOMAIN_ID || !API_KEY || !RFK_ID) return [];

  const facetTypes = buildFacetTypes(facets);

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
            ...(facetTypes ? { facet: { types: facetTypes } } : {}),
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

export type FacetValues = {
  contentTypes: string[];
  authors: string[];
  tags: string[];
};

/**
 * Lists the available values (with result counts) for the content type, author,
 * and tags facets, so a caller can discover valid filter values for
 * querySitecoreSearch's `facets` argument before filtering by them.
 */
export async function listSearchFacetValues(keyphrase = 'the'): Promise<FacetValues> {
  const empty: FacetValues = { contentTypes: [], authors: [], tags: [] };
  if (!DOMAIN_ID || !API_KEY || !RFK_ID) return empty;

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
            query: { keyphrase },
            facet: {
              types: [
                { name: 'type', max: 20 },
                { name: 'author', max: 20 },
                { name: 'tags', max: 30 },
              ],
            },
            // The API rejects limit: 0 ("under minimum allowed value"); 1 is the
            // smallest valid value and we only care about the `facet` block here.
            limit: 1,
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
    if (!res.ok) return empty;
    const json = await res.json();
    const facetList: Array<{ name: string; value?: Array<{ text: string }> }> = json?.widgets?.[0]?.facet ?? [];
    const valuesOf = (name: string) => facetList.find((f) => f.name === name)?.value?.map((v) => v.text) ?? [];
    return {
      contentTypes: valuesOf('type'),
      authors: valuesOf('author'),
      tags: valuesOf('tags'),
    };
  } catch {
    return empty;
  }
}
