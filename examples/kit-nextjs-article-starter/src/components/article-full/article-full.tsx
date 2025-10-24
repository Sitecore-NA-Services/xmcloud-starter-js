import type React from 'react';
import { Text, RichText as ContentSdkRichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ArticleFullProps } from './article-full.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { fields, params } = props;
  const { page } = useSitecore();
  const id = params?.RenderingIdentifier;

  // Fallback to context item fields if no datasource is assigned
  const contextFields = page?.layout?.sitecore?.route?.fields;
  const articleTitle = fields?.ArticleTitle || contextFields?.ArticleTitle;
  const articleAuthor = fields?.ArticleAuthor || contextFields?.ArticleAuthor;
  const articleText = fields?.ArticleText || contextFields?.ArticleText;

  // Only show fallback if no fields are available at all
  if (!articleTitle && !articleAuthor && !articleText && !page.mode.isEditing) {
    return <NoDataFallback componentName="Article Full" />;
  }

  return (
    <div
      className={cn('article-full', { [props?.params?.styles]: props?.params?.styles })}
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

      {/* Article Text */}
      {(articleText?.value || page.mode.isEditing) && (
        <div className="prose max-w-none">
          <ContentSdkRichText field={articleText} />
        </div>
      )}
    </div>
  );
};
