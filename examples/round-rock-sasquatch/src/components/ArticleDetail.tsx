// ArticleDetail rendering — renders the route item's own `Article Page` fields.
import Link from 'next/link';
import { JSX } from 'react';
import { Field, ImageField, Text, Image } from '@sitecore-content-sdk/nextjs';
import { MarkdownContent } from 'src/ui/markdown';
import { ComponentProps } from 'src/lib/component-props';

type ArticleFields = {
  ArticleTitle?: Field<string>;
  ArticleDate?: Field<string>;
  HeroImage?: ImageField;
  Body?: Field<string>;
};

export default function ArticleDetail(props: ComponentProps): JSX.Element {
  const route = props.page.layout.sitecore.route;
  const fields = route?.fields as ArticleFields | undefined;
  if (!fields?.ArticleTitle) return <></>;

  return (
    <>
      <section className="article-hero">
        <Image field={fields.HeroImage} className="article-hero-svg" />
        <div className="article-hero-overlay">
          <div className="container">
            <Text field={fields.ArticleDate} tag="p" className="article-date" />
            <Text field={fields.ArticleTitle} tag="h1" className="article-title" />
          </div>
        </div>
      </section>

      <div className="container">
        <Link href="/" className="article-back">
          ← Back to all reports
        </Link>
        <div className="article-body">
          <MarkdownContent content={fields.Body?.value ?? ''} sectionDividers={true} />
        </div>
      </div>
    </>
  );
}
