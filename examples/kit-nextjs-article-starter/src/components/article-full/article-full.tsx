import type React from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { cn } from '@/lib/utils';

/**
 * Article component fields
 */
export type ArticleFullFields = {
  fields: {
    ArticleAuthor: Field<string>;
    ArticleTitle: Field<string>;
    ArticleText: Field<string>;
  };
};

export type ArticleFullProps = ComponentProps & ArticleFullFields;

export const Default: React.FC<ArticleFullProps> = (props) => {
  const { fields, params } = props;

  const { ArticleAuthor, ArticleTitle, ArticleText } = fields ?? {};

  if (!fields) {
    return null;
  }

  return (
    <article
      className={cn(
        'relative flex flex-col gap-6 p-10 max-w-4xl mx-auto',
        {
          [params?.styles]: params?.styles,
        }
      )}
    >
      {/* Article Title */}
      <header>
        <h1 className="text-4xl font-bold mb-4">
          <Text field={ArticleTitle} />
        </h1>
        
        {/* Article Author */}
        <div className="text-lg text-gray-600 mb-6">
          By <Text field={ArticleAuthor} />
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <Text field={ArticleText} />
      </div>
    </article>
  );
};
