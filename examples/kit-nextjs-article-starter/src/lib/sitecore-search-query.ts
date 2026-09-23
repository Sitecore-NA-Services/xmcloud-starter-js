/**
 * Server-side query helper for the Sitecore Search runtime API
 * (`POST /discover/v2/{domainId}`), used by the chat API routes to retrieve
 * article content for tool-calling (agent) and RAG grounding.
 *
 * Reuses the same Search credentials as the front-end SDK widgets
 * (see `src/components/sitecore-search/search-config.ts`), falling back to the
 * dedicated server-only `SITECORE_SEARCH_*` vars when set.
 */

import { toSearchLocale } from '@/lib/search-locale';

const DOMAIN_ID =
  process.env.SITECORE_SEARCH_DOMAIN_ID ||
  process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY?.split('-')[1] ||
  '';

const API_URL = process.env.SITECORE_SEARCH_API_URL || `https://discover.sitecorecloud.io/discover/v2/${DOMAIN_ID}`;

const API_KEY = process.env.SITECORE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_SEARCH_API_KEY || '';

const RFK_ID = process.env.SITECORE_SEARCH_WIDGET_ID || process.env.NEXT_PUBLIC_SEARCH_RESULTS_RFKID || '';

/**
 * The `questions_answers` widget auto-created by the Q&A group in
 * CEC > Domain Settings > Feature Configuration > Question & Answer Groups.
 * Separate from RFK_ID: Q&A pairs are NOT part of the `content` entity index,
 * so they are unreachable through a normal content search.
 */
const QUESTIONS_RFK_ID =
  process.env.SITECORE_SEARCH_QUESTIONS_WIDGET_ID || process.env.NEXT_PUBLIC_SEARCH_QUESTIONS_RFKID || '';

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

// The Search API's `eq` facet filters take an opaque "facetid_<base64>" token,
// not the raw facet value, even though facet listings expose the raw text.
// The token is just base64(JSON.stringify({ type: 'eq', name, value })) -
// reverse-engineered by comparing listSearchFacetValues() output to what the
// filter API accepts, so we build it ourselves instead of round-tripping.
function buildFacetId(name: string, value: string): string {
  const payload = JSON.stringify({ type: 'eq', name, value });
  return `facetid_${Buffer.from(payload, 'utf-8').toString('base64')}`;
}

/** Builds the `search.facet.types[]` entries for whichever facets were provided. */
function buildFacetTypes(facets?: SearchFacets): FacetTypeRequest[] | undefined {
  if (!facets) return undefined;
  const types: FacetTypeRequest[] = [];
  if (facets.contentType)
    types.push({ name: 'type', filter: { type: 'or', values: [buildFacetId('type', facets.contentType)] } });
  if (facets.author)
    types.push({ name: 'author', filter: { type: 'or', values: [buildFacetId('author', facets.author)] } });
  if (facets.tags?.length)
    types.push({ name: 'tags', filter: { type: 'or', values: facets.tags.map((t) => buildFacetId('tags', t)) } });
  return types.length ? types : undefined;
}

/**
 * Query the Sitecore Search index and return a small set of article documents.
 * Optional `facets` narrow results by content type, author, and/or topic tags,
 * in addition to the free-text keyphrase. `locale` is the visitor's resolved
 * Sitecore content language (e.g. "es-MX"); defaults to SITECORE_SEARCH_DEFAULT_LOCALE
 * when the caller doesn't know the page locale.
 */
export async function querySitecoreSearch(
  keyphrase: string,
  limit = 5,
  facets?: SearchFacets,
  locale?: string,
): Promise<SearchDoc[]> {
  if (!DOMAIN_ID || !API_KEY || !RFK_ID) return [];

  const facetTypes = buildFacetTypes(facets);
  const [language, country] = toSearchLocale(locale || LOCALE);

  const body = {
    context: {
      locale: { language, country },
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
export async function listSearchFacetValues(keyphrase = 'the', locale?: string): Promise<FacetValues> {
  const empty: FacetValues = { contentTypes: [], authors: [], tags: [] };
  if (!DOMAIN_ID || !API_KEY || !RFK_ID) return empty;

  const [language, country] = toSearchLocale(locale || LOCALE);

  const body = {
    context: {
      locale: { language, country },
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

/** A generated question/answer pair from the Sitecore Search Q&A capability. */
export type QuestionAnswer = {
  id?: string;
  question: string;
  answer: string;
};

export type QuestionsResult = {
  /** The single best answer to the asked question, when the engine can produce one. */
  exact?: QuestionAnswer;
  /** Pre-generated pairs related to the question. */
  related: QuestionAnswer[];
};

/**
 * Query the Sitecore Search Questions & Answers capability.
 *
 * These are editorially curated, AI-generated Q&A pairs — an author can correct
 * or hide an answer in the Q&A Browser, and that curation is invisible to a plain
 * content search. That is the whole reason to call this in addition to
 * `querySitecoreSearch`, which only ever returns article documents.
 *
 * Behaviour notes that are easy to get wrong:
 *  - Scoping comes from the Q&A group config; a request-level `sources` filter is
 *    silently ignored on this widget, so none is sent.
 *  - `exact_answer` must be an empty object. Passing `query_types: ['*']`
 *    suppresses exact-answer generation entirely.
 *  - When no exact answer can be produced the API returns error code 103
 *    (`machine_cannot_generate_answer`) and omits `answer`. That is expected, not
 *    a failure — the related questions are still useful.
 *  - The capability is English-only today, so non-English locales return nothing
 *    rather than a confusing English answer on a Spanish page.
 */
export async function querySitecoreQuestions(
  keyphrase: string,
  relatedLimit = 4,
  locale?: string,
): Promise<QuestionsResult> {
  const empty: QuestionsResult = { related: [] };
  if (!DOMAIN_ID || !API_KEY || !QUESTIONS_RFK_ID) return empty;

  const trimmed = keyphrase?.trim();
  // Minimum keyphrase length is 1; an empty one is an API error, not "browse all".
  if (!trimmed) return empty;

  const [language, country] = toSearchLocale(locale || LOCALE);
  if (language !== 'en') return empty;

  const body = {
    context: {
      locale: { language, country },
      page: { uri: '/chat' },
    },
    widget: {
      items: [
        {
          rfk_id: QUESTIONS_RFK_ID,
          entity: ENTITY,
          questions: {
            keyphrase: trimmed,
            exact_answer: {},
            related_questions: { limit: relatedLimit, offset: 0 },
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
    const w = json?.widgets?.[0];
    if (!w) return empty;

    const normalize = (x: { id?: string; question?: string; answer?: string } | undefined) =>
      x?.question && x?.answer ? { id: x.id, question: x.question, answer: x.answer } : undefined;

    const exact = normalize(w.answer);
    const related = (w.related_questions ?? [])
      .map(normalize)
      .filter((x: QuestionAnswer | undefined): x is QuestionAnswer => !!x)
      // The exact answer is often also the top related question; don't repeat it.
      .filter((x: QuestionAnswer) => !exact || x.question !== exact.question);

    return { exact, related };
  } catch {
    return empty;
  }
}
