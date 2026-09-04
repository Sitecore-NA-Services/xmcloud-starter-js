// TODO: Move footer navigation links and social URLs to Sitecore datasource
// items (Link List or site settings). The brand name and copyright should come
// from site-level fields so editors can manage them without code deployments.

import { JSX } from 'react';
import Link from 'next/link';

const Footer = (): JSX.Element => {
  return (
    <footer>
      <div id="footer">
        {/* Footer main content */}
        <div className="text-[#cccccc]" style={{ backgroundColor: '#232323' }}>
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {/* Logo */}
              <div className="md:col-span-4">
                <Link href="/" className="inline-block no-underline">
                  <div className="font-black text-[var(--color-brand-primary)] whitespace-nowrap" style={{ fontSize: '32px', lineHeight: 1.3 }}>
                    <span
                      className="text-white inline-block"
                      style={{ background: 'var(--color-brand-primary)', padding: '0 12px', lineHeight: '1.5', marginRight: '4px' }}
                    >
                      LIGHT
                    </span>
                    HOUSE
                  </div>
                  <div className="uppercase text-[#aaaaaa]" style={{ fontSize: '12px', letterSpacing: '5px', paddingLeft: '16px', marginTop: '2px' }}>LIFESTYLE</div>
                </Link>
              </div>

              {/* Pages */}
              <div className="md:col-span-2">
                <h3 className="mb-4 font-bold text-white">Pages</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/articles" className="hover:text-white transition-colors">Articles</Link></li>
                  <li><Link href="/company" className="hover:text-white transition-colors">Company</Link></li>
                  <li><Link href="/company/locations" className="hover:text-white transition-colors">Locations</Link></li>
                  <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                  <li><Link href="/company/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Useful Links */}
              <div className="md:col-span-2">
                <h3 className="mb-4 font-bold text-white">Useful Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/landing-pages" className="hover:text-white transition-colors">Landing Pages</Link></li>
                  <li><Link href="/campaign-pages" className="hover:text-white transition-colors">Campaign Pages</Link></li>
                </ul>
              </div>

              {/* Search + Social */}
              <div className="md:col-span-4">
                <form action="/search" method="get" className="mb-6">
                  <label htmlFor="footer-search" className="sr-only">Search</label>
                  <div className="flex">
                    <input
                      id="footer-search"
                      type="text"
                      name="q"
                      placeholder="Search here..."
                      className="flex-1 rounded-l border border-[#444444] bg-[#2a2a2a] px-3 py-2 text-sm text-white placeholder-[#888888] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-r bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-medium uppercase text-white hover:bg-[var(--color-brand-dark)]"
                    >
                      Search
                    </button>
                  </div>
                </form>
                <h3 className="mb-3 font-bold text-white">Follow us</h3>
                <ul className="flex gap-3 text-sm">
                  <li>
                    <a href="http://facebook.com" target="_blank" rel="noopener noreferrer"
                      className="social-links-facebook hover:text-white transition-colors">Facebook</a>
                  </li>
                  <li>
                    <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="social-links-linkedin hover:text-white transition-colors">LinkedIn</a>
                  </li>
                  <li>
                    <a href="http://twitter.com" target="_blank" rel="noopener noreferrer"
                      className="social-links-twitter hover:text-white transition-colors">Twitter</a>
                  </li>
                  <li>
                    <a href="http://youtube.com" target="_blank" rel="noopener noreferrer"
                      className="social-links-youtube hover:text-white transition-colors">Youtube</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 bg-[#1a1a1a]">
            <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-gray-400">
              <p>
                Copyright &copy; 2026 Sitecore |{' '}
                <Link href="/company/privacy-policy" className="hover:text-white">Legal Notice</Link>
                {' '}|{' '}
                <Link href="/company/privacy-policy" className="hover:text-white">Privacy</Link>
              </p>
              <p className="mt-1">
                Sitecore Demo as used here is for demonstration purposes only and to represent the software and services provided by Sitecore further described at www.sitecore.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
