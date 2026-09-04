import { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type NavItem = {
  Id?: string;
  Href?: string;
  Querystring?: string;
  NavigationTitle?: Field<string>;
  Styles?: string[];
  Children?: NavItem[];
};

type NavigationProps = ComponentProps & {
  fields?: NavItem[];
};

function getKey(item: NavItem, fallbackIndex: number): string {
  return item.Id || `${item.Href || ''}-${fallbackIndex}`;
}

function getHref(item: NavItem): string {
  const qs = item.Querystring ? `?${item.Querystring}` : '';
  return `${item.Href || '#'}${qs}`;
}

function getLabel(item: NavItem): string {
  return item.NavigationTitle?.value || '';
}

export default function Navigation(props: NavigationProps): JSX.Element {
  const items = Array.isArray(props.fields) ? props.fields : [];
  if (!items.length) return <></>;
  return (
    <nav className="container sxa-nav" aria-label="Page navigation">
      <ul className="sxa-nav-list">
        {items.map((item, i) => (
          <li key={getKey(item, i)} className="sxa-nav-item">
            <a href={getHref(item)} className="sxa-nav-link">
              {getLabel(item)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
