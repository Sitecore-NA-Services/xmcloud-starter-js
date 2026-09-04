import { JSX } from 'react';
import { Field, ImageField, LinkField, Image, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type ImageComponentProps = ComponentProps & {
  fields: {
    Image: ImageField;
    ImageCaption?: Field<string>;
    Link?: LinkField;
  };
};

const ImageComponent = ({ fields }: ImageComponentProps): JSX.Element => {
  if (!fields?.Image?.value?.src) return <></>;

  const img = <Image field={fields.Image} className="h-auto max-w-full rounded" />;

  return (
    <figure className="image-component">
      {fields.Link?.value?.href ? (
        <SitecoreLink field={sanitizeLink(fields.Link)} className="block">{img}</SitecoreLink>
      ) : img}
      {fields.ImageCaption?.value && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          <Text field={fields.ImageCaption} />
        </figcaption>
      )}
    </figure>
  );
};

export default ImageComponent;
