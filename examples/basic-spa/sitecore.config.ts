import { defineConfig } from '@sitecore-content-sdk/angular/config';
import { environment } from './src/environments/environment';

/**
 * Client fields come from `environment*.ts` (CSDK_PUBLIC_*); server fields from `process.env`.
 * Pass overrides in the first argument when needed.
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * SDK defaultSite is read from SITECORE_DEFAULT_SITE / CSDK_PUBLIC_SITECORE_DEFAULT_SITE /
 * CSDK_PUBLIC_DEFAULT_SITE — not CSDK_PUBLIC_DEFAULT_SITE_NAME. Map that name here so
 * `ng serve` (no Express multisite) still requests the intended site.
 *
 * Last-resort literal: `sitecore.config.ts` lives outside `sourceRoot`, so Angular
 * fileReplacements may leave `environment` empty while Vite also omits SITECORE_* from
 * `process.env`. Empty defaultSite makes Edge return the first `*` hostname site.
 */
const env = environment as Record<string, string | undefined>;
const DEFAULT_SITE = 'angular-skate-park';

export default defineConfig(
  {
    defaultSite:
      env.CSDK_PUBLIC_DEFAULT_SITE ||
      env.CSDK_PUBLIC_SITECORE_DEFAULT_SITE ||
      env.CSDK_PUBLIC_DEFAULT_SITE_NAME ||
      DEFAULT_SITE,
  },
  env
);
