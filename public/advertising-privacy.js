/**
 * Advertising is deliberately paused until a certified CMP is configured,
 * published and verified. This is a deny-only safety switch, not a CMP.
 * Do not re-enable Google tags using a localStorage flag or a timeout.
 */
(function () {
  'use strict';
  var KEY = 'stooplify_advertising_preference_v1';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.dataLayer = window.dataLayer || [];
  // No ad conversion or configuration events are queued while paused.
  window.gtag = function () {
    if (arguments[0] === 'consent') window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', denied);
  window.gtag('consent', 'update', denied);
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.pauseAdRequests = 1;

  function clearAdvertisingStorage() {
    try { window.localStorage.removeItem('_b44_gads_click'); } catch (_) { /* Storage may be blocked. */ }
    try {
      document.cookie.split(';').forEach(function (cookie) {
        var name = cookie.split('=')[0].trim();
        if (!/^_gcl_/.test(name)) return;
        var domains = ['', '; Domain=' + window.location.hostname, '; Domain=.stooplify.com'];
        domains.forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; Path=/; Secure; SameSite=Lax' + domain;
        });
      });
    } catch (_) { /* Advertising stays disabled even if cookies cannot be cleared. */ }
  }
  function hasSavedChoice() {
    try {
      var choice = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      return !!choice && choice.version === 1 && choice.advertising === 'denied' &&
        Number.isFinite(choice.savedAt) && choice.savedAt <= Date.now() &&
        Date.now() - choice.savedAt < MAX_AGE;
    } catch (_) { return false; }
  }
  function keepOff() {
    var saved = false;
    clearAdvertisingStorage();
    window.gtag('consent', 'update', denied);
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ version: 1, advertising: 'denied', savedAt: Date.now() }));
      saved = true;
    } catch (_) { /* Do not imply that a blocked preference was saved. */ }
    window.dispatchEvent(new CustomEvent('stooplify-advertising-choice', { detail: { saved: saved } }));
    return saved;
  }
  clearAdvertisingStorage();
  window.stooplifyAdvertising = Object.freeze({
    status: 'paused_pending_certified_cmp',
    isEnabled: function () { return false; },
    hasSavedChoice: hasSavedChoice,
    keepOff: keepOff
  });
})();
