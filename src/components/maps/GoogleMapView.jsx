import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const LIGHT_STYLES = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
const DARK_STYLES = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}];

export default function GoogleMapView({ lat, lng, exact = false, title = '', zoom, className = 'h-64 rounded-xl overflow-hidden' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { isLoaded, error } = useGoogleMaps();

  // React to theme toggle
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({ styles: isDark ? DARK_STYLES : LIGHT_STYLES });
    }
  }, [isDark]);

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
        styles: isDark ? DARK_STYLES : LIGHT_STYLES,
      });
    } else {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(defaultZoom);
      mapInstanceRef.current.setOptions({ styles: isDark ? DARK_STYLES : LIGHT_STYLES });
    }

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
        radius: 400,
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