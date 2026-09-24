// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as ZipcodeModaldev from 'src/components/zipcode-modal/zipcode-modal.dev';
import * as VerticalImageAccordion from 'src/components/vertical-image-accordion/VerticalImageAccordion';
import * as VerticalImageAccordionprops from 'src/components/vertical-image-accordion/vertical-image-accordion.props';
import * as TopicListing from 'src/components/topic-listing/TopicListing';
import * as TopicItemdev from 'src/components/topic-listing/TopicItem.dev';
import * as TopicListingprops from 'src/components/topic-listing/topic-listing.props';
import * as ThemeProviderdev from 'src/components/theme-provider/theme-provider.dev';
import * as TextBannerTextTopdev from 'src/components/text-banner/TextBannerTextTop.dev';
import * as TextBannerDefaultdev from 'src/components/text-banner/TextBannerDefault.dev';
import * as TextBannerBlueTitleRightdev from 'src/components/text-banner/TextBannerBlueTitleRight.dev';
import * as TextBanner02dev from 'src/components/text-banner/TextBanner02.dev';
import * as TextBanner01dev from 'src/components/text-banner/TextBanner01.dev';
import * as TextBanner from 'src/components/text-banner/TextBanner';
import * as TextBannerprops from 'src/components/text-banner/text-banner.props';
import * as TestimonialCarouselItem from 'src/components/testimonial-carousel/TestimonialCarouselItem';
import * as TestimonialCarousel from 'src/components/testimonial-carousel/TestimonialCarousel';
import * as TestimonialCarouselprops from 'src/components/testimonial-carousel/testimonial-carousel.props';
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
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as SubscriptionBannerprops from 'src/components/subscription-banner/subscription-banner.props';
import * as SubmissionFormDefaultdev from 'src/components/submission-form/SubmissionFormDefault.dev';
import * as SubmissionFormCentereddev from 'src/components/submission-form/SubmissionFormCentered.dev';
import * as SubmissionForm from 'src/components/submission-form/SubmissionForm';
import * as SubmissionFormprops from 'src/components/submission-form/submission-form.props';
import * as SlideCarouseldev from 'src/components/slide-carousel/SlideCarousel.dev';
import * as SlideCarouselprops from 'src/components/slide-carousel/slide-carousel.props';
import * as Video from 'src/components/site-three/Video';
import * as TextSlider from 'src/components/site-three/TextSlider';
import * as SignupBanner from 'src/components/site-three/SignupBanner';
import * as ProductPageHeader from 'src/components/site-three/ProductPageHeader';
import * as ProductComparison from 'src/components/site-three/ProductComparison';
import * as PageHeaderST from 'src/components/site-three/PageHeaderST';
import * as MultiPromo from 'src/components/site-three/MultiPromo';
import * as MobileMenuWrapper from 'src/components/site-three/MobileMenuWrapper';
import * as MegaMenuItemWrapper from 'src/components/site-three/MegaMenuItemWrapper';
import * as MegaMenuItem from 'src/components/site-three/MegaMenuItem';
import * as ImageCarousel from 'src/components/site-three/ImageCarousel';
import * as ImageBanner from 'src/components/site-three/ImageBanner';
import * as HeroST from 'src/components/site-three/HeroST';
import * as HeaderST from 'src/components/site-three/HeaderST';
import * as FooterST from 'src/components/site-three/FooterST';
import * as FeatureBanner from 'src/components/site-three/FeatureBanner';
import * as AccordionBlock from 'src/components/site-three/AccordionBlock';
import * as SearchBox from 'src/components/site-three/non-sitecore/SearchBox';
import * as MiniCart from 'src/components/site-three/non-sitecore/MiniCart';
import * as SiteMetadata from 'src/components/site-metadata/SiteMetadata';
import * as SiteMetadataprops from 'src/components/site-metadata/site-metadata.props';
import * as SecondaryNavigation from 'src/components/secondary-navigation/SecondaryNavigation';
import * as SecondaryNavigationprops from 'src/components/secondary-navigation/secondary-navigation.props';
import * as RichTextBlock from 'src/components/rich-text-block/RichTextBlock';
import * as RichTextBlockprops from 'src/components/rich-text-block/rich-text-block.props';
import * as PromoImageTitlePartialOverlaydev from 'src/components/promo-image/PromoImageTitlePartialOverlay.dev';
import * as PromoImageRightdev from 'src/components/promo-image/PromoImageRight.dev';
import * as PromoImageMiddledev from 'src/components/promo-image/PromoImageMiddle.dev';
import * as PromoImageLeftdev from 'src/components/promo-image/PromoImageLeft.dev';
import * as PromoImageDefaultdev from 'src/components/promo-image/PromoImageDefault.dev';
import * as PromoImage from 'src/components/promo-image/PromoImage';
import * as PromoImageprops from 'src/components/promo-image/promo-image.props';
import * as PromoBlock from 'src/components/promo-block/PromoBlock';
import * as PromoBlockprops from 'src/components/promo-block/promo-block.props';
import * as PromoAnimatedImageRightdev from 'src/components/promo-animated/PromoAnimatedImageRight.dev';
import * as PromoAnimatedDefaultdev from 'src/components/promo-animated/PromoAnimatedDefault.dev';
import * as PromoAnimated from 'src/components/promo-animated/PromoAnimated';
import * as PromoAnimatedutil from 'src/components/promo-animated/promo-animated.util';
import * as PromoAnimatedprops from 'src/components/promo-animated/promo-animated.props';
import * as ProductListingThreeUpdev from 'src/components/product-listing/ProductListingThreeUp.dev';
import * as ProductListingSliderdev from 'src/components/product-listing/ProductListingSlider.dev';
import * as ProductListingDefaultdev from 'src/components/product-listing/ProductListingDefault.dev';
import * as ProductListingCarddev from 'src/components/product-listing/ProductListingCard.dev';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as ProductListingprops from 'src/components/product-listing/product-listing.props';
import * as ProductListingdictionary from 'src/components/product-listing/product-listing.dictionary';
import * as Portaldev from 'src/components/portal/portal.dev';
import * as PageHeaderFiftyFiftydev from 'src/components/page-header/PageHeaderFiftyFifty.dev';
import * as PageHeaderDefaultdev from 'src/components/page-header/PageHeaderDefault.dev';
import * as PageHeaderCentereddev from 'src/components/page-header/PageHeaderCentered.dev';
import * as PageHeaderBlueTextdev from 'src/components/page-header/PageHeaderBlueText.dev';
import * as PageHeaderBlueBackgrounddev from 'src/components/page-header/PageHeaderBlueBackground.dev';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as PageHeaderprops from 'src/components/page-header/page-header.props';
import * as MultiPromoTabs from 'src/components/multi-promo-tabs/MultiPromoTabs';
import * as MultiPromoTabdev from 'src/components/multi-promo-tabs/MultiPromoTab.dev';
import * as MultiPromoTabsprops from 'src/components/multi-promo-tabs/multi-promo-tabs.props';
import * as ModeToggledev from 'src/components/mode-toggle/mode-toggle.dev';
import * as MediaSectiondev from 'src/components/media-section/MediaSection.dev';
import * as MediaSectionprops from 'src/components/media-section/media-section.props';
import * as Meteors from 'src/components/magicui/meteors';
import * as LogoTabs from 'src/components/logo-tabs/LogoTabs';
import * as LogoItem from 'src/components/logo-tabs/LogoItem';
import * as LogoTabsprops from 'src/components/logo-tabs/logo-tabs.props';
import * as Logoprops from 'src/components/logo/logo.props';
import * as Logodev from 'src/components/logo/Logo.dev';
import * as Utils from 'src/components/location-search/utils';
import * as LocationSearchTitleZipCentereddev from 'src/components/location-search/LocationSearchTitleZipCentered.dev';
import * as LocationSearchMapTopAllCentereddev from 'src/components/location-search/LocationSearchMapTopAllCentered.dev';
import * as LocationSearchMapRightTitleZipCentereddev from 'src/components/location-search/LocationSearchMapRightTitleZipCentered.dev';
import * as LocationSearchMapRightdev from 'src/components/location-search/LocationSearchMapRight.dev';
import * as LocationSearchItemdev from 'src/components/location-search/LocationSearchItem.dev';
import * as LocationSearchDefaultdev from 'src/components/location-search/LocationSearchDefault.dev';
import * as LocationSearch from 'src/components/location-search/LocationSearch';
import * as LocationSearchprops from 'src/components/location-search/location-search.props';
import * as LocationSearchItemprops from 'src/components/location-search/location-search-item.props';
import * as GoogleMapdev from 'src/components/location-search/GoogleMap.dev';
import * as GoogleMapsprops from 'src/components/location-search/google-maps.props';
import * as ImageGalleryNoSpacingdev from 'src/components/image-gallery/ImageGalleryNoSpacing.dev';
import * as ImageGalleryGriddev from 'src/components/image-gallery/ImageGalleryGrid.dev';
import * as ImageGalleryFiftyFiftydev from 'src/components/image-gallery/ImageGalleryFiftyFifty.dev';
import * as ImageGalleryFeaturedImagedev from 'src/components/image-gallery/ImageGalleryFeaturedImage.dev';
import * as ImageGallerydev from 'src/components/image-gallery/ImageGallery.dev';
import * as ImageGallery from 'src/components/image-gallery/ImageGallery';
import * as ImageGalleryprops from 'src/components/image-gallery/image-gallery.props';
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
import * as LinePlaydev from 'src/components/icon/svg/line-play.dev';
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
import * as HeroImageRightdev from 'src/components/hero/HeroImageRight.dev';
import * as HeroImageBottomInsetdev from 'src/components/hero/HeroImageBottomInset.dev';
import * as HeroImageBottomdev from 'src/components/hero/HeroImageBottom.dev';
import * as HeroImageBackgrounddev from 'src/components/hero/HeroImageBackground.dev';
import * as HeroDefaultdev from 'src/components/hero/HeroDefault.dev';
import * as Hero from 'src/components/hero/Hero';
import * as Heroprops from 'src/components/hero/hero.props';
import * as Herodictionary from 'src/components/hero/hero.dictionary';
import * as GlobalHeaderDefaultdev from 'src/components/global-header/GlobalHeaderDefault.dev';
import * as GlobalHeaderCentereddev from 'src/components/global-header/GlobalHeaderCentered.dev';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as GlobalHeaderprops from 'src/components/global-header/global-header.props';
import * as GlobalFooterDefaultdev from 'src/components/global-footer/GlobalFooterDefault.dev';
import * as GlobalFooterBlueCompactdev from 'src/components/global-footer/GlobalFooterBlueCompact.dev';
import * as GlobalFooterBlueCentereddev from 'src/components/global-footer/GlobalFooterBlueCentered.dev';
import * as GlobalFooterBlackLargedev from 'src/components/global-footer/GlobalFooterBlackLarge.dev';
import * as GlobalFooterBlackCompactdev from 'src/components/global-footer/GlobalFooterBlackCompact.dev';
import * as GlobalFooter from 'src/components/global-footer/GlobalFooter';
import * as GlobalFooterprops from 'src/components/global-footer/global-footer.props';
import * as GlobalFooterdictionary from 'src/components/global-footer/global-footer.dictionary';
import * as FooterNavigationColumndev from 'src/components/global-footer/FooterNavigationColumn.dev';
import * as FooterNavigationColumn from 'src/components/global-footer/FooterNavigationColumn';
import * as ZipcodeSearchFormdev from 'src/components/forms/zipcode/ZipcodeSearchForm.dev';
import * as ZipcodeSearchFormprops from 'src/components/forms/zipcode/zipcode-search-form.props';
import * as SuccessCompactdev from 'src/components/forms/success/success-compact.dev';
import * as SubmitInfoFormdev from 'src/components/forms/submitinfo/SubmitInfoForm.dev';
import * as SubmitInfoFormprops from 'src/components/forms/submitinfo/submit-info-form.props';
import * as SubmitInfoFormdictionary from 'src/components/forms/submitinfo/submit-info-form.dictionary';
import * as EmailSignupFormdev from 'src/components/forms/email/EmailSignupForm.dev';
import * as EmailSignupFormprops from 'src/components/forms/email/email-signup-form.props';
import * as FooterNavigationCalloutdev from 'src/components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as FooterNavigationCalloutprops from 'src/components/footer-navigation-callout/footer-navigation-callout.props';
import * as FloatingDockdev from 'src/components/floating-dock/floating-dock.dev';
import * as Flexdev from 'src/components/flex/Flex.dev';
import * as CtaBanner from 'src/components/cta-banner/CtaBanner';
import * as CtaBannerprops from 'src/components/cta-banner/cta-banner.props';
import * as ContentSdkRichText from 'src/components/content-sdk-rich-text/ContentSdkRichText';
import * as Containerutil from 'src/components/container/container.util';
import * as Containerprops from 'src/components/container/container.props';
import * as ContainerFullWidth from 'src/components/container/container-full-width/ContainerFullWidth';
import * as ContainerFullWidthprops from 'src/components/container/container-full-width/container-full-width.props';
import * as ContainerFullBleed from 'src/components/container/container-full-bleed/ContainerFullBleed';
import * as ContainerFullBleedprops from 'src/components/container/container-full-bleed/container-full-bleed.props';
import * as Container7030 from 'src/components/container/container-7030/Container7030';
import * as Container7030props from 'src/components/container/container-7030/container-7030.props';
import * as Container70 from 'src/components/container/container-70/Container70';
import * as Container70props from 'src/components/container/container-70/container-70.props';
import * as Container6321 from 'src/components/container/container-6321/Container6321';
import * as Container6040 from 'src/components/container/container-6040/Container6040';
import * as Container6040props from 'src/components/container/container-6040/container-6040.props';
import * as Container5050 from 'src/components/container/container-5050/Container5050';
import * as Container5050props from 'src/components/container/container-5050/container-5050.props';
import * as Container4060 from 'src/components/container/container-4060/Container4060';
import * as Container4060props from 'src/components/container/container-4060/container-4060.props';
import * as Container3070 from 'src/components/container/container-3070/Container3070';
import * as Container3070props from 'src/components/container/container-3070/container-3070.props';
import * as Container303030 from 'src/components/container/container-303030/Container303030';
import * as Container303030props from 'src/components/container/container-303030/container-303030.props';
import * as Container25252525 from 'src/components/container/container-25252525/Container25252525';
import * as Testimonials from 'src/components/component-library/Testimonials';
import * as TeamSection from 'src/components/component-library/TeamSection';
import * as StatsSection from 'src/components/component-library/StatsSection';
import * as ProductsSection from 'src/components/component-library/ProductsSection';
import * as PlaceholderTabs from 'src/components/component-library/PlaceholderTabs';
import * as NewsletterSection from 'src/components/component-library/NewsletterSection';
import * as LogoCloud from 'src/components/component-library/logo-cloud';
import * as Header from 'src/components/component-library/Header';
import * as FeaturesSection from 'src/components/component-library/FeaturesSection';
import * as FAQ from 'src/components/component-library/FAQ';
import * as ContactSection from 'src/components/component-library/ContactSection';
import * as CLHero from 'src/components/component-library/CLHero';
import * as CallToAction from 'src/components/component-library/CallToAction';
import * as Carousel from 'src/components/carousel/Carousel';
import * as CardSpotlightdev from 'src/components/card-spotlight/card-spotlight.dev';
import * as Cardprops from 'src/components/card/card.props';
import * as Carddev from 'src/components/card/Card.dev';
import * as ButtonComponent from 'src/components/button-component/ButtonComponent';
import * as Breadcrumbs from 'src/components/breadcrumbs/Breadcrumbs';
import * as Breadcrumbsprops from 'src/components/breadcrumbs/breadcrumbs.props';
import * as BackgroundThumbnaildev from 'src/components/background-thumbnail/BackgroundThumbnail.dev';
import * as ArticleHeader from 'src/components/article-header/ArticleHeader';
import * as ArticleHeaderprops from 'src/components/article-header/article-header.props';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as AnimatedSectionprops from 'src/components/animated-section/animated-section.props';
import * as AlertBannerdev from 'src/components/alert-banner/AlertBanner.dev';
import * as AlertBannerprops from 'src/components/alert-banner/alert-banner.props';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['zipcode-modal', { ...ZipcodeModaldev }],
  ['VerticalImageAccordion', { ...VerticalImageAccordion, componentType: 'client' }],
  ['vertical-image-accordion', { ...VerticalImageAccordionprops }],
  ['TopicListing', { ...TopicListing }],
  ['TopicItem', { ...TopicItemdev }],
  ['topic-listing', { ...TopicListingprops }],
  ['theme-provider', { ...ThemeProviderdev }],
  ['TextBannerTextTop', { ...TextBannerTextTopdev }],
  ['TextBannerDefault', { ...TextBannerDefaultdev }],
  ['TextBannerBlueTitleRight', { ...TextBannerBlueTitleRightdev }],
  ['TextBanner02', { ...TextBanner02dev }],
  ['TextBanner01', { ...TextBanner01dev }],
  ['TextBanner', { ...TextBanner, componentType: 'client' }],
  ['text-banner', { ...TextBannerprops }],
  ['TestimonialCarouselItem', { ...TestimonialCarouselItem }],
  ['TestimonialCarousel', { ...TestimonialCarousel, componentType: 'client' }],
  ['testimonial-carousel', { ...TestimonialCarouselprops }],
  ['Title', { ...Title }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList, componentType: 'client' }],
  ['Image', { ...Image }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['SubscriptionBanner', { ...SubscriptionBanner, componentType: 'client' }],
  ['subscription-banner', { ...SubscriptionBannerprops }],
  ['SubmissionFormDefault', { ...SubmissionFormDefaultdev }],
  ['SubmissionFormCentered', { ...SubmissionFormCentereddev }],
  ['SubmissionForm', { ...SubmissionForm }],
  ['submission-form', { ...SubmissionFormprops }],
  ['SlideCarousel', { ...SlideCarouseldev }],
  ['slide-carousel', { ...SlideCarouselprops }],
  ['Video', { ...Video }],
  ['TextSlider', { ...TextSlider, componentType: 'client' }],
  ['SignupBanner', { ...SignupBanner }],
  ['ProductPageHeader', { ...ProductPageHeader, componentType: 'client' }],
  ['ProductComparison', { ...ProductComparison, componentType: 'client' }],
  ['PageHeaderST', { ...PageHeaderST }],
  ['MultiPromo', { ...MultiPromo, componentType: 'client' }],
  ['MobileMenuWrapper', { ...MobileMenuWrapper, componentType: 'client' }],
  ['MegaMenuItemWrapper', { ...MegaMenuItemWrapper, componentType: 'client' }],
  ['MegaMenuItem', { ...MegaMenuItem }],
  ['ImageCarousel', { ...ImageCarousel, componentType: 'client' }],
  ['ImageBanner', { ...ImageBanner }],
  ['HeroST', { ...HeroST, componentType: 'client' }],
  ['HeaderST', { ...HeaderST }],
  ['FooterST', { ...FooterST }],
  ['FeatureBanner', { ...FeatureBanner, componentType: 'client' }],
  ['AccordionBlock', { ...AccordionBlock, componentType: 'client' }],
  ['SearchBox', { ...SearchBox, componentType: 'client' }],
  ['MiniCart', { ...MiniCart, componentType: 'client' }],
  ['SiteMetadata', { ...SiteMetadata }],
  ['site-metadata', { ...SiteMetadataprops }],
  ['SecondaryNavigation', { ...SecondaryNavigation, componentType: 'client' }],
  ['secondary-navigation', { ...SecondaryNavigationprops }],
  ['RichTextBlock', { ...RichTextBlock }],
  ['rich-text-block', { ...RichTextBlockprops }],
  ['PromoImageTitlePartialOverlay', { ...PromoImageTitlePartialOverlaydev }],
  ['PromoImageRight', { ...PromoImageRightdev }],
  ['PromoImageMiddle', { ...PromoImageMiddledev }],
  ['PromoImageLeft', { ...PromoImageLeftdev }],
  ['PromoImageDefault', { ...PromoImageDefaultdev }],
  ['PromoImage', { ...PromoImage }],
  ['promo-image', { ...PromoImageprops }],
  ['PromoBlock', { ...PromoBlock }],
  ['promo-block', { ...PromoBlockprops }],
  ['PromoAnimatedImageRight', { ...PromoAnimatedImageRightdev }],
  ['PromoAnimatedDefault', { ...PromoAnimatedDefaultdev }],
  ['PromoAnimated', { ...PromoAnimated, componentType: 'client' }],
  ['promo-animated', { ...PromoAnimatedutil, ...PromoAnimatedprops }],
  ['ProductListingThreeUp', { ...ProductListingThreeUpdev }],
  ['ProductListingSlider', { ...ProductListingSliderdev }],
  ['ProductListingDefault', { ...ProductListingDefaultdev }],
  ['ProductListingCard', { ...ProductListingCarddev }],
  ['ProductListing', { ...ProductListing, componentType: 'client' }],
  ['product-listing', { ...ProductListingprops, ...ProductListingdictionary }],
  ['portal', { ...Portaldev }],
  ['PageHeaderFiftyFifty', { ...PageHeaderFiftyFiftydev }],
  ['PageHeaderDefault', { ...PageHeaderDefaultdev }],
  ['PageHeaderCentered', { ...PageHeaderCentereddev }],
  ['PageHeaderBlueText', { ...PageHeaderBlueTextdev }],
  ['PageHeaderBlueBackground', { ...PageHeaderBlueBackgrounddev }],
  ['PageHeader', { ...PageHeader, componentType: 'client' }],
  ['page-header', { ...PageHeaderprops }],
  ['MultiPromoTabs', { ...MultiPromoTabs, componentType: 'client' }],
  ['MultiPromoTab', { ...MultiPromoTabdev }],
  ['multi-promo-tabs', { ...MultiPromoTabsprops }],
  ['mode-toggle', { ...ModeToggledev }],
  ['MediaSection', { ...MediaSectiondev }],
  ['media-section', { ...MediaSectionprops }],
  ['meteors', { ...Meteors, componentType: 'client' }],
  ['LogoTabs', { ...LogoTabs, componentType: 'client' }],
  ['LogoItem', { ...LogoItem }],
  ['logo-tabs', { ...LogoTabsprops }],
  ['logo', { ...Logoprops }],
  ['Logo', { ...Logodev }],
  ['utils', { ...Utils }],
  ['LocationSearchTitleZipCentered', { ...LocationSearchTitleZipCentereddev }],
  ['LocationSearchMapTopAllCentered', { ...LocationSearchMapTopAllCentereddev }],
  ['LocationSearchMapRightTitleZipCentered', { ...LocationSearchMapRightTitleZipCentereddev }],
  ['LocationSearchMapRight', { ...LocationSearchMapRightdev }],
  ['LocationSearchItem', { ...LocationSearchItemdev }],
  ['LocationSearchDefault', { ...LocationSearchDefaultdev }],
  ['LocationSearch', { ...LocationSearch, componentType: 'client' }],
  ['location-search', { ...LocationSearchprops }],
  ['location-search-item', { ...LocationSearchItemprops }],
  ['GoogleMap', { ...GoogleMapdev }],
  ['google-maps', { ...GoogleMapsprops }],
  ['ImageGalleryNoSpacing', { ...ImageGalleryNoSpacingdev }],
  ['ImageGalleryGrid', { ...ImageGalleryGriddev }],
  ['ImageGalleryFiftyFifty', { ...ImageGalleryFiftyFiftydev }],
  ['ImageGalleryFeaturedImage', { ...ImageGalleryFeaturedImagedev }],
  ['ImageGallery', { ...ImageGallerydev, ...ImageGallery, componentType: 'client' }],
  ['image-gallery', { ...ImageGalleryprops }],
  ['nextImageSrc', { ...NextImageSrcdev }],
  ['ImageWrapper', { ...ImageWrapperdev }],
  ['ImageBlock', { ...ImageBlock }],
  ['image', { ...Imageprops }],
  ['image-optimization', { ...ImageOptimizationcontext }],
  ['Icon', { ...Icon, componentType: 'client' }],
  ['YoutubeIcon', { ...YoutubeIcondev }],
  ['TwitterIcon', { ...TwitterIcondev }],
  ['signal', { ...Signaldev }],
  ['play', { ...Playdev }],
  ['LinkedInIcon', { ...LinkedInIcondev }],
  ['line-play', { ...LinePlaydev }],
  ['InternalIcon', { ...InternalIcondev }],
  ['InstagramIcon', { ...InstagramIcondev }],
  ['FileIcon', { ...FileIcondev }],
  ['FacebookIcon', { ...FacebookIcondev }],
  ['ExternalIcon', { ...ExternalIcondev }],
  ['EmailIcon', { ...EmailIcondev }],
  ['diversity', { ...Diversitydev }],
  ['cross-arrows', { ...CrossArrowsdev }],
  ['communities', { ...Communitiesdev }],
  ['arrow-up-right', { ...ArrowUpRightdev }],
  ['arrow-right', { ...ArrowRightdev }],
  ['arrow-left', { ...ArrowLeftdev }],
  ['HeroImageRight', { ...HeroImageRightdev }],
  ['HeroImageBottomInset', { ...HeroImageBottomInsetdev }],
  ['HeroImageBottom', { ...HeroImageBottomdev }],
  ['HeroImageBackground', { ...HeroImageBackgrounddev }],
  ['HeroDefault', { ...HeroDefaultdev }],
  ['Hero', { ...Hero, componentType: 'client' }],
  ['hero', { ...Heroprops, ...Herodictionary }],
  ['GlobalHeaderDefault', { ...GlobalHeaderDefaultdev }],
  ['GlobalHeaderCentered', { ...GlobalHeaderCentereddev }],
  ['GlobalHeader', { ...GlobalHeader, componentType: 'client' }],
  ['global-header', { ...GlobalHeaderprops }],
  ['GlobalFooterDefault', { ...GlobalFooterDefaultdev }],
  ['GlobalFooterBlueCompact', { ...GlobalFooterBlueCompactdev }],
  ['GlobalFooterBlueCentered', { ...GlobalFooterBlueCentereddev }],
  ['GlobalFooterBlackLarge', { ...GlobalFooterBlackLargedev }],
  ['GlobalFooterBlackCompact', { ...GlobalFooterBlackCompactdev }],
  ['GlobalFooter', { ...GlobalFooter, componentType: 'client' }],
  ['global-footer', { ...GlobalFooterprops, ...GlobalFooterdictionary }],
  ['FooterNavigationColumn', { ...FooterNavigationColumndev, ...FooterNavigationColumn, componentType: 'client' }],
  ['ZipcodeSearchForm', { ...ZipcodeSearchFormdev }],
  ['zipcode-search-form', { ...ZipcodeSearchFormprops }],
  ['success-compact', { ...SuccessCompactdev }],
  ['SubmitInfoForm', { ...SubmitInfoFormdev }],
  ['submit-info-form', { ...SubmitInfoFormprops, ...SubmitInfoFormdictionary }],
  ['EmailSignupForm', { ...EmailSignupFormdev }],
  ['email-signup-form', { ...EmailSignupFormprops }],
  ['FooterNavigationCallout', { ...FooterNavigationCalloutdev }],
  ['footer-navigation-callout', { ...FooterNavigationCalloutprops }],
  ['floating-dock', { ...FloatingDockdev }],
  ['Flex', { ...Flexdev }],
  ['CtaBanner', { ...CtaBanner }],
  ['cta-banner', { ...CtaBannerprops }],
  ['ContentSdkRichText', { ...ContentSdkRichText }],
  ['container', { ...Containerutil, ...Containerprops }],
  ['ContainerFullWidth', { ...ContainerFullWidth }],
  ['container-full-width', { ...ContainerFullWidthprops }],
  ['ContainerFullBleed', { ...ContainerFullBleed }],
  ['container-full-bleed', { ...ContainerFullBleedprops }],
  ['Container7030', { ...Container7030 }],
  ['container-7030', { ...Container7030props }],
  ['Container70', { ...Container70 }],
  ['container-70', { ...Container70props }],
  ['Container6321', { ...Container6321 }],
  ['Container6040', { ...Container6040 }],
  ['container-6040', { ...Container6040props }],
  ['Container5050', { ...Container5050 }],
  ['container-5050', { ...Container5050props }],
  ['Container4060', { ...Container4060 }],
  ['container-4060', { ...Container4060props }],
  ['Container3070', { ...Container3070 }],
  ['container-3070', { ...Container3070props }],
  ['Container303030', { ...Container303030 }],
  ['container-303030', { ...Container303030props }],
  ['Container25252525', { ...Container25252525 }],
  ['Testimonials', { ...Testimonials }],
  ['TeamSection', { ...TeamSection }],
  ['StatsSection', { ...StatsSection }],
  ['ProductsSection', { ...ProductsSection, componentType: 'client' }],
  ['PlaceholderTabs', { ...PlaceholderTabs }],
  ['NewsletterSection', { ...NewsletterSection }],
  ['logo-cloud', { ...LogoCloud }],
  ['Header', { ...Header, componentType: 'client' }],
  ['FeaturesSection', { ...FeaturesSection, componentType: 'client' }],
  ['FAQ', { ...FAQ, componentType: 'client' }],
  ['ContactSection', { ...ContactSection, componentType: 'client' }],
  ['CLHero', { ...CLHero }],
  ['CallToAction', { ...CallToAction }],
  ['Carousel', { ...Carousel, componentType: 'client' }],
  ['card-spotlight', { ...CardSpotlightdev }],
  ['card', { ...Cardprops }],
  ['Card', { ...Carddev }],
  ['ButtonComponent', { ...ButtonComponent }],
  ['Breadcrumbs', { ...Breadcrumbs }],
  ['breadcrumbs', { ...Breadcrumbsprops }],
  ['BackgroundThumbnail', { ...BackgroundThumbnaildev }],
  ['ArticleHeader', { ...ArticleHeader, componentType: 'client' }],
  ['article-header', { ...ArticleHeaderprops }],
  ['AnimatedSection', { ...AnimatedSectiondev }],
  ['animated-section', { ...AnimatedSectionprops }],
  ['AlertBanner', { ...AlertBannerdev }],
  ['alert-banner', { ...AlertBannerprops }],
]);

export default componentMap;
