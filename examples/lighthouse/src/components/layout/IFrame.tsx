import { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type IFrameProps = ComponentProps & {
  fields: {
    Url: Field<string>;
    Height?: Field<string>;
    Title?: Field<string>;
  };
};

const IFrame = ({ fields }: IFrameProps): JSX.Element => {
  const url = fields?.Url?.value as string;
  if (!url) return <></>;

  const height = (fields?.Height?.value as string) || '500px';
  const title = (fields?.Title?.value as string) || 'Embedded content';

  return (
    <div className="iframe-wrapper overflow-hidden rounded border border-gray-200">
      <iframe
        src={url}
        title={title}
        style={{ height }}
        className="w-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default IFrame;
