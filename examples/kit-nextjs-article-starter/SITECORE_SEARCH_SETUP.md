# Sitecore Search Setup (Article Starter)

This starter now includes:
- A server-side search proxy at `src/app/api/search/articles/route.ts`
- A header search box at `src/components/sitecore-search/ArticleSearchBox.tsx`

## 1) Configure environment variables

Copy `.env.remote.example` to `.env.local` and set:
- `SITECORE_SEARCH_API_URL`
- `SITECORE_SEARCH_DOMAIN_ID`
- `SITECORE_SEARCH_WIDGET_ID`
- `SITECORE_SEARCH_ENTITY`

Optional authentication settings:
- `SITECORE_SEARCH_API_KEY`
- `SITECORE_SEARCH_API_KEY_HEADER` (default `Authorization`)
- `SITECORE_SEARCH_API_KEY_PREFIX` (default `Bearer `)

Optional filtering and locale:
- `SITECORE_SEARCH_SOURCE_IDS` (comma-separated)
- `SITECORE_SEARCH_DEFAULT_LOCALE`

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
