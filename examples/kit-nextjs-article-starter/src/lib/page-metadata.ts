import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export interface RouteFields {
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  pageShortTitle?: Field;
  pageHeaderTitle?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  pageSubtitle?: Field;
  ogTitle?: Field;
  ogDescription?: Field;
  ogImage?: ImageField;
  thumbnailImage?: ImageField;
}

export interface ResolvedPageMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const getFieldValue = (field?: Field) => field?.value?.toString() || '';

export const resolvePageMetadata = (
  fields?: RouteFields,
  canonicalUrl?: string,
): ResolvedPageMetadata => {
  const title =
    getFieldValue(fields?.metadataTitle) ||
    getFieldValue(fields?.pageTitle) ||
    getFieldValue(fields?.pageShortTitle) ||
    getFieldValue(fields?.pageHeaderTitle) ||
    getFieldValue(fields?.Title) ||
    'Page';

  const description =
    getFieldValue(fields?.metadataDescription) ||
    getFieldValue(fields?.pageSummary) ||
    getFieldValue(fields?.pageSubtitle) ||
    getFieldValue(fields?.ogDescription);

  const keywords = getFieldValue(fields?.metadataKeywords);

  return {
    title,
    description,
    keywords,
    ogTitle: getFieldValue(fields?.ogTitle) || title,
    ogDescription: getFieldValue(fields?.ogDescription) || description,
    ogImage:
      fields?.ogImage?.value?.src || fields?.thumbnailImage?.value?.src || '',
    canonicalUrl,
  };
};