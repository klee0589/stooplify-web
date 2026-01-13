import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Heart, DollarSign } from 'lucide-react';
import { useTranslation } from '../translations';

export default function HowItWorks() {
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
  
  const steps = [
    {
      icon: Search,
      title: t('discoverSalesTitle'),
      description: t('discoverSalesDesc'),
      color: '#14B8FF',
      bgColor: '#E6F7FF'
    },
    {
      icon: MapPin,
      title: t('getDirectionsTitle'),
      description: t('getDirectionsDesc'),
      color: '#2E3A59',
      bgColor: '#F0F2F7'
    },
    {
      icon: Heart,
      title: t('saveFavoritesTitle'),
      description: t('saveFavoritesDesc'),
      color: '#F5A623',
      bgColor: '#FFF9ED'
    },
    {
      icon: DollarSign,
      title: t('findDealsTitle'),
      description: t('findDealsDesc'),
      color: '#14B8FF',
      bgColor: '#E6F7FF'
    }
  ];

  return (
    <section className="py-20 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('howItWorks')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('howItWorksSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-3xl p-8 h-full transition-shadow duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <step.icon className="w-8 h-8" style={{ color: step.color }} />
                </motion.div>
                <span 
                  className="text-sm font-semibold text-[#14B8FF] mb-2 block"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {t('step1')} {index + 1}
                </span>
                <h3 
                  className="text-xl font-bold text-[#2E3A59] mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}