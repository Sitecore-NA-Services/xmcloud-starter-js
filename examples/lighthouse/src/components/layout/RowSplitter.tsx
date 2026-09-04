import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type RowSplitterProps = ComponentProps & {
  params?: {
    RowCount?: string;
    Styles?: string;
  };
};

const RowSplitter = ({ rendering, params, page }: RowSplitterProps): JSX.Element => {
  const rowCount = parseInt(params?.RowCount || '2', 10);
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

  return (
    <div className={`row-splitter flex flex-col gap-6 ${params?.Styles || ''}`}>
      {rows.map((row) => (
        <div key={row} className="row">
          <AppPlaceholder
            name={`row-${row}-${rendering.uid}`}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </div>
      ))}
    </div>
  );
};

export default RowSplitter;
