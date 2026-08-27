'use client';

import { PageController } from '@sitecore-search/react';
import { toSearchLocale } from '@/lib/search-locale';

/**
 * Sets the Sitecore Search request locale (`context.locale`) from the resolved
 * page language, so search returns results in the visitor's language.
 *
 * The domain has locale settings enabled, so every request must carry a locale.
 * This is multi-domain: the es-MX host resolves language `es-MX` -> Search locale
 * `es`/`mx`; the English host resolves `en` -> `en`/`us`. Set synchronously during
 * render (like the SDK's own examples) and guarded so a Search SDK hiccup can
 * never break page rendering.
 */
export default function SearchLocale({ locale }: { locale?: string }) {
  const [language, country] = toSearchLocale(locale);
  try {
    PageController.getContext().setLocaleLanguage(language);
    PageController.getContext().setLocaleCountry(country);
  } catch {
    // non-fatal
  }
  return null;
}

