/**
 * Consent defaults for Google AdSense (Auto ads).
 * Google's certified CMP (published in AdSense > Privacy & messaging) shows the
 * consent message to EEA/UK/Swiss visitors and updates these signals itself.
 * Must load before adsbygoogle.js.
 */
(function () {
  'use strict';
  var KEY = 'stooplify_advertising_preference_v1';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  var CONSENT_REGIONS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'];

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.adsbygoogle = window.adsbygoogle || [];

  // Denied by default where consent is legally required; Google's CMP updates it.
  window.gtag('consent', 'default', Object.assign({ region: CONSENT_REGIONS, wait_for_update: 500 }, denied));

  // Visitors who previously chose "Keep advertising off" keep non-personalized ads.
  try {
    var choice = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    var valid = !!choice && choice.advertising === 'denied' && Number.isFinite(choice.savedAt) &&
      choice.savedAt <= Date.now() && Date.now() - choice.savedAt < MAX_AGE;
    if (valid) {
      window.gtag('consent', 'update', denied);
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    } else if (choice) {
      window.localStorage.removeItem(KEY);
    }
  } catch (_) { /* Storage may be blocked. */ }
})();
