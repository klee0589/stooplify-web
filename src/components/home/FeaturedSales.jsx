import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '../translations';
import { Badge } from '@/components/ui/badge';

export default function FeaturedSales({ sales = [] }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  const t = useTranslation(language);
  
  if (sales.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('featuredSales')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t('featuredSubtitle')}
            </p>
          </div>
          <Link to={createPageUrl('yard-sales')}>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-[#14B8FF] font-medium"
            >
              {t('viewAllSales')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sales.slice(0, 6).map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#14B8FF]/20 to-[#F5A623]/20 flex-shrink-0">
                    {sale.photos && sale.photos.length > 0 ? (
                       <img
                          src={sale.photos[0]}
                          alt={sale.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={300}
                          height={200}
                        />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <MapPin className="w-12 h-12 text-[#14B8FF]/40" />
                       </div>
                    )}
                    {sale.categories && sale.categories.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-1">
                        {sale.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} className="bg-white/90 text-[#2E3A59] text-xs capitalize">
                            {cat.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 
                      className="text-lg font-bold text-[#2E3A59] dark:text-white mb-3 line-clamp-2"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {sale.title}
                    </h3>

                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-[#14B8FF] flex-shrink-0" />
                        <span className="text-sm">
                          {sale.date ? (() => { const [y,m,d] = sale.date.split('-').map(Number); return format(new Date(y, m-1, d), 'MMM d'); })() : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                        <span className="text-sm">
                          {sale.start_time || '8am'} - {sale.end_time || '2pm'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.views || 0} views
                      </span>
                      <span className="text-[#14B8FF] font-medium text-xs flex items-center gap-1">
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
  }