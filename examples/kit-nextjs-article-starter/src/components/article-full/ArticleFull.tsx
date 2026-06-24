'use client';

import type React from 'react';
import {
  Text,
  RichText as ContentSdkRichText,
  useSitecore,
  Field,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ArticleFullProps } from './ArticleFull.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

// Route-level (REST layout service) field keys use the exact Sitecore field names.
interface RouteFields {
  ArticleTitle?: Field<string>;
  ArticleAuthor?: Field<string>;
  ArticleContent?: RichTextField;
}

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { params, fields } = props;
  const { page } = useSitecore();
  const id = params?.RenderingIdentifier;

  // Resolve fields in priority order:
  //   1. an assigned datasource (integrated GraphQL — camelCased field names),
  //   2. the page's own fields returned by the same query (externalFields),
  //   3. the route-level page fields as a guaranteed fallback.
  // This keeps content rendering even if the integrated query is unavailable, while
  // still letting Page Builder edit fields inline and assign a content item.
  const datasourceFields = fields?.data?.datasource;
  const externalFields = fields?.data?.externalFields;
  const contextFields = page?.layout?.sitecore?.route?.fields as RouteFields;
  const articleTitle =
    datasourceFields?.articleTitle?.jsonValue ??
    externalFields?.articleTitle?.jsonValue ??
    contextFields?.ArticleTitle;
  const articleAuthor =
    datasourceFields?.articleAuthor?.jsonValue ??
    externalFields?.articleAuthor?.jsonValue ??
    contextFields?.ArticleAuthor;
  const articleContent =
    datasourceFields?.articleContent?.jsonValue ??
    externalFields?.articleContent?.jsonValue ??
    contextFields?.ArticleContent;

  // Only show fallback if no fields are available at all
  if (!articleTitle && !articleAuthor && !articleContent && !page.mode.isEditing) {
    return <NoDataFallback componentName="Article Full" />;
  }

  return (
    <div
      className={cn('article-full px-4 md:px-6 lg:px-8', {
        [props?.params?.styles]: props?.params?.styles,
      })}
      id={id ? id : undefined}
      data-component-name="article-full"
    >
      {/* Article Title */}
      {(articleTitle?.value || page.mode.isEditing) && (
        <h1 className="text-4xl font-bold mb-4">
          <Text field={articleTitle} />
        </h1>
      )}

      {/* Article Author */}
      {(articleAuthor?.value || page.mode.isEditing) && (
        <p className="text-lg text-gray-600 mb-6">
          By <Text field={articleAuthor} />
        </p>
      )}

      {/* Article Content */}
      {(articleContent?.value || page.mode.isEditing) && (
        <div className="prose max-w-none">
          <ContentSdkRichText field={articleContent} />
        </div>
      )}
    </div>
  );
};
