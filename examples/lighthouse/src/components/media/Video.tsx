import { JSX } from 'react';
import { Field, FileField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type VideoProps = ComponentProps & {
  fields: {
    Video?: FileField;
    EmbedUrl?: Field<string>;
    Caption?: Field<string>;
  };
};

const Video = ({ fields }: VideoProps): JSX.Element => {
  const embedUrl = fields?.EmbedUrl?.value as string | undefined;
  const mediaUrl = fields?.Video?.value?.src;

  if (!embedUrl && !mediaUrl) return <></>;

  return (
    <figure className="video-component">
      <div className="relative aspect-video overflow-hidden rounded bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            className="absolute inset-0 h-full w-full"
            preload="metadata"
          />
        )}
      </div>
      {fields?.Caption?.value && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {fields.Caption.value as string}
        </figcaption>
      )}
    </figure>
  );
};

export default Video;
