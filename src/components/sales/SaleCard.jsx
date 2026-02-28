import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, Heart, ArrowRight, DollarSign, CreditCard, Smartphone, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TrustBadges from './TrustBadges';
import { useTranslation } from '../translations';

export default function SaleCard({ sale, isFavorite, onToggleFavorite, distance, seller, isPast }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  const t = useTranslation(language);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${isPast ? 'opacity-50' : ''}`}
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-[#FF6F61]/10 to-[#F5A623]/10">
        {sale.photos && sale.photos.length > 0 ? (
          <img
            src={sale.photos[0]}
            alt={sale.title}
            className={`w-full h-full object-cover ${isPast ? 'grayscale' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-[#FF6F61]/30" />
          </div>
        )}
        
        {/* Past Sale Badge or Category */}
        {isPast ? (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-gray-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
            {t('ended')}
          </span>
        ) : (sale.categories?.[0] || sale.category) && (
          (() => {
            const categoryIcons = {
              general: Package, furniture: Sofa, clothing: Shirt, electronics: Zap,
              toys: Baby, antiques: Crown, books: BookOpen, sports: Dumbbell, 'multi-family': Users
            };
            const catValue = sale.categories?.[0] || sale.category;
            const Icon = categoryIcons[catValue] || Tag;
            return (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#2E3A59] capitalize flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {catValue.replace('-', ' ')}
              </span>
            );
          })()
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
          <div className="space-y-2 mb-3">
            <h3 
              className="text-lg font-bold text-[#2E3A59] dark:text-white line-clamp-1"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {sale.title}
            </h3>
            {sale.is_community_event ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#14B8FF]/10 text-[#14B8FF] text-xs font-semibold rounded-full">
                🌐 Community
              </span>
            ) : seller && <TrustBadges seller={seller} size="small" />}
          </div>
          
          <div className="space-y-1.5 mb-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-[#FF6F61]" />
              <span className="text-sm">
                {sale.date ? format(parseISO(sale.date + 'T12:00:00'), 'EEE, MMM d') : t('dateTBD')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="text-sm">
                {sale.start_time || '8 AM'} - {sale.end_time || '2 PM'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#2E3A59]" />
              <span className="text-sm line-clamp-1">
                {sale.general_location || `${sale.city}, ${sale.state}`}
                {distance && <span className="ml-1 text-[#FF6F61]">• {distance} mi</span>}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          {(sale.payment_cash || sale.payment_card || sale.payment_digital) && (
            <div className="flex items-center gap-1.5 pt-2 pb-1">
              {sale.payment_cash && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-md" title="Cash accepted">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  {sale.cash_preferred && <span className="text-[8px] text-green-700 font-semibold">✓</span>}
                </div>
              )}
              {sale.payment_card && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-md" title="Cards accepted">
                  <CreditCard className="w-3 h-3 text-blue-600" />
                </div>
              )}
              {sale.payment_digital && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded-md" title="Digital payments accepted">
                  <Smartphone className="w-3 h-3 text-purple-600" />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-[#FF6F61] font-medium text-sm flex items-center gap-1">
              {t('details')}
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}