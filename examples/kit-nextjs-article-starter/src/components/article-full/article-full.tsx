import type React from 'react';
import { Text, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ArticleFullProps } from './article-full.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { fields, params } = props;
  const id = params?.RenderingIdentifier;

  if (!fields) {
    return <NoDataFallback componentName="Article Full" />;
  }

  return (
    <div
      className={cn('article-full', { [props?.params?.styles]: props?.params?.styles })}
      id={id ? id : undefined}
      data-component-name="article-full"
    >
      {/* Article Title */}
      {fields.ArticleTitle && (
        <h1 className="text-4xl font-bold mb-4">
          <Text field={fields.ArticleTitle} />
        </h1>
      )}

      {/* Article Author */}
      {fields.ArticleAuthor && (
        <p className="text-lg text-gray-600 mb-6">
          By <Text field={fields.ArticleAuthor} />
        </p>
      )}

      {/* Article Text */}
      {fields.ArticleText && (
        <div className="prose max-w-none">
          <ContentSdkRichText field={fields.ArticleText} />
        </div>
      )}
    </div>
  );
};
