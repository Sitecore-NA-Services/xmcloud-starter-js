import React, { JSX } from 'react';
import { Field, Page, DesignLibraryApp, AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import componentMap from '.sitecore/component-map';

interface LayoutProps {
  page: Page;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field<string>;
  Content?: Field<string>;
}

/**
 * Round Rock Sasquatch Society layout.
 *
 * The public site is just a header, a `<main>`, and a footer stacked in a
 * flex column so the footer sticks to the bottom (see `body { display:flex }`
 * and `.site-footer { margin-top:auto }` in globals.css). Header and Footer are
 * Sitecore components placed via the `headless-header` / `headless-footer`
 * placeholders (Partial Designs), so the layout itself adds no chrome.
 */
const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const shellClass = mode.isEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <div className={shellClass} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {mode.isDesignLibrary ? (
          route && (
            <DesignLibraryApp
              page={page}
              rendering={route}
              componentMap={componentMap}
              loadServerImportMap={() => import('.sitecore/import-map.server')}
            />
          )
        ) : (
          <>
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-header"
                rendering={route}
              />
            )}
            <main>
              {route && (
                <AppPlaceholder
                  page={page}
                  componentMap={componentMap}
                  name="headless-main"
                  rendering={route}
                />
              )}
            </main>
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-footer"
                rendering={route}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
