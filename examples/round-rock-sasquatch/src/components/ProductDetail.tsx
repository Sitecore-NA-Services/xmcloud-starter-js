// TODO: Move stock labels ("In stock" / "Backordered"), shipping copy, and
// form labels to Sitecore dictionary items for i18n support.

// ProductDetail rendering — renders the route item's own `Product Page` fields.
import Link from 'next/link';
import { JSX } from 'react';
import { Field, ImageField, Text, Image } from '@sitecore-content-sdk/nextjs';
import { MarkdownContent } from 'src/ui/markdown';
import { addToCart } from 'src/app/actions/cart';
import { formatPrice } from 'src/lib/format';
import { ComponentProps } from 'src/lib/component-props';

type ProductFields = {
  ProductName?: Field<string>;
  Price?: Field<number>;
  ProductImage?: ImageField;
  Category?: Field<string>;
  Tagline?: Field<string>;
  InStock?: Field<boolean>;
  Body?: Field<string>;
};

export default function ProductDetail(props: ComponentProps): JSX.Element {
  const route = props.page.layout.sitecore.route;
  const fields = route?.fields as ProductFields | undefined;
  if (!fields?.ProductName) return <></>;

  const slug = route?.name ?? '';
  const inStock = !!fields.InStock?.value;

  return (
    <div className="container product-page">
      <Link href="/shop" className="article-back">
        ← Back to shop
      </Link>

      <div className="product-detail">
        <div className="product-detail-media">
          <Image field={fields.ProductImage} className="product-svg" />
        </div>

        <div className="product-detail-info">
          <Text field={fields.Category} tag="p" className="product-card-category" />
          <Text field={fields.ProductName} tag="h1" className="product-detail-title" />
          <Text field={fields.Tagline} tag="p" className="product-detail-tagline" />

          <div className="product-detail-price-row">
            <span className="product-detail-price">{formatPrice(fields.Price?.value ?? 0)}</span>
            {inStock ? (
              <span className="product-stock in-stock">In stock</span>
            ) : (
              <span className="product-stock out-of-stock">Backordered (Doug is on it)</span>
            )}
          </div>

          <form action={addToCart} className="add-to-cart-form">
            <input type="hidden" name="slug" value={slug} />
            <label className="qty-label">
              <span>Quantity</span>
              <input
                type="number"
                name="qty"
                defaultValue="1"
                min="1"
                max="99"
                className="qty-input"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary add-to-cart-btn"
              disabled={!inStock}
            >
              Add to Cart
            </button>
          </form>

          <p className="product-detail-shipping">
            Free shipping on orders over $150. Ships from a vehicle that is, in
            most legal interpretations, a truck.
          </p>
        </div>
      </div>

      <div className="product-detail-body">
        <MarkdownContent content={fields.Body?.value ?? ''} />
      </div>
    </div>
  );
}
