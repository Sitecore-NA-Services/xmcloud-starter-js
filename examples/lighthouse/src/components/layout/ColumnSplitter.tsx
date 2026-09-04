import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type ColumnSplitterProps = ComponentProps & {
  params?: {
    ColumnCount?: string;
    Styles?: string;
    styles?: string;
    EnabledPlaceholders?: string;
  };
};

const ColumnSplitter = ({ rendering, params, page }: ColumnSplitterProps): JSX.Element => {
  const columnCount = parseInt(params?.ColumnCount || '2', 10);
  const rawStyles = params?.Styles || params?.styles || '';
  const enabledPlaceholders = params?.EnabledPlaceholders?.split(',').map((s) => s.trim()) || [];

  const cols = Array.from({ length: columnCount }, (_, i) => i + 1);

  // Use grid for standard column layouts; flex-wrap as a fallback
  const gridClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const layoutClass = gridClass[columnCount] || `grid-cols-${columnCount}`;

  return (
    <div className={`column-splitter grid gap-4 ${layoutClass} ${rawStyles}`}>
      {cols.map((col) => {
        const placeholderName = `column-${col}-${rendering.uid}`;
        if (enabledPlaceholders.length && !enabledPlaceholders.includes(`column-${col}`)) return null;
        return (
          <div key={col} className="column min-w-0">
            <AppPlaceholder name={placeholderName} rendering={rendering} page={page} componentMap={componentMap} />
          </div>
        );
      })}
    </div>
  );
};

export default ColumnSplitter;
