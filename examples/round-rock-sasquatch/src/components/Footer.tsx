// TODO: Replace hard-coded copyright text and navigation links with Sitecore
// datasource fields so content authors can manage footer content.

// Footer rendering — site footer ported from RRSS app/layout.js
import Link from 'next/link';
import { JSX } from 'react';
import { ComponentProps } from 'src/lib/component-props';

export default function Footer(_props: ComponentProps): JSX.Element {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p>
          &copy; {new Date().getFullYear()} Round Rock Sasquatch Society.
          All sightings reported in good faith.
        </p>
        <nav className="site-footer-nav">
          <Link href="/about">About</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </footer>
  );
}
