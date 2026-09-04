// Client-safe component map for App Router
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCClientWrapper, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as TrainerFinder from 'src/components/TrainerFinder';
import * as TrackerRegister from 'src/components/TrackerRegister';
import * as StoreLocator from 'src/components/StoreLocator';
import * as SectionIndex from 'src/components/SectionIndex';
import * as ResourceSearch from 'src/components/ResourceSearch';
import * as RegisterForm from 'src/components/RegisterForm';
import * as LoginForm from 'src/components/LoginForm';
import * as GlobalSearch from 'src/components/GlobalSearch';
import * as GenericPage from 'src/components/GenericPage';
import * as ForgotPasswordForm from 'src/components/ForgotPasswordForm';
import * as ExpandableSearchBox from 'src/components/ExpandableSearchBox';
import * as ContentFinder from 'src/components/ContentFinder';
import * as AccountSettings from 'src/components/AccountSettings';
import * as SearchBox from 'src/components/search/SearchBox';
import * as DropdownFilter from 'src/components/search/DropdownFilter';
import * as ChecklistFilter from 'src/components/search/ChecklistFilter';
import * as Navigation from 'src/components/navigation/Navigation';
import * as Gallery from 'src/components/media/Gallery';
import * as Toggle from 'src/components/layout/Toggle';
import * as PageList from 'src/components/content/PageList';
import * as Tabs from 'src/components/composites/Tabs';
import * as FooterCarousel from 'src/components/composites/FooterCarousel';
import * as Carousel from 'src/components/composites/Carousel';
import * as Accordion from 'src/components/composites/Accordion';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['TrainerFinder', { ...TrainerFinder }],
  ['TrackerRegister', { ...TrackerRegister }],
  ['StoreLocator', { ...StoreLocator }],
  ['SectionIndex', { ...SectionIndex }],
  ['ResourceSearch', { ...ResourceSearch }],
  ['RegisterForm', { ...RegisterForm }],
  ['LoginForm', { ...LoginForm }],
  ['GlobalSearch', { ...GlobalSearch }],
  ['GenericPage', { ...GenericPage }],
  ['ForgotPasswordForm', { ...ForgotPasswordForm }],
  ['ExpandableSearchBox', { ...ExpandableSearchBox }],
  ['ContentFinder', { ...ContentFinder }],
  ['AccountSettings', { ...AccountSettings }],
  ['SearchBox', { ...SearchBox }],
  ['DropdownFilter', { ...DropdownFilter }],
  ['ChecklistFilter', { ...ChecklistFilter }],
  ['Navigation', { ...Navigation }],
  ['Gallery', { ...Gallery }],
  ['Toggle', { ...Toggle }],
  ['PageList', { ...PageList }],
  ['Tabs', { ...Tabs }],
  ['FooterCarousel', { ...FooterCarousel }],
  ['Carousel', { ...Carousel }],
  ['Accordion', { ...Accordion }],
]);

export default componentMap;
