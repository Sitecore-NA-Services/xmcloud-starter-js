/**
 * One-off: render the inline-SVG art components to standalone .svg files so they
 * can be uploaded to the Sitecore Media Library. Run with:
 *   npx tsx@4 scripts/export-svgs.tsx <outDir>
 * (or `npm run export-svgs` if a script is added). Output dir defaults to ./.svg-out.
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ForestHero, ArticleHero, FootprintDivider, HeaderMark } from '../src/ui/illustrations';
import { ProductImage } from '../src/ui/product-image';

const outDir = process.argv[2] || join(process.cwd(), '.svg-out');
mkdirSync(outDir, { recursive: true });

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';

function ensureXmlns(svg: string): string {
  // react-dom/server already emits xmlns on the root <svg>; guard just in case.
  return svg.includes('xmlns="http://www.w3.org/2000/svg"')
    ? svg
    : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}

function save(name: string, element: React.ReactElement) {
  const markup = ensureXmlns(renderToStaticMarkup(element));
  writeFileSync(join(outDir, `${name}.svg`), XML_HEADER + markup + '\n', 'utf8');
  console.log('wrote', `${name}.svg`);
}

// Heroes
save('forest-hero', <ForestHero />);
for (const v of ['trail', 'creek', 'gear', 'legends', 'seasons']) {
  save(`article-hero-${v}`, <ArticleHero variant={v} />);
}

// Product illustrations
for (const v of ['spray', 'ghillie', 'cast', 'monocular', 'branch', 'camera', 'card', 'journal']) {
  save(`product-${v}`, <ProductImage variant={v} />);
}

// Brand / decorative
save('footprint-divider', <FootprintDivider />);
save('header-mark', <HeaderMark />);

console.log('done -> ', outDir);
