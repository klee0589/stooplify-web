import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, Heart, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function SaleCard({ sale, isFavorite, onToggleFavorite, distance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-[#FF6F61]/10 to-[#F5A623]/10">
        {sale.photos && sale.photos.length > 0 ? (
          <img
            src={sale.photos[0]}
            alt={sale.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-[#FF6F61]/30" />
          </div>
        )}
        
        {/* Category Badge */}
        {sale.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#2E3A59] capitalize">
            {sale.category.replace('-', ' ')}
          </span>
        )}
        
        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(sale.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#FF6F61] text-[#FF6F61]' : 'text-gray-400'}`} 
          />
        </motion.button>
      </div>

      {/* Content */}
      <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}>
        <div className="p-4">
          <h3 
            className="text-lg font-bold text-[#2E3A59] mb-2 line-clamp-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {sale.title}
          </h3>
          
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-[#FF6F61]" />
              <span className="text-sm">
                {sale.date ? format(new Date(sale.date), 'EEE, MMM d') : 'Date TBD'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="text-sm">
                {sale.start_time || '8 AM'} - {sale.end_time || '2 PM'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-[#2E3A59]" />
              <span className="text-sm line-clamp-1">
                {sale.general_location || `${sale.city}, ${sale.state}`}
                {distance && <span className="ml-1 text-[#FF6F61]">• {distance} mi</span>}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-gray-100">
            <span className="text-[#FF6F61] font-medium text-sm flex items-center gap-1">
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}