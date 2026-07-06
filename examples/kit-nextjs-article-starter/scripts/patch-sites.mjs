/**
 * patch-sites.mjs
 *
 * Runs after `sitecore-tools project build` (which generates .sitecore/sites.json).
 *
 * sitecore-tools has two known limitations for multi-domain/multi-language setups:
 *   1. It deduplicates Site Groupings that share the same SiteName field, appending -1, -2, etc.
 *   2. It always generates `"language": "en"` regardless of the Language field on the item.
 *
 * This script patches sites.json to ensure the Spanish domain entry exists with the
 * correct site name and language — whether or not sitecore-tools generated it.
 *
 * The solterra-es-mx Site Grouping in XM Cloud covers the intent; this script makes
 * it effective without depending on sitecore-tools generating the entry correctly.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitesPath = resolve(__dirname, '../.sitecore/sites.json');

/**
 * Entries to guarantee exist in sites.json.
 * Each must be placed before the matching name's wildcard entry so
 * SiteResolver resolves specific hostnames before the "*" fallback.
 */
const REQUIRED_ENTRIES = [
  {
    name: 'solterra',
    hostName: 'article-starter-keb-2293s-projects.vercel.app',
    language: 'es-MX',
  },
];

let sites = JSON.parse(readFileSync(sitesPath, 'utf-8'));

for (const entry of REQUIRED_ENTRIES) {
  // Remove any existing entry for this hostname (e.g. solterra-1 with wrong language)
  const before = sites.length;
  sites = sites.filter((s) => s.hostName !== entry.hostName);
  const removed = before - sites.length;

  // Find the wildcard entry for the same site name and insert before it
  const wildcardIdx = sites.findIndex((s) => s.name === entry.name && s.hostName === '*');
  const insertAt = wildcardIdx >= 0 ? wildcardIdx : 0;
  sites.splice(insertAt, 0, entry);

  const action = removed > 0 ? `replaced ${removed} existing entry/entries` : 'injected';
  console.log(`patch-sites: ${action} → { name: "${entry.name}", hostName: "${entry.hostName}", language: "${entry.language}" }`);
}

writeFileSync(sitesPath, JSON.stringify(sites, null, 2));
console.log('patch-sites: sites.json updated');

