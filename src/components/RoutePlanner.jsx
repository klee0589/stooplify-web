import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { MapPin, Clock, Navigation, Route, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

function distanceMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildRoute(sales) {
  if (sales.length === 0) return [];
  // Group by date first, then sort by start_time within each date
  const byDate = {};
  sales.forEach(s => {
    const d = s.date || 'unknown';
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(s);
  });
  const result = [];
  Object.keys(byDate).sort().forEach(date => {
    const group = byDate[date].sort((a, b) => {
      const ta = a.start_time || '08:00';
      const tb = b.start_time || '08:00';
      return ta.localeCompare(tb);
    });
    result.push(...group);
  });
  return result;
}

function buildGoogleMapsUrl(sales) {
  const waypoints = sales
    .map(s => {
      if (s.exact_latitude && s.exact_longitude) return `${s.exact_latitude},${s.exact_longitude}`;
      if (s.latitude && s.longitude) return `${s.latitude},${s.longitude}`;
      const addr = [s.address, s.city, s.state].filter(Boolean).join(', ');
      return encodeURIComponent(addr);
    })
    .filter(Boolean);
  if (waypoints.length === 0) return null;
  if (waypoints.length === 1) return `https://www.google.com/maps/dir/?api=1&destination=${waypoints[0]}`;
  const dest = waypoints[waypoints.length - 1];
  const wps = waypoints.slice(0, -1).join('|');
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&waypoints=${wps}`;
}

export default function RoutePlanner({ sales }) {
  const [routeVisible, setRouteVisible] = useState(false);

  const route = useMemo(() => buildRoute(sales), [sales]);
  const mapsUrl = buildGoogleMapsUrl(route);

  if (sales.length < 2) return null;

  const handleOpen = () => {
    setRouteVisible(true);
    base44.analytics.track({ eventName: 'route_planner_opened', properties: { sale_count: sales.length } });
  };

  const handleCreateRoute = () => {
    base44.analytics.track({ eventName: 'route_planner_created', properties: { sale_count: sales.length } });
    if (mapsUrl) window.open(mapsUrl, '_blank');
  };

  if (!routeVisible) {
    return (
      <div className="bg-gradient-to-r from-[#14B8FF]/10 to-[#FF6F61]/10 border border-[#14B8FF]/20 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#14B8FF] rounded-xl flex items-center justify-center">
            <Route className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Weekend Route Planner
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You have {sales.length} saved sales — plan your route in one tap.
            </p>
          </div>
        </div>
        <Button onClick={handleOpen} className="bg-[#14B8FF] hover:bg-[#0da3e6] text-white rounded-xl">
          <Route className="w-4 h-4 mr-2" />
          Plan My Route
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-[#14B8FF]" />
          <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Weekend Route
          </h3>
        </div>
        {mapsUrl && (
          <Button onClick={handleCreateRoute} size="sm" className="bg-[#14B8FF] hover:bg-[#0da3e6] text-white rounded-xl flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" />
            Open in Maps
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {route.map((sale, idx) => (
          <div key={sale.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#14B8FF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              {idx < route.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">{sale.title}</p>
              <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {sale.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(sale.date), 'EEE, MMM d')}
                  </span>
                )}
                {sale.start_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sale.start_time}{sale.end_time ? ` – ${sale.end_time}` : ''}
                  </span>
                )}
                {sale.general_location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {sale.general_location}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Route ordered by date then start time. Tap "Open in Maps" to navigate stop-by-stop.
      </p>
    </div>
  );
}