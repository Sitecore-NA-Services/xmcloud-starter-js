// TODO: Replace SHOP_ROOT_FALLBACK_ID hard-coded GUID with an environment
// variable or resolve via a site-relative GraphQL query. Hard-coded GUIDs
// are environment-specific and break when items are re-created.

// ProductGrid rendering — `Product Grid` datasource header + a server-side GraphQL
// query for the product page items under the configured `PageRoot` folder.
import Link from 'next/link';
import { JSX } from 'react';
import { Field, ImageField, Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import { formatPrice } from 'src/lib/format';
import { sitecoreQuery, SITE_LANGUAGE, SitecoreImageField } from 'src/lib/sitecore-graphql';

const SHOP_ROOT_FALLBACK_ID = 'A24054B9-1127-48AF-A58C-92DCFD4D40FC';

type ProductGridProps = ComponentProps & {
  fields?: {
    Eyebrow?: Field<string>;
    Title?: Field<string>;
    Sub?: Field<string>;
    PageRoot?: { id?: string } | null;
  };
};

type ProductGridItem = {
  id: string;
  name: string;
  url: string;
  category: string;
  tagline: string;
  price: number;
  image: SitecoreImageField;
};

type ProductsQueryResult = {
  item?: {
    children?: {
      results?: Array<{
        id: string;
        name: string;
        url?: { path?: string };
        template?: { name?: string };
        ProductName?: { value?: string } | null;
        Price?: { value?: string } | null;
        Category?: { value?: string } | null;
        Tagline?: { value?: string } | null;
        ProductImage?: { jsonValue?: SitecoreImageField } | null;
      }>;
    };
  } | null;
};

const PRODUCTS_QUERY = `
  query ProductGridItems($rootId: String!, $language: String!) {
    item(path: $rootId, language: $language) {
      children {
        results {
          id
          name
          url { path }
          template { name }
          ProductName: field(name: "ProductName") { value }
          Price: field(name: "Price") { value }
          Category: field(name: "Category") { value }
          Tagline: field(name: "Tagline") { value }
          ProductImage: field(name: "ProductImage") { jsonValue }
        }
      }
    }
  }
`;

async function loadProducts(rootId: string): Promise<ProductGridItem[]> {
  const data = await sitecoreQuery<ProductsQueryResult>(PRODUCTS_QUERY, {
    rootId,
    language: SITE_LANGUAGE,
  });
  const results = data?.item?.children?.results ?? [];
  return results
    .filter((r) => r.template?.name === 'Product Page')
    .map((r) => ({
      id: r.id,
      name: r.ProductName?.value ?? r.name,
      url: r.url?.path ?? `/shop/${r.name}`,
      category: r.Category?.value ?? '',
      tagline: r.Tagline?.value ?? '',
      price: parseFloat(r.Price?.value ?? '0') || 0,
      image: r.ProductImage?.jsonValue ?? { value: undefined },
    }));
}

export default async function ProductGrid({ fields }: ProductGridProps): Promise<JSX.Element> {
  if (!fields) return <></>;

  const rootId = fields.PageRoot?.id || SHOP_ROOT_FALLBACK_ID;
  const products = await loadProducts(rootId);

  return (
    <div className="container shop-container">
      <header className="shop-header">
        <Text field={fields.Eyebrow} tag="p" className="shop-eyebrow" />
        <Text field={fields.Title} tag="h1" className="shop-title" />
        <RichText field={fields.Sub} className="shop-sub" />
      </header>

      <div className="product-grid">
        {products.map((p) => (
          <article className="product-card" key={p.id}>
            <Link href={p.url} className="product-card-media">
              <Image field={p.image as ImageField} className="product-svg" />
            </Link>
            <div className="product-card-body">
              <p className="product-card-category">{p.category}</p>
              <h2 className="product-card-title">
                <Link href={p.url}>{p.name}</Link>
              </h2>
              <p className="product-card-tagline">{p.tagline}</p>
              <div className="product-card-footer">
                <span className="product-card-price">{formatPrice(p.price)}</span>
                <Link href={p.url} className="product-card-link">
                  View →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
