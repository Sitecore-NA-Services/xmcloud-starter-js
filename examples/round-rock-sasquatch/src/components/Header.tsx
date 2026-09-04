// TODO: Replace hard-coded site title, tagline, and navigation links with
// Sitecore datasource fields. Navigation should be driven by Sitecore
// Navigation items or link fields so content authors can manage it.

// Header rendering — site header ported from RRSS app/layout.js
import Link from 'next/link';
import { JSX } from 'react';
import { HeaderMark } from 'src/ui/illustrations';
import { getCartItemCount } from 'src/lib/cart';
import { ComponentProps } from 'src/lib/component-props';

export default async function Header(_props: ComponentProps): Promise<JSX.Element> {
  const cartCount = await getCartItemCount();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-title-link">
          <HeaderMark />
          <span className="site-title-text">
            <span className="site-title">Round Rock Sasquatch Society</span>
            <span className="site-tagline">
              Central Texas Field Research &amp; Chronicles
            </span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/" className="site-nav-link">
            Home
          </Link>
          <Link href="/about" className="site-nav-link">
            About
          </Link>
          <Link href="/shop" className="site-nav-link">
            Shop
          </Link>
          <Link href="/cart" className="site-nav-cart" aria-label="Cart">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 4h2.5L7 16h11l2-8H6.5" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="site-nav-cart-count">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
