# Advertising privacy

Google AdSense Auto ads re-enabled on November 10, 2026, after the European regulations message was published in AdSense > Privacy & messaging (Google's certified CMP).

- index.html loads adsbygoogle.js with ca-pub-9420381871665480; Google chooses ad placements (Auto ads).
- public/advertising-privacy.js runs first and sets Consent Mode defaults to denied for EEA, UK and Switzerland; Google's CMP updates them after the visitor chooses.
- Visitors who saved "Keep advertising off" under the old notice (180-day expiry) get non-personalized ads.
- The footer "Privacy & cookie settings" link reopens Google's consent message (googlefc.showRevocationMessage).
- public/ads.txt keeps the authorized-seller record.
- Google Ads conversion tracking remains paused.

## Checks
- node --test tests/advertising-privacy.test.mjs
- npm run build