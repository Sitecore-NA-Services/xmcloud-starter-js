import { JSX } from 'react';
import { Field, RichText as SitecoreRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type RichTextProps = ComponentProps & {
  fields: {
    Text: Field<string>;
  };
};

const RichText = ({ fields, params }: RichTextProps): JSX.Element => {
  if (!fields?.Text?.value) return <></>;

  return (
    <div className={['px-6 py-4 max-w-3xl mx-auto', params?.styles].filter(Boolean).join(' ')}>
      <div className="rich-text prose prose-gray max-w-none">
        <SitecoreRichText field={fields.Text} />
      </div>
    </div>
  );
};

export default RichText;
