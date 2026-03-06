/**
 * Deferred Analytics Loader
 * Loads PostHog after page interactive to avoid blocking main thread
 */

export const deferAnalyticsLoad = () => {
  // Load PostHog after page becomes interactive
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback if available, otherwise fall back to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadPostHog();
      }, { timeout: 2000 });
    } else {
      // Load after 3 seconds (gives time for main content to render)
      setTimeout(loadPostHog, 3000);
    }

    // Also load on first user interaction
    const loadOnInteraction = () => {
      loadPostHog();
      document.removeEventListener('click', loadOnInteraction);
      document.removeEventListener('touchstart', loadOnInteraction);
      document.removeEventListener('keydown', loadOnInteraction);
    };

    document.addEventListener('click', loadOnInteraction, { once: true });
    document.addEventListener('touchstart', loadOnInteraction, { once: true });
    document.addEventListener('keydown', loadOnInteraction, { once: true });
  }
};

const loadPostHog = async () => {
  try {
    // Only load if not already loaded
    if (window.posthog) return;

    // Dynamically import PostHog
    const posthogModule = await import('posthog-js');
    const posthog = posthogModule.default;

    posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_YOUR_API_KEY', {
      api_host: 'https://us.i.posthog.com',
      // Disable heavy features on homepage
      session_recording: {
        recordCrossOriginIframes: false,
        maskAllInputs: true,
      },
      disable_session_recording: window.location.pathname === '/',
      disable_surveys: window.location.pathname === '/',
      persistence: 'localStorage+cookie',
      persistence_name: 'ph_lite',
      batch_size: 50,
      batch_timeout_ms: 10000,
    });

    window.posthog = posthog;
  } catch (error) {
    console.log('PostHog deferred load skipped');
  }
};

export const loadAnalyticsNow = () => {
  loadPostHog();
};