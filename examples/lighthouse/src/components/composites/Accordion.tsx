'use client';

import { JSX, useState } from 'react';
import { Field, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type AccordionItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Content: Field<string>;
  };
};

type AccordionProps = ComponentProps & {
  fields?: {
    items?: AccordionItem[];
  };
  params?: {
    ExpandedByDefault?: string;  // '1' to expand first item by default
    CanOpenMultiple?: string;    // '1' to allow multiple items open
    CanToggle?: string;          // '0' to prevent closing an open item
    styles?: string;
  };
};

const Accordion = ({ fields, params }: AccordionProps): JSX.Element => {
  const items = fields?.items || [];
  const expandedByDefault = params?.ExpandedByDefault === '1';
  const canOpenMultiple = params?.CanOpenMultiple === '1';
  const canToggle = params?.CanToggle !== '0';

  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(expandedByDefault && items[0] ? [items[0].id] : [])
  );

  if (!items.length) return <></>;

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (canToggle) next.delete(id);
      } else {
        if (!canOpenMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={['accordion divide-y divide-gray-200 rounded-lg border border-gray-200', params?.styles].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
            aria-expanded={openIds.has(item.id)}
          >
            <Text field={item.fields.Title} tag="span" />
            <span className={`ml-3 shrink-0 transition-transform ${openIds.has(item.id) ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {openIds.has(item.id) && (
            <div className="border-t border-gray-200 px-5 py-4">
              <div className="rich-text text-gray-700">
                <RichText field={item.fields.Content} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
