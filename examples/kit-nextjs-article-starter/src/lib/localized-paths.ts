import { cache } from 'react';
import scConfig from 'sitecore.config';

/**
 * Site root (Home) item id, used to fetch the top-level pages whose display
 * names drive the localized URL prefixes. Overridable via env for other sites.
 */
const SITE_ROOT_ID =
  process.env.SITECORE_SITE_ROOT_ID || '43919bef-1195-48e9-afc6-e5e165241400';

const EDGE_GRAPHQL = 'https://edge-platform.sitecorecloud.io/v1/content/api/graphql/v1';

export type PrefixMap = Record<string, string>;

/**
 * Builds a prefix map like { "/About": "/nosotros", "/Articles": "/articulos" }
 * from the site's top-level pages, mapping each item-name URL path to its
 * display-name URL path for the given locale.
 *
 * Experience Edge serves `url.path` using the item name even when the CM has
 * `useDisplayName=true` (the setting only affects server-side link generation,
 * not the pre-computed Edge `url.path`). So on the localized (es-MX) site we
 * rewrite link hrefs to the display-name form on the fly. The map is derived
 * from live Edge content (no hardcoded slug lists) and cached per request.
 */
export const getLocalizedPathPrefixes = cache(
  async (locale: string): Promise<PrefixMap> => {
    if (!locale || locale === scConfig.defaultLanguage) return {};
    const contextId =
      process.env.SITECORE_EDGE_CONTEXT_ID || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;
    if (!contextId) return {};

    const query =
      'query($id:String!,$lang:String!){ item(path:$id, language:$lang){ children(hasLayout:true){ results{ name displayName url{ path } } } } }';

    try {
      const res = await fetch(`${EDGE_GRAPHQL}?sitecoreContextId=${contextId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables: { id: SITE_ROOT_ID, lang: locale } }),
        next: { revalidate: 300 },
      });
      const json = await res.json();
      const nodes: Array<{ name?: string; displayName?: string; url?: { path?: string } }> =
        json?.data?.item?.children?.results ?? [];

      const map: PrefixMap = {};
      for (const n of nodes) {
        const path = n?.url?.path;
        const displayName = n?.displayName;
        // Only remap where the display name actually differs from the item name.
        if (path && displayName && displayName !== n.name) {
          map[path] = '/' + displayName;
        }
      }
      return map;
    } catch {
      return {};
    }
  }
);
