import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../translations';
import SectionHeader from './SectionHeader';
import FeaturedSaleCard from './FeaturedSaleCard';

export default function FeaturedSales({ sales = [] }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useTranslation(language);

  if (sales.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Handpicked"
          title={t('featuredSales')}
          subtitle={t('featuredSubtitle')}
          action={
            <Link to={createPageUrl('yard-sales')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              {t('viewAllSales')} <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sales.slice(0, 6).map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeaturedSaleCard sale={sale} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}