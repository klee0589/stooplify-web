import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Clock, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const TAG_LABELS = {
  curbside: { label: 'CURBSIDE', color: 'bg-blue-100 text-blue-700' },
  moving: { label: 'MOVING', color: 'bg-orange-100 text-orange-700' },
  fcfs: { label: 'FCFS', color: 'bg-purple-100 text-purple-700' },
  bundle: { label: 'BUNDLE', color: 'bg-yellow-100 text-yellow-700' },
};

function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function FreeItemCard({ item, userLocation }) {
  const photo = item.photos?.[0];
  const distance = userLocation && item.latitude && item.longitude
    ? getDistanceMiles(userLocation.lat, userLocation.lng, item.latitude, item.longitude)
    : null;

  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <Link to={createPageUrl('YardSaleDetails') + `?id=${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
          {photo ? (
            <img src={photo} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="w-12 h-12 text-green-400" />
            </div>
          )}
          {/* FREE badge */}
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md tracking-wide">
            FREE
          </div>
          {/* Tags */}
          {(item.free_item_tags || []).length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              {(item.free_item_tags || []).map(tag => {
                const t = TAG_LABELS[tag];
                if (!t) return null;
                return (
                  <span key={tag} className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.color}`}>
                    {t.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-[#2E3A59] dark:text-white mb-2 line-clamp-2 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {item.title}
          </h3>

          <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{item.general_location || item.city}</span>
              {distance !== null && distance < 50 && (
                <span className="ml-auto text-xs text-[#14B8FF] font-medium whitespace-nowrap">
                  {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`}
                </span>
              )}
            </div>
            {item.date && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {item.start_time || ''} {item.end_time ? `– ${item.end_time}` : ''}
                  {!item.start_time && 'Pickup anytime'}
                </span>
              </div>
            )}
          </div>

          {item.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.description}</p>
          )}

          <div className="mt-3 w-full py-2 bg-green-500 text-white rounded-xl text-sm font-semibold text-center">
            View Details
          </div>
        </div>
      </Link>
    </motion.div>
  );
}