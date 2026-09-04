'use client';
import Link from 'next/link';

/**
 * Root error boundary (replaces the whole document on an unhandled error in the
 * root layout).
 *
 * Note: this is a Client Component, so it must not pull in the Sitecore `Layout`
 * here — `Layout` references the server import map (`.sitecore/import-map.server`),
 * which transitively imports server-only modules used by this site's data layer
 * (`next/headers` in `src/lib/cart`, `node:fs` in `src/data/products`). Bundling
 * those into the client error boundary breaks every route at build time. The page
 * also wouldn't render those server components in the browser anyway, so a static
 * fallback is the correct behaviour here.
 */
export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: 10 }}>
          <h1>500 Internal Server Error</h1>
          <p>
            There is a problem with the resource you are looking for, and it cannot be displayed.
          </p>
          <Link href="/">Go to the Home page</Link>
        </div>
      </body>
    </html>
  );
}
