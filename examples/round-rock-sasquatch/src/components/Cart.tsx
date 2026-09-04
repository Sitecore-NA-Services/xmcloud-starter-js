// TODO: Move UI copy (empty-cart text, tax label, shipping disclaimer) to
// Sitecore dictionary items. Move tax rate and shipping threshold to
// environment variables or a Sitecore settings item.

// Cart rendering — ported from RRSS app/cart/page.js
import Link from 'next/link';
import { JSX } from 'react';
import { Image } from '@sitecore-content-sdk/nextjs';
import { getCartTotals } from 'src/lib/cart';
import { formatPrice } from 'src/lib/format';
import { updateQuantity, removeFromCart, clearCart } from 'src/app/actions/cart';
import { ComponentProps } from 'src/lib/component-props';

export default async function Cart(_props: ComponentProps): Promise<JSX.Element> {
  const { lineItems, subtotal, shipping, tax, total } = await getCartTotals();

  if (lineItems.length === 0) {
    return (
      <div className="container cart-empty">
        <h1 className="cart-title">Your cart is empty.</h1>
        <p className="cart-empty-text">
          The cart, like the Brushy Creek corridor at 4 PM on a Tuesday, has
          had no recent activity. Maybe try{" "}
          <Link href="/shop">browsing the shop</Link>?
        </p>
      </div>
    );
  }

  return (
    <div className="container cart-container">
      <header className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <p className="cart-subtitle">
          {lineItems.length} {lineItems.length === 1 ? "item" : "items"} ·{" "}
          {lineItems.reduce((s, l) => s + l.qty, 0)} total units
        </p>
      </header>

      <div className="cart-grid">
        <div className="cart-lines">
          {lineItems.map(({ slug, qty, product, lineTotal }) => (
            <div className="cart-line" key={slug}>
              <Link href={`/shop/${slug}`} className="cart-line-media">
                <Image field={product.productImage} className="product-svg" />
              </Link>
              <div className="cart-line-info">
                <p className="product-card-category">{product.category}</p>
                <h2 className="cart-line-title">
                  <Link href={`/shop/${slug}`}>{product.name}</Link>
                </h2>
                <p className="cart-line-tagline">{product.tagline}</p>
                <p className="cart-line-unit">
                  {formatPrice(product.price)} each
                </p>
              </div>
              <div className="cart-line-controls">
                <div className="qty-stepper">
                  <form action={updateQuantity}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="qty" value={qty - 1} />
                    <button
                      type="submit"
                      className="qty-btn"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                  </form>
                  <span className="qty-value" aria-live="polite">
                    {qty}
                  </span>
                  <form action={updateQuantity}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="qty" value={qty + 1} />
                    <button
                      type="submit"
                      className="qty-btn"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </form>
                </div>
                <p className="cart-line-total">{formatPrice(lineTotal)}</p>
                <form action={removeFromCart}>
                  <input type="hidden" name="slug" value={slug} />
                  <button type="submit" className="cart-remove-btn">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
          <form action={clearCart} className="cart-clear-row">
            <button type="submit" className="cart-clear-btn">
              Clear cart
            </button>
          </form>
        </div>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>
          <dl className="cart-summary-lines">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div>
              <dt>Tax (Williamson Co. 8.25%)</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="cart-summary-total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn btn-primary cart-checkout-btn">
            Proceed to Checkout →
          </Link>
          <p className="cart-summary-note">
            Free shipping on orders over $150. We do not accept returns on the
            wood-knock branch.
          </p>
        </aside>
      </div>
    </div>
  );
}
