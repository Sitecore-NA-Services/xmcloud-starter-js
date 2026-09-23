// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as VideoPlayerdev from 'src/components/video/VideoPlayer.dev';
import * as VideoModaldev from 'src/components/video/VideoModal.dev';
import * as Video from 'src/components/video/Video';
import * as VerticalImageAccordion from 'src/components/vertical-image-accordion/VerticalImageAccordion';
import * as HtmlLang from 'src/components/util/HtmlLang';
import * as TopicItemdev from 'src/components/topic-listing/TopicItem.dev';
import * as themeproviderdev from 'src/components/theme-provider/theme-provider.dev';
import * as TestimonialCarousel from 'src/components/testimonial-carousel/TestimonialCarousel';
import * as Title from 'src/components/sxa/Title';
import * as PageContent from 'src/components/sxa/PageContent';
import * as Navigation from 'src/components/sxa/Navigation';
import * as Image from 'src/components/sxa/Image';
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as SearchResults from 'src/components/sitecore-search/SearchResults';
import * as SearchQuestions from 'src/components/sitecore-search/SearchQuestions';
import * as SearchProvider from 'src/components/sitecore-search/SearchProvider';
import * as SearchLocale from 'src/components/sitecore-search/SearchLocale';
import * as PreviewSearchBox from 'src/components/sitecore-search/PreviewSearchBox';
import * as SecondaryNavigation from 'src/components/secondary-navigation/SecondaryNavigation';
import * as RagChat from 'src/components/rag-chat/RagChat';
import * as PromoAnimatedImageRightdev from 'src/components/promo-animated/PromoAnimatedImageRight.dev';
import * as PromoAnimatedDefaultdev from 'src/components/promo-animated/PromoAnimatedDefault.dev';
import * as PromoAnimated from 'src/components/promo-animated/PromoAnimated';
import * as portaldev from 'src/components/portal/portal.dev';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as MultiPromoTabs from 'src/components/multi-promo-tabs/MultiPromoTabs';
import * as MultiPromo from 'src/components/multi-promo/MultiPromo';
import * as modetoggledev from 'src/components/mode-toggle/mode-toggle.dev';
import * as MediaSectiondev from 'src/components/media-section/MediaSection.dev';
import * as meteors from 'src/components/magicui/meteors';
import * as LogoTabs from 'src/components/logo-tabs/LogoTabs';
import * as nextImageSrcdev from 'src/components/image/nextImageSrc.dev';
import * as ImageWrapperdev from 'src/components/image/ImageWrapper.dev';
import * as imageoptimizationcontext from 'src/components/image/image-optimization.context';
import * as Icon from 'src/components/icon/Icon';
import * as Hero from 'src/components/hero/Hero';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as FooterNavigationColumn from 'src/components/global-footer/FooterNavigationColumn';
import * as floatingdockdev from 'src/components/floating-dock/floating-dock.dev';
import * as BackgroundThumbnaildev from 'src/components/background-thumbnail/BackgroundThumbnail.dev';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleHeader from 'src/components/article-header/ArticleHeader';
import * as ArticleFull from 'src/components/article-full/ArticleFull';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as AlertBannerdev from 'src/components/alert-banner/AlertBanner.dev';
import * as AgentChat from 'src/components/agent-chat/AgentChat';
import * as AccordionBlock from 'src/components/accordion-block/AccordionBlock';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['VideoPlayer', { ...VideoPlayerdev }],
  ['VideoModal', { ...VideoModaldev }],
  ['Video', { ...Video }],
  ['VerticalImageAccordion', { ...VerticalImageAccordion }],
  ['HtmlLang', { ...HtmlLang }],
  ['TopicItem', { ...TopicItemdev }],
  ['theme-provider', { ...themeproviderdev }],
  ['TestimonialCarousel', { ...TestimonialCarousel }],
  ['Title', { ...Title }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation }],
  ['Image', { ...Image }],
  ['SubscriptionBanner', { ...SubscriptionBanner }],
  ['SearchResults', { ...SearchResults }],
  ['SearchQuestions', { ...SearchQuestions }],
  ['SearchProvider', { ...SearchProvider }],
  ['SearchLocale', { ...SearchLocale }],
  ['PreviewSearchBox', { ...PreviewSearchBox }],
  ['SecondaryNavigation', { ...SecondaryNavigation }],
  ['RagChat', { ...RagChat }],
  ['PromoAnimatedImageRight', { ...PromoAnimatedImageRightdev }],
  ['PromoAnimatedDefault', { ...PromoAnimatedDefaultdev }],
  ['PromoAnimated', { ...PromoAnimated }],
  ['portal', { ...portaldev }],
  ['PageHeader', { ...PageHeader }],
  ['MultiPromoTabs', { ...MultiPromoTabs }],
  ['MultiPromo', { ...MultiPromo }],
  ['mode-toggle', { ...modetoggledev }],
  ['MediaSection', { ...MediaSectiondev }],
  ['meteors', { ...meteors }],
  ['LogoTabs', { ...LogoTabs }],
  ['nextImageSrc', { ...nextImageSrcdev }],
  ['ImageWrapper', { ...ImageWrapperdev }],
  ['image-optimization', { ...imageoptimizationcontext }],
  ['Icon', { ...Icon }],
  ['Hero', { ...Hero }],
  ['GlobalHeader', { ...GlobalHeader }],
  ['FooterNavigationColumn', { ...FooterNavigationColumn }],
  ['floating-dock', { ...floatingdockdev }],
  ['BackgroundThumbnail', { ...BackgroundThumbnaildev }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleHeader', { ...ArticleHeader }],
  ['ArticleFull', { ...ArticleFull }],
  ['AnimatedSection', { ...AnimatedSectiondev }],
  ['AlertBanner', { ...AlertBannerdev }],
  ['AgentChat', { ...AgentChat }],
  ['AccordionBlock', { ...AccordionBlock }],
]);

export default componentMap;
