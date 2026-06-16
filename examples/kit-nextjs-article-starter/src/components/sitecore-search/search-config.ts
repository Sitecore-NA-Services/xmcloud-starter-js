/**
 * Shared Sitecore Search front-end config.
 *
 * The domain has locale settings enabled, so every Search request must include
 * `context.locale`. These default to the domain's default locale (en_us) and can
 * be overridden per environment.
 */
export const SEARCH_LANGUAGE = process.env.NEXT_PUBLIC_SEARCH_LANGUAGE || 'en';
export const SEARCH_COUNTRY = process.env.NEXT_PUBLIC_SEARCH_COUNTRY || 'us';

/**
 * Source IDs to scope results to (Sitecore Search > Sources).
 *
 * A Search domain holds ONE shared index that every source feeds. The recommended
 * multi-site pattern is "one source per site" + filtering results by source — so
 * this site only shows its own content even though other sites share the domain.
 * Comma-separated; empty means "all sources".
 */
export const SEARCH_SOURCE_IDS = (process.env.NEXT_PUBLIC_SEARCH_SOURCE_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
