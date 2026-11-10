import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../public/advertising-privacy.js', import.meta.url), 'utf8');
const key = 'stooplify_advertising_preference_v1';
function run(saved = null, blocked = false) {
  const values = new Map(saved ? [[key, saved]] : []);
  values.set('_b44_gads_click', 'old-click');
  const events = [];
  const cookies = [];
  const document = {};
  Object.defineProperty(document, 'cookie', { get: () => '_gcl_aw=old; essential=yes', set: value => cookies.push(value) });
  const window = {
    location: { hostname: 'stooplify.com' },
    localStorage: {
      getItem(k) { if (blocked) throw new Error('blocked'); return values.get(k) ?? null; },
      setItem(k, v) { if (blocked) throw new Error('blocked'); values.set(k, v); },
      removeItem(k) { if (blocked) throw new Error('blocked'); values.delete(k); },
    },
    dispatchEvent(event) { events.push(event); },
  };
  vm.runInNewContext(code, { window, document, Date, Number, JSON, Object, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } } });
  return { window, values, cookies, events };
}
test('first visit defaults to advertising off without network APIs', () => {
  const { window, values, cookies } = run();
  assert.equal(window.stooplifyAdvertising.isEnabled(), false);
  assert.equal(window.stooplifyAdvertising.hasSavedChoice(), false);
  assert.equal(window.adsbygoogle.pauseAdRequests, 1);
  assert.equal(values.has('_b44_gads_click'), false);
  assert(cookies.every(c => c.startsWith('_gcl_aw=')));
  assert.equal(window.dataLayer.length, 2);
  for (const entry of window.dataLayer) assert.equal(entry[2].ad_user_data, 'denied');
});
test('conversion calls do not get queued while paused', () => {
  const { window } = run();
  window.gtag('event', 'conversion', { send_to: 'test' });
  window.gtag('config', 'test');
  assert.equal(window.dataLayer.length, 2);
});
test('keep-off works repeatedly and persists only minimal deny record', () => {
  const { window, values, events } = run();
  assert.equal(window.stooplifyAdvertising.keepOff(), true);
  assert.equal(window.stooplifyAdvertising.keepOff(), true);
  assert.equal(window.stooplifyAdvertising.hasSavedChoice(), true);
  assert.equal(window.stooplifyAdvertising.isEnabled(), false);
  const saved = JSON.parse(values.get(key));
  assert.deepEqual(Object.keys(saved).sort(), ['advertising', 'savedAt', 'version']);
  assert.equal(saved.advertising, 'denied');
  assert.equal(events.length, 2);
});
test('expired, corrupt, future or granted preferences never enable ads', () => {
  const variants = ['invalid', JSON.stringify({version:1,advertising:'granted',savedAt:Date.now()}),
    JSON.stringify({version:1,advertising:'denied',savedAt:Date.now()-181*864e5}),
    JSON.stringify({version:1,advertising:'denied',savedAt:Date.now()+864e5})];
  for (const saved of variants) {
    const { window } = run(saved);
    assert.equal(window.stooplifyAdvertising.hasSavedChoice(), false);
    assert.equal(window.stooplifyAdvertising.isEnabled(), false);
  }
});
test('blocked storage fails closed and does not claim a saved preference', () => {
  const { window, events } = run(null, true);
  assert.equal(window.stooplifyAdvertising.hasSavedChoice(), false);
  assert.equal(window.stooplifyAdvertising.keepOff(), false);
  assert.equal(window.stooplifyAdvertising.isEnabled(), false);
  assert.equal(events[0].detail.saved, false);
});
test('AdSense verification survives without a loader or ad placements', () => {
  const root = new URL('../', import.meta.url);
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.match(html, /google-adsense-account.*ca-pub-9420381871665480/);
  assert.doesNotMatch(html, /<script[^>]*adsbygoogle\.js/);
  assert.match(html, /src="\/advertising-privacy\.js"/);
  assert.equal(fs.readFileSync(new URL('public/ads.txt', root), 'utf8').trim(), 'google.com, pub-9420381871665480, DIRECT, f08c47fec0942fa0');
  for (const file of ['src/Layout.jsx', 'src/pages/Blog.jsx', 'src/pages/BlogPost.jsx', 'src/pages/BlogSlug.jsx']) {
    const source = fs.readFileSync(new URL(file, root), 'utf8');
    assert.doesNotMatch(source, /googletagmanager\.com|className="adsbygoogle"|adsbygoogle = window/);
  }
});
