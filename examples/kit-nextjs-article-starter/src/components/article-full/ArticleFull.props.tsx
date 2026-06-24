import { ComponentProps } from '@/lib/component-props';
import { Field, RichTextField } from '@sitecore-content-sdk/nextjs';

/**
 * Shape of the Article fields returned by the rendering's integrated GraphQL query,
 * shared by the assigned datasource item and the page-level (external) fields.
 * GraphQL field names are camelCased (Sitecore lowercases the first letter).
 */
export interface ArticleFullFields {
	articleTitle?: { jsonValue?: Field<string> };
	articleAuthor?: { jsonValue?: Field<string> };
	articleContent?: { jsonValue?: RichTextField };
}

/**
 * ArticleFull renders an assigned ArticleData datasource when present, and otherwise
 * falls back to the current Article Page's own fields (externalFields). Both come through
 * the datasource pipeline so Page Builder can edit fields and assign a content item.
 */
export type ArticleFullProps = ComponentProps & {
	fields?: {
		data?: {
			datasource?: ArticleFullFields;
			externalFields?: ArticleFullFields;
		};
	};
};
