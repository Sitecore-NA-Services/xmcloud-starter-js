import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type SearchResultItem = {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  image?: string;
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

function pickFirstString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function readStringArray(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === 'string') return [item.trim()];
        if (!item || typeof item !== 'object') return [];

        const record = item as Record<string, unknown>;
        const label = pickFirstString(record, ['label', 'title', 'name', 'value']);
        return label ? [label] : [];
      })
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if ('value' in record) {
      return readStringArray(record.value);
    }

    if ('items' in record) {
      return readStringArray(record.items);
    }
  }

  return [];
}

function pickFirstStringArray(obj: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = readStringArray(obj[key]);
    if (value.length > 0) return value;
  }

  return [];
}

function readArrayCandidate(value: unknown): Record<string, unknown>[] {
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;

  if (Array.isArray(record)) {
    return record.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
  }

  if (Array.isArray(record.value)) {
    return record.value.filter(
      (item): item is Record<string, unknown> => !!item && typeof item === 'object',
    );
  }

  if (Array.isArray(record.items)) {
    return record.items.filter(
      (item): item is Record<string, unknown> => !!item && typeof item === 'object',
    );
  }

  return [];
}

function normalizeItems(raw: unknown, entity: string): SearchResultItem[] {
  if (!raw || typeof raw !== 'object') return [];

  const response = raw as Record<string, unknown>;

  const content = (response.content ?? response.contents ?? response.data ?? {}) as Record<
    string,
    unknown
  >;

  const entityCandidates = [
    content[entity],
    content.content,
    content.article,
    response[entity],
    response.items,
  ];

  let source: Record<string, unknown>[] = [];
  for (const candidate of entityCandidates) {
    source = readArrayCandidate(candidate);
    if (source.length > 0) break;
  }

  const mapped: SearchResultItem[] = [];

  source.forEach((item, index) => {
    const title = pickFirstString(item, ['title', 'name', 'pageTitle', 'ArticleTitle']);
    const url = pickFirstString(item, ['url', 'link', 'path']);
    const excerpt = pickFirstString(item, [
      'excerpt',
      'description',
      'summary',
      'pageSummary',
      'ogDescription',
    ]);
    const image = pickFirstString(item, ['image', 'thumbnail', 'pageThumbnail']);
    const author = pickFirstString(item, ['author', 'authorName', 'taxAuthor', 'personName']);
    const contentType = pickFirstString(item, [
      'contentType',
      'articleType',
      'taxContentType',
      'type',
    ]);
    const topics = pickFirstStringArray(item, ['topics', 'topic', 'tags', 'taxTopic']);
    const id = pickFirstString(item, ['id', 'item_id', 'entity_id']) || `result-${index}`;

    if (!title || !url) return;

    mapped.push({
      id,
      title,
      url,
      excerpt: excerpt || undefined,
      image: image || undefined,
      author: author || undefined,
      contentType: contentType || undefined,
      topics: topics.length > 0 ? topics : undefined,
    });
  });

  return mapped;
}

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get('q') || '').trim();
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');

    if (!query) {
      return NextResponse.json<SearchResponse>({
        query,
        page,
        pageSize,
        total: 0,
        items: [],
      });
    }

    const apiUrl = getEnvOrThrow('SITECORE_SEARCH_API_URL');
    const domainId = getEnvOrThrow('SITECORE_SEARCH_DOMAIN_ID');
    const widgetId = getEnvOrThrow('SITECORE_SEARCH_WIDGET_ID');
    const entity = process.env.SITECORE_SEARCH_ENTITY || 'content';
    const locale = searchParams.get('locale') || process.env.SITECORE_SEARCH_DEFAULT_LOCALE || 'en';
    const sourceIds = (process.env.SITECORE_SEARCH_SOURCE_IDS || '')
      .split(',')
      .map((source) => source.trim())
      .filter(Boolean);

    const keyHeader = process.env.SITECORE_SEARCH_API_KEY_HEADER || 'Authorization';
    const keyPrefix = process.env.SITECORE_SEARCH_API_KEY_PREFIX || 'Bearer ';
    const apiKey = process.env.SITECORE_SEARCH_API_KEY;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'rfk.domainId': domainId,
    };

    if (apiKey) {
      headers[keyHeader] = `${keyPrefix}${apiKey}`;
    }

    const payload: Record<string, unknown> = {
      context: {
        locale,
        page: { uri: '/search' },
      },
      widget: {
        rfkid: widgetId,
      },
      n_item: Math.max(1, Math.min(pageSize, 50)),
      page_number: Math.max(1, page),
      query: {
        keyphrase: {
          value: [query],
        },
      },
      content: {
        [entity]: {},
      },
      request_for: ['query'],
    };

    if (sourceIds.length > 0) {
      payload.source = {
        include: sourceIds,
      };
    }

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return NextResponse.json(
        {
          error: 'Sitecore Search request failed',
          status: upstream.status,
          detail,
        },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as Record<string, unknown>;
    const items = normalizeItems(data, entity);

    const total =
      Number(data.total_item || data.total || data.total_count || data.found || 0) || items.length;

    return NextResponse.json<SearchResponse>({
      query,
      page,
      pageSize,
      total,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to search articles',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
