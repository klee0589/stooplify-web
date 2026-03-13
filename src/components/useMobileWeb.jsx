import { useMemo } from 'react';

/**
 * Detects if the app is running in a mobile browser (not a native app container).
 * Returns false for native apps (Capacitor, React Native WebView, iOS standalone PWA, Android WebView).
 */
export function useMobileWeb() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    // Native app containers
    if (window.Capacitor) return false;
    if (window.ReactNativeWebView) return false;
    // iOS standalone (installed to home screen as PWA)
    if (window.navigator.standalone) return false;
    // Android WebView ("; wv)" in UA)
    if (/; wv\)/.test(navigator.userAgent)) return false;
    // Only activate for mobile devices
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);
}