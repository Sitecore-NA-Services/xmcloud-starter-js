# Migration Guide: Pages Router `next-localization` → `next-intl`

## Overview

The `basic-nextjs-pages-router` starter uses `next-localization` (Rosetta) for i18n. This is a legacy, minimally maintained library that only works client-side. Migrating to `next-intl` brings Server Component support, built-in formatting, type safety, and eliminates the ISR caching issue with dictionary updates.

> **Note:** `next-intl` fully supports the Pages Router — this migration does NOT require moving to App Router.

---

## Steps

### 1. Swap Dependencies

```bash
cd examples/basic-nextjs-pages-router
npm uninstall next-localization
npm install next-intl
```

### 2. Add `next-intl` Plugin to `next.config.js`

```js
// next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

module.exports = withNextIntl({
  // ...existing config
});
```

### 3. Create `src/i18n/request.ts`

This replaces the dictionary fetch that currently lives in `getStaticProps`:

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import client from 'lib/sitecore-client';

export default getRequestConfig(async ({ locale }) => {
  const messages = await client.getDictionary({
    locale,
    site: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || '',
  });

  return {
    locale,
    messages,
  };
});
```

### 4. Replace `<I18nProvider>` in `_app.tsx`

**Before:**
```tsx
import { I18nProvider } from 'next-localization';

function App({ Component, pageProps }) {
  const { dictionary, ...rest } = pageProps;
  return (
    <I18nProvider lngDict={dictionary} locale={pageProps.page?.locale || 'en'}>
      <Component {...rest} />
    </I18nProvider>
  );
}
```

**After:**
```tsx
import { NextIntlClientProvider } from 'next-intl';

function App({ Component, pageProps }) {
  const { dictionary, ...rest } = pageProps;
  return (
    <NextIntlClientProvider
      messages={dictionary}
      locale={pageProps.page?.locale || 'en'}
    >
      <Component {...rest} />
    </NextIntlClientProvider>
  );
}
```

### 5. Update `getStaticProps` (Optional Simplification)

The dictionary fetch in `[[...path]].tsx` can stay as-is — `getStaticProps` still passes it as a prop. But you can remove the ISR caching concern by fetching fresh in `getServerSideProps` if desired.

No change required if you keep ISR — `next-intl` works with either approach.

### 6. Update All Component Usages

**Before (`next-localization`):**
```tsx
import { useI18n } from 'next-localization';

const MyComponent = () => {
  const { t } = useI18n();
  return <span>{t('MyKey')}</span>;
};
```

**After (`next-intl`):**
```tsx
import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations();
  return <span>{t('MyKey')}</span>;
};
```

**Find all usages to update:**
```bash
grep -rn "useI18n\|next-localization" src/
```

### 7. (Optional) Add Type Safety for Dictionary Keys

Create typed key constants per component, matching the pattern in the article starter:

```ts
// src/components/my-component/my-component.dictionary.ts
export const MyComponentDictionaryKeys = {
  LABEL: 'MyKey',
} as const;
```

---

## What Changes

| Aspect | Before | After |
|---|---|---|
| Package | `next-localization` | `next-intl` |
| Provider | `<I18nProvider lngDict={...}>` | `<NextIntlClientProvider messages={...}>` |
| Hook | `useI18n().t('key')` | `useTranslations()('key')` |
| Pluralization | Manual | `{count, plural, one {# item} other {# items}}` |
| Date/number formatting | DIY | `useFormatter()` |
| Server Components | Not supported | Supported (if you migrate to App Router later) |

## What Stays the Same

- Sitecore dictionary item structure (Key/Phrase fields)
- `client.getDictionary()` call
- `getStaticProps` / ISR setup (no changes required)
- Locale routing via Next.js `i18n` config
- All dictionary keys in Sitecore

---

## Estimated Effort

| Task | Effort |
|---|---|
| Swap packages + config | 15 minutes |
| Replace `_app.tsx` provider | 10 minutes |
| Update component imports/hooks | 5 minutes per component |
| Testing | 30 minutes |
| **Total (small project)** | **~1–2 hours** |

## Risks

- **Low risk:** API surface is very similar (`t('key')` pattern identical)
- **No Sitecore changes needed:** Dictionary items, templates, and Edge API are unchanged
- **No routing changes:** Next.js i18n routing config is unaffected
- **Rollback:** Revert package swap + provider change to restore `next-localization`
