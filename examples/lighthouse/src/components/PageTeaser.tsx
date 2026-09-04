import { JSX } from 'react';
import { Field, ImageField, LinkField, RichText, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type PageTeaserProps = ComponentProps & {
  fields: {
    PromoIcon?: ImageField;
    PromoText3?: Field<string>;
    PromoText?: Field<string>;
    PromoText2?: Field<string>;
    PromoLink?: LinkField;
    // Article Page / legacy fallback fields
    Title?: Field<string>;
    Introduction?: Field<string>;
    Content?: Field<string>;
    Image?: ImageField;
    Link?: LinkField;
  };
  params?: {
    ImageAlignment?: string;
    styles?: string;
  };
};

const PageTeaser = ({ fields, params }: PageTeaserProps): JSX.Element => {
  if (!fields) return <></>;

  const hasPromoFields = !!(fields.PromoText?.value || fields.PromoIcon?.value?.src);
  const promoLink = sanitizeLink(fields.PromoLink);
  const legacyLink = sanitizeLink(fields.Link);

  if (hasPromoFields) {
    return (
      <div className="page-teaser promo promo-top col-xs-12">
        <div className="component-content">
          {fields.PromoIcon?.value?.src && (
            <div className="field-promoicon field-image w-full overflow-hidden">
              <Image field={fields.PromoIcon} className="w-full object-cover max-h-[280px]" />
            </div>
          )}
          <div className="px-4 py-4">
            {fields.PromoText3?.value && (
              <div
                className="field-promotext3 field-subtitle"
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: 'var(--color-brand-primary)',
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                <RichText field={fields.PromoText3} tag="span" />
              </div>
            )}
            {fields.PromoText?.value && (
              <h3
                className="field-title"
                style={{ fontSize: '18px', fontWeight: 'bold', color: '#272727', margin: '8px 0' }}
              >
                <RichText field={fields.PromoText} tag="span" />
              </h3>
            )}
            {fields.PromoText2?.value && (
              <div
                className="field-introduction"
                style={{ fontSize: '14px', color: '#5e5e5e', marginBottom: '12px' }}
              >
                <RichText field={fields.PromoText2} />
              </div>
            )}
            {promoLink?.value?.href && (
              <div className="field-promolink">
                <SitecoreLink
                  field={promoLink}
                  style={{
                    color: 'var(--color-brand-primary)',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                  className="hover:underline"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Article / legacy fallback — XP-style overlapping card over image.
  const imageLeft = params?.ImageAlignment === 'left';
  const rawContent = (fields.Introduction?.value as string | undefined) || (fields.Content?.value as string | undefined) || '';
  const fullText = rawContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt = fullText.length > 220 ? fullText.substring(0, 220).trimEnd() + '…' : fullText;
  const hasLegacyImage = !!fields.Image?.value?.src;
  const title = fields.Title?.value as string | undefined;
  const linkHref = legacyLink?.value?.href;

  const TextCard = (
    <div className="relative z-10 bg-white p-8 md:p-10 shadow-sm">
      <div className="text-[11px] uppercase tracking-[2px] text-[var(--color-brand-primary)] font-semibold mb-3">
        ARTICLE
      </div>
      <h3 className="field-title font-bold text-gray-900 leading-tight text-[24px] md:text-[26px]">
        {linkHref ? (
          <SitecoreLink field={legacyLink} style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </SitecoreLink>
        ) : (
          title
        )}
      </h3>
      {excerpt && (
        <p className="field-introduction mt-4 text-sm leading-relaxed text-gray-600">{excerpt}</p>
      )}
      {linkHref && (
        <div className="cta mt-6">
          <SitecoreLink
            field={legacyLink}
            className="inline-block rounded-none border border-gray-800 px-8 py-3 text-[11px] font-semibold uppercase tracking-[2px] text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Read Now
          </SitecoreLink>
        </div>
      )}
    </div>
  );

  const ImageBlock = hasLegacyImage ? (
    <div className="w-full md:w-[55%] overflow-hidden flex-shrink-0">
      <Image field={fields.Image as ImageField} className="w-full h-full object-cover" style={{ minHeight: '420px' }} />
    </div>
  ) : null;

  return (
    <article className="page-teaser w-full bg-white py-10">
      <div className="mx-auto flex flex-col md:flex-row md:items-center relative" style={{ maxWidth: '1100px' }}>
        {imageLeft ? (
          <>
            {ImageBlock}
            <div className="w-full md:w-[55%] md:-ml-16">{TextCard}</div>
          </>
        ) : (
          <>
            <div className="w-full md:w-[55%] md:-mr-16">{TextCard}</div>
            {ImageBlock}
          </>
        )}
      </div>
    </article>
  );
};

export default PageTeaser;
