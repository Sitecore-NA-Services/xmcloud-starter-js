import { HttpInterceptorFn } from '@angular/common/http';
import { EDITING_PARAMS_HEADER, LOADER_DATA_ENDPOINT } from '@sitecore-content-sdk/angular';
import { isDesignLibraryMode } from '@sitecore-content-sdk/content/editing';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';

/** Path Sitecore Pages loads the editing host on; mirrors the SDK's own DEFAULT_ENDPOINT. */
const EDITING_RENDER_PATH = '/api/editing/render';

/**
 * Rebuilds the payload `createEditingRenderMiddleware` stashes on the SSR request, mirroring
 * its `buildPreviewData()` shape so a `/_data` call is treated exactly like the original
 * editing render.
 */
const buildPreviewData = (query: URLSearchParams): Record<string, unknown> => {
  const mode = query.get('mode') ?? '';
  const common = {
    site: query.get('sc_site') ?? '',
    itemId: query.get('sc_itemid') ?? '',
    language: query.get('sc_lang') ?? '',
    mode,
  };

  if (isDesignLibraryMode(mode)) {
    const renderingId = query.get('sc_renderingId');
    const dataSourceId = query.get('dataSourceId');
    const version = query.get('sc_version');
    const generation = query.get('generation');
    return {
      ...common,
      componentUid: query.get('sc_uid') ?? '',
      ...(renderingId && { renderingId }),
      ...(dataSourceId && { dataSourceId }),
      ...(version && { version }),
      ...(generation && { generation }),
    };
  }

  const previewTime = query.get('sc_previewTime');
  return {
    ...common,
    variantId: query.get('sc_variant') ?? DEFAULT_VARIANT,
    version: query.get('sc_version') ?? undefined,
    layoutKind: query.get('sc_layoutKind') ?? undefined,
    ...(previewTime && { previewTime }),
  };
};

/**
 * Forwards the editing preview payload on browser `/_data` calls.
 *
 * Pages loads the editing host at `/api/editing/render?...`. Server-side,
 * `createEditingRenderMiddleware` turns those query params into an `x-sitecore-editing-params`
 * header and rewrites the URL to the real route, so SSR renders the edited page correctly.
 * The browser keeps the original `/api/editing/render` URL, and because this app opts out of
 * `provideClientHydration()` (see app.config.ts) there is no transfer state to reuse - so every
 * resolver re-runs and POSTs `/_data` with that URL and no editing header. The page loader then
 * falls through to `getPage('/api/editing/render')`, Edge has no such route, and the good SSR
 * markup is replaced by the 404 component.
 *
 * Re-attaching the header puts the loader back on the `getPreview()` path, so the refetch
 * returns the same edited layout SSR already produced.
 */
export const editingParamsInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined' || req.method !== 'POST') {
    return next(req);
  }

  const { pathname, search } = window.location;
  if (pathname !== EDITING_RENDER_PATH || !req.url.includes(LOADER_DATA_ENDPOINT)) {
    return next(req);
  }

  const previewData = buildPreviewData(new URLSearchParams(search));
  if (!previewData['itemId'] || !previewData['mode']) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { [EDITING_PARAMS_HEADER]: JSON.stringify(previewData) } }));
};
