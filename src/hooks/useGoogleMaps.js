import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

let scriptPromise = null;
let cachedApiKey = null;

async function getApiKey() {
  if (cachedApiKey) return cachedApiKey;
  const res = await base44.functions.invoke('getPublicConfig', {});
  cachedApiKey = res.data.googleMapsApiKey;
  return cachedApiKey;
}

function loadGoogleMapsScript(apiKey) {
  if (scriptPromise) return scriptPromise;
  if (window.google?.maps) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const apiKey = await getApiKey();
        if (!apiKey) throw new Error('No API key');
        await loadGoogleMapsScript(apiKey);
        if (!cancelled) setIsLoaded(true);
      } catch (err) {
        console.error('Google Maps load error:', err);
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { isLoaded, error };
}