import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, ArrowRight, LocateFixed } from 'lucide-react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Upcoming sale marker (green)
const upcomingIcon = new L.DivIcon({
  className: 'upcoming-marker',
  html: `
    <div style="
      width: 40px; height: 40px;
      background: #10B981;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="transform: rotate(45deg); color: white; font-size: 16px;">📅</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom marker icon for single sale
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 40px; height: 40px;
      background: #14B8FF;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(20, 184, 255, 0.4);
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="transform: rotate(45deg); color: white; font-size: 16px;">🏷️</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const createClusterIcon = (count) => new L.DivIcon({
  className: 'cluster-marker',
  html: `
    <div style="
      width: 50px; height: 50px;
      background: #FF6F61;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(255, 111, 97, 0.4);
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; color: white; font-size: 18px;
    ">
      ${count}
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

const createCommunityIcon = (emoji) => new L.DivIcon({
  className: 'community-marker',
  html: `
    <div style="
      width: 45px; height: 45px;
      background: #2E3A59;
      border-radius: 50%;
      border: 3px solid gold;
      box-shadow: 0 4px 15px rgba(46, 58, 89, 0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    ">
      ${emoji}
    </div>
  `,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

// Cluster sales by proximity based on current zoom
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
      const latDiff = Math.abs(sale.latitude - other.latitude);
      const lonDiff = Math.abs(sale.longitude - other.longitude);
      if (latDiff < clusterRadius && lonDiff < clusterRadius) {
        cluster.push(other);
        assigned.add(j);
      }
    });
    clusters.push(cluster);
  });

  return clusters;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapBoundsWatcher({ onBoundsChange, onZoomChange }) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => {
      onBoundsChange(map.getBounds());
      onZoomChange(map.getZoom());
    },
  });
  useEffect(() => {
    onBoundsChange(map.getBounds());
    onZoomChange(map.getZoom());
  }, []);
  return null;
}

function RecenterButton({ userLocation }) {
  const map = useMap();
  if (!userLocation) return null;

  return (
    <button
      onClick={() => map.flyTo(userLocation, 14, { animate: true, duration: 0.8 })}
      className="absolute bottom-6 right-4 z-[1000] bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      title="Re-center on my location"
      style={{ touchAction: 'none' }}
    >
      <LocateFixed className="w-5 h-5 text-[#14B8FF]" />
    </button>
  );
}

export default function SaleMap({ sales, center, onVisibleSalesChange }) {
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [zoom, setZoom] = useState(11);
  const defaultCenter = center || userLocation || [40.7128, -74.0060];

  const { data: communityLocations = [] } = useQuery({
    queryKey: ['communityLocations'],
    queryFn: () => base44.entities.CommunityLocation.filter({ is_active: true }),
  });

  useEffect(() => {
    if (navigator.geolocation && !center) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
    setMapReady(true);
  }, []);

  const visibleSales = mapBounds
    ? sales.filter(s => s.latitude && s.longitude && mapBounds.contains([s.latitude, s.longitude]))
    : sales;

  useEffect(() => {
    if (onVisibleSalesChange) onVisibleSalesChange(visibleSales);
  }, [visibleSales.length, mapBounds]);

  const salesWithCoords = visibleSales.filter(s => s.latitude && s.longitude);
  const clusters = clusterSales(salesWithCoords, zoom);

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8 text-[#14B8FF]" />
          <span className="text-gray-500">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative z-0">
      <style>{`
        .leaflet-tile-pane { filter: saturate(0.5) brightness(1.1) sepia(0.25) hue-rotate(-10deg); }
        .leaflet-popup-content-wrapper { border-radius: 16px; padding: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .leaflet-popup-content { margin: 0; min-width: 250px; }
        .leaflet-popup-tip { background: white; }
        .custom-marker { background: transparent; border: none; }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={userLocation ? 12 : 11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={center} />
        <MapBoundsWatcher onBoundsChange={setMapBounds} onZoomChange={setZoom} />
        <RecenterButton userLocation={userLocation} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Community Locations */}
        {communityLocations.map((loc) => (
          <Marker
            key={`community-${loc.id}`}
            position={[loc.latitude, loc.longitude]}
            icon={createCommunityIcon(loc.icon)}
          >
            <Popup>
              <div className="p-4">
                <h3 className="font-bold text-[#2E3A59] mb-2 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {loc.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{loc.description}</p>
                <p className="text-xs text-gray-500">{loc.address}, {loc.city}</p>
                <div className="mt-2 inline-block text-xs bg-gray-100 px-2 py-1 rounded">
                  {loc.category.replace(/_/g, ' ')}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Sale clusters / single pins */}
        {clusters.map((cluster, idx) => {
          const avgLat = cluster.reduce((s, c) => s + c.latitude, 0) / cluster.length;
          const avgLon = cluster.reduce((s, c) => s + c.longitude, 0) / cluster.length;

          if (cluster.length === 1) {
            const sale = cluster[0];
            return (
              <Marker key={sale.id} position={[sale.latitude, sale.longitude]} icon={sale.isUpcoming ? upcomingIcon : customIcon}>
                <Popup>
                  <div className="p-4">
                    {sale.photos?.length > 0 && (
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                        <img src={sale.photos[0]} alt={sale.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-bold text-[#2E3A59] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {sale.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#14B8FF]" />
                        <span>{sale.date ? format(new Date(sale.date), 'EEE, MMM d') : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
                        <span>{sale.start_time || '8 AM'} - {sale.end_time || '2 PM'}</span>
                      </div>
                    </div>
                    <Link
                      to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                      className="flex items-center justify-center gap-1 w-full py-2 bg-[#14B8FF] text-white rounded-xl text-sm font-medium hover:bg-[#0da3e6] transition-colors"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          }

          // Cluster marker — clicking zooms in
          return (
            <ClusterMarker
              key={`cluster-${idx}`}
              position={[avgLat, avgLon]}
              cluster={cluster}
              icon={createClusterIcon(cluster.length)}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

function ClusterMarker({ position, cluster, icon }) {
  const map = useMap();

  const handleClick = useCallback(() => {
    const currentZoom = map.getZoom();
    map.flyTo(position, Math.min(currentZoom + 3, 18), { animate: true, duration: 0.6 });
  }, [map, position]);

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <div className="p-4 max-w-sm">
          <h3 className="font-bold text-[#2E3A59] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {cluster.length} Sales nearby — tap to zoom in
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cluster.map((sale) => (
              <Link
                key={sale.id}
                to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                className="block p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-[#2E3A59] text-sm mb-1">{sale.title}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {sale.date ? format(new Date(sale.date), 'MMM d') : 'Date TBD'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}