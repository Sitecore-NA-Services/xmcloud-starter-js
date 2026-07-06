import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';
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
 * Map of English item-name URL paths to their Spanish (es-MX) display-name equivalents.
 *
 * XM Cloud Edge delivers link field `url` values as English item-name paths even when
 * `useDisplayName=true` is active on the CM link provider, because Edge pre-computes
 * and caches URLs using the item name rather than the display name. We issue a 301
 * redirect so that when a user on the Spanish domain clicks a link such as
 * /Articles/battery-storage-lessons-from-heat-week, they land on the canonical
 * Spanish display-name URL /articulos/almacenamiento-de-baterias-lecciones-de-la-semana-de-calor.
 *
 * Only translated articles (those with an es-MX __Display name set in XM Cloud)
 * are listed here. Untranslated articles will continue to work as-is on the Spanish
 * domain, showing English content with the es-MX locale context.
 */
const SPANISH_PATH_MAP: Record<string, string> = {
  '/About': '/nosotros',
  '/Articles': '/articulos',
  '/Articles/battery-storage-lessons-from-heat-week': '/articulos/almacenamiento-de-baterias-lecciones-de-la-semana-de-calor',
  '/Articles/closing-the-loop-on-circular-materials': '/articulos/cerrando-el-ciclo-en-materiales-circulares',
  '/Articles/from-pilot-to-program-scaling-resilient-power': '/articulos/del-piloto-al-programa-energia-resiliente-a-escala',
  '/Articles/grant-strategies-for-mid-market-clean-energy': '/articulos/estrategias-de-subvenciones-para-energia-limpia',
  '/Articles/impact-dashboard-what-we-measure-and-why': '/articulos/panel-de-impacto-que-medimos-y-por-que',
  '/Articles/microgrids-and-community-cooling-centers': '/articulos/microrredes-y-centros-de-enfriamiento-comunitario',
  '/Articles/municipal-microgrid-procurement-playbook': '/articulos/guia-de-adquisicion-de-microrredes-municipales',
  '/Articles/safety-first-field-operations-standard': '/articulos/estandar-de-operaciones-de-campo-seguridad-primero',
  '/Articles/school-campus-energy-resilience-checklist': '/articulos/lista-de-verificacion-resiliencia-energetica-en-campus',
  '/Articles/waste-to-watts-in-three-school-districts': '/articulos/residuos-a-vatios-en-tres-distritos-escolares',
};

/**
 * LocaleMiddleware that selects the language from the request hostname when the
 * URL has no explicit locale prefix. An explicit locale in the path always wins,
 * so /es-MX/... still works on any domain.
 *
 * Resolution order:
 * 1. LOCALE_DOMAIN_MAP env var (explicit override, useful before Site Grouping is deployed)
 * 2. site.language from sites.json — populated automatically by sitecore-tools:generate-map
 *    once a Site Grouping item with the correct HostName/POS is pushed to XM Cloud
 * 3. Base middleware resolution (locale header → defaultLanguage → 'en')
 */
class DomainLocaleMiddleware extends LocaleMiddleware {
  protected getLanguage(req: NextRequest, res?: NextResponse): string {
    const host = this.getHostHeader(req)?.toLowerCase();

    // 1. Explicit LOCALE_DOMAIN_MAP override
    const mapped = host ? domainLocaleMap[host] : undefined;
    if (mapped && supportedLocales.includes(mapped)) {
      return mapped;
    }

    // 2. Language from Site Grouping (via sites.json) — driven by the POS field on the
    //    Site Grouping item (e.g. "es-MX=solterra"). This removes the need for
    //    LOCALE_DOMAIN_MAP once the Spanish Site Grouping is deployed to XM Cloud.
    if (host) {
      try {
        const siteLanguage = this.getSite(req, res)?.language;
        if (siteLanguage && supportedLocales.includes(siteLanguage)) {
          return siteLanguage;
        }
      } catch {
        // SiteResolver throws if the host doesn't match — fall through to default
      }
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
  // --- Spanish domain: redirect English-slug paths to Spanish display-name paths ---
  // Check if this request is for the Spanish (es-MX) domain, either via
  // LOCALE_DOMAIN_MAP env var or via the hostName entry injected into sites.json
  // by the patch-sites.mjs script.
  const host = (req.headers.get('host') ?? '').toLowerCase();
  const isSpanishDomain =
    domainLocaleMap[host] === 'es-MX' ||
    sites.some(
      (s: { hostName?: string; language?: string }) =>
        s.hostName?.toLowerCase() === host && s.language === 'es-MX'
    );

  if (isSpanishDomain) {
    const pathname = req.nextUrl.pathname;
    const translated = SPANISH_PATH_MAP[pathname];
    if (translated) {
      const redirectUrl = new URL(translated, req.url);
      redirectUrl.search = req.nextUrl.search; // preserve query params
      return NextResponse.redirect(redirectUrl, { status: 301 });
    }
  }
  // --- End Spanish domain URL translation ---

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
