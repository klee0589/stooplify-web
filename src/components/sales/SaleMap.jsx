import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon for single sale
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 40px;
      height: 40px;
      background: #14B8FF;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(20, 184, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
      ">
        🏷️
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Cluster icon for multiple sales at same location
const createClusterIcon = (count) => new L.DivIcon({
  className: 'cluster-marker',
  html: `
    <div style="
      width: 50px;
      height: 50px;
      background: #FF6F61;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(255, 111, 97, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 18px;
    ">
      ${count}
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function SaleMap({ sales, center }) {
   const [mapReady, setMapReady] = useState(false);
   const [userLocation, setUserLocation] = useState(null);
   const [expandedLocation, setExpandedLocation] = useState(null);
   const defaultCenter = center || userLocation || [40.7128, -74.0060]; // NYC default

   // Group sales by general location
   const groupedByLocation = sales.reduce((acc, sale) => {
     if (!sale.latitude || !sale.longitude) return acc;
     const key = sale.general_location || 'Unknown';
     if (!acc[key]) {
       acc[key] = [];
     }
     acc[key].push(sale);
     return acc;
   }, {});

   // Debug: Log sales data
   useEffect(() => {
     console.log('🗺️ SaleMap received sales:', sales.length);
     console.log('Sales with coordinates:', sales.filter(s => s.latitude && s.longitude).length);
     sales.forEach(sale => {
       console.log(`Sale: ${sale.title} - Lat: ${sale.latitude}, Lon: ${sale.longitude}`);
     });
   }, [sales]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation && !center) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied, using default');
        }
      );
    }
    setMapReady(true);
  }, []);

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
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 250px;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={userLocation ? 12 : 11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {Object.entries(groupedByLocation).map(([location, locationSales]) => {
           if (locationSales.length === 0) return null;

           // Calculate average coordinates for this location
           const avgLat = locationSales.reduce((sum, s) => sum + s.latitude, 0) / locationSales.length;
           const avgLon = locationSales.reduce((sum, s) => sum + s.longitude, 0) / locationSales.length;

           // If only one sale, show it directly
           if (locationSales.length === 1) {
             const sale = locationSales[0];
             return (
               <Marker
                 key={sale.id}
                 position={[sale.latitude, sale.longitude]}
                 icon={customIcon}
               >
                 <Popup>
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="p-4"
                   >
                     {sale.photos && sale.photos.length > 0 && (
                       <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                         <img
                           src={sale.photos[0]}
                           alt={sale.title}
                           className="w-full h-full object-cover"
                         />
                       </div>
                     )}
                     <h3 
                       className="font-bold text-[#2E3A59] mb-2"
                       style={{ fontFamily: 'Poppins, sans-serif' }}
                     >
                       {sale.title}
                     </h3>
                     <div className="space-y-1 text-sm text-gray-600 mb-3">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5 text-[#14B8FF]" />
                         <span>
                           {sale.date ? format(new Date(sale.date), 'EEE, MMM d') : 'Date TBD'}
                         </span>
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
                       View Details
                       <ArrowRight className="w-3.5 h-3.5" />
                     </Link>
                   </motion.div>
                 </Popup>
               </Marker>
             );
           }

           // If multiple sales, show cluster marker
           return (
             <Marker
               key={`cluster-${location}`}
               position={[avgLat, avgLon]}
               icon={createClusterIcon(locationSales.length)}
               eventHandlers={{
                 click: () => setExpandedLocation(expandedLocation === location ? null : location)
               }}
             >
               <Popup>
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-4 max-w-sm"
                 >
                   <h3 
                     className="font-bold text-[#2E3A59] mb-4"
                     style={{ fontFamily: 'Poppins, sans-serif' }}
                   >
                     {locationSales.length} Sales in {location}
                   </h3>
                   <div className="space-y-3 max-h-80 overflow-y-auto">
                     {locationSales.map((sale) => (
                       <Link
                         key={sale.id}
                         to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                         className="block p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                       >
                         <p className="font-medium text-[#2E3A59] text-sm mb-1">
                           {sale.title}
                         </p>
                         <p className="text-xs text-gray-600 flex items-center gap-1">
                           <Calendar className="w-3 h-3" />
                           {sale.date ? format(new Date(sale.date), 'MMM d') : 'Date TBD'}
                         </p>
                       </Link>
                     ))}
                   </div>
                 </motion.div>
               </Popup>
             </Marker>
           );
         })}
      </MapContainer>
    </div>
  );
}