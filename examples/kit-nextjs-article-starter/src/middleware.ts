import { type NextRequest, type NextFetchEvent, type NextResponse } from 'next/server';
import {
  defineMiddleware,
  AppRouterMultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
  LocaleMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import type { ExperienceParams } from '@sitecore-content-sdk/nextjs/types/middleware/personalize-middleware';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { routing } from './i18n/routing';

/**
 * Map a request hostname to the locale that domain should serve, so the site
 * language can be selected by domain (e.g. an es-MX domain vs the default en
 * domain) without duplicating the content tree.
 *
 * Driven entirely by the LOCALE_DOMAIN_MAP env var so deployment-specific hosts
 * never get baked into source. Format: a comma-separated list of host=locale
 * pairs, for example:
 *   LOCALE_DOMAIN_MAP="es.example.com=es-MX,fr.example.com=fr-FR"
 *
 * Each locale must also be declared in src/i18n/routing.ts and enabled (with
 * content versions) in XM Cloud. The Content SDK's LocaleMiddleware runs first
 * and resolves the locale before any site is known, so hostname-based language
 * selection belongs here rather than in site/multisite config.
 * See: https://doc.sitecore.com/sai/en/developers/content-sdk/internationalization-using-next-intl.html
 */
function parseDomainLocaleMap(raw: string | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  if (!raw) return map;
  for (const pair of raw.split(',')) {
    const [host, loc] = pair.split('=').map((s) => s.trim());
    // Lower-case host keys for case-insensitive matching against the request host.
    if (host && loc) map[host.toLowerCase()] = loc;
  }
  return map;
}

const domainLocaleMap = parseDomainLocaleMap(process.env.LOCALE_DOMAIN_MAP);
const supportedLocales = routing.locales.slice();

/**
 * LocaleMiddleware that selects the language from the request hostname when the
 * URL has no explicit locale prefix. An explicit locale in the path always wins,
 * so /es-MX/... still works on any domain. Falls back to the default resolution
 * (header / Next locale / configured default) when the host has no mapping.
 */
class DomainLocaleMiddleware extends LocaleMiddleware {
  protected getLanguage(req: NextRequest, res?: NextResponse): string {
    const host = this.getHostHeader(req)?.toLowerCase();
    const mapped = host ? domainLocaleMap[host] : undefined;
    if (mapped && supportedLocales.includes(mapped)) {
      return mapped;
    }
    return super.getLanguage(req, res);
  }
}

const locale = new DomainLocaleMiddleware({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  /**
   * List of all supported locales configured in routing.ts
   */
  locales: routing.locales.slice(),
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  // in multilanguage scenarios, we need locale middleware to always run first to ensure locale is set and used correctly by the rest of the middlewares
  skip: () => false,
});

const multisite = new AppRouterMultisiteMiddleware({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const redirects = new RedirectsMiddleware({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.redirects,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

type ExtendedExperienceParams = ExperienceParams & { sampleParam?: string };

// Extend middleware so sampleParam is emitted as a top-level request param
class SampleParamPersonalizeMiddleware extends PersonalizeMiddleware {
  protected getExperienceParams(req: NextRequest): ExperienceParams {
    console.log('[Personalize Middleware] Getting experience params for:', req.nextUrl.pathname);
    const params = super.getExperienceParams(req) as ExtendedExperienceParams;

    const sampleValue =
      req.nextUrl.searchParams.get('sampleParam') ||
      undefined;

    if (sampleValue) {
      params.sampleParam = sampleValue;
      console.log('[Personalize Middleware] sampleParam captured:', sampleValue);
    }

    console.log('[Personalize Middleware] Experience params:', JSON.stringify(params, null, 2));
    return params;
  }
}

const personalize = new SampleParamPersonalizeMiddleware({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.personalize,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log('[Middleware] Processing request:', req.nextUrl.pathname);
  return defineMiddleware(locale, multisite, redirects, personalize).exec(req, ev);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. API route handlers
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: [
    '/',
    '/((?!api/|sitemap|robots|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)',
  ],
};
