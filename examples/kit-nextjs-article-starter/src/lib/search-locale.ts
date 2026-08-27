/**
 * Maps a Sitecore content language (e.g. "es-MX", "en") to the Sitecore Search
 * API's language/country pair. Shared by the client-side Search SDK locale
 * setter (SearchLocale.tsx) and the server-side chat API routes, so both the
 * `/search` page and the Agent/RAG chat demos resolve the same visitor locale
 * to the same Search context the same way.
 */
export function toSearchLocale(locale?: string): [string, string] {
  if (!locale) return ['en', 'us'];
  const [lang, region] = locale.split('-');
  const language = (lang || 'en').toLowerCase();
  const country = (region || (language === 'es' ? 'mx' : 'us')).toLowerCase();
  return [language, country];
}
