import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from '../translations';
import HomePhoto from './HomePhoto';

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

  return (
    <section className="py-16 md:py-20 bg-background" aria-labelledby="home-host-sale-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-6 py-8 dark:border-border dark:bg-card sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-warm/20 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2 id="home-host-sale-title" className="text-h2 font-heading font-semibold text-white">
                {t('ctaTitle')} <span className="text-accent-warm">{t('ctaOwnSale')}</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">{t('ctaSubtitle')}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={createPageUrl('AddYardSale')}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent-warm px-6 py-3 text-center font-heading font-semibold text-accent-warm-foreground shadow-sm transition-colors hover:bg-accent-warm/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
                >
                  <Plus className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {t('listSaleFree')}
                </Link>
                <Link
                  to={createPageUrl('YardSales')}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-center font-heading font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
                >
                  {t('browseSalesBtn')}
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-lg lg:col-span-5">
              <HomePhoto
                image="hosting"
                className="h-full w-full object-cover"
                sizes="(min-width: 1280px) 430px, (min-width: 1024px) 38vw, 90vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
