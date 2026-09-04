import { JSX } from 'react';
import { Field, ImageField, LinkField, Image as SitecoreImage, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'src/lib/sitecore-link';

type ImageProps = ComponentProps & {
  fields?: {
    Image?: ImageField;
    ImageCaption?: Field<string>;
    TargetUrl?: LinkField;
  };
};

export default function Image({ fields }: ImageProps): JSX.Element {
  if (!fields?.Image?.value?.src) return <></>;
  const img = <SitecoreImage field={fields.Image} className="sxa-image-img" />;
  return (
    <figure className="container sxa-image">
      {fields.TargetUrl?.value?.href ? (
        <SitecoreLink field={sanitizeLink(fields.TargetUrl)} className="sxa-image-link">
          {img}
        </SitecoreLink>
      ) : img}
      {fields.ImageCaption?.value && (
        <figcaption className="sxa-image-caption">
          <Text field={fields.ImageCaption} />
        </figcaption>
      )}
    </figure>
  );
}
