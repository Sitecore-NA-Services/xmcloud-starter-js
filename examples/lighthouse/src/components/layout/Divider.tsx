import { JSX } from 'react';
import { ComponentProps } from 'src/lib/component-props';

const Divider = ({ params }: ComponentProps): JSX.Element => (
  <hr className={`divider my-8 border-t border-gray-200 ${params?.Styles || ''}`} />
);

export default Divider;
