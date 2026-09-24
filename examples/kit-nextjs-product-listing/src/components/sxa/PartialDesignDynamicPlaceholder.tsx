import React, { JSX } from 'react';
import { AppPlaceholder, ComponentMap } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

const PartialDesignDynamicPlaceholder = (
  props: ComponentProps & { componentMap: ComponentMap }
): JSX.Element => (
  <AppPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page}
    componentMap={props.componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
