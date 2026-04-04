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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Spring background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8F8F0] via-white to-[#FFF5F0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute top-10 right-[8%] w-48 h-48 bg-green-300/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-[3%] w-40 h-40 bg-[#FF6F61]/15 rounded-full blur-2xl" />
        <div className="absolute top-1/3 left-[40%] w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            {/* Spring Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-2 rounded-full shadow-sm mb-6"
            >
              <span className="text-lg">🌸</span>
              <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">
                Spring sales season is here
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E3A59] dark:text-white leading-tight mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Find Stoop Sales <span className="text-[#14B8FF]">In Your Neighborhood</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto lg:mx-0"
            >
              Spring cleaning is happening right now. Browse live stoop sales, yard sales, and free giveaways near you — updated every day.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start"
            >
              <Link to={createPageUrl('yard-sales')} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 255, 0.35)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#14B8FF] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#14B8FF]/25 text-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <MapPin className="w-5 h-5" />
                  Find Sales Near Me
                </motion.button>
              </Link>
              <Link to={createPageUrl('add-yard-sale')} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 111, 97, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-[#FF6F61] text-[#FF6F61] bg-white dark:bg-transparent dark:text-[#FF6F61] rounded-2xl font-semibold flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Plus className="w-5 h-5" />
                  Post Your Sale Free
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-xl">📍</span>
                <span>
                  {statsLoading ? (
                    <span className="inline-block w-6 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse align-middle" />
                  ) : (
                    <strong className="text-[#14B8FF]">{statsData?.activeSales ?? 0}</strong>
                  )}
                  {' '}active sales
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-xl">🎁</span>
                <span>Free items available</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-xl">✅</span>
                <span>Always free to browse</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Spring image */}
          <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.7, delay: 0.3 }}
           className="relative hidden lg:block"
          >
           <div className="relative w-full aspect-square max-w-lg mx-auto">
             <div className="absolute inset-0">
               <div className="w-full h-full bg-gradient-to-br from-green-100/50 to-orange-100/50 rounded-[3rem] overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&q=70&fit=crop"
                    alt="Spring outdoor stoop sale with colorful items"
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
                transition={{ delay: 0.9 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-green-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🌸</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Spring Season</p>
                    <p className="font-semibold text-[#2E3A59] dark:text-white">Peak Sale Time</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FF6F61]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Save big</p>
                    <p className="font-semibold text-[#2E3A59] dark:text-white">Up to 90% off retail</p>
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