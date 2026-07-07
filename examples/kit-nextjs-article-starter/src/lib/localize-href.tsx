'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

export type PrefixMap = Record<string, string>;

const LocalizedPathsContext = createContext<PrefixMap>({});

export function LocalizedPathsProvider({
  map,
  children,
}: {
  map: PrefixMap;
  children: ReactNode;
}) {
  return <LocalizedPathsContext.Provider value={map}>{children}</LocalizedPathsContext.Provider>;
}

/**
 * Rewrite an internal href from its item-name form (/About, /Articles/x) to the
 * localized display-name form (/nosotros, /articulos/x) using the prefix map.
 * External/empty hrefs and non-matching paths are returned unchanged.
 */
export function localizeHref(href: string | undefined, map: PrefixMap): string | undefined {
  if (!href || href[0] !== '/') return href;
  for (const from in map) {
    if (href === from) return map[from];
    if (href.startsWith(from + '/')) return map[from] + href.slice(from.length);
  }
  return href;
}

/** Hook returning a stable localizer bound to the current locale's prefix map. */
export function useLocalizeHref() {
  const map = useContext(LocalizedPathsContext);
  return (href: string | undefined) => localizeHref(href, map);
}

/**
 * Hook that returns a function to localize a Content SDK link field's href
 * (returns a shallow copy with the rewritten href, leaving the original intact).
 */
export function useLocalizeLinkField() {
  const map = useContext(LocalizedPathsContext);
  return (field: LinkField): LinkField => {
    if (!field) return field;
    // The Content SDK Link accepts both a flat ({ href }) and a nested
    // ({ value: { href } }) link field shape, so handle both.
    const f = field as unknown as { href?: string; value?: { href?: string } };
    if (typeof f.href === 'string') {
      return { ...field, href: localizeHref(f.href, map) ?? f.href } as LinkField;
    }
    const href = f.value?.href;
    if (!href) return field;
    return { ...field, value: { ...f.value, href: localizeHref(href, map) ?? href } } as LinkField;
  };
}
