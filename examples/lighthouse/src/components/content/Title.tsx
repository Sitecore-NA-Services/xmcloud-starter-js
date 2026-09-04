import { JSX } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type TitleProps = ComponentProps & {
  fields: {
    Text: Field<string>;
  };
  params?: {
    Tag?: string;
    styles?: string;
  };
};

const Title = ({ fields, params }: TitleProps): JSX.Element => {
  if (!fields?.Text?.value) return <></>;

  const tag = (params?.Tag || 'h2') as keyof JSX.IntrinsicElements;

  return (
    <div className={['px-6 pt-8 pb-2 max-w-3xl mx-auto', params?.styles].filter(Boolean).join(' ')}>
      <Text
        field={fields.Text}
        tag={tag}
        className="title font-bold leading-tight text-[var(--color-text-primary)]"
      />
    </div>
  );
};

export default Title;
