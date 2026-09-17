// Below are built-in components that are available in the app, it's recommended to keep them as is
import { AngularContentSdkComponent } from '@sitecore-content-sdk/angular';

import { ScFormComponent } from '@sitecore-content-sdk/angular';
// end of built-in import section
import * as RichTextcomponent from 'src/app/components/rich-text.component';
import * as Promocomponent from 'src/app/components/promo.component';
import * as PartialDesignDynamicPlaceholdercomponent from 'src/app/components/partial-design-dynamic-placeholder.component';
import * as ParkFindercomponent from 'src/app/components/park-finder.component';
import * as ParkDetailcomponent from 'src/app/components/park-detail.component';
import * as Navigationcomponent from 'src/app/components/navigation.component';
import * as LiveScoreboardcomponent from 'src/app/components/live-scoreboard.component';
import * as LessonBookingcomponent from 'src/app/components/lesson-booking.component';
import * as Imagecomponent from 'src/app/components/image.component';
import * as Containercomponent from 'src/app/components/container.component';

export const componentMap = new Map<string, AngularContentSdkComponent>([
  ['Form', ScFormComponent],
  ['RichText', { ...RichTextcomponent }],
  ['Promo', { ...Promocomponent }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholdercomponent }],
  ['ParkFinder', { ...ParkFindercomponent }],
  ['ParkDetail', { ...ParkDetailcomponent }],
  ['Navigation', { ...Navigationcomponent }],
  ['LiveScoreboard', { ...LiveScoreboardcomponent }],
  ['LessonBooking', { ...LessonBookingcomponent }],
  ['Image', { ...Imagecomponent }],
  ['Container', { ...Containercomponent }],
]);

export default componentMap;
