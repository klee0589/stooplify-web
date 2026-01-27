import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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
  
  const { data: sales = [] } = useQuery({
    queryKey: ['featuredSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-created_date', 6);
      return allSales;
    },
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
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
            <img 
              src="https://media.licdn.com/dms/image/v2/C4D03AQHfEpPu5uyhmA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1623772310095?e=1770854400&v=beta&t=Csl4ztXTFqpT2bDF941vIBkMgwKK7iah2ExnaXY6eFg"
              alt="Daniel - Founder of Stooplify"
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0 shadow-lg"
            />
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
        </div>
      </div>
    </div>
  );
}