import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type ContainerProps = ComponentProps;

export default function Container({ rendering, page }: ContainerProps): JSX.Element {
  return (
    <div className="container sxa-container">
      <AppPlaceholder
        name={`container-${rendering.uid}`}
        rendering={rendering}
        page={page}
        componentMap={componentMap}
      />
    </div>
  );
}
