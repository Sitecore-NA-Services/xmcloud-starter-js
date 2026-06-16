# Sitecore Search Setup (Article Starter)

The front end is built on the **Sitecore Search JS SDK for React**
(`@sitecore-search/react` + `@sitecore-search/ui`), which is Sitecore's
recommended integration method for React/Next.js apps. The SDK handles
authentication, queries, and — importantly — the visitor event tracking that
powers Search analytics and personalization (something a hand-rolled REST proxy
does not do).

This starter includes:
- A root provider: `src/components/sitecore-search/SearchProvider.tsx`
  (wraps the app in the SDK `WidgetsProvider`; mounted in `src/app/layout.tsx`).
- A header typeahead: `src/components/sitecore-search/PreviewSearchBox.tsx`
  (`usePreviewSearch`) — submits to `/search` on Enter.
- A full results page: `src/components/sitecore-search/SearchResults.tsx`
  (`useSearchResults` with facets, sort, and pagination), rendered at the
  standalone route `src/app/search/page.tsx` (`/search?q=...`).

> The previous server-side REST proxy (`/api/search/articles`) and fetch-based
> `ArticleSearchBox` have been removed in favor of the SDK.

## 1) Configure environment variables

Sitecore Search is called from the browser with a domain-scoped key, so the SDK
config uses public (`NEXT_PUBLIC_*`) variables. Copy `.env.remote.example` to
`.env.local` and set:

- `NEXT_PUBLIC_SEARCH_ENV` — `prod` | `prodEu` | `apse2`
- `NEXT_PUBLIC_SEARCH_CUSTOMER_KEY` — from CEC → **Developer Resources**
- `NEXT_PUBLIC_SEARCH_API_KEY` — from CEC → **Developer Resources**
- `NEXT_PUBLIC_SEARCH_RESULTS_RFKID` — rfkId of your **Search Results** widget
- `NEXT_PUBLIC_SEARCH_PREVIEW_RFKID` — rfkId of your **Preview Search** widget
- `NEXT_PUBLIC_SEARCH_LANGUAGE` / `NEXT_PUBLIC_SEARCH_COUNTRY` — optional locale
  override (defaults to `en` / `us`)

If these are not set, the header renders a plain input that routes to `/search`,
and `/search` shows a "not configured" notice — so the app still builds and runs.

### Locale is required

If your domain has locale settings enabled, every request must include
`context.locale` or the API returns `400 — required context.locale missing`.
`SearchProvider` sets it once at the page level via the SDK's `PageController`:

```ts
PageController.getContext().setLocaleLanguage('en');
PageController.getContext().setLocaleCountry('us');
```

### Multi-site: scoping results to one site

A Search **domain has a single shared index** that every **source** feeds — you do
not create per-site indexes. Sitecore's recommended multi-site pattern is:

> **One source per site**, all in one domain, and **filter results by source**.

So this starter scopes its widgets to its own source via
`NEXT_PUBLIC_SEARCH_SOURCE_IDS` (comma-separated source IDs from **Sources** in the
console). The query hooks apply it with the SDK's `setSources`:

```ts
query.getRequest().setSources(['1260103']); // this site's source only
```

Without it, the widgets return content from *every* source sharing the domain.
You can instead scope a widget in the console with a variation rule (no redeploy).
Use a **separate domain** per site only when sites are truly independent (different
data models, isolation, or no cross-site search) — it's heavier and loses cross-site
search and shared analytics.

### Widgets and facets

In the Sitecore Search console, create (or confirm) two widgets for the
`content` entity and copy their `rfkId`s into the env vars above:
- a **Search Results** widget (for `/search`), and
- a **Preview Search** widget (for the header typeahead).

Facets on `/search` are driven by the **facet attributes enabled on the Search
Results widget** in the console — the UI renders whatever facets the API returns,
so enabling a facet (e.g. content type, topics, author) needs no code change.

## 2) Create your Search source and crawler

In Sitecore Search Admin:

1. Create a web source for your rendering host (for example your Vercel URL).
2. Choose the **Advanced Web Crawler**.
3. Set **Allowed Domains** to your rendering host domain (for example `article-starter.vercel.app`).
4. Open **Triggers** and add seed URLs (absolute URLs), then save and publish:
   - `https://article-starter.vercel.app/`
   - `https://article-starter.vercel.app/Articles`
5. Increase **Max Depth** to `4` or `5` so the crawler can discover article detail pages from the listing page.
6. Configure exclusions for utility paths:
   - `/api/**`
   - `/_next/**`
   - `/**?sc_mode=edit*`
7. Run a test crawl and then a full crawl.

Note: In some Search Admin versions, you may not see a field named "Start URLs". Use **Triggers** for crawl entry points.

## 2.1) Fix sitemap-first crawling (if article URLs are missing from sitemap.xml)

If `https://article-starter.vercel.app/sitemap.xml` does not include article detail URLs, fix sitemap coverage in XM Cloud before relying on sitemap-only crawl.

1. In XM Cloud Content Editor, open your site article pages under `/sitecore/content/.../Home/Articles/*`.
2. For article detail pages, ensure they are not excluded from sitemap (look for fields such as "Exclude from sitemap" and disable exclusion).
3. Publish the updated article pages.
4. Recheck `https://article-starter.vercel.app/sitemap.xml` and verify article detail URLs are present.
5. If sitemap is still incomplete, continue crawling from `https://article-starter.vercel.app/Articles` via Triggers.

## 3) Configure entity mapping

Map crawler fields to your article entity schema. Typical mappings:
- `title` <- article title/headline
- `url` <- canonical page URL
- `description` or `summary` <- page summary/meta description
- `image` <- article thumbnail/open graph image
- `topics` <- taxonomy topics
- `contentType` <- content type taxonomy
- `author` <- author taxonomy

If your widget returns different keys, update normalization in `route.ts`.

For this starter integration, ensure your entity mapping and widget response include these fields:
- `title`
- `url`
- `summary` or `description`
- `image`
- `author`
- `contentType`
- `topics` (array preferred, comma-separated string also supported)

## 4) Create and configure a search widget

In Sitecore Search:
1. Create a query widget for the target entity.
2. Copy the widget id (`rfkid`) into `SITECORE_SEARCH_WIDGET_ID`.
3. Make sure the widget query is configured to return article fields (title/url/summary/image).
   Include `author`, `contentType`, and `topics` in widget response fields.
4. Publish widget changes.

## 5) Validate end-to-end

1. Start the app with `npm run dev` in this starter folder.
2. Open the site and use the header search input.
3. Confirm requests to `/api/search/articles` return results.
4. If no results are returned, verify:
   - Crawl completed and source is healthy
   - Widget is querying the correct source/entity
   - `rfk.domainId` and `rfkid` are correct
   - API URL and auth headers are correct

## Troubleshooting tips

- `502` from `/api/search/articles`: upstream Search API request failed. Check endpoint, headers, key, and domain id.
- Empty result set with `200`: source may not be crawled/indexed yet, or widget filters are too strict.
- Bad links in results: verify `url` field mapping in entity extraction.
