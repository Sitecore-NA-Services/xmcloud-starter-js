import { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type PlainHtmlProps = ComponentProps & {
  fields: {
    Content: Field<string>;
  };
};

const PlainHtml = ({ fields }: PlainHtmlProps): JSX.Element => {
  if (!fields?.Content?.value) return <></>;

  return (
    <div
      className="plain-html"
      dangerouslySetInnerHTML={{ __html: fields.Content.value as string }}
    />
  );
};

export default PlainHtml;
