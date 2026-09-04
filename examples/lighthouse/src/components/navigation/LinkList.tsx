import { JSX } from 'react';
import { Field, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type LinkListItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Link: LinkField;
  };
};

type LinkListProps = ComponentProps & {
  fields: {
    Title?: Field<string>;
    items: LinkListItem[];
  };
};

const LinkList = ({ fields }: LinkListProps): JSX.Element => {
  if (!fields?.items?.length) return <></>;

  return (
    <div className="link-list">
      {fields.Title?.value && (
        <Text field={fields.Title} tag="h3" className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500" />
      )}
      <ul className="space-y-2">
        {fields.items.map((item) => (
          <li key={item.id}>
            <SitecoreLink
              field={sanitizeLink(item.fields.Link)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-[var(--color-brand-primary)]"
            >
              <span className="text-[var(--color-brand-primary)]">›</span>
              <Text field={item.fields.Title} />
            </SitecoreLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkList;
