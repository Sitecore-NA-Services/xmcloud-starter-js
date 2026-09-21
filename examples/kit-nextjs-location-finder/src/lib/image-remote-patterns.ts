import type { NextConfig } from 'next';

type RemotePatterns = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>;

/**
 * Allow-list of hosts the Next.js Image Optimization API may serve from.
 *
 * This lives in its own module so that both next.config.ts and app code can read
 * it. Importing next.config.ts from a component instead drags the build-time
 * next-intl plugin (and its `fs` import) into the bundle, which Turbopack rejects.
 */
export const imageRemotePatterns: RemotePatterns = [
  {
    protocol: 'https',
    hostname: 'edge*.**',
    port: '',
  },
  {
    protocol: 'https',
    hostname: 'xmc-*.**',
    port: '',
  },
];
