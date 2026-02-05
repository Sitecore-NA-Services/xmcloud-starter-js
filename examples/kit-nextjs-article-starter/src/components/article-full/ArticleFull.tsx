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

interface RouteFields {
  pageHeaderTitle?: Field<string>;
  pageAuthor?: {
    fields?: {
      personFirstName?: Field<string>;
      personLastName?: Field<string>;
    };
  };
  Content?: RichTextField;
}

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { params } = props;
  const { page } = useSitecore();
  const id = params?.RenderingIdentifier;

  // Get fields from the current page/route context
  const contextFields = page?.layout?.sitecore?.route?.fields as RouteFields;
  const pageTitle = contextFields?.pageHeaderTitle;
  const pageAuthor = contextFields?.pageAuthor;
  const pageContent = contextFields?.Content;

  // Build author display name from person reference
  const authorFirstName = pageAuthor?.fields?.personFirstName?.value || '';
  const authorLastName = pageAuthor?.fields?.personLastName?.value || '';
  const authorName = [authorFirstName, authorLastName].filter(Boolean).join(' ');

  // Only show fallback if no fields are available at all
  if (!pageTitle && !pageAuthor && !pageContent && !page.mode.isEditing) {
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
      {(pageTitle?.value || page.mode.isEditing) && (
        <h1 className="text-4xl font-bold mb-4">
          <Text field={pageTitle} />
        </h1>
      )}

      {/* Article Author */}
      {(authorName || page.mode.isEditing) && (
        <p className="text-lg text-gray-600 mb-6">By {authorName || '[Author]'}</p>
      )}

      {/* Article Content */}
      {(pageContent?.value || page.mode.isEditing) && (
        <div className="prose max-w-none">
          <ContentSdkRichText field={pageContent} />
        </div>
      )}
    </div>
  );
};
