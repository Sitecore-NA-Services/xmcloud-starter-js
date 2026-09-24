// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Widgetprops from 'src/components/widget/widget.props';
import * as Widget from 'src/components/widget/Widget';
import * as Whatsit from 'src/components/whatsit/Whatsit';
import * as VideoPlayerdev from 'src/components/video/VideoPlayer.dev';
import * as VideoModaldev from 'src/components/video/VideoModal.dev';
import * as Video from 'src/components/video/Video';
import * as VideoProps from 'src/components/video/video-props';
import * as VerticalImageAccordionprops from 'src/components/vertical-image-accordion/vertical-image-accordion.props';
import * as VerticalImageAccordion from 'src/components/vertical-image-accordion/VerticalImageAccordion';
import * as HtmlLang from 'src/components/util/HtmlLang';
import * as ChatMarkdown from 'src/components/util/ChatMarkdown';
import * as TopicListingprops from 'src/components/topic-listing/topic-listing.props';
import * as TopicListing from 'src/components/topic-listing/TopicListing';
import * as TopicItemdev from 'src/components/topic-listing/TopicItem.dev';
import * as ThemeProviderdev from 'src/components/theme-provider/theme-provider.dev';
import * as TextBannerDefaultdev from 'src/components/text-banner/TextBannerDefault.dev';
import * as TextBanner02dev from 'src/components/text-banner/TextBanner02.dev';
import * as TextBanner01dev from 'src/components/text-banner/TextBanner01.dev';
import * as TextBannerprops from 'src/components/text-banner/text-banner.props';
import * as TextBanner from 'src/components/text-banner/TextBanner';
import * as TestimonialCarouselItem from 'src/components/testimonial-carousel/TestimonialCarouselItem';
import * as TestimonialCarouselprops from 'src/components/testimonial-carousel/testimonial-carousel.props';
import * as TestimonialCarousel from 'src/components/testimonial-carousel/TestimonialCarousel';
import * as Title from 'src/components/sxa/Title';
import * as RowSplitter from 'src/components/sxa/RowSplitter';
import * as RichText from 'src/components/sxa/RichText';
import * as Promo from 'src/components/sxa/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/sxa/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/sxa/PageContent';
import * as Navigation from 'src/components/sxa/Navigation';
import * as LinkList from 'src/components/sxa/LinkList';
import * as Image from 'src/components/sxa/Image';
import * as ContentBlock from 'src/components/sxa/ContentBlock';
import * as Container from 'src/components/sxa/Container';
import * as ColumnSplitter from 'src/components/sxa/ColumnSplitter';
import * as SubscriptionBannerprops from 'src/components/subscription-banner/subscription-banner.props';
import * as SubscriptionBannerdictionary from 'src/components/subscription-banner/subscription-banner.dictionary';
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as SearchResultsdictionary from 'src/components/sitecore-search/search-results.dictionary';
import * as SearchResults from 'src/components/sitecore-search/SearchResults';
import * as SearchQuestionsdictionary from 'src/components/sitecore-search/search-questions.dictionary';
import * as SearchQuestions from 'src/components/sitecore-search/SearchQuestions';
import * as SearchProvider from 'src/components/sitecore-search/SearchProvider';
import * as SearchLocale from 'src/components/sitecore-search/SearchLocale';
import * as SearchConfig from 'src/components/sitecore-search/search-config';
import * as PreviewSearchBox from 'src/components/sitecore-search/PreviewSearchBox';
import * as PreviewSearchdictionary from 'src/components/sitecore-search/preview-search.dictionary';
import * as SiteMetadataprops from 'src/components/site-metadata/site-metadata.props';
import * as SiteMetadata from 'src/components/site-metadata/SiteMetadata';
import * as SecondaryNavigationprops from 'src/components/secondary-navigation/secondary-navigation.props';
import * as SecondaryNavigation from 'src/components/secondary-navigation/SecondaryNavigation';
import * as RichTextBlockprops from 'src/components/rich-text-block/rich-text-block.props';
import * as RichTextBlock from 'src/components/rich-text-block/RichTextBlock';
import * as RagChat from 'src/components/rag-chat/RagChat';
import * as PromoBlockprops from 'src/components/promo-block/promo-block.props';
import * as PromoBlock from 'src/components/promo-block/PromoBlock';
import * as PromoAnimatedImageRightdev from 'src/components/promo-animated/PromoAnimatedImageRight.dev';
import * as PromoAnimatedDefaultdev from 'src/components/promo-animated/PromoAnimatedDefault.dev';
import * as PromoAnimatedutil from 'src/components/promo-animated/promo-animated.util';
import * as PromoAnimatedprops from 'src/components/promo-animated/promo-animated.props';
import * as PromoAnimated from 'src/components/promo-animated/PromoAnimated';
import * as Portaldev from 'src/components/portal/portal.dev';
import * as PageHeaderprops from 'src/components/page-header/page-header.props';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as MultiPromoTabsprops from 'src/components/multi-promo-tabs/multi-promo-tabs.props';
import * as MultiPromoTabs from 'src/components/multi-promo-tabs/MultiPromoTabs';
import * as MultiPromoTabdev from 'src/components/multi-promo-tabs/MultiPromoTab.dev';
import * as MultiPromoItemdev from 'src/components/multi-promo/MultiPromoItem.dev';
import * as MultiPromoprops from 'src/components/multi-promo/multi-promo.props';
import * as MultiPromo from 'src/components/multi-promo/MultiPromo';
import * as ModeToggledev from 'src/components/mode-toggle/mode-toggle.dev';
import * as MediaSectiondev from 'src/components/media-section/MediaSection.dev';
import * as MediaSectionprops from 'src/components/media-section/media-section.props';
import * as Meteors from 'src/components/magicui/meteors';
import * as LogoTabsprops from 'src/components/logo-tabs/logo-tabs.props';
import * as LogoTabs from 'src/components/logo-tabs/LogoTabs';
import * as LogoItem from 'src/components/logo-tabs/LogoItem';
import * as Logoprops from 'src/components/logo/logo.props';
import * as Logodev from 'src/components/logo/Logo.dev';
import * as NextImageSrcdev from 'src/components/image/nextImageSrc.dev';
import * as ImageWrapperdev from 'src/components/image/ImageWrapper.dev';
import * as ImageBlock from 'src/components/image/ImageBlock';
import * as Imageprops from 'src/components/image/image.props';
import * as ImageOptimizationcontext from 'src/components/image/image-optimization.context';
import * as Icon from 'src/components/icon/Icon';
import * as YoutubeIcondev from 'src/components/icon/svg/YoutubeIcon.dev';
import * as TwitterIcondev from 'src/components/icon/svg/TwitterIcon.dev';
import * as Signaldev from 'src/components/icon/svg/signal.dev';
import * as Playdev from 'src/components/icon/svg/play.dev';
import * as LinkedInIcondev from 'src/components/icon/svg/LinkedInIcon.dev';
import * as InternalIcondev from 'src/components/icon/svg/InternalIcon.dev';
import * as InstagramIcondev from 'src/components/icon/svg/InstagramIcon.dev';
import * as FileIcondev from 'src/components/icon/svg/FileIcon.dev';
import * as FacebookIcondev from 'src/components/icon/svg/FacebookIcon.dev';
import * as ExternalIcondev from 'src/components/icon/svg/ExternalIcon.dev';
import * as EmailIcondev from 'src/components/icon/svg/EmailIcon.dev';
import * as Diversitydev from 'src/components/icon/svg/diversity.dev';
import * as CrossArrowsdev from 'src/components/icon/svg/cross-arrows.dev';
import * as Communitiesdev from 'src/components/icon/svg/communities.dev';
import * as ArrowUpRightdev from 'src/components/icon/svg/arrow-up-right.dev';
import * as ArrowRightdev from 'src/components/icon/svg/arrow-right.dev';
import * as ArrowLeftdev from 'src/components/icon/svg/arrow-left.dev';
import * as Heroprops from 'src/components/hero/hero.props';
import * as Hero from 'src/components/hero/Hero';
import * as GlobalHeaderprops from 'src/components/global-header/global-header.props';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as GlobalFooterprops from 'src/components/global-footer/global-footer.props';
import * as GlobalFooter from 'src/components/global-footer/GlobalFooter';
import * as FooterNavigationColumn from 'src/components/global-footer/FooterNavigationColumn';
import * as FooterNavigationCalloutdev from 'src/components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as FloatingDockdev from 'src/components/floating-dock/floating-dock.dev';
import * as Flexdev from 'src/components/flex/Flex.dev';
import * as CtaBanner from 'src/components/cta-banner/CtaBanner';
import * as Containerutil from 'src/components/container/container.util';
import * as ContainerFullWidth from 'src/components/container/container-full-width/ContainerFullWidth';
import * as ContainerFullBleed from 'src/components/container/container-full-bleed/ContainerFullBleed';
import * as Container7030 from 'src/components/container/container-7030/Container7030';
import * as Container70 from 'src/components/container/container-70/Container70';
import * as Container6321 from 'src/components/container/container-6321/Container6321';
import * as Container6040 from 'src/components/container/container-6040/Container6040';
import * as Container5050 from 'src/components/container/container-5050/Container5050';
import * as Container4060 from 'src/components/container/container-4060/Container4060';
import * as Container3070 from 'src/components/container/container-3070/Container3070';
import * as Container303030 from 'src/components/container/container-303030/Container303030';
import * as Container25252525 from 'src/components/container/container-25252525/Container25252525';
import * as Carddev from 'src/components/card/Card.dev';
import * as ButtonComponent from 'src/components/button-component/ButtonComponent';
import * as Breadcrumbs from 'src/components/breadcrumbs/Breadcrumbs';
import * as BackgroundThumbnaildev from 'src/components/background-thumbnail/BackgroundThumbnail.dev';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleHeaderdictionary from 'src/components/article-header/article-header.dictionary';
import * as ArticleHeader from 'src/components/article-header/ArticleHeader';
import * as ArticleFullprops from 'src/components/article-full/ArticleFull.props';
import * as ArticleFull from 'src/components/article-full/ArticleFull';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as AlertBannerdev from 'src/components/alert-banner/AlertBanner.dev';
import * as AgentChat from 'src/components/agent-chat/AgentChat';
import * as AccordionBlockItemdev from 'src/components/accordion-block/AccordionBlockItem.dev';
import * as AccordionBlockDefaultdev from 'src/components/accordion-block/AccordionBlockDefault.dev';
import * as AccordionBlockprops from 'src/components/accordion-block/accordion-block.props';
import * as AccordionBlock from 'src/components/accordion-block/AccordionBlock';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['Widget', { ...Widgetprops, ...Widget }],
  ['Whatsit', { ...Whatsit }],
  ['VideoPlayer', { ...VideoPlayerdev }],
  ['VideoModal', { ...VideoModaldev }],
  ['Video', { ...Video, componentType: 'client' }],
  ['VideoProps', { ...VideoProps }],
  ['VerticalImageAccordion', { ...VerticalImageAccordionprops, ...VerticalImageAccordion, componentType: 'client' }],
  ['HtmlLang', { ...HtmlLang, componentType: 'client' }],
  ['ChatMarkdown', { ...ChatMarkdown, componentType: 'client' }],
  ['TopicListing', { ...TopicListingprops, ...TopicListing }],
  ['TopicItem', { ...TopicItemdev }],
  ['ThemeProvider', { ...ThemeProviderdev }],
  ['TextBannerDefault', { ...TextBannerDefaultdev }],
  ['TextBanner02', { ...TextBanner02dev }],
  ['TextBanner01', { ...TextBanner01dev }],
  ['TextBanner', { ...TextBannerprops, ...TextBanner }],
  ['TestimonialCarouselItem', { ...TestimonialCarouselItem }],
  ['TestimonialCarousel', { ...TestimonialCarouselprops, ...TestimonialCarousel, componentType: 'client' }],
  ['Title', { ...Title, componentType: 'client' }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent, componentType: 'client' }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['Image', { ...Image, componentType: 'client' }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['SubscriptionBanner', { ...SubscriptionBannerprops, ...SubscriptionBannerdictionary, ...SubscriptionBanner, componentType: 'client' }],
  ['SearchResults', { ...SearchResultsdictionary, ...SearchResults, componentType: 'client' }],
  ['SearchQuestions', { ...SearchQuestionsdictionary, ...SearchQuestions, componentType: 'client' }],
  ['SearchProvider', { ...SearchProvider, componentType: 'client' }],
  ['SearchLocale', { ...SearchLocale, componentType: 'client' }],
  ['SearchConfig', { ...SearchConfig }],
  ['PreviewSearchBox', { ...PreviewSearchBox, componentType: 'client' }],
  ['PreviewSearch', { ...PreviewSearchdictionary }],
  ['SiteMetadata', { ...SiteMetadataprops, ...SiteMetadata }],
  ['SecondaryNavigation', { ...SecondaryNavigationprops, ...SecondaryNavigation, componentType: 'client' }],
  ['RichTextBlock', { ...RichTextBlockprops, ...RichTextBlock }],
  ['RagChat', { ...RagChat, componentType: 'client' }],
  ['PromoBlock', { ...PromoBlockprops, ...PromoBlock }],
  ['PromoAnimatedImageRight', { ...PromoAnimatedImageRightdev }],
  ['PromoAnimatedDefault', { ...PromoAnimatedDefaultdev }],
  ['PromoAnimated', { ...PromoAnimatedutil, ...PromoAnimatedprops, ...PromoAnimated, componentType: 'client' }],
  ['Portal', { ...Portaldev }],
  ['PageHeader', { ...PageHeaderprops, ...PageHeader, componentType: 'client' }],
  ['MultiPromoTabs', { ...MultiPromoTabsprops, ...MultiPromoTabs, componentType: 'client' }],
  ['MultiPromoTab', { ...MultiPromoTabdev }],
  ['MultiPromoItem', { ...MultiPromoItemdev }],
  ['MultiPromo', { ...MultiPromoprops, ...MultiPromo, componentType: 'client' }],
  ['ModeToggle', { ...ModeToggledev }],
  ['MediaSection', { ...MediaSectiondev, ...MediaSectionprops }],
  ['Meteors', { ...Meteors, componentType: 'client' }],
  ['LogoTabs', { ...LogoTabsprops, ...LogoTabs, componentType: 'client' }],
  ['LogoItem', { ...LogoItem }],
  ['Logo', { ...Logoprops, ...Logodev }],
  ['NextImageSrc', { ...NextImageSrcdev }],
  ['ImageWrapper', { ...ImageWrapperdev }],
  ['ImageBlock', { ...ImageBlock }],
  ['Image', { ...Imageprops }],
  ['ImageOptimization', { ...ImageOptimizationcontext }],
  ['Icon', { ...Icon, componentType: 'client' }],
  ['YoutubeIcon', { ...YoutubeIcondev }],
  ['TwitterIcon', { ...TwitterIcondev }],
  ['Signal', { ...Signaldev }],
  ['Play', { ...Playdev }],
  ['LinkedInIcon', { ...LinkedInIcondev }],
  ['InternalIcon', { ...InternalIcondev }],
  ['InstagramIcon', { ...InstagramIcondev }],
  ['FileIcon', { ...FileIcondev }],
  ['FacebookIcon', { ...FacebookIcondev }],
  ['ExternalIcon', { ...ExternalIcondev }],
  ['EmailIcon', { ...EmailIcondev }],
  ['Diversity', { ...Diversitydev }],
  ['CrossArrows', { ...CrossArrowsdev }],
  ['Communities', { ...Communitiesdev }],
  ['ArrowUpRight', { ...ArrowUpRightdev }],
  ['ArrowRight', { ...ArrowRightdev }],
  ['ArrowLeft', { ...ArrowLeftdev }],
  ['Hero', { ...Heroprops, ...Hero, componentType: 'client' }],
  ['GlobalHeader', { ...GlobalHeaderprops, ...GlobalHeader, componentType: 'client' }],
  ['GlobalFooter', { ...GlobalFooterprops, ...GlobalFooter }],
  ['FooterNavigationColumn', { ...FooterNavigationColumn, componentType: 'client' }],
  ['FooterNavigationCallout', { ...FooterNavigationCalloutdev }],
  ['FloatingDock', { ...FloatingDockdev }],
  ['Flex', { ...Flexdev }],
  ['CtaBanner', { ...CtaBanner }],
  ['Container', { ...Containerutil }],
  ['ContainerFullWidth', { ...ContainerFullWidth }],
  ['ContainerFullBleed', { ...ContainerFullBleed }],
  ['Container7030', { ...Container7030 }],
  ['Container70', { ...Container70 }],
  ['Container6321', { ...Container6321 }],
  ['Container6040', { ...Container6040 }],
  ['Container5050', { ...Container5050 }],
  ['Container4060', { ...Container4060 }],
  ['Container3070', { ...Container3070 }],
  ['Container303030', { ...Container303030 }],
  ['Container25252525', { ...Container25252525 }],
  ['Card', { ...Carddev }],
  ['ButtonComponent', { ...ButtonComponent }],
  ['Breadcrumbs', { ...Breadcrumbs }],
  ['BackgroundThumbnail', { ...BackgroundThumbnaildev }],
  ['ArticleListing', { ...ArticleListing, componentType: 'client' }],
  ['ArticleHeader', { ...ArticleHeaderdictionary, ...ArticleHeader, componentType: 'client' }],
  ['ArticleFull', { ...ArticleFullprops, ...ArticleFull, componentType: 'client' }],
  ['AnimatedSection', { ...AnimatedSectiondev }],
  ['AlertBanner', { ...AlertBannerdev }],
  ['AgentChat', { ...AgentChat, componentType: 'client' }],
  ['AccordionBlockItem', { ...AccordionBlockItemdev }],
  ['AccordionBlockDefault', { ...AccordionBlockDefaultdev }],
  ['AccordionBlock', { ...AccordionBlockprops, ...AccordionBlock, componentType: 'client' }],
]);

export default componentMap;
