// FootprintDivider rendering — placeable wrapper around the illustration divider
import { JSX } from 'react';
import { FootprintDivider as FootprintDividerArt } from 'src/ui/illustrations';
import { ComponentProps } from 'src/lib/component-props';

export default function FootprintDivider(_props: ComponentProps): JSX.Element {
  return <FootprintDividerArt />;
}
