'use client';

import {
  Text as ContentSdkText,
  Field,
} from '@sitecore-content-sdk/nextjs';

interface ArticleFields {
  ArticleAuthor: Field<string>;
  ArticleTitle: Field<string>;
  ArticleText: Field<string>;
}

type ArticleFullProps = {
  params: { [key: string]: string };
  fields: ArticleFields;
};

export const Default = (props: ArticleFullProps) => {
  return (
    <article
      className={`relative flex flex-col gap-6 p-10 max-w-4xl mx-auto ${props.params?.styles}`}
      data-class-change
    >
      {/* Article Title */}
      <header>
        <h1 className="text-4xl font-bold mb-4">
          <ContentSdkText field={props.fields?.ArticleTitle} />
        </h1>

        {/* Article Author */}
        <div className="text-lg text-gray-600 mb-6">
          By <ContentSdkText field={props.fields?.ArticleAuthor} />
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <ContentSdkText field={props.fields?.ArticleText} />
      </div>
    </article>
  );
};
