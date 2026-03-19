# i18n & Dictionary Guide — XM Cloud Starters

## Architecture Overview

This repo has two different i18n approaches depending on the Next.js routing model:

| | **App Router Starters** (article, location, product, skate-park) | **Pages Router Starter** (basic-nextjs-pages-router) |
|---|---|---|
| **Library** | `next-intl` | `next-localization` (Rosetta) |
| **Dictionary fetch** | Server-side per request (`getRequestConfig`) | ISR-cached in `getStaticProps` (5s revalidate) |
| **Provider** | Implicit (server context) | Explicit `<I18nProvider>` in `_app.tsx` |
| **Usage** | `useTranslations()` from `next-intl` | `useI18n().t()` from `next-localization` |
| **Server Components** | Supported | Not supported |
| **Type safety** | Typed keys via `dictionary.tsx` files | Raw string keys |

---

## How It Works — App Router (Article Starter)

### Data Flow

```
Sitecore Dictionary Items
        ↓ (publish)
Sitecore Edge API
        ↓ (getDictionary)
src/i18n/request.ts          ← fetches dictionary per request via getRequestConfig()
        ↓
next-intl server context     ← makes translations available to all components
        ↓
useTranslations() hook       ← components read translated strings
```

### Key Files

| File | Purpose |
|---|---|
| `src/i18n/request.ts` | Calls `client.getDictionary()` on every request, provides locale + messages to `next-intl` |
| `src/i18n/routing.ts` | Defines supported locales (`en`, `en-CA`) |
| `src/variables/dictionary.tsx` | Central registry of all dictionary key constants |
| `src/components/*/[name].dictionary.ts` | Per-component dictionary key definitions |

### Adding a New Dictionary Entry

1. **Create the dictionary item in Sitecore:**
   - Path: `/sitecore/content/[site]/Dictionary/[folder]/[ItemName]`
   - Template: `Dictionary entry` (`{6D1CD897-1936-4A3A-A511-289A94C2A7B1}`)
   - Set `Key` field (e.g., `TestEntryKey`)
   - Set `Phrase` field (e.g., `TestEntryValue`)
   - Publish the item

2. **Add a dictionary key constant** (optional but recommended):
   ```ts
   // src/components/my-component/my-component.dictionary.ts
   export const MyComponentDictionaryKeys = {
     MY_KEY: 'TestEntryKey',  // must match the Key field in Sitecore
   };
   ```

3. **Register in the central dictionary file:**
   ```ts
   // src/variables/dictionary.tsx
   import { MyComponentDictionaryKeys } from '@/components/my-component/my-component.dictionary';

   export const dictionaryKeys = {
     ...SubscriptionBannerDictionaryKeys,
     ...ArticleHeaderDictionaryKeys,
     ...MyComponentDictionaryKeys,  // ← add here
   };
   ```

4. **Use in a component:**
   ```tsx
   'use client';
   import { useTranslations } from 'next-intl';
   import { dictionaryKeys } from '@/variables/dictionary';

   const MyComponent = () => {
     const t = useTranslations();
     const label = t(dictionaryKeys.MY_KEY);
     return <span>{label}</span>;
   };
   ```

---

## How It Works — Pages Router

### Data Flow

```
Sitecore Dictionary Items
        ↓ (publish)
Sitecore Edge API
        ↓ (getDictionary)
getStaticProps in [[...path]].tsx   ← fetches dictionary, cached by ISR (5s revalidate)
        ↓
pageProps.dictionary                ← passed as serialized JSON prop
        ↓
<I18nProvider lngDict={dictionary}> ← wraps app in _app.tsx
        ↓
useI18n().t('key')                  ← components read translated strings
```

### Key Files

| File | Purpose |
|---|---|
| `src/pages/[[...path]].tsx` | `getStaticProps` calls `client.getDictionary()`, returns as prop |
| `src/pages/_app.tsx` | Wraps app in `<I18nProvider>` with dictionary and locale |

### Using a Dictionary Entry

```tsx
import { useI18n } from 'next-localization';

const MyComponent = () => {
  const { t } = useI18n();
  return <span>{t('TestEntryKey')}</span>;
};
```

---

## Library Comparison: `next-intl` vs `next-localization`

| Feature | `next-intl` | `next-localization` |
|---|---|---|
| App Router support | Full (Server + Client Components) | None (client-only) |
| Server Components | `useTranslations()` works without `'use client'` | Not supported |
| Provider required | No (uses `getRequestConfig` on server) | Yes (`<I18nProvider>`) |
| Pluralization | Built-in ICU format | Manual only |
| Date/number formatting | Built-in `useFormatter()` | None |
| Rich text in translations | Supported | String interpolation only |
| Nested keys | Dot notation (`section.key`) | Flat key/value only |
| Type safety | TypeScript module augmentation | None |
| Bundle size | ~14KB | ~1KB |
| Maintenance | Actively maintained | Legacy, minimal updates |

**Recommendation:** Use `next-intl` for all new App Router starters. `next-localization` is only for the legacy Pages Router starter.

---

## Cache Behavior & Troubleshooting

### App Router (article starter)

- Dictionary is fetched **per request** in `getRequestConfig()` — no Next.js caching layer
- Only cache is **Sitecore Edge CDN** (typically 5–15 minutes after publish)
- After publishing in Sitecore, wait for Edge cache to clear, then refresh

### Pages Router

- Dictionary is fetched in `getStaticProps` with **ISR `revalidate: 5`**
- Two cache layers stacked: **Sitecore Edge CDN** + **Next.js ISR**
- ISR is stale-while-revalidate: first request gets stale data, second request (after 5s) gets fresh data
- No on-demand revalidation API route exists — Sitecore publish cannot trigger cache purge

### If Dictionary Changes Aren't Showing Up

1. **Verify the item is published** in Sitecore Content Editor
2. **Check Sitecore Edge** — query the Edge API directly to confirm the dictionary is updated:
   ```
   https://edge-platform.sitecorecloud.io/v1/content/api/dictionary?siteName=YOUR_SITE&language=en
   ```
3. **App Router:** Hard refresh the page — dictionary should update within Edge cache TTL
4. **Pages Router:** Hard refresh **twice** with 5+ seconds between refreshes (ISR stale-while-revalidate)
5. **Deployed on Vercel:** ISR cache persists across deployments — redeploy or use Vercel's purge API
6. **Local dev:** Delete `.next/` folder and restart dev server for a clean slate

### Adding On-Demand Revalidation (Pages Router)

To allow Sitecore publish to trigger cache purge, create an API route:

```ts
// src/pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.query.secret;
  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const path = req.query.path as string;
  try {
    await res.revalidate(path || '/');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

Then configure a Sitecore webhook to call:
```
https://your-site.com/api/revalidate?secret=YOUR_SECRET&path=/
```

---

## Sitecore Dictionary Item Structure

- **Template:** Dictionary entry (`{6D1CD897-1936-4A3A-A511-289A94C2A7B1}`)
- **Location:** `/sitecore/content/[site]/Dictionary/`
- **Fields:**
  - `Key` (shared) — the lookup key used in code
  - `Phrase` (unversioned) — the translated value
- **Example:** Key = `TestEntryKey`, Phrase = `TestEntryValue`
- **Access in code:** `t('TestEntryKey')` returns `"TestEntryValue"`
