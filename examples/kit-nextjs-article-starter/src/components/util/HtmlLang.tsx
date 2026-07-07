'use client';

import { useEffect } from 'react';

/**
 * Syncs the <html lang> attribute to the resolved Sitecore content language.
 * The root layout renders a static lang="en"; this updates it on the client so
 * the document language matches the localized (e.g. es-MX) content.
 */
export default function HtmlLang({ lang }: { lang?: string }) {
  useEffect(() => {
    if (lang) document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
