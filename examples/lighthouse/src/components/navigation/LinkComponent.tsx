import { JSX } from 'react';
import { Field, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import SitecoreLink from 'lib/sitecore-link';

type LinkComponentProps = ComponentProps & {
  fields: {
    Text?: Field<string>;
    Link: LinkField;
  };
};

const LinkComponent = ({ fields }: LinkComponentProps): JSX.Element => {
  if (!fields?.Link?.value?.href) return <></>;

  return (
    <SitecoreLink
      field={fields.Link}
      className="inline-flex items-center gap-1 text-[var(--color-brand-primary)] hover:underline"
    >
      {fields.Text?.value ? <Text field={fields.Text} /> : null}
    </SitecoreLink>
  );
};

export default LinkComponent;
