'use client';

import type React from 'react';
import { Text, RichText as ContentSdkRichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ArticleFullProps } from './ArticleFull.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { params, fields } = props;
  const { page } = useSitecore();
  const id = params?.RenderingIdentifier;

  // Prefer the assigned datasource; otherwise fall back to the page's own article fields.
  // Both arrive through the rendering's integrated GraphQL query (datasource / externalFields),
  // so Page Builder can edit the fields inline and assign a content item to the component.
  const datasourceFields = fields?.data?.datasource;
  const externalFields = fields?.data?.externalFields;
  const articleTitle =
    datasourceFields?.ArticleTitle?.jsonValue ?? externalFields?.ArticleTitle?.jsonValue;
  const articleAuthor =
    datasourceFields?.ArticleAuthor?.jsonValue ?? externalFields?.ArticleAuthor?.jsonValue;
  const articleContent =
    datasourceFields?.ArticleContent?.jsonValue ?? externalFields?.ArticleContent?.jsonValue;

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
