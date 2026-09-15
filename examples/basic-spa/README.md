# Sitecore Content SDK Angular Sample Application

[SitecoreAI Content SDK Documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/1x/sitecore-content-sdk-for-angular.html)

This starter is a standalone Angular 21 SSR app on Content SDK 1.0. It replaces the previous JSS Angular SPA + Node XM Cloud proxy layout. Editing, personalization, multisite, sitemap, and robots are handled by Express middleware in `src/server.ts`.

## Getting started

```bash
cd examples/basic-spa
cp .env.example .env
# Fill in SITECORE_EDGE_CONTEXT_ID, CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
# CSDK_PUBLIC_DEFAULT_SITE_NAME, and CSDK_PUBLIC_DEFAULT_LANGUAGE
npm install
npm run dev
```

- `npm run dev` — generate env + component map, then `ng serve`
- `npm run build` — production build (Sitecore tooling + Angular SSR)
- `npm start` — production build, then serve the SSR bundle
- `npm run serve:ssr` — serve an already-built SSR bundle (`dist/content-sdk-angular/server/server.mjs`)

The XM Cloud editing host (`angularstarter` in `xmcloud.build.json`) uses `build` / `serve:ssr`.

## Vercel (production host)

Work from this starter directory, the same way as the article starter — not the repo root:

```bash
cd examples/basic-spa
vercel --prod
```

The Express SSR entry is `dist/content-sdk-angular/server/server.mjs` (`npm run serve:ssr`). `vercel.json` runs `npm run build` and uses that server output.

Set these environment variables on the Vercel project (Production, Preview, and Development), matching `.env.example`:

```
SITECORE_EDGE_CONTEXT_ID
CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID
CSDK_PUBLIC_DEFAULT_SITE_NAME
CSDK_PUBLIC_DEFAULT_SITE
SITECORE_DEFAULT_SITE
CSDK_PUBLIC_DEFAULT_LANGUAGE
NG_ALLOWED_HOSTS=*.vercel.app
NG_TRUST_PROXY_HEADERS=X-FORWARDED-PORT,X-FORWARDED-PATH,X-FORWARDED-FOR,X-FORWARDED-HOST,X-FORWARDED-PROTO
```

Do not commit `.env` or `.vercel`.

Required environment variables (see `.env.example`):

```
SITECORE_EDGE_CONTEXT_ID
CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID
CSDK_PUBLIC_DEFAULT_SITE_NAME
CSDK_PUBLIC_DEFAULT_LANGUAGE
```

For SitecoreAI Deploy, also set:

```
NG_TRUST_PROXY_HEADERS=X-FORWARDED-PORT,X-FORWARDED-PATH,X-FORWARDED-FOR,X-FORWARDED-HOST,X-FORWARDED-PROTO
NG_ALLOWED_HOSTS=*.sitecorecloud.io
```
