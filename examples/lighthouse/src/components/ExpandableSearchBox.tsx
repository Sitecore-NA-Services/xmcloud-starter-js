'use client';

import { JSX, useState, useRef, useEffect } from 'react';
import { ComponentProps } from 'src/lib/component-props';

const ExpandableSearchBox = ({}: ComponentProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="expandable-search-box flex items-center">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close search' : 'Open search'}
        className="p-2 text-gray-600 hover:text-[var(--color-brand-primary)]"
      >
        🔍
      </button>
      <form
        onSubmit={handleSubmit}
        className={`overflow-hidden transition-all duration-200 ${expanded ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          aria-label="Search"
          className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
        />
      </form>
    </div>
  );
};

export default ExpandableSearchBox;
