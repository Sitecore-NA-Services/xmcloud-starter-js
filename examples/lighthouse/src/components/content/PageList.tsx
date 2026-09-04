'use client';

import { JSX, useState } from 'react';
import { Field, LinkField, ImageField, Text, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

const PAGE_SIZE = 9;

type PageListItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Introduction?: Field<string>;
    Content?: Field<string>;
    Image?: ImageField;
    PublishDate?: Field<string>;
    Link?: LinkField;
  };
};

type PageListProps = ComponentProps & {
  fields: {
    items: PageListItem[];
  };
  params?: {
    styles?: string;
  };
};

const ArticleCard = ({ item }: { item: PageListItem }): JSX.Element => {
  const href = item.fields.Link?.value?.href || '#';
  const intro = item.fields.Introduction?.value || item.fields.Content?.value || '';
  const publishDate = item.fields.PublishDate?.value || '';

  let formattedDate = '';
  if (publishDate) {
    try {
      formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      formattedDate = publishDate;
    }
  }

  return (
    <li className="page-list-item flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <a href={href} className="block overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
        {item.fields.Image?.value?.src ? (
          <Image
            field={item.fields.Image}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </a>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {formattedDate && (
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">{formattedDate}</div>
        )}
        <a href={href} className="hover:text-[var(--color-brand-primary)] transition-colors">
          <Text
            field={item.fields.Title}
            tag="h3"
            className="text-base font-semibold text-[#272727] mb-2 leading-snug"
          />
        </a>
        {intro && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{intro}</p>
        )}
        <a
          href={href}
          className="self-start text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-primary)] hover:underline mt-auto"
        >
          Read More
        </a>
      </div>
    </li>
  );
};

const PageList = ({ fields, params }: PageListProps): JSX.Element => {
  const [page, setPage] = useState(0);

  if (!fields?.items?.length) return <></>;

  const items = fields.items;
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={['page-list-wrapper container mx-auto px-6 py-10', params?.styles].filter(Boolean).join(' ')}>
      <ul className="page-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
        {pageItems.map((item) => (
          <ArticleCard key={item.id} item={item} />
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1.5 text-sm border ${
                i === page
                  ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Page ${i + 1}`}
              aria-current={i === page ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default PageList;
