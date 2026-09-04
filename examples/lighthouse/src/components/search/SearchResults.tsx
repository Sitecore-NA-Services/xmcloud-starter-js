import { JSX } from 'react';
import { Field, ImageField, LinkField, Text, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { sanitizeLink } from 'src/lib/link-utils';
import SitecoreLink from 'lib/sitecore-link';

type SearchResult = {
  id: string;
  fields: {
    Title: Field<string>;
    Description?: Field<string>;
    Image?: ImageField;
    Link?: LinkField;
  };
};

type SearchResultsProps = ComponentProps & {
  fields?: {
    items?: SearchResult[];
    TotalResults?: Field<string>;
    Query?: Field<string>;
  };
};

const SearchResults = ({ fields }: SearchResultsProps): JSX.Element => {
  const items = fields?.items || [];
  const total = fields?.TotalResults?.value as string | undefined;
  const query = fields?.Query?.value as string | undefined;

  return (
    <div className="search-results">
      {query && (
        <p className="mb-4 text-sm text-gray-500">
          {total ? `${total} results` : 'Results'} for <strong>&ldquo;{query}&rdquo;</strong>
        </p>
      )}
      {!items.length ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4">
              {item.fields.Image?.value?.src && (
                <Image field={item.fields.Image} className="h-20 w-20 shrink-0 rounded object-cover" />
              )}
              <div>
                <Text field={item.fields.Title} tag="h3" className="font-semibold text-gray-900" />
                {item.fields.Description?.value && (
                  <Text field={item.fields.Description} tag="p" className="mt-1 text-sm text-gray-600 line-clamp-2" />
                )}
                {item.fields.Link?.value?.href && (
                  <SitecoreLink field={sanitizeLink(item.fields.Link)} className="mt-1 block text-sm text-[var(--color-brand-primary)] hover:underline" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
