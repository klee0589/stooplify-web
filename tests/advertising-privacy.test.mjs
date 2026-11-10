import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../public/advertising-privacy.js', import.meta.url), 'utf8');
const key = 'stooplify_advertising_preference_v1';

function run(saved = null) {
  const values = new Map(saved ? [[key, saved]] : []);
  const window = {
    localStorage: {
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => values.set(k, v),
      removeItem: (k) => values.delete(k),
    },
  };
  vm.runInNewContext(code, { window, Date, Number, JSON, Object });
  return { window, values };
}

test('EEA/UK/CH default to denied before AdSense loads', () => {
  const { window } = run();
  const [cmd, type, params] = window.dataLayer[0];
  assert.equal(cmd, 'consent');
  assert.equal(type, 'default');
  for (const k of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) assert.equal(params[k], 'denied');
  assert(params.region.includes('DE') && params.region.includes('GB') && params.region.includes('CH'));
  assert.equal(window.adsbygoogle.requestNonPersonalizedAds, undefined);
});

test('a saved keep-off choice keeps ads non-personalized', () => {
  const { window } = run(JSON.stringify({ version: 1, advertising: 'denied', savedAt: Date.now() }));
  assert.equal(window.dataLayer[1][1], 'update');
  assert.equal(window.adsbygoogle.requestNonPersonalizedAds, 1);
});

test('expired choices are cleared', () => {
  const { window, values } = run(JSON.stringify({ version: 1, advertising: 'denied', savedAt: Date.now() - 181 * 864e5 }));
  assert.equal(values.has(key), false);
  assert.equal(window.adsbygoogle.requestNonPersonalizedAds, undefined);
});