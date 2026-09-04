// AboutBody rendering — post-hero content from the `About Body` datasource (rich text).
import { JSX } from 'react';
import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type AboutBodyProps = ComponentProps & {
  fields?: {
    Body?: Field<string>;
  };
};

export default function AboutBody({ fields }: AboutBodyProps): JSX.Element {
  if (!fields?.Body) return <></>;

  return (
    <div className="container">
      <RichText field={fields.Body} className="article-body about-body" />
    </div>
  );
}
