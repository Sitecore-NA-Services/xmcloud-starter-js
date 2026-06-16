'use client';

import type { ReactNode } from 'react';
import { PageController, WidgetsProvider } from '@sitecore-search/react';
import { SEARCH_COUNTRY, SEARCH_LANGUAGE } from './search-config';

/**
 * Root provider for Sitecore Search widgets.
 *
 * Wraps the app so any `@sitecore-search/react` query hook (useSearchResults,
 * usePreviewSearch, ...) can run. The SDK orchestrates authentication, requests,
 * and event tracking (the visitor UUID cookie that powers Search analytics and
 * personalization) — which is why the SDK is the recommended integration method
 * over calling the REST API directly.
 *
 * Credentials are read from public env vars (Sitecore Search is designed to be
 * called from the browser with a domain-scoped key):
 *   - NEXT_PUBLIC_SEARCH_ENV          "prod" | "prodEu" | "apse2"
 *   - NEXT_PUBLIC_SEARCH_CUSTOMER_KEY customer key from CEC > Developer Resources
 *   - NEXT_PUBLIC_SEARCH_API_KEY      API key from CEC > Developer Resources
 *
 * If the credentials are not configured, children render without the provider so
 * the rest of the app keeps working.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const env = process.env.NEXT_PUBLIC_SEARCH_ENV;
  const customerKey = process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY;
  const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  if (!env || !customerKey || !apiKey) {
    return <>{children}</>;
  }

  // The domain has locale settings enabled, so every Search request must include
  // context.locale. Set it once at the page level; the SDK stores it and applies
  // it to all subsequent requests/widgets. Wrapped defensively so a Search SDK
  // hiccup can never break page rendering.
  try {
    PageController.getContext().setLocaleLanguage(SEARCH_LANGUAGE);
    PageController.getContext().setLocaleCountry(SEARCH_COUNTRY);
  } catch {
    // non-fatal
  }

  return (
    <WidgetsProvider
      env={env as 'prod' | 'prodEu' | 'apse2'}
      customerKey={customerKey}
      apiKey={apiKey}
      // Set to true if the rendering host is a subdomain of an apex domain that
      // restricts cookies, so the visitor-tracking cookie is set at the right level.
      publicSuffix={true}
    >
      {children}
    </WidgetsProvider>
  );
}
