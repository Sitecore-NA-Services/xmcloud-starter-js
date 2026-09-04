import { JSX } from 'react';
import { Field, FileField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type FileListItem = {
  id: string;
  fields: {
    Title: Field<string>;
    File: FileField;
    Description?: Field<string>;
  };
};

type FileListProps = ComponentProps & {
  fields?: {
    Title?: Field<string>;
    items?: FileListItem[];
  };
};

const FileList = ({ fields }: FileListProps): JSX.Element => {
  const items = fields?.items || [];
  if (!items.length) return <></>;

  return (
    <div className="file-list">
      {fields?.Title?.value && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{fields.Title.value as string}</h3>
      )}
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((item) => {
          const fileUrl = item.fields.File?.value?.src;
          return (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-900">{item.fields.Title?.value as string}</p>
                {item.fields.Description?.value && (
                  <p className="text-sm text-gray-500">{item.fields.Description.value as string}</p>
                )}
              </div>
              {fileUrl && (
                <a
                  href={fileUrl}
                  download
                  className="shrink-0 rounded bg-[var(--color-brand-primary)] px-3 py-1 text-sm text-white hover:bg-[var(--color-brand-dark)]"
                >
                  Download
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FileList;
