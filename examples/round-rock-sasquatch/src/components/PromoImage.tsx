// PromoImage rendering — the "Latest Field Reports" cards on the home page.
// Its datasource schema (heading/description/image/link) is this site's own and
// does NOT match the SXA Promo rendering (PromoText/PromoIcon/...), so it needs
// its own implementation rather than reusing src/components/Promo.tsx.
import { JSX } from 'react';
import { Field, ImageField, LinkField, Image, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'src/lib/sitecore-link';

type PromoImageProps = ComponentProps & {
  fields?: {
    heading?: Field<string>;
    description?: Field<string>;
    image?: ImageField;
    link?: LinkField;
  };
};

export default function PromoImage({ fields }: PromoImageProps): JSX.Element {
  if (!fields) return <></>;

  const hasImage = !!fields.image?.value?.src;
  const hasLink = !!fields.link?.value?.href;

  return (
    <div className="container sxa-promo">
      {/* Without media the card must collapse to one column, or the two-column
          grid leaves an empty panel beside the text. */}
      <div className={`sxa-promo-card${hasImage ? '' : ' sxa-promo-card--no-media'}`}>
        {hasImage && (
          <div className="sxa-promo-media">
            <Image field={fields.image} className="sxa-promo-img" />
          </div>
        )}
        <div className="sxa-promo-body">
          {fields.heading?.value && (
            <Text field={fields.heading} tag="h3" className="sxa-promo-title" />
          )}
          {fields.description?.value && (
            <div className="sxa-promo-text">
              <RichText field={fields.description} />
            </div>
          )}
          {hasLink && (
            <div className="sxa-promo-cta">
              <SitecoreLink field={sanitizeLink(fields.link)} className="btn btn-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
