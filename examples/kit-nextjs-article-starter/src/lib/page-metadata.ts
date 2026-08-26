import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export interface RouteFields {
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  pageShortTitle?: Field;
  pageHeaderTitle?: Field;
  ArticleTitle?: Field;
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
    getFieldValue(fields?.ArticleTitle) ||
    'Page';

  const description =
    getFieldValue(fields?.metadataDescription) ||
    getFieldValue(fields?.pageSummary) ||
    getFieldValue(fields?.pageSubtitle) ||
    getFieldValue(fields?.ogDescription);

  const keywords = getFieldValue(fields?.metadataKeywords);

  // The ogTitle field is often populated with the item's slug (kebab-case) rather
  // than a human title. Prefer an ogTitle only when it reads like a real title
  // (contains a space); otherwise fall back to the resolved human title.
  const ogTitleField = getFieldValue(fields?.ogTitle);
  const ogTitle = ogTitleField.includes(' ') ? ogTitleField : title;

  return {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription: getFieldValue(fields?.ogDescription) || description,
    ogImage:
      fields?.ogImage?.value?.src || fields?.thumbnailImage?.value?.src || '',
    canonicalUrl,
  };
};