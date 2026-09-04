'use client';

import { JSX, useState } from 'react';
import { Field, Text, AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map.client';

type ToggleProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
  };
};

const Toggle = ({ fields, rendering, page }: ToggleProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <div className="toggle rounded border border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
        aria-expanded={open}
      >
        {fields?.Title ? (
          <Text field={fields.Title} tag="span" />
        ) : (
          <span>Toggle</span>
        )}
        <span className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="border-t border-gray-200 px-5 py-4">
          <AppPlaceholder name={`toggle-content-${rendering.uid}`} rendering={rendering} page={page} componentMap={componentMap} />
        </div>
      )}
    </div>
  );
};

export default Toggle;
