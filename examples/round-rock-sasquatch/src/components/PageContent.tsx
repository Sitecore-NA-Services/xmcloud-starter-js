import { JSX } from 'react';
import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type PageContentProps = ComponentProps & {
  fields?: {
    Content?: Field<string>;
  };
};

export default function PageContent({ fields, page }: PageContentProps): JSX.Element {
  // When no datasource is set, the rendering has no `fields` of its own.
  // Fall back to the route item's Content field so PageContent always shows
  // the host page's content the way SXA intends.
  const fromDatasource = fields?.Content;
  const route = page?.layout?.sitecore?.route;
  const fromRoute = (route?.fields as { Content?: Field<string> } | undefined)?.Content;
  const content = fromDatasource ?? fromRoute;
  if (!content?.value) return <></>;
  return (
    <div className="container sxa-page-content">
      <RichText field={content} />
    </div>
  );
}
