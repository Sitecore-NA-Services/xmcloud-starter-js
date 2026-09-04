import { JSX } from 'react';
import { Field, ImageField, Image, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type AuthorTeaserProps = ComponentProps & {
  fields: {
    AuthorName: Field<string>;
    AuthorBio: Field<string>;
    AuthorImage: ImageField;
  };
};

const AuthorTeaser = ({ fields }: AuthorTeaserProps): JSX.Element => {
  if (!fields) return <></>;

  return (
    <div className="author-teaser flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
      {fields.AuthorImage?.value?.src && (
        <div className="shrink-0">
          <Image
            field={fields.AuthorImage}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      )}
      <div>
        <Text
          field={fields.AuthorName}
          tag="p"
          className="font-semibold text-gray-900"
        />
        {fields.AuthorBio?.value && (
          <Text
            field={fields.AuthorBio}
            tag="p"
            className="mt-1 text-sm text-gray-600"
          />
        )}
      </div>
    </div>
  );
};

export default AuthorTeaser;
