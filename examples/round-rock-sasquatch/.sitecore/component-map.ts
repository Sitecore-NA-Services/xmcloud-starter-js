// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Title from 'src/components/Title';
import * as RowSplitter from 'src/components/RowSplitter';
import * as RichText from 'src/components/RichText';
import * as Promo from 'src/components/Promo';
import * as ProductGrid from 'src/components/ProductGrid';
import * as ProductDetail from 'src/components/ProductDetail';
import * as PageContent from 'src/components/PageContent';
import * as Navigation from 'src/components/Navigation';
import * as LinkList from 'src/components/LinkList';
import * as Image from 'src/components/Image';
import * as Hero from 'src/components/Hero';
import * as Header from 'src/components/Header';
import * as FootprintDivider from 'src/components/FootprintDivider';
import * as Footer from 'src/components/Footer';
import * as Container from 'src/components/Container';
import * as ColumnSplitter from 'src/components/ColumnSplitter';
import * as CheckoutSuccess from 'src/components/CheckoutSuccess';
import * as Checkout from 'src/components/Checkout';
import * as Cart from 'src/components/Cart';
import * as ArticleList from 'src/components/ArticleList';
import * as ArticleDetail from 'src/components/ArticleDetail';
import * as AboutBody from 'src/components/AboutBody';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['Title', { ...Title }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['ProductGrid', { ...ProductGrid }],
  ['ProductDetail', { ...ProductDetail }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation }],
  ['LinkList', { ...LinkList }],
  ['Image', { ...Image }],
  ['Hero', { ...Hero }],
  ['Header', { ...Header }],
  ['FootprintDivider', { ...FootprintDivider }],
  ['Footer', { ...Footer }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['CheckoutSuccess', { ...CheckoutSuccess }],
  ['Checkout', { ...Checkout }],
  ['Cart', { ...Cart }],
  ['ArticleList', { ...ArticleList }],
  ['ArticleDetail', { ...ArticleDetail }],
  ['AboutBody', { ...AboutBody }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
]);

export default componentMap;
