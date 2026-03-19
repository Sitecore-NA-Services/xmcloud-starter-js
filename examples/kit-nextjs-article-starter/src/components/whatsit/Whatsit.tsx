import type React from 'react';
import { Text, RichText, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';

type WhatsitProps = ComponentProps & {
  fields: {
    title: Field<string>;
    text: Field<string>;
  };
};

export const Default: React.FC<WhatsitProps> = (props) => {
  const { fields, params } = props;
  const id = params?.RenderingIdentifier;

  if (!fields) {
    return <NoDataFallback componentName="Whatsit" />;
  }

  return (
    <div
      className={params?.styles || undefined}
      id={id ? id : undefined}
      data-component-name="whatsit"
    >
      <Text tag="h2" field={fields.title} />
      <RichText field={fields.text} />
    </div>
  );
};
