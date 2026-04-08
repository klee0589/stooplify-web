import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, ArrowRight, LocateFixed, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const LIGHT_STYLES = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
const DARK_STYLES = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}];

function clusterSales(sales, zoom) {
  const clusterRadius = Math.max(0.001, 0.02 / Math.pow(2, zoom - 11));
  const clusters = [];
  const assigned = new Set();
  sales.forEach((sale, i) => {
    if (assigned.has(i)) return;
    const cluster = [sale];
    assigned.add(i);
    sales.forEach((other, j) => {
      if (assigned.has(j)) return;
      if (Math.abs(sale.latitude - other.latitude) < clusterRadius &&
          Math.abs(sale.longitude - other.longitude) < clusterRadius) {
        cluster.push(other);
        assigned.add(j);
      }
    });
    clusters.push(cluster);
  });
  return clusters;
}

function makeSaleMarkerSvg(color) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" />
      <circle cx="18" cy="18" r="9" fill="white" fill-opacity="0.9"/>
    </svg>
  `)}`;
}

// Popup card rendered into a portal div
function SalePopup({ sale, container }) {
  if (!container) return null;
  return createPortal(
    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 220, maxWidth: 280 }}>
      {sale.photos?.length > 0 && (
        <div style={{ width: '100%', height: 100, overflow: 'hidden', borderRadius: '8px 8px 0 0', marginBottom: 8 }}>
          <img src={sale.photos[0]} alt={sale.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: '8px 12px 12px' }}>
        <p style={{ fontWeight: 700, color: '#2E3A59', marginBottom: 6, fontSize: 14 }}>{sale.title}</p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
          📅 {sale.date ? format(new Date(sale.date), 'EEE, MMM d') : 'Date TBD'}
        </p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
          🕐 {sale.start_time || '8 AM'} – {sale.end_time || '2 PM'}
        </p>
        <a
          href={`${createPageUrl('YardSaleDetails')}?id=${sale.id}`}
          style={{ display: 'block', textAlign: 'center', padding: '8px', background: '#14B8FF', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
        >
          View Details →
        </a>
      </div>
    </div>,
    container
  );
}

function ClusterPopup({ cluster, container }) {
  if (!container) return null;
  return createPortal(
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '12px', minWidth: 220, maxWidth: 280 }}>
      <p style={{ fontWeight: 700, color: '#2E3A59', marginBottom: 10, fontSize: 14 }}>{cluster.length} Sales nearby</p>
      <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cluster.map(sale => (
          <a
            key={sale.id}
            href={`${createPageUrl('YardSaleDetails')}?id=${sale.id}`}
            style={{ display: 'block', padding: '6px 8px', background: '#f5f5f5', borderRadius: 8, textDecoration: 'none' }}
          >
            <p style={{ fontWeight: 600, color: '#2E3A59', fontSize: 12, marginBottom: 2 }}>{sale.title}</p>
            <p style={{ fontSize: 11, color: '#888' }}>📅 {sale.date ? format(new Date(sale.date), 'MMM d') : 'Date TBD'}</p>
          </a>
        ))}
      </div>
    </div>,
    container
  );
}

