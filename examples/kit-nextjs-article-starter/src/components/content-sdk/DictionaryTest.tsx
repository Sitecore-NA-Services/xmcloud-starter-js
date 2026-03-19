'use client';

import { useTranslations } from 'next-intl';

/**
 * Temporary test component to verify dictionary entries are loading from Sitecore.
 * Displays the value of "TestEntryKey" from the dictionary.
 * Remove after verification.
 */
const DictionaryTest = () => {
  const t = useTranslations();

  let value: string;
  try {
    value = t('TestEntryKey');
  } catch {
    value = '[key not found]';
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: '#222',
        color: '#0f0',
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 12,
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      Dictionary: TestEntryKey = &quot;{value}&quot;
    </div>
  );
};

export default DictionaryTest;
