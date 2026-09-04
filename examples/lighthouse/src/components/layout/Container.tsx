import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type ContainerProps = ComponentProps & {
  params?: {
    Styles?: string;
    styles?: string;
    GridParameters?: string;
  };
};

function getContainerClasses(styles?: string): string {
  if (!styles) return 'mx-auto max-w-7xl px-4';
  if (styles.includes('full-width-container') || styles.includes('full-width-promo')) return 'w-full max-w-none';
  if (styles.includes('container-gray-background')) return 'bg-[#f7f7f7] w-full';
  if (styles.includes('footer-links-container')) return 'px-4';
  if (styles.includes('footer-legal-container')) return 'border-t border-gray-300 mt-4 pt-4 w-full';
  return 'mx-auto max-w-7xl px-4';
}

const Container = ({ rendering, params, page }: ContainerProps): JSX.Element => {
  // XMC passes styles as either Styles or styles depending on SDK version
  const rawStyles = params?.Styles || params?.styles || '';
  const containerClasses = getContainerClasses(rawStyles);

  return (
    <div className={`container-component ${containerClasses}`}>
      <AppPlaceholder
        name={`container-${rendering.uid}`}
        rendering={rendering}
        page={page}
        componentMap={componentMap}
      />
    </div>
  );
};

export default Container;
