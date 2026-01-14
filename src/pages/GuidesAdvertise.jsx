import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Megaphone, Home, ChevronRight } from 'lucide-react';
import { useTranslation } from '../components/translations';

export default function GuidesAdvertise() {
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

  useEffect(() => {
    document.title = 'How to Advertise a Yard Sale in NYC - Free & Easy | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn how to advertise your yard sale in NYC for free. Reach local buyers in Brooklyn, Queens, and Manhattan without printed signs or Facebook groups.');
    }
    
    // Add JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Advertise a Yard Sale in NYC (Free & Easy)",
      "description": "Learn how to advertise your yard sale in New York City for free and reach local buyers effectively",
      "image": "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "author": {
        "@type": "Organization",
        "name": "Stooplify"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Stooplify",
        "logo": {
          "@type": "ImageObject",
          "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
        }
      },
      "datePublished": "2026-01-14",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [language]);

  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={createPageUrl('Home')} className="hover:text-[#FF6F61] flex items-center gap-1">
            <Home className="w-4 h-4" />
            {t('guides.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={createPageUrl('Guides')} className="hover:text-[#FF6F61]">
            {t('guides.title')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2E3A59] font-medium">{language === 'en' ? 'Advertise Your Sale' : 'Anuncia Tu Venta'}</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop" 
            alt="Yard sale signs and neighborhood"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <Megaphone className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('guides.advertise.title')}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">{t('guides.advertise.intro1')}</p>
              <p className="text-gray-700 leading-relaxed mb-6">{t('guides.advertise.intro2')}</p>

              <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('guides.advertise.traditional')}
              </h2>
              <p className="text-gray-700 mb-4">{t('guides.advertise.traditionalIntro')}</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                {t('guides.advertise.traditionalList').map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">{t('guides.advertise.traditionalOutro')}</p>

              <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('guides.advertise.better')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('guides.advertise.betterIntro')}</p>
              <p className="text-gray-700 mb-4">{t('guides.advertise.betterWith')}</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                {t('guides.advertise.betterList').map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">{t('guides.advertise.betterOutro')}</p>

              <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('guides.advertise.why')}
              </h2>
              <p className="text-gray-700 mb-4">{t('guides.advertise.whyIntro')}</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                {t('guides.advertise.whyList').map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p className="text-gray-700 leading-relaxed mb-8">{t('guides.advertise.whyOutro')}</p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('AddYardSale')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    {t('guides.advertise.cta')}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}