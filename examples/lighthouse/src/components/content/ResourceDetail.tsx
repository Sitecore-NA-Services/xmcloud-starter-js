import { JSX } from 'react';
import Link from 'next/link';
import { Field, ImageField, RichText, Text, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type Json<T> = { jsonValue: T } | undefined;
type StrField = Json<{ value?: string }>;
type FileField = Json<{ value?: { src?: string } }>;
type GeneralLinkField = Json<{ value?: { href?: string; text?: string; target?: string; linktype?: string } }>;

type ResourceDetailFields = {
  data?: {
    externalFields?: {
      Title?: Json<Field<string>>;
      Introduction?: Json<Field<string>>;
      Content?: Json<Field<string>>;
      Image?: Json<ImageField>;
      ResourceType?: StrField;
      Media?: FileField;
      MediaTitle?: Json<Field<string>>;
      MediaCaption?: Json<Field<string>>;
      Link?: GeneralLinkField;
    };
  };
};

type ResourceDetailProps = ComponentProps & {
  fields?: ResourceDetailFields;
};

const ResourceDetail = ({ fields }: ResourceDetailProps): JSX.Element => {
  const ext = fields?.data?.externalFields;
  if (!ext) return <></>;

  const title = ext.Title?.jsonValue;
  const intro = ext.Introduction?.jsonValue;
  const content = ext.Content?.jsonValue;
  const image = ext.Image?.jsonValue;
  const type = (ext.ResourceType?.jsonValue?.value || '').trim();
  const mediaSrc = ext.Media?.jsonValue?.value?.src || '';
  const mediaTitle = ext.MediaTitle?.jsonValue;
  const mediaCaption = ext.MediaCaption?.jsonValue;
  const link = ext.Link?.jsonValue?.value;

  const isVideo = /video/i.test(type) || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(mediaSrc);
  const isAudio = /audio/i.test(type) || /\.(mp3|wav|m4a|aac|oga)(\?|$)/i.test(mediaSrc);

  return (
    <article className="resource-detail">
      {image?.value?.src && (
        <div className="w-full overflow-hidden" style={{ maxHeight: '420px' }}>
          <Image field={image} className="h-full w-full object-cover" style={{ maxHeight: '420px' }} />
        </div>
      )}

      <div className="container mx-auto max-w-4xl px-6 py-10">
        {type && (
          <div className="mb-4 inline-block bg-[var(--color-brand-primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] text-white">
            {type}
          </div>
        )}

        {title && (
          <Text field={title} tag="h1" className="mb-4 text-4xl font-bold leading-tight text-[#272727]" />
        )}

        {intro?.value && (
          <p className="mb-6 border-l-4 border-[var(--color-brand-primary)] pl-4 text-lg font-semibold leading-relaxed text-gray-700">
            {intro.value}
          </p>
        )}

        {mediaSrc && (isVideo || isAudio) && (
          <figure className="my-6">
            {mediaTitle?.value && (
              <Text field={mediaTitle} tag="figcaption" className="mb-2 text-sm font-semibold text-gray-700" />
            )}
            {isVideo ? (
              <video src={mediaSrc} controls className="w-full rounded bg-black" />
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio src={mediaSrc} controls className="w-full" />
            )}
            {mediaCaption?.value && (
              <div className="prose prose-sm mt-2 max-w-none text-gray-600 [&_p]:mb-2">
                <RichText field={mediaCaption} />
              </div>
            )}
          </figure>
        )}

        {link?.href && (
          <div className="my-6">
            <a
              href={link.href}
              target={link.target || '_blank'}
              rel="noopener noreferrer"
              className="inline-block bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[2px] text-white hover:bg-[var(--color-brand-dark)]"
            >
              {link.text || (/external/i.test(type) ? 'Visit Resource' : 'Download')}
            </a>
          </div>
        )}

        {content?.value && (
          <div className="prose prose-lg mt-6 max-w-none leading-relaxed text-gray-700">
            <RichText field={content} />
          </div>
        )}

        <div className="mt-10 border-t border-gray-200 pt-6">
          <Link
            href="/resources"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-primary)] hover:underline"
          >
            &larr; Back to Resources
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ResourceDetail;
