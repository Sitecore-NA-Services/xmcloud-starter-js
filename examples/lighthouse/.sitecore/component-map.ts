// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as TrainerFinder from 'src/components/TrainerFinder';
import * as TrackerRegister from 'src/components/TrackerRegister';
import * as StoreLocator from 'src/components/StoreLocator';
import * as SectionIndex from 'src/components/SectionIndex';
import * as RichText from 'src/components/RichText';
import * as ResourceSearch from 'src/components/ResourceSearch';
import * as RegisterForm from 'src/components/RegisterForm';
import * as PageTeaser from 'src/components/PageTeaser';
import * as LoginForm from 'src/components/LoginForm';
import * as Hero from 'src/components/Hero';
import * as GlobalSearch from 'src/components/GlobalSearch';
import * as GenericPage from 'src/components/GenericPage';
import * as ForgotPasswordForm from 'src/components/ForgotPasswordForm';
import * as ExpandableSearchBox from 'src/components/ExpandableSearchBox';
import * as ContentFinder from 'src/components/ContentFinder';
import * as AuthorTeaser from 'src/components/AuthorTeaser';
import * as AccountSettings from 'src/components/AccountSettings';
import * as AccountPortal from 'src/components/AccountPortal';
import * as SearchResults from 'src/components/search/SearchResults';
import * as SearchBox from 'src/components/search/SearchBox';
import * as DropdownFilter from 'src/components/search/DropdownFilter';
import * as ChecklistFilter from 'src/components/search/ChecklistFilter';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/navigation/LinkList';
import * as LinkComponent from 'src/components/navigation/LinkComponent';
import * as Breadcrumb from 'src/components/navigation/Breadcrumb';
import * as Video from 'src/components/media/Video';
import * as ImageComponent from 'src/components/media/ImageComponent';
import * as Gallery from 'src/components/media/Gallery';
import * as FileList from 'src/components/media/FileList';
import * as Toggle from 'src/components/layout/Toggle';
import * as RowSplitter from 'src/components/layout/RowSplitter';
import * as IFrame from 'src/components/layout/IFrame';
import * as Footer from 'src/components/layout/Footer';
import * as Divider from 'src/components/layout/Divider';
import * as Container from 'src/components/layout/Container';
import * as ColumnSplitter from 'src/components/layout/ColumnSplitter';
import * as Title from 'src/components/content/Title';
import * as ResourceDetail from 'src/components/content/ResourceDetail';
import * as Promo from 'src/components/content/Promo';
import * as PlainHtml from 'src/components/content/PlainHtml';
import * as Pagination from 'src/components/content/Pagination';
import * as PageList from 'src/components/content/PageList';
import * as PageContent from 'src/components/content/PageContent';
import * as ExperienceData from 'src/components/content/ExperienceData';
import * as ArticleDetail from 'src/components/content/ArticleDetail';
import * as Tabs from 'src/components/composites/Tabs';
import * as PageTeaserGrid from 'src/components/composites/PageTeaserGrid';
import * as FooterCarousel from 'src/components/composites/FooterCarousel';
import * as Carousel from 'src/components/composites/Carousel';
import * as Accordion from 'src/components/composites/Accordion';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['TrainerFinder', { ...TrainerFinder, componentType: 'client' }],
  ['TrackerRegister', { ...TrackerRegister, componentType: 'client' }],
  ['StoreLocator', { ...StoreLocator, componentType: 'client' }],
  ['SectionIndex', { ...SectionIndex, componentType: 'client' }],
  ['RichText', { ...RichText }],
  ['ResourceSearch', { ...ResourceSearch, componentType: 'client' }],
  ['RegisterForm', { ...RegisterForm, componentType: 'client' }],
  ['PageTeaser', { ...PageTeaser }],
  ['LoginForm', { ...LoginForm, componentType: 'client' }],
  ['Hero', { ...Hero }],
  ['GlobalSearch', { ...GlobalSearch, componentType: 'client' }],
  ['GenericPage', { ...GenericPage, componentType: 'client' }],
  ['ForgotPasswordForm', { ...ForgotPasswordForm, componentType: 'client' }],
  ['ExpandableSearchBox', { ...ExpandableSearchBox, componentType: 'client' }],
  ['ContentFinder', { ...ContentFinder, componentType: 'client' }],
  ['AuthorTeaser', { ...AuthorTeaser }],
  ['AccountSettings', { ...AccountSettings, componentType: 'client' }],
  ['AccountPortal', { ...AccountPortal }],
  ['SearchResults', { ...SearchResults }],
  ['SearchBox', { ...SearchBox, componentType: 'client' }],
  ['DropdownFilter', { ...DropdownFilter, componentType: 'client' }],
  ['ChecklistFilter', { ...ChecklistFilter, componentType: 'client' }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['LinkComponent', { ...LinkComponent }],
  ['Breadcrumb', { ...Breadcrumb }],
  ['Video', { ...Video }],
  ['ImageComponent', { ...ImageComponent }],
  ['Gallery', { ...Gallery, componentType: 'client' }],
  ['FileList', { ...FileList }],
  ['Toggle', { ...Toggle, componentType: 'client' }],
  ['RowSplitter', { ...RowSplitter }],
  ['IFrame', { ...IFrame }],
  ['Footer', { ...Footer }],
  ['Divider', { ...Divider }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['Title', { ...Title }],
  ['ResourceDetail', { ...ResourceDetail }],
  ['Promo', { ...Promo }],
  ['PlainHtml', { ...PlainHtml }],
  ['Pagination', { ...Pagination }],
  ['PageList', { ...PageList, componentType: 'client' }],
  ['PageContent', { ...PageContent }],
  ['ExperienceData', { ...ExperienceData }],
  ['ArticleDetail', { ...ArticleDetail }],
  ['Tabs', { ...Tabs, componentType: 'client' }],
  ['PageTeaserGrid', { ...PageTeaserGrid }],
  ['FooterCarousel', { ...FooterCarousel, componentType: 'client' }],
  ['Carousel', { ...Carousel, componentType: 'client' }],
  ['Accordion', { ...Accordion, componentType: 'client' }],
]);

export default componentMap;
