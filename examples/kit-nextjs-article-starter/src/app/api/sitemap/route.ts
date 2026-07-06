import { type NextRequest } from 'next/server';
import { createSitemapRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';

export const dynamic = 'force-dynamic';

const sitemapHandler = createSitemapRouteHandler({ client, sites, revalidate: 300 });

/**
 * The canonical hostname that XM Cloud Edge bakes into sitemap <loc> URLs.
 * Requests from other domains (e.g. the Spanish domain) need their hostname
 * substituted in the XML so search engines see the correct domain.
 */
const CANONICAL_HOST = process.env.NEXT_PUBLIC_CANONICAL_SITE_HOST || 'article-starter.vercel.app';

/**
 * XM Cloud's native sitemap includes ALL language variants for every page:
 *   - Locale-free paths (e.g. /Articles/...) — English canonical
 *   - Locale-prefixed paths (e.g. /es-MX/Articles/...) — explicit locale variant
 *
 * The Spanish domain uses "domain-as-locale" routing: the middleware detects the
 * domain and sets es-MX locale, so locale-free paths on the Spanish domain serve
 * Spanish content. The /es-MX/ prefix is redundant and not what users navigate to.
 *
 * For a non-canonical hostname, strip <url> entries whose path has an explicit
 * locale prefix — keeping only locale-free paths (which are the canonical URLs
 * for that domain).
 */
function filterLocalePrefixedPaths(xml: string): string {
  // Matches locale segments like /es-MX/, /en/, /fr-CA/, etc.
  const localePrefixRe = /^\/[a-z]{2}(-[A-Z]{2})?\//;
  return xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const match = block.match(/<loc>[^<]*?\/\/[^/]+(\/[^<]*)<\/loc>/);
    if (!match) return block;
    const path = match[1];
    if (localePrefixRe.test(path)) return '';
    return block;
  });
}

export async function GET(request: NextRequest) {
  const response = await sitemapHandler.GET(request);

  const reqHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  if (reqHost && reqHost !== CANONICAL_HOST && response.ok) {
    const xml = await response.text();
    const rewritten = xml.split(CANONICAL_HOST).join(reqHost);

    // Filter to only the locale assigned to this hostname in sites.json
    const siteEntry = (sites as Array<{ name: string; hostName: string; language: string }>).find(
      (s) => s.hostName === reqHost
    );
    const filtered = siteEntry?.language ? filterLocalePrefixedPaths(rewritten) : rewritten;

    return new Response(filtered, { headers: response.headers });
  }

  return response;
}
