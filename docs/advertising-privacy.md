# Advertising privacy safeguards

Google AdSense and Google Ads conversion tracking are paused globally as of November 10, 2026, pending a configured and tested consent platform.

- index.html retains the AdSense account verification meta tag but does not load adsbygoogle.js.
- public/ads.txt retains the publisher's authorized-seller record.
- public/advertising-privacy.js sets denied advertising consent, suppresses conversion events, pauses ad requests, and removes old first-party Google click identifiers.
- AdvertisingPrivacy provides a deny-only notice and browser-local preference with 180-day expiry. It is not a certified CMP and cannot enable ads.
- The three blog ad placements are removed. Previous versions remain available in the pre-change checkpoint.
- Other site analytics and essential services are unchanged. This is not a full-site privacy audit or a legal-compliance certification.

## Completing the consent setup
1. Sign into the publisher's Google AdSense account.
2. In Privacy & messaging, create and publish a European regulations message for stooplify.com with the privacy URL https://stooplify.com/legal#privacy and clear consent, refusal and withdrawal choices.
3. Follow the selected Google-certified CMP's documented integration. Google's own CMP is ID 300. Do not invent a bootstrap URL or wait on a CMP that is itself only loaded by the blocked AdSense tag.
4. Verify consent-required locations, refusal, dismissal, revocation, expired preferences, blocked storage, errors and navigation. Do not enable tags merely from a localStorage flag, timeout or Consent Mode default.
5. Respect existing advertising-off preferences when designing the final controls. Obtain valid choices before advertising is enabled where needed.
6. Re-enable the relevant tags only after the account configuration and site integration have been verified. Keep the privacy disclosure accurate.

## Checks
- node --test tests/advertising-privacy.test.mjs
- npm run build
- npm run lint
- npm run typecheck

The repository has pre-existing lint and type-check issues; compare diagnostics against the pre-change checkpoint rather than claiming a clean full check.

## Official references
- https://support.google.com/adsense/answer/13554116?hl=en
- https://support.google.com/adsense/answer/10960768?hl=en
- https://support.google.com/adsense/answer/11546682?hl=en
- https://developers.google.com/funding-choices/fc-api-docs
- https://www.google.com/about/company/user-consent-policy/
