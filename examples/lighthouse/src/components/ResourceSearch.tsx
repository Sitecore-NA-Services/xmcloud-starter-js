'use client';

import { JSX, useMemo, useState } from 'react';
import { ComponentProps } from 'src/lib/component-props';

type Json<T> = { jsonValue: T } | undefined;
type StrField = Json<{ value?: string }>;
type ImgField = Json<{ value?: { src?: string; alt?: string } }>;
type LinkField = Json<{ value?: { href?: string; text?: string; target?: string } }>;

type ResourceItem = {
  id: string;
  name: string;
  url?: { path?: string };
  Title?: StrField;
  Introduction?: StrField;
  Image?: ImgField;
  ResourceType?: StrField;
  Link?: LinkField;
};

type ChildrenShape = ResourceItem[] | { results?: ResourceItem[] } | undefined;

type ResourceSearchFields = {
  data?: {
    externalFields?: {
      Supertitle?: StrField;
      Title?: StrField;
      children?: ChildrenShape;
    };
  };
};

const childList = (c: ChildrenShape): ResourceItem[] =>
  Array.isArray(c) ? c : c?.results || [];

type ResourceSearchProps = ComponentProps & {
  fields?: ResourceSearchFields;
};

const PAGE_SIZE = 9;

const typeStyles: Record<string, string> = {
  Video: 'bg-[#111] text-white',
  Audio: 'bg-[#4a4a4a] text-white',
  Document: 'bg-[var(--color-brand-primary)] text-white',
  Whitepaper: 'bg-[#7aa7b0] text-white',
  'Case Study': 'bg-[#b8cfd6] text-gray-800',
  External: 'bg-[#e0e8eb] text-gray-800',
};

const stripHtml = (html?: string): string =>
  (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

type NormResource = {
  id: string;
  title: string;
  type: string;
  intro: string;
  img?: { src?: string; alt?: string };
  href: string;
  external: boolean;
};

const normalize = (r: ResourceItem): NormResource => {
  const linkHref = r.Link?.jsonValue?.value?.href;
  const path = r.url?.path;
  return {
    id: r.id,
    title: r.Title?.jsonValue?.value || r.name,
    type: (r.ResourceType?.jsonValue?.value || '').trim() || 'Resource',
    intro: stripHtml(r.Introduction?.jsonValue?.value),
    img: r.Image?.jsonValue?.value,
    href: linkHref || path || '#',
    external: !!linkHref && !path?.length ? true : !!linkHref,
  };
};

const ResourceSearch = ({ fields }: ResourceSearchProps): JSX.Element => {
  const ext = fields?.data?.externalFields;
  const supertitle = ext?.Supertitle?.jsonValue?.value || '';
  const pageTitle = ext?.Title?.jsonValue?.value || 'Resources';

  const all: NormResource[] = useMemo(
    () => childList(ext?.children).map(normalize),
    [ext?.children]
  );
  const types = useMemo(
    () => Array.from(new Set(all.map((r) => r.type))).sort(),
    [all]
  );

  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<string>('');
  const [page, setPage] = useState(0);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = all;
    if (type) list = list.filter((r) => r.type === type);
    if (submitted && q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.intro.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, type, q, submitted]);

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setPage(0);
  };
  const handleClear = () => {
    setQuery('');
    setSubmitted(false);
    setType('');
    setPage(0);
  };

  if (!ext) return <></>;

  return (
    <section className="resource-search w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {(supertitle || pageTitle) && (
          <header className="mb-6 text-center">
            {supertitle && (
              <p className="text-xs font-semibold uppercase tracking-[3px] text-gray-400">{supertitle}</p>
            )}
            <h1 className="mt-1 text-3xl font-bold text-[#272727] md:text-4xl">{pageTitle}</h1>
          </header>
        )}

        <form onSubmit={handleSubmit} className="mb-4 flex gap-0">
          <input
            type="text"
            placeholder="search for resources here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 bg-[#f7f7f7] px-4 py-3 text-sm focus:border-[var(--color-brand-primary)] focus:bg-white focus:outline-none"
            aria-label="Search resources"
          />
          <button
            type="submit"
            className="bg-[var(--color-brand-primary)] px-10 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-brand-dark)]"
          >
            Search
          </button>
        </form>

        {types.length > 1 && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setType('');
                setPage(0);
              }}
              className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] ${
                type === '' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setPage(0);
                }}
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] ${
                  type === t ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="mb-3 text-center text-sm text-gray-700">
          There {totalResults === 1 ? 'is' : 'are'} {totalResults} result{totalResults === 1 ? '' : 's'}
          {(submitted && q) || type ? (
            <>
              {' '}·{' '}
              <button type="button" onClick={handleClear} className="text-[var(--color-brand-primary)] hover:underline">
                Clear
              </button>
            </>
          ) : null}
        </div>

        {totalResults === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">No results</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                >
                  <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="block">
                    {r.img?.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.img.src} alt={r.img.alt || r.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="h-44 w-full bg-gray-200" />
                    )}
                  </a>
                  <div className={`${typeStyles[r.type] ?? 'bg-gray-200 text-gray-800'} px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px]`}>
                    {r.type}
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-4">
                    <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="hover:text-[var(--color-brand-primary)]">
                      <h3 className="mb-2 text-base font-semibold leading-snug text-[#272727]">{r.title}</h3>
                    </a>
                    {r.intro && <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">{r.intro}</p>}
                    <a
                      href={r.href}
                      {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="mt-auto self-start text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-brand-primary)] hover:underline"
                    >
                      {r.external ? 'Visit Resource' : 'Read More'} &rsaquo;
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2 text-xs text-gray-600">
                <button type="button" onClick={() => setPage(0)} disabled={page === 0} className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40">First</button>
                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <span className="px-3 py-1.5">Page {page + 1} of {totalPages}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                <button type="button" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="px-3 py-1.5 uppercase tracking-[2px] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40">Last</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ResourceSearch;
