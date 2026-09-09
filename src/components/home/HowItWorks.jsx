import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Heart, Navigation, Tag } from 'lucide-react';
import { useTranslation } from '../translations';
import SectionHeader from './SectionHeader';
import WeekendAlertSignup from '../WeekendAlertSignup';

const steps = [
  { num: '01', icon: Map, title: 'Discover Sales', desc: 'Browse yard sales near you using our interactive map or list view.' },
  { num: '02', icon: Heart, title: 'Save Favorites', desc: 'Bookmark sales you love and get reminders before they start.' },
  { num: '03', icon: Navigation, title: 'Get Directions', desc: 'Navigate to any sale with one tap. Never miss a hidden treasure.' },
  { num: '04', icon: Tag, title: 'Find Deals', desc: 'Score amazing finds at unbeatable prices from your neighbors.' },
];

export default function HowItWorks() {
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
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="How it works" title={t('howItWorks')} subtitle={t('howItWorksSubtitle')} />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 rounded-2xl border border-border bg-background p-2 shadow-card"
          >
            <WeekendAlertSignup variant="banner" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}