// TODO: Move post-purchase copy ("Thank you", "What Happens Next" section,
// button labels) to Sitecore datasource or dictionary items.

// CheckoutSuccess rendering — ported from RRSS app/checkout/success/page.js
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { JSX } from 'react';
import { Image } from '@sitecore-content-sdk/nextjs';
import { readLastOrder } from 'src/lib/cart';
import { formatPrice } from 'src/lib/format';
import { ComponentProps } from 'src/lib/component-props';

export default async function CheckoutSuccess(_props: ComponentProps): Promise<JSX.Element> {
  const order = await readLastOrder();
  if (!order) redirect("/shop");

  const items = order.resolvedItems;

  return (
    <div className="container success-container">
      <div className="success-card">
        <div className="success-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="30" fill="#2d4a2b" />
            <path
              d="M18 33 L28 43 L46 24"
              stroke="#f5ead8"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="success-title">
          Thank you, {order.name || "Friend"}.
        </h1>
        <p className="success-sub">
          Your order has been received and added to the queue, which is a
          three-ring binder Bill keeps in his truck.
        </p>
        <p className="success-order-num">
          Order Number:{" "}
          <strong className="success-order-strong">{order.orderNumber}</strong>
        </p>

        <div className="success-items">
          {items.map(({ slug, product, qty }) => (
            <div className="success-item" key={slug}>
              <div className="success-item-media">
                <Image field={product.productImage} className="product-svg" />
              </div>
              <div className="success-item-info">
                <h3>{product.name}</h3>
                <p>
                  Qty {qty} · {formatPrice(product.price * qty)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="success-shipping">
          <h2>What Happens Next</h2>
          <ol>
            <li>
              You will receive a confirmation email at{" "}
              <strong>{order.email || "the email you provided"}</strong>. (You
              will not, because this site is satirical.)
            </li>
            <li>
              Your order enters the fulfillment queue, which is processed when
              Doug remembers to check the binder.
            </li>
            <li>
              Items ship from the back of Bill&apos;s truck within 6–8 weeks,
              weather permitting and assuming Bill is not at his sister&apos;s in
              Lampasas.
            </li>
            <li>
              You will receive a tracking number consisting of the words &quot;yeah
              it&apos;s coming.&quot;
            </li>
          </ol>
        </div>

        <div className="success-actions">
          <Link href="/shop" className="btn btn-primary">
            Continue shopping
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
