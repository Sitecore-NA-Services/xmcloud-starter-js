import { JSX } from 'react';
import { Field, RichText as SitecoreRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type RichTextProps = ComponentProps & {
  fields?: {
    Text?: Field<string>;
  };
};

export default function RichText({ fields }: RichTextProps): JSX.Element {
  if (!fields?.Text?.value) return <></>;
  return (
    <div className="container sxa-richtext">
      <SitecoreRichText field={fields.Text} />
    </div>
  );
}
