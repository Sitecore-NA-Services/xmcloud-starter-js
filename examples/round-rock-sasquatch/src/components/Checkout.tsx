// TODO: Move form labels, placeholders, and disclaimer copy to Sitecore
// dictionary items so they are translatable and author-managed.

// Checkout rendering — ported from RRSS app/checkout/page.js
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { JSX } from 'react';
import { getCartTotals } from 'src/lib/cart';
import { formatPrice } from 'src/lib/format';
import { submitOrder } from 'src/app/actions/cart';
import { ComponentProps } from 'src/lib/component-props';

export default async function Checkout(_props: ComponentProps): Promise<JSX.Element> {
  const { lineItems, subtotal, shipping, tax, total } = await getCartTotals();

  if (lineItems.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container checkout-container">
      <header className="cart-header">
        <h1 className="cart-title">Checkout</h1>
        <p className="cart-subtitle">
          This is a satirical site. Please do not enter real payment information.
          Any fields you fill out will be discarded the moment you close the tab.
        </p>
      </header>

      <div className="checkout-grid">
        <form action={submitOrder} className="checkout-form">
          <fieldset className="checkout-fieldset">
            <legend>Shipping</legend>
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Janet from Cedar Park"
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="janet@example.com"
              />
            </label>
            <label className="field">
              <span>Street address</span>
              <input
                type="text"
                name="street"
                required
                placeholder="500 W Bagdad Ave"
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>City</span>
                <input
                  type="text"
                  name="city"
                  required
                  defaultValue="Round Rock"
                />
              </label>
              <label className="field field-narrow">
                <span>State</span>
                <input
                  type="text"
                  name="state"
                  required
                  defaultValue="TX"
                  maxLength={2}
                />
              </label>
              <label className="field field-narrow">
                <span>ZIP</span>
                <input
                  type="text"
                  name="zip"
                  required
                  pattern="\d{5}"
                  placeholder="78664"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend>Payment (satire)</legend>
            <label className="field">
              <span>Card number</span>
              <input
                type="text"
                name="card"
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                autoComplete="off"
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Expiration</span>
                <input
                  type="text"
                  name="exp"
                  placeholder="MM/YY"
                  autoComplete="off"
                />
              </label>
              <label className="field field-narrow">
                <span>CVV</span>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  autoComplete="off"
                />
              </label>
            </div>
            <p className="checkout-note">
              No payment processor is connected. This form does not transmit
              card data anywhere. The field exists to complete the bit.
            </p>
          </fieldset>

          <button type="submit" className="btn btn-primary checkout-submit">
            Place Order — {formatPrice(total)}
          </button>
          <p className="checkout-disclaimer">
            By placing this order you acknowledge that no order will be placed,
            no item will ship, and that the Round Rock Sasquatch Society is a
            fictional satirical organization.
          </p>
        </form>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order</h2>
          <ul className="checkout-order-list">
            {lineItems.map(({ slug, qty, product, lineTotal }) => (
              <li key={slug}>
                <span className="checkout-order-name">
                  {product.name}{" "}
                  <span className="checkout-order-qty">× {qty}</span>
                </span>
                <span className="checkout-order-line">
                  {formatPrice(lineTotal)}
                </span>
              </li>
            ))}
          </ul>
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
              <dt>Tax</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="cart-summary-total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link href="/cart" className="checkout-back">
            ← Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
