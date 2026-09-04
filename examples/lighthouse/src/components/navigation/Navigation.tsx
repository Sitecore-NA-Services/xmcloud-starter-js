'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Field, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import SitecoreLink from 'lib/sitecore-link';

type NavItem = {
  id: string;
  fields: {
    Title: Field<string>;
    Link: LinkField;
    Children?: NavItem[];
  };
};

type NavigationProps = ComponentProps & {
  fields?: {
    items?: NavItem[];
  };
};

type StaticNavItem = { label: string; href: string; cta?: boolean; children?: Array<{ label: string; href: string }> };

const MAIN_NAV: StaticNavItem[] = [
  { label: 'Your Health', href: '/your-health' },
  {
    label: 'On the Go', href: '/on-the-go',
    children: [
      { label: 'Healthy Eating', href: '/on-the-go/healthy-eating' },
      { label: 'Fitness Trackers', href: '/on-the-go/fitness-trackers' },
      { label: 'Travel Gear', href: '/on-the-go/travel-gear' },
    ],
  },
  {
    label: 'At Home', href: '/at-home',
    children: [
      { label: 'Healthy Eating', href: '/at-home/healthy-eating' },
      { label: 'Virtual Fitness Workouts', href: '/at-home/virtual-fitness-workouts' },
      { label: 'Sleep Technology', href: '/at-home/sleep-technology' },
    ],
  },
  {
    label: 'At Work', href: '/at-work',
    children: [
      { label: 'Corporate Wellness', href: '/at-work/corporate-wellness' },
      { label: 'Work From Home', href: '/at-work/work-from-home' },
    ],
  },
  { label: 'Articles', href: '/articles', cta: true },
];

const UTILITY_LINKS = [
  { label: 'English ▼', href: '#' },
  { label: 'Login', href: '/account' },
  { label: 'Locations', href: '/company/locations' },
  { label: 'Services', href: '/services' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/company/contact' },
];

const Navigation = ({ fields }: NavigationProps): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const items = fields?.items || [];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="relative">
      {/* TOP UTILITY BAR */}
      <div className="hidden md:block bg-[#232323] border-t-4 border-[var(--color-brand-primary)] relative">
        <div className="flex items-center justify-end px-4" style={{ height: '44px' }}>
          {UTILITY_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[12px] uppercase tracking-[2px] text-[#9a9a9a] hover:text-white no-underline"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="px-3 py-2 text-[#9a9a9a] hover:text-white text-base"
          >
            &#128269;
          </button>
        </div>
        {searchOpen && (
          <div
            className="absolute right-4 top-full z-[60] w-[420px] max-w-[calc(100vw-2rem)] border border-gray-200 bg-white shadow-lg"
            role="search"
          >
            <form action="/search" method="get" className="flex items-stretch">
              <input
                type="text"
                name="q"
                placeholder="search here..."
                autoFocus
                className="h-11 flex-1 px-4 text-sm text-[#272727] bg-white placeholder-[#9a9a9a] focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 px-6 bg-[var(--color-brand-primary)] text-xs font-semibold uppercase tracking-[2px] text-white hover:bg-[var(--color-brand-dark)]"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MAIN HEADER — full width, no max-width so logo hugs left and nav hugs right */}
      <nav
        className="navigation bg-white absolute left-0 right-0 z-50 border-b border-gray-200"
        style={{ top: '44px' }}
        aria-label="Main navigation"
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <div className="flex items-center justify-between px-4" style={{ minHeight: '110px' }}>

          {/* Logo */}
          <Link href="/" className="inline-block shrink-0 no-underline">
            <div
              className="font-black text-[var(--color-brand-primary)] whitespace-nowrap"
              style={{ fontSize: '40px', lineHeight: 1.3 }}
            >
              <span
                className="text-white inline-block"
                style={{ background: 'var(--color-brand-primary)', padding: '0 16px', lineHeight: '1.5', marginRight: '4px' }}
              >
                LIGHT
              </span>
              HOUSE
            </div>
            <div
              className="text-[var(--color-brand-primary)] uppercase"
              style={{ fontSize: '14px', letterSpacing: '5px', paddingLeft: '20px', marginTop: '2px' }}
            >
              LIFESTYLE
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="block rounded p-2 text-[#444444] hover:bg-[#f5f5f5] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-5 bg-current mb-1" />
            <span className="block h-0.5 w-5 bg-current mb-1" />
            <span className="block h-0.5 w-5 bg-current" />
          </button>

          {/* Primary nav — desktop: flex row; dropdowns use fixed viewport positioning */}
          <ul
            className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col bg-white shadow-md md:static md:flex md:flex-row md:shadow-none`}
            style={{ alignSelf: 'stretch' }}
          >
            {items.length > 0
              ? items.map((item) => (
                  <li
                    key={item.id}
                    className="relative"
                    style={{ display: 'flex', alignItems: 'stretch' }}
                    onMouseEnter={() => item.fields.Children?.length ? setOpenDropdown(item.id) : setOpenDropdown(null)}
                  >
                    <SitecoreLink
                      field={item.fields.Link}
                      className="flex items-center px-4 text-[14px] font-semibold uppercase tracking-wide text-[#272727] hover:font-black border-t-2 border-transparent hover:border-[var(--color-brand-primary)] no-underline"
                    >
                      <Text field={item.fields.Title} />
                    </SitecoreLink>
                    {item.fields.Children?.length && openDropdown === item.id ? (
                      <ul className="absolute top-full right-0 z-50 bg-white shadow-md border border-gray-200 min-w-[240px] flex flex-col py-1">
                        {item.fields.Children.map((child) => (
                          <li key={child.id}>
                            <SitecoreLink
                              field={child.fields.Link}
                              className="block px-5 py-2.5 text-[12px] uppercase tracking-[2px] text-[#272727] hover:bg-[#f6f6f6] hover:text-[var(--color-brand-primary)] no-underline whitespace-nowrap"
                            >
                              <Text field={child.fields.Title} />
                            </SitecoreLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))
              : MAIN_NAV.map((link) => (
                  <li
                    key={link.href}
                    className="relative"
                    style={{ display: 'flex', alignItems: 'stretch' }}
                    onMouseEnter={() => link.children?.length ? setOpenDropdown(link.href) : setOpenDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className={
                        link.cta || isActive(link.href)
                          ? 'self-center mx-2 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-wide no-underline text-white bg-[var(--color-brand-primary)]'
                          : 'flex items-center px-4 text-[14px] font-semibold uppercase tracking-wide text-[#272727] hover:font-black border-t-2 border-transparent hover:border-[var(--color-brand-primary)] no-underline'
                      }
                    >
                      {link.label}
                    </a>
                    {link.children?.length && openDropdown === link.href ? (
                      <ul className="absolute top-full right-0 z-50 bg-white shadow-md border border-gray-200 min-w-[240px] flex flex-col py-1">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className="block px-5 py-2.5 text-[12px] uppercase tracking-[2px] text-[#272727] hover:bg-[#f6f6f6] hover:text-[var(--color-brand-primary)] no-underline whitespace-nowrap"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
