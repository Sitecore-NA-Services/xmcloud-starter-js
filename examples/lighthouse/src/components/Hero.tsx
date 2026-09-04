import { JSX } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  FileField,
  Image,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import SitecoreLink from 'lib/sitecore-link';

type HeroProps = ComponentProps & {
  fields: {
    HeroTitle: Field<string>;
    HeroSupertitle: Field<string>;
    HeroText: Field<string>;
    HeroImage: ImageField;
    HeroOverlayImage: ImageField;
    HeroLink: LinkField;
    HeroVideo: FileField;
  };
};

const Hero = ({ fields, params }: HeroProps): JSX.Element => {
  if (!fields) return <></>;

  const stylesClass = params?.styles || '';
  const isLeft = /\bhero-left\b/i.test(stylesClass);
  const isShort = /\bhero-short\b/i.test(stylesClass);
  const isBottom = /\bhero-bottom\b/i.test(stylesClass);
  // XP Services hero: brand-color left panel, image on the right half.
  const isSplit = /\bhero-split\b/i.test(stylesClass);
  const alignClass = isLeft || isSplit ? 'text-left' : 'text-center';
  const wrapperAlign = isLeft || isSplit ? '' : 'mx-auto';
  const padClass = isSplit
    ? 'py-20 md:py-28'
    : isBottom
      ? 'pt-48 pb-10 md:pt-64 md:pb-14'
      : isShort
        ? 'py-16 md:py-20'
        : 'py-24 md:py-32';

  // Split hero: left half is the brand-teal panel with title, right half is the image.
  if (isSplit) {
    return (
      <section className={['hero relative w-full overflow-hidden bg-[var(--color-brand-primary)] text-white', stylesClass].filter(Boolean).join(' ')}>
        <div className="relative flex flex-col md:flex-row items-stretch min-h-[360px] md:min-h-[420px]">
          <div className={['relative z-10 flex-1 md:w-1/2 flex flex-col justify-center px-6 md:px-16', padClass].filter(Boolean).join(' ')}>
            {fields.HeroSupertitle?.value && (
              <Text
                field={fields.HeroSupertitle}
                tag="p"
                className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-white/90"
              />
            )}
            <Text
              field={fields.HeroTitle}
              tag="h1"
              className="mb-0 text-5xl font-bold leading-tight md:text-7xl"
            />
            {fields.HeroText?.value && (
              <Text
                field={fields.HeroText}
                tag="p"
                className="mt-4 max-w-xl text-lg text-white/90"
              />
            )}
            {fields.HeroLink?.value?.href && (
              <div className="mt-6">
                <SitecoreLink
                  field={fields.HeroLink}
                  className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                />
              </div>
            )}
          </div>
          <div className="relative md:w-1/2 min-h-[280px] md:min-h-0 overflow-hidden">
            {fields.HeroImage?.value?.src && (
              <Image field={fields.HeroImage} className="absolute inset-0 h-full w-full object-cover" />
            )}
            {fields.HeroVideo?.value?.src && (
              <video
                src={fields.HeroVideo.value.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={['hero relative w-full overflow-hidden bg-gray-900 text-white', stylesClass].filter(Boolean).join(' ')}>
      {fields.HeroImage?.value?.src && (
        <div className="absolute inset-0">
          <Image
            field={fields.HeroImage}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      {fields.HeroVideo?.value?.src && (
        <div className="absolute inset-0">
          <video
            src={fields.HeroVideo.value.src}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      <div className={['relative mx-auto max-w-7xl px-6 md:px-12', padClass, alignClass].filter(Boolean).join(' ')}>
        {fields.HeroSupertitle?.value && (
          <Text
            field={fields.HeroSupertitle}
            tag="p"
            className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-white/90"
          />
        )}
        <Text
          field={fields.HeroTitle}
          tag="h1"
          className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
        />
        {fields.HeroText?.value && (
          <Text
            field={fields.HeroText}
            tag="p"
            className={['mb-8 max-w-2xl text-lg text-gray-200', wrapperAlign].filter(Boolean).join(' ')}
          />
        )}
        {fields.HeroOverlayImage?.value?.src && (
          <div className={['mb-8 max-w-xs', wrapperAlign].filter(Boolean).join(' ')}>
            <Image field={fields.HeroOverlayImage} className={wrapperAlign} />
          </div>
        )}
        {fields.HeroLink?.value?.href && (
          <SitecoreLink
            field={fields.HeroLink}
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-900 hover:bg-gray-100"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
