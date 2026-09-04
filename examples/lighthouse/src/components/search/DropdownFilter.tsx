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

type DropdownFilterProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    items?: FilterOption[];
  };
};

const DropdownFilter = ({ fields }: DropdownFilterProps): JSX.Element => {
  const [value, setValue] = useState('');
  const items = fields?.items || [];
  if (!items.length) return <></>;

  return (
    <div className="dropdown-filter">
      {fields?.Title?.value && (
        <Text field={fields.Title} tag="label" className="mb-1 block text-sm font-semibold text-gray-700" />
      )}
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none"
      >
        <option value="">All</option>
        {items.map((item) => (
          <option key={item.id} value={item.fields.Value?.value as string}>
            {item.fields.Title?.value as string}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
