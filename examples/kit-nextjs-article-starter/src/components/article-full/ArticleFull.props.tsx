import { ComponentProps } from '@/lib/component-props';
import { Field, RichTextField } from '@sitecore-content-sdk/nextjs';

/**
 * ArticleFull component can read from datasource fields or page/route context fields.
 */
export type ArticleFullProps = ComponentProps & {
	fields?: {
		data?: {
			datasource?: {
				Title?: { jsonValue?: Field<string> };
				Author?: { jsonValue?: Field<string> };
				Body?: { jsonValue?: RichTextField };
			};
		};
	};
};