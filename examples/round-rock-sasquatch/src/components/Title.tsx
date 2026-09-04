import { JSX } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type TitleProps = ComponentProps & {
  fields?: {
    Text?: Field<string>;
    data?: {
      datasource?: { field?: { jsonValue?: Field<string> } | null } | null;
      contextItem?: { field?: { jsonValue?: Field<string> } | null } | null;
    };
  };
  params?: { Tag?: string };
};

export default function Title({ fields, params }: TitleProps): JSX.Element {
  // Three possible shapes:
  // 1. Flat `fields.Text` when a non-Graph contents resolver is used
  // 2. Graph: `fields.data.datasource.field.jsonValue` when the datasource has the queried field
  // 3. Graph fallback to `fields.data.contextItem.field.jsonValue` (the page's title) when the datasource doesn't
  const text: Field<string> | undefined =
    fields?.Text ??
    fields?.data?.datasource?.field?.jsonValue ??
    fields?.data?.contextItem?.field?.jsonValue;
  if (!text?.value) return <></>;
  const tag = (params?.Tag || 'h2') as keyof JSX.IntrinsicElements;
  return (
    <div className="container sxa-title">
      <Text field={text} tag={tag} className="sxa-title-text" />
    </div>
  );
}
