import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { Loader2 } from 'lucide-react';

/**
 * Google Maps display component with a marker (exact) or circle (approximate).
 * Props:
 *   lat, lng        — center coordinates
 *   exact           — if true, show pin marker; if false, show fuzzy circle
 *   title           — marker popup text
 *   zoom            — default 15 (exact) or 13 (approx)
 *   className       — container class
 */
export default function GoogleMapView({ lat, lng, exact = false, title = '', zoom, className = 'h-64 rounded-xl overflow-hidden' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { isLoaded, error } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return;

    const center = { lat, lng };
    const defaultZoom = zoom || (exact ? 16 : 14);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: defaultZoom,
        disableDefaultUI: false,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
    } else {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(defaultZoom);
    }

    // Clear existing overlays by re-creating them
    if (exact) {
      const marker = new window.google.maps.Marker({
        position: center,
        map: mapInstanceRef.current,
        title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#FF6F61',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      if (title) {
        const infoWindow = new window.google.maps.InfoWindow({ content: `<strong style="font-family:sans-serif;font-size:13px;">${title}</strong>` });
        marker.addListener('click', () => infoWindow.open(mapInstanceRef.current, marker));
      }
    } else {
      new window.google.maps.Circle({
        map: mapInstanceRef.current,
        center,
        radius: 400, // ~quarter mile fuzzy zone
        fillColor: '#FF6F61',
        fillOpacity: 0.15,
        strokeColor: '#FF6F61',
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });
    }
  }, [isLoaded, lat, lng, exact, title, zoom]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm`}>
        Map unavailable
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-700`}>
        <Loader2 className="w-6 h-6 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}