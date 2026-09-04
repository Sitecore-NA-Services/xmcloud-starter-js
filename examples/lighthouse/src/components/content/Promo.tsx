import { JSX } from 'react';
import { Field, ImageField, LinkField, RichText, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type PromoProps = ComponentProps & {
  fields: {
    PromoText: Field<string>;
    PromoText2?: Field<string>;
    PromoText3?: Field<string>;
    PromoIcon?: ImageField;
    PromoLink?: LinkField;
  };
};

const Promo = ({ fields, params }: PromoProps): JSX.Element => {
  if (!fields) return <></>;

  const hasLabel = !!(fields.PromoText3 as Field<string> | undefined)?.value;
  const hasBody = !!(fields.PromoText2 as Field<string> | undefined)?.value;
  const hasImage = !!fields.PromoIcon?.value?.src;
  const hasLink = !!fields.PromoLink?.value?.href;
  const promoLink = sanitizeLink(fields.PromoLink);
  const imageLeft = params?.ImageAlignment === 'left';
  const stylesClass = params?.styles || '';

  // Side-by-side layout: has body text (PromoText2)
  // Hero-bleed layout: only title +/- eyebrow label, no body (e.g. virtual-trainer banner)
  // Tile layout: params.styles contains "tile" — small card with title overlay
  const isTile = /\btile\b/i.test(stylesClass);
  const isPromoLeft = hasBody && !isTile;

  if (isTile) {
    const titlePlain = (fields.PromoText?.value || '').replace(/<[^>]+>/g, '').trim();
    const Card = (
      <div className="flex h-full flex-col bg-white">
        <div className="relative overflow-hidden aspect-[16/10]">
          {hasImage && (
            <Image field={fields.PromoIcon} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-white">
            {hasLabel && (
              <div className="field-promotext3 mb-1 text-[11px] font-semibold uppercase tracking-[3px] italic text-white/90 [&_p]:m-0">
                <RichText field={fields.PromoText3} />
              </div>
            )}
            <div className="field-promotext font-bold [&_p]:m-0 [&_p]:text-[24px] [&_p]:md:text-[28px] [&_p]:leading-tight">
              <RichText field={fields.PromoText} />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-white">
          {hasLink ? (
            <SitecoreLink
              field={promoLink}
              className="inline-block rounded-none bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
            />
          ) : (
            <span className="inline-block rounded-none bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white">
              Read More
            </span>
          )}
        </div>
      </div>
    );

    return (
      <div className="promo promo-top inline-block align-top w-full md:w-1/2 px-3 py-4">
        {hasLink ? (
          <SitecoreLink field={promoLink} aria-label={titlePlain} className="block no-underline text-inherit">
            {Card}
          </SitecoreLink>
        ) : Card}
      </div>
    );
  }

  if (isPromoLeft) {
    // XP parity:
    //   ImageAlignment=left        -> image LEFT,  text RIGHT, LIGHT bg (XP class "promo-right")
    //   default (image right)      -> text LEFT,   image RIGHT, DARK bg  (XP class "promo-left")
    //   styles=light-bg            -> force LIGHT bg regardless of image side
    const forceLight = /\blight-bg\b/i.test(stylesClass);
    const darkBand = !imageLeft && !forceLight;
    const bandBg = darkBand ? 'bg-[#232323] text-gray-100' : 'bg-white text-gray-900';
    const titleColor = darkBand ? 'text-white' : 'text-gray-900';
    const bodyColor = darkBand ? 'text-gray-300' : 'text-gray-600';
    const labelColor = darkBand ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-brand-primary)]';

    return (
      <div className={['promo', darkBand ? 'promo-left' : 'promo-right', 'w-full', bandBg, stylesClass].filter(Boolean).join(' ')}>
        <div className="mx-auto flex flex-col md:flex-row items-stretch" style={{ maxWidth: '1200px' }}>
          {imageLeft && hasImage && (
            <div className="md:w-[45%] overflow-hidden flex-shrink-0 self-stretch min-h-[280px]">
              <Image field={fields.PromoIcon} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 px-8 md:px-12 py-10 md:py-14 flex flex-col justify-center">
            {hasLabel && (
              <div className={`field-promotext3 mb-3 text-xs font-semibold uppercase tracking-widest italic ${labelColor}`}>
                <RichText field={fields.PromoText3} />
              </div>
            )}
            <div className={`field-promotext font-bold leading-tight [&_p]:text-[28px] [&_p]:md:text-[32px] [&_p]:m-0 ${titleColor}`}>
              <RichText field={fields.PromoText} />
            </div>
            {hasBody && (
              <div className={`field-promotext2 mt-4 text-sm md:text-base leading-relaxed ${bodyColor}`}>
                <RichText field={fields.PromoText2} />
              </div>
            )}
            {hasLink && (
              <div className="cta field-promolink mt-6">
                <SitecoreLink
                  field={promoLink}
                  className="inline-block rounded-none bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
                />
              </div>
            )}
          </div>
          {!imageLeft && hasImage && (
            <div className="md:w-[45%] overflow-hidden flex-shrink-0 self-stretch min-h-[280px]">
              <Image field={fields.PromoIcon} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // promo-right style: full-width hero image, title + arrow centered on image
  return (
    <div className={['promo promo-right relative w-full overflow-hidden', stylesClass].filter(Boolean).join(' ')}>
      {hasImage && (
        <div className="w-full" style={{ maxHeight: '600px', minHeight: '480px', overflow: 'hidden' }}>
          <Image field={fields.PromoIcon} className="w-full object-cover" style={{ maxHeight: '600px', minHeight: '480px' }} />
        </div>
      )}
      {/* Dark overlay + centered content */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-8">
        {/* Bordered box wrapping title + arrow */}
        <div className="border-2 border-white px-14 py-14 inline-flex flex-col items-center" style={{ minWidth: '380px' }}>
          <div className="field-promotext text-white font-bold [&_p]:m-0 [&_p]:text-[42px] [&_p]:leading-snug">
            <RichText field={fields.PromoText} />
          </div>
          {hasLink && (
            <div className="field-promolink mt-8">
              <SitecoreLink
                field={promoLink}
                className="inline-flex items-center justify-center w-14 h-14 border-2 border-white text-white text-3xl hover:bg-white hover:text-black transition-colors"
              >
                &#8594;
              </SitecoreLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promo;
