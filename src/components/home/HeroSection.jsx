import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Plus, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";
import { useTranslation } from '../translations';
import { useQuery } from '@tanstack/react-query';
import HeroPhotoCard from './HeroPhotoCard';

const ease = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useTranslation(language);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['heroStats'],
    queryFn: async () => {
      const sales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 500);
      const now = new Date();
      const liveSales = sales.filter((sale) => new Date(`${sale.date}T23:59:59`) >= now);
      return { activeSales: liveSales.length };
    },
    staleTime: 120000
  });

  const { data: heroPhotos = [] } = useQuery({
    queryKey: ['heroPhotos'],
    queryFn: async () => {
      const sales = await base44.entities.YardSale.filter({ status: 'approved' }, '-created_date', 50);
      const photos = sales.flatMap((s) => s.photos || []).filter(Boolean);
      for (let i = photos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photos[i], photos[j]] = [photos[j], photos[i]];
      }
      return photos.slice(0, 10);
    },
    staleTime: 300000
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    base44.analytics.track({ eventName: 'email_subscription_started' });
    setIsSubmitting(true);
    try {
      await base44.entities.EmailSubscriber.create({ email, notify_new_sales: true });
      base44.analytics.track({ eventName: 'email_subscribed', properties: { success: true } });
      toast.success('Thanks for subscribing! We\'ll notify you about new sales.');
      setEmail('');
    } catch (error) {
      base44.analytics.track({ eventName: 'email_subscribed', properties: { success: false } });
      toast.error('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] h-56 w-56 rounded-full bg-accent-warm/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-card"
            >
              <span className="h-2 w-2 rounded-full bg-accent-warm animate-pulse" />
              NYC &amp; NJ's #1 stoop sale finder
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease }}
              className="mt-6 text-display font-heading font-bold text-foreground"
            >
              Find stoop sales in{' '}
              <span className="text-primary">NYC &amp; New Jersey</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease }}
              className="mt-5 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Browse live stoop sales, yard sales, and free giveaways across Brooklyn, Queens, Manhattan, the Bronx, and New Jersey — updated every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                to={createPageUrl('yard-sales')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
              >
                <MapPin className="h-5 w-5" />
                Find Sales Near Me
              </Link>
              <Link
                to={createPageUrl('add-yard-sale')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-warm px-6 font-heading font-semibold text-accent-warm-foreground shadow-sm hover:shadow-md hover:bg-accent-warm/90 transition-all"
              >
                <Plus className="h-5 w-5" />
                Post Your Sale Free
              </Link>
            </motion.div>

            <motion.form
              onSubmit={handleEmailSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, ease }}
              className="mt-6 flex w-full max-w-md mx-auto lg:mx-0 items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-card"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email me new sales nearby"
                required
                className="h-10 flex-1 min-w-0 bg-transparent px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Notify me
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {statsLoading
                  ? <span className="inline-block h-4 w-6 rounded bg-muted animate-pulse align-middle" />
                  : <strong className="font-semibold text-foreground">{statsData?.activeSales ?? 0}</strong>}
                {' '}active sales
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-warm" />
                Free items available
              </span>
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="lg:col-span-6"
          >
            <HeroPhotoCard photos={heroPhotos} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}