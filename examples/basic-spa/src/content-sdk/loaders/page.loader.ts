import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  getEditingPreviewData,
  isDesignLibraryPreviewData,
  getSiteName,
  getVariantId,
  getComponentVariantIds,
  getLanguage,
  splitLocaleFromPath,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const previewData = getEditingPreviewData(context.csdkRequestData);
  const locale = getLanguage(context) || scConfig.defaultLanguage;
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);

  let page: Page | null;
  if (isDesignLibraryPreviewData(previewData)) {
    page = await getClient().getDesignLibraryData(previewData);
  } else if (previewData) {
    page = await getClient().getPreview(previewData);
  } else {
    page = await getClient().getPage(nonLocalePath, {
      locale,
      // `ng serve` has no Express multisite middleware. Empty string is a real
      // getPage() site value (?? does not fall back), so Edge returns the first
      // `*` hostname site instead of defaultSite.
      site: getSiteName(context) || scConfig.defaultSite,
      personalize: {
        variantId: getVariantId(context),
        componentVariantIds: getComponentVariantIds(context),
      },
    });
  }

  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