export default function SaleMap({ sales, center, onVisibleSalesChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [popupState, setPopupState] = useState(null); // { type, data, container }
  const [userLocation, setUserLocation] = useState(null);
  const [zoom, setZoom] = useState(12);
  const { isLoaded, error } = useGoogleMaps();
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const { data: communityLocations = [] } = useQuery({
    queryKey: ['communityLocations'],
    queryFn: () => base44.entities.CommunityLocation.filter({ is_active: true }),
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation && !center) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    const defaultCenter = center
      ? { lat: center[0], lng: center[1] }
      : userLocation
        ? { lat: userLocation[0], lng: userLocation[1] }
        : { lat: 40.7128, lng: -74.006 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: userLocation ? 14 : 12,
      styles: isDark ? DARK_STYLES : LIGHT_STYLES,
      gestureHandling: 'cooperative',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();

    map.addListener('zoom_changed', () => setZoom(map.getZoom()));
    map.addListener('idle', () => {
      if (onVisibleSalesChange) {
        const bounds = map.getBounds();
        if (bounds) {
          const visible = sales.filter(s => s.latitude && s.longitude &&
            bounds.contains({ lat: s.latitude, lng: s.longitude }));
          onVisibleSalesChange(visible);
        }
      }
    });

    mapInstanceRef.current = map;
  }, [isLoaded]);

  // Update center when prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;
    mapInstanceRef.current.setCenter({ lat: center[0], lng: center[1] });
  }, [center]);

  // Re-render markers when sales/zoom/communityLocations change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    infoWindowRef.current.close();
    setPopupState(null);

    const salesWithCoords = sales.filter(s => s.latitude && s.longitude);
    const clusters = clusterSales(salesWithCoords, zoom);

    clusters.forEach((cluster) => {
      const avgLat = cluster.reduce((s, c) => s + c.latitude, 0) / cluster.length;
      const avgLon = cluster.reduce((s, c) => s + c.longitude, 0) / cluster.length;

      let markerIcon;
      if (cluster.length === 1) {
        const today = new Date().toDateString();
        const saleDate = cluster[0].date ? new Date(cluster[0].date).toDateString() : null;
        const isUpcoming = saleDate && saleDate !== today;
        markerIcon = {
          url: makeSaleMarkerSvg(isUpcoming ? '#10B981' : '#14B8FF'),
          scaledSize: new window.google.maps.Size(36, 44),
          anchor: new window.google.maps.Point(18, 44),
        };
      } else {
        markerIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="24" fill="#FF6F61"/>
              <text x="24" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="white" font-family="sans-serif">${cluster.length}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(48, 48),
          anchor: new window.google.maps.Point(24, 24),
        };
      }

      const marker = new window.google.maps.Marker({
        position: { lat: avgLat, lng: avgLon },
        map,
        icon: markerIcon,
      });

      marker.addListener('click', () => {
        if (cluster.length > 1) {
          const currentZoom = map.getZoom();
          map.flyTo && map.flyTo({ lat: avgLat, lng: avgLon }, Math.min(currentZoom + 3, 18));
          map.setZoom(Math.min(currentZoom + 3, 18));
          map.setCenter({ lat: avgLat, lng: avgLon });
          // Show cluster popup
          const container = document.createElement('div');
          infoWindowRef.current.setContent(container);
          infoWindowRef.current.open(map, marker);
          setPopupState({ type: 'cluster', data: cluster, container });
        } else {
          const container = document.createElement('div');
          infoWindowRef.current.setContent(container);
          infoWindowRef.current.open(map, marker);
          setPopupState({ type: 'sale', data: cluster[0], container });
        }
      });

      markersRef.current.push(marker);
    });

    // Community markers
    communityLocations.forEach(loc => {
      const container = document.createElement('div');
      container.style.cssText = 'width:40px;height:40px;background:#2E3A59;border-radius:50%;border:3px solid gold;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 15px rgba(46,58,89,0.5)';
      container.textContent = loc.icon || '📍';

      const marker = new window.google.maps.Marker({
        position: { lat: loc.latitude, lng: loc.longitude },
        map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="21" fill="#2E3A59" stroke="gold" stroke-width="3"/>
              <text x="22" y="29" text-anchor="middle" font-size="20" font-family="sans-serif">${loc.icon || '📍'}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(44, 44),
          anchor: new window.google.maps.Point(22, 22),
        },
        title: loc.name,
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, sales, zoom, communityLocations]);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
        Map unavailable
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-[#14B8FF] animate-spin" />
          <span className="text-gray-500 text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Recenter button */}
      {userLocation && (
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter({ lat: userLocation[0], lng: userLocation[1] });
              mapInstanceRef.current.setZoom(14);
            }
          }}
          className="absolute bottom-6 right-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Re-center on my location"
        >
          <LocateFixed className="w-5 h-5 text-[#14B8FF]" />
        </button>
      )}

      {/* Portaled popups */}
      {popupState?.type === 'sale' && <SalePopup sale={popupState.data} container={popupState.container} />}
      {popupState?.type === 'cluster' && <ClusterPopup cluster={popupState.data} container={popupState.container} />}
    </div>
  );
}