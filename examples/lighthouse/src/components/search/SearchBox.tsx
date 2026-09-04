'use client';

import { JSX, useState } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type SearchBoxProps = ComponentProps & {
  fields?: {
    PlaceholderText?: Field<string>;
  };
};

const SearchBox = ({ fields }: SearchBoxProps): JSX.Element => {
  const [query, setQuery] = useState('');
  const placeholder = (fields?.PlaceholderText?.value as string) || 'Search…';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="search-box flex gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
      />
      <button
        type="submit"
        className="rounded-lg bg-[var(--color-brand-primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-dark)]"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
