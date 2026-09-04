import { JSX } from 'react';
import { Field, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'src/lib/sitecore-link';

type FlatItem = { id: string; fields: { Title?: Field<string>; Link: LinkField } };
type GraphItem = {
  id?: string;
  title?: { jsonValue?: Field<string> };
  link?: { jsonValue?: LinkField };
};

type LinkListProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    items?: FlatItem[];
    data?: {
      datasource?: {
        title?: { jsonValue?: Field<string> } | null;
        children?: { results?: GraphItem[] } | null;
      } | null;
    };
  };
};

function normalize(props: LinkListProps): { title?: Field<string>; items: { id: string; title?: Field<string>; link: LinkField }[] } {
  const flatItems = props.fields?.items ?? [];
  if (flatItems.length) {
    return {
      title: props.fields?.Title,
      items: flatItems.map((it) => ({
        id: it.id,
        title: it.fields.Title,
        link: it.fields.Link,
      })),
    };
  }
  const graphChildren = props.fields?.data?.datasource?.children?.results ?? [];
  return {
    title: props.fields?.data?.datasource?.title?.jsonValue,
    items: graphChildren
      .filter((c): c is GraphItem & { link: { jsonValue: LinkField } } => !!c.link?.jsonValue)
      .map((c, i) => ({
        id: c.id ?? `item-${i}`,
        title: c.title?.jsonValue,
        link: c.link.jsonValue,
      })),
  };
}

export default function LinkList(props: LinkListProps): JSX.Element {
  const { title, items } = normalize(props);
  if (!items.length) return <></>;
  return (
    <div className="container sxa-link-list">
      {title?.value && <Text field={title} tag="h3" className="sxa-link-list-title" />}
      <ul className="sxa-link-list-items">
        {items.map((item) => (
          <li key={item.id} className="sxa-link-list-item">
            <SitecoreLink field={sanitizeLink(item.link)} className="sxa-link-list-link">
              {item.title?.value ? <Text field={item.title} /> : null}
            </SitecoreLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
