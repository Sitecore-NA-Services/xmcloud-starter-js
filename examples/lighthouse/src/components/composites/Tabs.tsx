'use client';

import { JSX, useState } from 'react';
import { Field, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type TabItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Content: Field<string>;
  };
};

type TabsProps = ComponentProps & {
  fields?: {
    items?: TabItem[];
  };
  params?: {
    TabControlBelowContent?: string;  // '1' to render tab buttons below content
    styles?: string;
  };
};

const Tabs = ({ fields, params }: TabsProps): JSX.Element => {
  const items = fields?.items || [];
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  if (!items.length) return <></>;

  const activeItem = items.find((i) => i.id === activeId) || items[0];
  const tabsBelow = params?.TabControlBelowContent === '1';

  const tabBar = (
    <div className="flex border-b border-gray-200" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={item.id === activeId}
          onClick={() => setActiveId(item.id)}
          className={`px-5 py-3 text-sm font-medium transition-colors ${
            item.id === activeId
              ? 'border-b-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Text field={item.fields.Title} tag="span" />
        </button>
      ))}
    </div>
  );

  return (
    <div className={['tabs', params?.styles].filter(Boolean).join(' ')}>
      {!tabsBelow && tabBar}
      <div className="rich-text p-5 text-gray-700" role="tabpanel">
        <RichText field={activeItem.fields.Content} />
      </div>
      {tabsBelow && tabBar}
    </div>
  );
};

export default Tabs;
