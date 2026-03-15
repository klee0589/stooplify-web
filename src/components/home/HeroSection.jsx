import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";
import { useTranslation } from '../translations';
import { useQuery } from '@tanstack/react-query';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Fetch real data - defer until visible
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['heroStats'],
    queryFn: async () => {
      const sales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 500);
      const now = new Date();
      const liveSales = sales.filter(sale => {
        // Parse as local time by appending T23:59:59 (avoids UTC-midnight off-by-one)
        const saleDate = new Date(`${sale.date}T23:59:59`);
        return saleDate >= now;
      });
      return {
        activeSales: liveSales.length
      };
    },
    staleTime: 120000,
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    base44.analytics.track({
      eventName: 'email_subscription_started'
    });
    
    setIsSubmitting(true);
    try {
      await base44.entities.EmailSubscriber.create({ email, notify_new_sales: true });
      base44.analytics.track({
        eventName: 'email_subscribed',
        properties: { success: true }
      });
      toast.success('Thanks for subscribing! We\'ll notify you about new sales.');
      setEmail('');
    } catch (error) {
      base44.analytics.track({
        eventName: 'email_subscribed',
        properties: { success: false }
      });
      toast.error('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient - no JS animations for performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F4] via-white to-[#F5F7FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute top-20 right-[10%] w-32 h-32 bg-[#FF6F61]/10 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-[5%] w-40 h-40 bg-[#F5A623]/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-[30%] w-24 h-24 bg-[#2E3A59]/5 rounded-full blur-xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Value Prop Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6"
            >
              <span className="text-lg">🎯</span>
              <span className="text-xs sm:text-sm font-semibold text-[#2E3A59] dark:text-white">
                Real neighborhood sales. No spam.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E3A59] dark:text-white leading-tight mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto lg:mx-0"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-6 justify-center lg:justify-start"
            >
              <Link to={createPageUrl('yard-sales')} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#14B8FF] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#14B8FF]/25"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  aria-label={t('findSales')}
                >
                  <MapPin className="w-5 h-5" />
                  {t('findSales')}
                </motion.button>
              </Link>
              <Link to={createPageUrl('add-yard-sale')} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 111, 97, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  aria-label={t('listYourSale')}
                >
                  <Plus className="w-5 h-5" />
                  <span>Post a Sale in <strong>60 Seconds</strong></span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏘️</span>
                <span>
                  {statsLoading ? (
                    <span className="inline-block w-6 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse align-middle" />
                  ) : (
                    <strong>{statsData.activeSales}</strong>
                  )}
                  {' '}active sales
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>Live in <strong>NYC</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>Local-only visibility</span>
              </div>
            </motion.div>

            {/* Email Capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-700 max-w-md mx-auto lg:mx-0"
            >
              <p className="text-sm font-medium text-[#2E3A59] dark:text-white mb-3">
                🔔 {t('emailNotify')}
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border-gray-200 focus:border-[#14B8FF] focus:ring-[#14B8FF]"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#14B8FF] hover:bg-[#0da3e6] rounded-xl px-4 shrink-0"
                >
                  {isSubmitting ? t('joining') : t('join')}
                </Button>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Illustration */}
          <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="relative hidden lg:block"
          >
           <div className="relative w-full aspect-square max-w-lg mx-auto">
             {/* Main Image Container */}
             <div className="absolute inset-0">
               <div className="w-full h-full bg-gradient-to-br from-[#FF6F61]/20 to-[#F5A623]/20 rounded-[3rem] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&h=500&q=60"
                    alt="Outdoor garage sale with tables full of items for sale"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                    loading="eager"
                    fetchpriority="high"
                    decoding="sync"
                  />
               </div>
             </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#14B8FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('thisWeekend')}</p>
                    <p className="font-semibold text-[#2E3A59] dark:text-white">
                      {statsLoading ? '...' : statsData.activeSales} {t('salesNearby')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('totalSavings')}</p>
                    <p className="font-semibold text-[#2E3A59] dark:text-white">{t('upToOff')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}