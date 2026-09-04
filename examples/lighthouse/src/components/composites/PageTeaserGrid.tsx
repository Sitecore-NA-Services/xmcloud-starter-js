import { JSX } from 'react';
import { Field, ImageField, LinkField, RichText, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type TeaserItem = {
  id: string;
  fields: {
    PromoIcon?: ImageField;
    PromoText3?: Field<string>;
    PromoText?: Field<string>;
    PromoText2?: Field<string>;
    PromoLink?: LinkField;
  };
};

type PageTeaserGridProps = ComponentProps & {
  fields?: {
    items?: TeaserItem[];
  };
};

const TeaserCard = ({ fields }: { fields: TeaserItem['fields'] }): JSX.Element => {
  const promoLink = sanitizeLink(fields.PromoLink);

  return (
    <div className="page-teaser promo promo-top" style={{ backgroundColor: '#fff' }}>
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
};

const PageTeaserGrid = ({ fields, params }: PageTeaserGridProps): JSX.Element => {
  const items = fields?.items || [];
  if (!items.length) return <></>;

  return (
    <div
      className={['page-teaser-grid container-gray-background', params?.styles].filter(Boolean).join(' ')}
      style={{ backgroundColor: '#f5f5f5', padding: '40px 0', width: '100%' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {items.map((item) => (
          <TeaserCard key={item.id} fields={item.fields} />
        ))}
      </div>
    </div>
  );
};

export default PageTeaserGrid;
