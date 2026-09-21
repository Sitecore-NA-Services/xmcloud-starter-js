import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';
import componentMap from '.sitecore/component-map';

type ContainerProps = ComponentProps;

/**
 * Resolve the child placeholder key from the layout data rather than assuming one.
 *
 * Sitecore emits this key in more than one shape: the SXA dynamic-placeholder form
 * `container-<DynamicPlaceholderId>`, and an unresolved wildcard `container-{*}`
 * (which is what this site's home page currently returns). Hard-coding
 * `container-${rendering.uid}` matched neither, so the Container rendered an empty
 * div and every component inside it silently disappeared.
 */
function resolveContainerPlaceholder(rendering: ContainerProps['rendering']): string {
  const keys = Object.keys(rendering?.placeholders ?? {});
  const containerKey = keys.find((key) => key.startsWith('container-'));
  if (containerKey) return containerKey;

  const dynamicId = rendering?.params?.DynamicPlaceholderId;
  return dynamicId ? `container-${dynamicId}` : `container-${rendering.uid}`;
}

export default function Container({ rendering, page }: ContainerProps): JSX.Element {
  return (
    <div className="container sxa-container">
      <AppPlaceholder
        name={resolveContainerPlaceholder(rendering)}
        rendering={rendering}
        page={page}
        componentMap={componentMap}
      />
    </div>
  );
}
