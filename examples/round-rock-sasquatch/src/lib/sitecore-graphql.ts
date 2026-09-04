// Small helper for running raw GraphQL queries against the Sitecore Edge/CM endpoint.
//
// `client.getData` is a thin pass-through to the SitecoreClient's configured GraphQL
// client (built from sitecore.config — see src/lib/sitecore-client.ts). We use it here
// to read content/datasource items by id or path so the rendering host can source its
// data from Sitecore instead of local files.
import client from 'src/lib/sitecore-client';
import scConfig from 'sitecore.config';

export type SitecoreImageValue = {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
};

export type SitecoreImageField = {
  value?: SitecoreImageValue;
};

/**
 * Run a GraphQL query against the configured Sitecore endpoint.
 * Returns `null` (and logs) on failure so callers can render a graceful fallback.
 */
export async function sitecoreQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await client.getData<T>(query, variables);
  } catch (err) {
    console.error('[sitecore-graphql] query failed:', err);
    return null;
  }
}

export const SITE_LANGUAGE = scConfig.defaultLanguage || 'en';
