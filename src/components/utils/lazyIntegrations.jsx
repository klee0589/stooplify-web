// Lazy load heavy integrations to avoid blocking main thread
let posthog = null;
let sentry = null;
let stripe = null;

// Initialize PostHog on demand (analytics)
export const getPostHog = () => {
  if (posthog) return posthog;
  if (typeof window === 'undefined') return null;
  
  try {
    const posthogModule = require('posthog-js');
    posthog = posthogModule.default;
    
    if (!posthog.__loaded) {
      posthog.init('phc_O1v6eh3WZWysCmiW5sODyx8YScYNMEligZyMHZGEekb', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
      });
    }
  } catch (e) {
    console.warn('Failed to load PostHog');
    return null;
  }
  
  return posthog;
};

// Initialize Sentry on demand (error tracking)
export const getSentry = () => {
  if (sentry) return sentry;
  if (typeof window === 'undefined') return null;
  
  try {
    sentry = require('@sentry/react');
    const sentryDSN = import.meta.env.VITE_SENTRY_DSN || '';
    
    if (sentryDSN && !window.__sentry_initialized__) {
      sentry.init({
        dsn: sentryDSN,
        integrations: [new sentry.BrowserTracing(), new sentry.Replay()],
        environment: import.meta.env.MODE,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      window.__sentry_initialized__ = true;
    }
  } catch (e) {
    console.warn('Failed to load Sentry');
    return null;
  }
  
  return sentry;
};

// Lazy load Stripe on checkout pages
export const loadStripe = async () => {
  if (stripe) return stripe;
  
  try {
    const stripeModule = await import('@stripe/stripe-js');
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    stripe = await stripeModule.loadStripe(publishableKey);
  } catch (e) {
    console.error('Failed to load Stripe:', e);
    return null;
  }
  
  return stripe;
};

// Lazy load Three.js for 3D
export const loadThree = async () => {
  try {
    const three = await import('three');
    return three.default || three;
  } catch (e) {
    console.error('Failed to load Three.js:', e);
    return null;
  }
};