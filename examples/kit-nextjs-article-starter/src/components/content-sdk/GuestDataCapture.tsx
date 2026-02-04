'use client';

import { useEffect, useRef, JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import { identity } from '@sitecore-cloudsdk/events/browser';

/**
 * GuestDataCapture Component
 *
 * Captures query string parameters and sends them as guest extension data
 * to Sitecore CDP for personalization.
 *
 * Supported query parameters:
 * - zipcode: Location context for geo-based personalization
 * - webid: Shop context for cart abandonment / order completion teasers
 * - utm_source: Customer entry context for marketing attribution
 *
 * Extension Data Keys (camelCase, alphanumeric only per CDP API spec):
 * - locationZipCode
 * - shopWebId
 * - utmSource
 *
 * Example URLs:
 * - /?zipcode=58102 - Shows location-specific hero banners
 * - /?webid=12345 - Shows "complete your order" teasers
 * - /?utm_source=google - Can hide/show specific teasers based on traffic source
 *
 * @see https://doc.sitecore.com/sdk/en/developers/006/cloud-sdk/identity-events.html
 * @see https://api-docs.sitecore.com/cdp/guest-rest-api/guest-data-extension
 */

const GuestDataCapture = (): JSX.Element => {
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls on re-renders
    if (hasRun.current) {
      return;
    }

    // Skip in development mode (Events SDK not initialized)
    if (process.env.NODE_ENV === 'development') {
      console.debug('[GuestDataCapture] Skipped in development mode');
      return;
    }

    // Extract query parameters for personalization
    const zipcode = searchParams.get('zipcode');
    const webid = searchParams.get('webid');
    const utmSource = searchParams.get('utm_source');

    // Only send if we have at least one personalization parameter
    if (!zipcode && !webid && !utmSource) {
      return;
    }

    // Build extension data object with the custom attributes
    // Keys must be alphanumeric and camelCase per CDP API spec
    const extensionData: Record<string, string> = {};

    if (zipcode) {
      extensionData['locationZipCode'] = zipcode;
    }

    if (webid) {
      extensionData['shopWebId'] = webid;
    }

    if (utmSource) {
      extensionData['utmSource'] = utmSource;
    }

    hasRun.current = true;

    // Send IDENTITY event with extension data (similar pattern to pageView in CdpPageView)
    identity({
      channel: 'WEB',
      currency: 'USD',
      identifiers: [
        {
          id: 'anonymous_visitor',
          provider: 'WEBSITE',
        },
      ],
      extensionData,
    })
      .then(() => {
        console.log('[GuestDataCapture] Sent guest extension data:', extensionData);
      })
      .catch((error) => {
        console.debug('[GuestDataCapture] Failed to send guest data:', error);
      });
  }, [searchParams]);

  return <></>;
};

export default GuestDataCapture;
