import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedSales from '../components/home/FeaturedSales';
import CTASection from '../components/home/CTASection';

export default function Home() {
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

  useEffect(() => {
    base44.analytics.track({ eventName: 'home_page_viewed' });
  }, []);
  
  const { data: sales = [] } = useQuery({
    queryKey: ['featuredSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 6);
      // Filter to show only upcoming sales (not ended)
      const now = new Date();
      return allSales.filter(sale => {
        const saleEndDateTime = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
        return saleEndDateTime >= now;
      });
    },
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Stats Section */}
      <section className="bg-gradient-to-br from-[#FF6F61] to-[#F5A623] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Join The Community
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Thousands of local shoppers finding amazing deals every week
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20"
            >
              <div className="text-6xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {sales.length}+
              </div>
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('activeSales')}
              </div>
              <p className="text-white/80 text-sm">
                Live sales happening this weekend
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20"
            >
              <div className="text-6xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                2.5K+
              </div>
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('happyShoppers')}
              </div>
              <p className="text-white/80 text-sm">
                Finding treasures in their neighborhood
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20"
            >
              <div className="text-6xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                90%
              </div>
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('upToOff')}
              </div>
              <p className="text-white/80 text-sm">
                Average savings on retail prices
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <HowItWorks />
      <FeaturedSales sales={sales} />
      <CTASection />
      
      {/* From the Founder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6 flex items-center justify-center gap-2">
            <span>👋</span> {t('fromTheFounder')}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6F61] to-[#F5A623] flex items-center justify-center mx-auto md:mx-0 shadow-lg">
              <span className="text-5xl">👤</span>
            </div>
            <div className="flex-1 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{t('founderIntro')}</p>
              <p>{t('founderBackground')}</p>
              <p>{t('founderVision')}</p>
              <p>{t('founderMission')}</p>
              <p>{t('founderContact')}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a 
                  href="mailto:daniel@stooplify.com"
                  className="inline-flex items-center gap-2 text-[#FF6F61] hover:underline font-semibold"
                >
                  📩 daniel@stooplify.com
                </a>
              </div>
            </div>
          </div>
          
          {/* CTA After Bio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              Ready to discover your neighborhood's hidden treasures?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/YardSales"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#14B8FF] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Browse Sales Now
              </motion.a>
              <motion.a
                href="/AddYardSale"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                List Your Sale Free
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Final CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#14B8FF] to-[#2E3A59] py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Start Finding Deals?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of treasure hunters discovering amazing finds at yard sales near you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/YardSales"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#2E3A59] rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Browse Sales Now
            </motion.a>
            <motion.a
              href="/AddYardSale"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              List Your Sale Free
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}