import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Plus, ArrowRight, Tag, Users } from 'lucide-react';
import { useTranslation } from '../translations';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function CTASection() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useTranslation(language);

  const { data: salesData } = useQuery({
    queryKey: ['ctaStats'],
    queryFn: async () => {
      const sales = await base44.entities.YardSale.filter({ status: 'approved' });
      const users = await base44.entities.User.list();
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const upcomingSales = sales.filter(sale => {
        if (!sale.date) return false;
        const [y, m, d] = sale.date.split('-').map(Number);
        return new Date(y, m - 1, d) >= now;
      });
      return { activeSales: upcomingSales.length, totalUsers: users.length };
    },
    staleTime: 60000,
    initialData: { activeSales: 0, totalUsers: 0 }
  });

  const stats = [
    { icon: Tag, value: salesData.activeSales.toString(), label: t('activeSales') },
    { icon: Users, value: salesData.totalUsers.toString(), label: t('happyShoppers') },
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-card border border-slate-800 dark:border-border px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-warm/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <h2 className="text-h2 font-heading font-semibold text-white">
                {t('ctaTitle')} <span className="text-accent-warm">{t('ctaOwnSale')}</span>
              </h2>
              <p className="mt-4 max-w-lg text-base text-slate-300 leading-relaxed">{t('ctaSubtitle')}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to={createPageUrl('AddYardSale')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-warm px-6 font-heading font-semibold text-accent-warm-foreground shadow-sm hover:shadow-md hover:bg-accent-warm/90 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  {t('listSaleFree')}
                </Link>
                <Link
                  to={createPageUrl('YardSales')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 font-heading font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all"
                >
                  {t('browseSalesBtn')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4 lg:col-span-5"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-heading text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}