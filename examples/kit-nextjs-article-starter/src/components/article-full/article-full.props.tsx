import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type ArticleFullProps = ComponentProps & ArticleFullFields;

export interface ArticleFullFields {
  fields: {
    ArticleAuthor: Field<string>;
    ArticleTitle: Field<string>;
    ArticleText: Field<string>;
  };
}
