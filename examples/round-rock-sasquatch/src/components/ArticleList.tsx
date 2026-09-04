// TODO: Replace ARTICLES_ROOT_FALLBACK_ID hard-coded GUID with an environment
// variable or resolve via a site-relative GraphQL query. Hard-coded GUIDs
// are environment-specific and break when items are re-created.

// ArticleList rendering — `Article List` datasource header + a server-side GraphQL
// query for the article page items under the configured `PageRoot` folder.
import Link from 'next/link';
import { JSX } from 'react';
import { Field, ImageField, Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import { FootprintDivider } from 'src/ui/illustrations';
import { ComponentProps } from 'src/lib/component-props';
import { sitecoreQuery, SITE_LANGUAGE, SitecoreImageField } from 'src/lib/sitecore-graphql';

const ARTICLES_ROOT_FALLBACK_ID = '1D7C3E85-FB5A-4779-87B9-21FB100CD523';

type ArticleListProps = ComponentProps & {
  fields?: {
    Intro?: Field<string>;
    Heading?: Field<string>;
    PageRoot?: { id?: string } | null;
  };
};

type ArticleListItem = {
  id: string;
  url: string;
  title: string;
  date: string;
  excerpt: string;
  heroImage: SitecoreImageField;
};

type ArticlesQueryResult = {
  item?: {
    children?: {
      results?: Array<{
        id: string;
        name: string;
        url?: { path?: string };
        template?: { name?: string };
        ArticleTitle?: { value?: string } | null;
        ArticleDate?: { value?: string } | null;
        Excerpt?: { value?: string } | null;
        HeroImage?: { jsonValue?: SitecoreImageField } | null;
      }>;
    };
  } | null;
};

const ARTICLES_QUERY = `
  query ArticleListItems($rootId: String!, $language: String!) {
    item(path: $rootId, language: $language) {
      children {
        results {
          id
          name
          url { path }
          template { name }
          ArticleTitle: field(name: "ArticleTitle") { value }
          ArticleDate: field(name: "ArticleDate") { value }
          Excerpt: field(name: "Excerpt") { value }
          HeroImage: field(name: "HeroImage") { jsonValue }
        }
      }
    }
  }
`;

async function loadArticles(rootId: string): Promise<ArticleListItem[]> {
  const data = await sitecoreQuery<ArticlesQueryResult>(ARTICLES_QUERY, {
    rootId,
    language: SITE_LANGUAGE,
  });
  const results = data?.item?.children?.results ?? [];
  return results
    .filter((r) => r.template?.name === 'Article Page')
    .map((r) => ({
      id: r.id,
      url: r.url?.path ?? `/articles/${r.name}`,
      title: r.ArticleTitle?.value ?? r.name,
      date: r.ArticleDate?.value ?? '',
      excerpt: r.Excerpt?.value ?? '',
      heroImage: r.HeroImage?.jsonValue ?? { value: undefined },
    }));
}

export default async function ArticleList({ fields }: ArticleListProps): Promise<JSX.Element> {
  if (!fields) return <></>;

  const rootId = fields.PageRoot?.id || ARTICLES_ROOT_FALLBACK_ID;
  const articles = await loadArticles(rootId);

  return (
    <div className="container">
      <RichText field={fields.Intro} className="home-intro" />

      <FootprintDivider />

      <Text field={fields.Heading} tag="h2" className="articles-heading" />

      <div className="article-list">
        {articles.map((a) => (
          <article className="article-card" key={a.id}>
            <Link href={a.url} className="article-card-media-link">
              <div className="article-card-media">
                <Image field={a.heroImage as ImageField} className="article-hero-svg" />
              </div>
            </Link>
            <div className="article-card-body">
              <p className="article-card-date">{a.date}</p>
              <h3 className="article-card-title">
                <Link href={a.url}>{a.title}</Link>
              </h3>
              <p className="article-card-excerpt">{a.excerpt}</p>
              <Link href={a.url} className="article-card-readmore">
                Read the report →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
