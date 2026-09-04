import { JSX } from 'react';
import Link from 'next/link';
import { Field, ImageField, RichText, Text, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type JsonField<T> = { jsonValue: T };

type AuthorLink = {
  id?: string;
  name?: string;
  displayName?: string;
};

type ArticleDetailFields = {
  data?: {
    externalFields?: {
      Title?: JsonField<Field<string>>;
      Subtitle?: JsonField<Field<string>>;
      Introduction?: JsonField<Field<string>>;
      Content?: JsonField<Field<string>>;
      AdditionalContent?: JsonField<Field<string>>;
      Image?: JsonField<ImageField>;
      PublishDate?: JsonField<Field<string>>;
      Author?: JsonField<AuthorLink>;
    };
  };
};

type ArticleDetailProps = ComponentProps & {
  fields?: ArticleDetailFields;
};

const ArticleDetail = ({ fields }: ArticleDetailProps): JSX.Element => {
  const ext = fields?.data?.externalFields;
  if (!ext) return <></>;

  const title = ext.Title?.jsonValue;
  const subtitle = ext.Subtitle?.jsonValue;
  const intro = ext.Introduction?.jsonValue;
  const content = ext.Content?.jsonValue;
  const additional = ext.AdditionalContent?.jsonValue;
  const image = ext.Image?.jsonValue;
  const publishDate = ext.PublishDate?.jsonValue?.value || '';
  const author = ext.Author?.jsonValue;
  const authorName = (author && (author.displayName || author.name)) || '';

  let formattedDate = '';
  if (publishDate) {
    try {
      formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      formattedDate = publishDate;
    }
  }

  const byline = [formattedDate, authorName ? `By ${authorName}` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="article-detail">
      {image?.value?.src && (
        <div className="w-full overflow-hidden" style={{ maxHeight: '500px' }}>
          <Image
            field={image}
            className="w-full h-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {byline && (
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">{byline}</div>
        )}

        {title && (
          <Text
            field={title}
            tag="h1"
            className="text-4xl font-bold text-[#272727] mb-3 leading-tight"
          />
        )}

        {subtitle?.value && (
          <Text
            field={subtitle}
            tag="p"
            className="text-xl font-medium text-gray-500 mb-6 leading-snug"
          />
        )}

        {intro?.value && (
          <p className="text-lg font-semibold text-gray-700 mb-6 leading-relaxed border-l-4 border-[var(--color-brand-primary)] pl-4">
            {intro.value}
          </p>
        )}

        {content?.value && (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <RichText field={content} />
          </div>
        )}

        {additional?.value && (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-8 pt-8 border-t border-gray-100">
            <RichText field={additional} />
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link
            href="/articles"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-primary)] hover:underline"
          >
            &larr; Back to Articles
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
