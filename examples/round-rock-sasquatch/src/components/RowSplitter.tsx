import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type RowSplitterProps = ComponentProps & {
  params?: {
    RowCount?: string;
  };
};

export default function RowSplitter({ rendering, params, page }: RowSplitterProps): JSX.Element {
  const rowCount = Math.max(1, Math.min(8, parseInt(params?.RowCount || '2', 10) || 2));
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);
  return (
    <div className="sxa-row-splitter">
      {rows.map((r) => (
        <div key={r} className="sxa-row">
          <AppPlaceholder
            name={`row-${r}-${rendering.uid}`}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </div>
      ))}
    </div>
  );
}
