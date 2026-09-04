'use client';

import { JSX, useState } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type FilterOption = {
  id: string;
  fields: {
    Title: Field<string>;
    Value: Field<string>;
  };
};

type ChecklistFilterProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    items?: FilterOption[];
  };
};

const ChecklistFilter = ({ fields }: ChecklistFilterProps): JSX.Element => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const items = fields?.items || [];
  if (!items.length) return <></>;

  const toggle = (val: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  };

  return (
    <div className="checklist-filter">
      {fields?.Title?.value && (
        <Text field={fields.Title} tag="h4" className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500" />
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const val = item.fields.Value?.value as string;
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selected.has(val)}
                  onChange={() => toggle(val)}
                  className="rounded border-gray-300 text-[var(--color-brand-primary)]"
                />
                <Text field={item.fields.Title} tag="span" className="text-sm text-gray-700" />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChecklistFilter;
