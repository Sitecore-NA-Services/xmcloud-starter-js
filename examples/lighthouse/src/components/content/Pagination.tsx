import { JSX } from 'react';
import { ComponentProps } from 'src/lib/component-props';

type PaginationProps = ComponentProps & {
  params?: {
    CurrentPage?: string;
    TotalPages?: string;
  };
};

const Pagination = ({ params }: PaginationProps): JSX.Element => {
  const current = parseInt(params?.CurrentPage || '1', 10);
  const total = parseInt(params?.TotalPages || '1', 10);

  if (total <= 1) return <></>;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="pagination flex justify-center gap-1 py-6">
      {pages.map((page) => (
        <button
          key={page}
          aria-current={page === current ? 'page' : undefined}
          className={`h-9 w-9 rounded text-sm font-medium transition-colors ${
            page === current
              ? 'bg-[var(--color-brand-primary)] text-white'
              : 'border border-gray-300 text-gray-700 hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]'
          }`}
        >
          {page}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
