import { JSX } from 'react';
import { Field, ImageField, LinkField, RichText, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'src/lib/sitecore-link';

type PromoProps = ComponentProps & {
  fields?: {
    PromoText?: Field<string>;
    PromoText2?: Field<string>;
    PromoText3?: Field<string>;
    PromoIcon?: ImageField;
    PromoLink?: LinkField;
  };
};

export default function Promo({ fields }: PromoProps): JSX.Element {
  if (!fields) return <></>;
  const hasImage = !!fields.PromoIcon?.value?.src;
  const hasLink = !!fields.PromoLink?.value?.href;
  return (
    <div className="container sxa-promo">
      <div className="sxa-promo-card">
        {hasImage && (
          <div className="sxa-promo-media">
            <SitecoreImage field={fields.PromoIcon} className="sxa-promo-img" />
          </div>
        )}
        <div className="sxa-promo-body">
          {fields.PromoText3?.value && (
            <div className="sxa-promo-eyebrow">
              <RichText field={fields.PromoText3} />
            </div>
          )}
          {fields.PromoText?.value && (
            <div className="sxa-promo-title">
              <RichText field={fields.PromoText} />
            </div>
          )}
          {fields.PromoText2?.value && (
            <div className="sxa-promo-text">
              <RichText field={fields.PromoText2} />
            </div>
          )}
          {hasLink && (
            <div className="sxa-promo-cta">
              <SitecoreLink field={sanitizeLink(fields.PromoLink)} className="btn btn-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
