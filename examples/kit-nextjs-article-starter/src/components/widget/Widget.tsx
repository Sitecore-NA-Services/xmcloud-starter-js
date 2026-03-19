import type React from 'react';
import { Text, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { WidgetProps } from './widget.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<WidgetProps> = (props) => {
  const { fields, params } = props;
  const id = params?.RenderingIdentifier;

  // Check if we have the required fields
  if (!fields?.widgetTitle && !fields?.widgetText) {
    return <NoDataFallback componentName="Widget" />;
  }

  return (
    <div
      className={cn(
        'widget bg-white border border-gray-200 rounded-lg p-6 shadow-sm',
        { [props?.params?.styles]: props?.params?.styles }
      )}
      id={id ? id : undefined}
      data-component-name="widget"
    >
      {/* Widget Title */}
      {(fields?.widgetTitle?.value || props.page?.mode?.isEditing) && (
        <h3 className="text-xl font-semibold mb-3 text-gray-900">
          <Text field={fields.widgetTitle} />
        </h3>
      )}

      {/* Widget Text */}
      {(fields?.widgetText?.value || props.page?.mode?.isEditing) && (
        <div className="text-gray-700 prose prose-sm max-w-none">
          <ContentSdkRichText field={fields.widgetText} />
        </div>
      )}
    </div>
  );
};