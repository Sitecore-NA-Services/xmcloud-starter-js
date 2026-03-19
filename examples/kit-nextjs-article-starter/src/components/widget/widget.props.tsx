import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Widget component - displays a widget with title and text content
 */
export type WidgetProps = ComponentProps & WidgetFields;

export interface WidgetFields {
  fields: {
    widgetTitle: Field<string>;
    widgetText: Field<string>;
  };
}