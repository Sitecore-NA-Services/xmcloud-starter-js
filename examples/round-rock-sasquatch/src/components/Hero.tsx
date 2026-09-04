// Hero rendering — .home-hero block. Reads the `Hero` datasource fields from Sitecore.
import { JSX } from 'react';
import { Field, ImageField, Text, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type HeroProps = ComponentProps & {
  fields?: {
    HeroTitle?: Field<string>;
    HeroSubtitle?: Field<string>;
    HeroImage?: ImageField;
  };
};

export default function Hero({ fields }: HeroProps): JSX.Element {
  if (!fields) return <></>;

  return (
    <section className="home-hero">
      <Image field={fields.HeroImage} className="hero-svg" />
      <div className="home-hero-overlay">
        <div className="container">
          <Text field={fields.HeroTitle} tag="h1" className="home-hero-title" />
          <Text field={fields.HeroSubtitle} tag="p" className="home-hero-sub" />
        </div>
      </div>
    </section>
  );
}
