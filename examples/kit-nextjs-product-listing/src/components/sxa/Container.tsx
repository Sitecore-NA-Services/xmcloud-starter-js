import {
  AppPlaceholder,
  ComponentParams,
  ComponentRendering,
  ComponentMap,
  Page,
} from '@sitecore-content-sdk/nextjs';
import React, { type JSX } from 'react';

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  page: Page;
  /**
   * Injected automatically by the parent AppPlaceholder that renders this component.
   * Received as a prop rather than imported from `.sitecore/component-map` here: that
   * generated file imports Container to register it, so importing it back at module
   * scope creates a cycle that can fail with a TDZ error on some component orderings.
   */
  componentMap: ComponentMap;
}

const DefaultContainer = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `container-${props.params.DynamicPlaceholderId}`;
  const id = props.params.RenderingIdentifier;
  const mediaUrlPattern = new RegExp(/mediaurl=\"([^"]*)\"/, 'i');
  const backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage && backgroundImage.match(mediaUrlPattern)) {
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1] || '';

    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <div className={`component container-default ${styles}`} id={id ? id : undefined}>
      <div className="component-content bg-cover" style={backgroundStyle}>
        <div className="row">
          <AppPlaceholder
            name={phKey}
            rendering={props.rendering}
            page={props.page}
            componentMap={props.componentMap}
          />
        </div>
      </div>
    </div>
  );
};

export const TailwindContainer = (): JSX.Element => {
  return (
    <>
      <div className="component conatiner container-default col-12 col-12 container mx-6 mb-4 mt-4 lg:mx-auto lg:mx-auto lg:grow lg:basis-0"></div>
      <div className="bg-linear-to-b bg-brand-gray95 border-t my-8 border-t-md text-center border-brand-purple from-brand-purple to-white"></div>
    </>
  );
};

export const Default = (props: ComponentProps): JSX.Element => {
  const splitStyles = props.params?.Styles?.split(' ');

  if (splitStyles && splitStyles.includes('container')) {
    return (
      <div className="container-wrapper">
        <DefaultContainer {...props} />
      </div>
    );
  }

  return <DefaultContainer {...props} />;
};
