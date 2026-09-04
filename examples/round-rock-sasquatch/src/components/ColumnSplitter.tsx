import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type ColumnSplitterProps = ComponentProps & {
  params?: {
    ColumnCount?: string;
    EnabledPlaceholders?: string;
  };
};

export default function ColumnSplitter({ rendering, params, page }: ColumnSplitterProps): JSX.Element {
  const columnCount = Math.max(1, Math.min(8, parseInt(params?.ColumnCount || '2', 10) || 2));
  const enabled = params?.EnabledPlaceholders?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const cols = Array.from({ length: columnCount }, (_, i) => i + 1);
  return (
    <div className={`sxa-column-splitter sxa-cols-${columnCount}`}>
      {cols.map((c) => {
        if (enabled.length && !enabled.includes(`column-${c}`)) return null;
        return (
          <div key={c} className="sxa-column">
            <AppPlaceholder
              name={`column-${c}-${rendering.uid}`}
              rendering={rendering}
              page={page}
              componentMap={componentMap}
            />
          </div>
        );
      })}
    </div>
  );
}
