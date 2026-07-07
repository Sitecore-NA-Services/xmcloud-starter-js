'use client';

import React from 'react';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { ThemeProvider } from 'components/theme-provider/theme-provider.dev';
import { VideoProvider } from './contexts/VideoContext';
import { LocalizedPathsProvider, type PrefixMap } from '@/lib/localize-href';

export default function Providers({
  children,
  page,
  componentProps = {},
  localizedPaths = {},
}: {
  children: React.ReactNode;
  page: Page;
  componentProps?: ComponentPropsCollection;
  localizedPaths?: PrefixMap;
}) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
    >
      <ComponentPropsContext value={componentProps}>
        <LocalizedPathsProvider map={localizedPaths}>
          <VideoProvider>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </VideoProvider>
        </LocalizedPathsProvider>
      </ComponentPropsContext>
    </SitecoreProvider>
  );
}
