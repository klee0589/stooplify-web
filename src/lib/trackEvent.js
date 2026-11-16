import { base44 } from '@/api/base44Client';

// Named product events go to Base44 Analytics and to PostHog, so behaviour
// shows up in the PostHog dashboard (and heatmaps) where we actually read it.
const pending = [];

export function trackEvent(eventName, properties = {}) {
  base44.analytics.track({ eventName, properties });
  if (typeof window !== 'undefined' && window.posthog && window.posthog.capture) {
    window.posthog.capture(eventName, properties);
  } else {
    pending.push([eventName, properties]);
  }
}

// Called once PostHog has loaded, so events fired during page load aren't lost.
export function flushTrackedEvents() {
  if (typeof window === 'undefined' || !window.posthog || !window.posthog.capture) return;
  while (pending.length) {
    const [name, props] = pending.shift();
    window.posthog.capture(name, props);
  }
}