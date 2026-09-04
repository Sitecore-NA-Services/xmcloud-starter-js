import { JSX } from 'react';
import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type PageContentProps = ComponentProps & {
  fields: {
    Content: Field<string>;
  };
};

const PageContent = ({ fields }: PageContentProps): JSX.Element => {
  if (!fields?.Content?.value) return <></>;

  return (
    <div className="page-content rich-text mx-auto max-w-3xl py-6">
      <RichText field={fields.Content} />
    </div>
  );
};

export default PageContent;
