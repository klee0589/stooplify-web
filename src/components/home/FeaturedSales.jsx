import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '../translations';

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
              className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('featuredSales')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('featuredSubtitle')}
            </p>
          </div>
          <Link to={createPageUrl('YardSales')}>
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
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg transition-shadow duration-300 h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#14B8FF]/20 to-[#F5A623]/20">
                    {sale.photos && sale.photos.length > 0 ? (
                      <img
                        src={sale.photos[0]}
                        alt={sale.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-[#14B8FF]/40" />
                      </div>
                    )}
                    {sale.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-[#2E3A59] capitalize">
                        {sale.category.replace('-', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 
                      className="text-xl font-bold text-[#2E3A59] mb-2 line-clamp-1"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {sale.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#14B8FF]" />
                        <span className="text-sm">
                          {sale.date ? format(new Date(sale.date), 'EEEE, MMM d') : 'Date TBD'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-[#F5A623]" />
                        <span className="text-sm">
                          {sale.start_time || '8:00 AM'} - {sale.end_time || '2:00 PM'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#2E3A59]" />
                        <span className="text-sm line-clamp-1">
                          {sale.city}, {sale.state}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {sale.views || 0} {t('views')}
                      </span>
                      <span className="text-[#14B8FF] font-medium text-sm flex items-center gap-1">
                        {t('viewDetails')}
                        <ArrowRight className="w-4 h-4" />
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