import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../translations';

const steps = [
  {
    num: '01',
    title: 'Discover Sales',
    desc: 'Browse yard sales near you using our interactive map or list view.',
    tags: ['MAP VIEW', 'LIST VIEW', 'NEARBY'],
    accent: '#14B8FF',
    dark: false,
  },
  {
    num: '02',
    title: 'Save Favorites',
    desc: 'Bookmark sales you love and get reminders before they start.',
    tags: ['BOOKMARK', 'ALERTS'],
    accent: '#FF6F61',
    dark: false,
  },
  {
    num: '03',
    title: 'Get Directions',
    desc: 'Navigate to any sale with one tap. Never miss a hidden treasure.',
    tags: ['GPS', 'ONE TAP'],
    accent: '#fff',
    dark: true,
  },
  {
    num: '04',
    title: 'Find Deals',
    desc: 'Score amazing finds at unbeatable prices from your neighbors.',
    tags: ['UP TO 90% OFF', 'LOCAL'],
    accent: '#F5A623',
    dark: false,
  },
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
    <section className="py-16 bg-[#F9F9F9] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-widest text-[#14B8FF] uppercase mb-2 block">// How It Works</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h2
              className="text-4xl md:text-5xl font-extrabold text-[#2E3A59] dark:text-white leading-tight uppercase tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('howItWorks')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm leading-relaxed">
              {t('howItWorksSubtitle')}
            </p>
          </div>
        </motion.div>

        {/* Tile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative border-2 rounded-2xl p-7 flex flex-col justify-between min-h-[180px] transition-all hover:shadow-lg ${
                step.dark
                  ? 'bg-[#2E3A59] border-[#2E3A59] dark:bg-gray-800 dark:border-gray-700'
                  : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: step.dark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
                >
                  {step.num}
                </span>
                <span
                  className="text-4xl font-black opacity-10 select-none"
                  style={{ color: step.dark ? '#fff' : step.accent, fontFamily: 'Poppins, sans-serif' }}
                >
                  {step.num}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-extrabold uppercase tracking-tight mb-2 ${
                  step.dark ? 'text-white' : 'text-[#2E3A59] dark:text-white'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {step.title}
              </h3>

              {/* Desc */}
              <p className={`text-sm leading-relaxed mb-4 ${step.dark ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-bold px-2.5 py-1 border rounded tracking-widest uppercase ${
                      step.dark
                        ? 'border-white/30 text-white/80'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Accent bar bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                style={{ background: step.accent, opacity: step.dark ? 0.6 : 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}