import { JSX } from 'react';
import { Field, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type BreadcrumbItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Link?: LinkField;
  };
};

type BreadcrumbProps = ComponentProps & {
  fields?: {
    items?: BreadcrumbItem[];
  };
};

const Breadcrumb = ({ fields }: BreadcrumbProps): JSX.Element => {
  const items = fields?.items || [];
  if (!items.length) return <></>;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.id} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast || !item.fields.Link?.value?.href ? (
                <Text field={item.fields.Title} tag="span" className="text-gray-900" />
              ) : (
                <SitecoreLink field={sanitizeLink(item.fields.Link)} className="hover:text-[var(--color-brand-primary)]">
                  <Text field={item.fields.Title} />
                </SitecoreLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
