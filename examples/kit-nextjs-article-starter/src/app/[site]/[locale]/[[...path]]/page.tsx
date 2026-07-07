import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode, headers } from 'next/headers';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
import Layout from 'src/Layout';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { resolvePageMetadata, type RouteFields } from '@/lib/page-metadata';
import { getLocalizedPathPrefixes } from '@/lib/localized-paths';

type PageProps = {
  params: Promise<{
    site: string;
    locale: string;
    path?: string[];
    [key: string]: string | string[] | undefined;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;
  const draft = await draftMode();

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  // Fetch the component data from Sitecore (Likely will be deprecated)
  // Pass the resolved locale so component-level GraphQL queries (e.g. the
  // SecondaryNavigation tree query) run in the correct language. Without it the
  // context defaults to the default language and nav labels render in English
  // even on es-MX pages.
  const componentProps = await client.getComponentData(
    page.layout,
    { locale },
    components,
  );

  // Map of item-name URL paths -> localized display-name paths for this locale,
  // used to render Spanish link hrefs (Edge serves item-name url.path).
  const localizedPaths = await getLocalizedPathPrefixes(locale);

  return (
    <NextIntlClientProvider>
      <Providers page={page} componentProps={componentProps} localizedPaths={localizedPaths}>
        <Layout page={page} localizedPaths={localizedPaths} />
      </Providers>
    </NextIntlClientProvider>
  );
}

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    // Filter sites to only include the sites this starter is designed to serve.
    // This prevents cross-site build errors when multiple starters share the same XM Cloud instance.
    const defaultSite = scConfig.defaultSite;
    const allowedSites = defaultSite
      ? sites
          .filter((site: SiteInfo) => site.name === defaultSite)
          .map((site: SiteInfo) => site.name)
      : sites.map((site: SiteInfo) => site.name);
    return await client.getAppRouterStaticParams(
      allowedSites,
      routing.locales.slice(),
    );
  }
  return [];
};

// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps) => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const url = `${protocol}://${host}`;

  const { path, site, locale } = await params;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });
  const fields = page?.layout.sitecore.route?.fields as RouteFields;
  const pagePath = path?.length ? `/${path.join('/')}` : '/';
  const canonicalUrl = `${url}${pagePath}`;
  const metadata = resolvePageMetadata(fields, canonicalUrl);

  // Emit article taxonomy as Open Graph *article* meta so the Sitecore Search
  // crawler can extract author / content type / topics into facetable attributes.
  //
  // Important: the crawler's document extractor reads `property=`-based meta
  // (e.g. `<meta property="article:author">`), NOT custom `name=` meta tags.
  // Next renders openGraph.authors -> article:author, openGraph.tags ->
  // article:tag (one per value), and openGraph.section -> article:section.
  // Only article pages carry these fields; other pages fall back to a neutral
  // section so the required `type` attribute is always populated.
  const tax = fields as unknown as {
    ArticleAuthor?: { value?: string };
    taxAuthor?: { name?: string };
    taxContentType?: { name?: string };
    taxTopic?: Array<{ name?: string }>;
  };
  const author = tax?.ArticleAuthor?.value || tax?.taxAuthor?.name || '';
  const contentType = tax?.taxContentType?.name || '';
  const topics = Array.isArray(tax?.taxTopic)
    ? tax.taxTopic.map((t) => t?.name).filter((n): n is string => !!n)
    : [];

  return {
    title: metadata.title,
    description: metadata.description || 'Sitecore Next.js App Router Example',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: metadata.ogTitle,
      description:
        metadata.ogDescription || 'Sitecore Next.js App Router Example',
      url: canonicalUrl,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      // -> <meta property="article:author" content="...">
      ...(author ? { authors: [author] } : {}),
      // -> one <meta property="article:tag" content="..."> per topic
      ...(topics.length ? { tags: topics } : {}),
      // -> <meta property="article:section" content="..."> (the content type;
      //    neutral "content" on non-article pages keeps `type` populated)
      section: contentType || 'content',
    },
  };
};
