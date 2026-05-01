import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroSection from '../components/home/HeroSection';
import DiscoveryDropdowns from '../components/sales/DiscoveryDropdowns';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedSales from '../components/home/FeaturedSales';
import CTASection from '../components/home/CTASection';
import FreeNearYou from '../components/home/FreeNearYou';
import SocialSection from '../components/home/SocialSection';
import WeekendAlertSignup from '../components/WeekendAlertSignup';
import { deferAnalyticsLoad } from '../components/AnalyticsLoader';


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

  useEffect(() => {
    // Defer analytics loading to avoid blocking main thread
    deferAnalyticsLoad();
    
    // Track after paint if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        base44.analytics.track({ eventName: 'home_page_viewed' });
      });
    } else {
      setTimeout(() => {
        base44.analytics.track({ eventName: 'home_page_viewed' });
      }, 0);
    }
  }, []);
  
  // Featured sales — scored by quality signals: photos, views, seller history
  const { data: sales = [] } = useQuery({
    queryKey: ['featuredSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 100);
      const now = new Date();

      const upcomingSales = allSales.filter(sale => {
        if (!sale.date) return false;
        const [y, m, d] = sale.date.split('-').map(Number);
        return new Date(y, m - 1, d) >= now;
      });

      // Count posts per seller for history signal
      const sellerPostCount = {};
      allSales.forEach(s => {
        if (s.created_by) sellerPostCount[s.created_by] = (sellerPostCount[s.created_by] || 0) + 1;
      });

      // Score each sale
      const scored = upcomingSales.map(sale => {
        const photoCount = (sale.photos || []).length;
        const views = sale.views || 0;
        const postHistory = sellerPostCount[sale.created_by] || 1;

        // Points:
        // Photos: 0=0, 1=5, 2=12, 3+=20
        const photoScore = photoCount === 0 ? 0 : photoCount === 1 ? 5 : photoCount === 2 ? 12 : 20;
        // Views: up to 30pts (1pt per 2 views, capped)
        const viewScore = Math.min(views / 2, 30);
        // Seller history: repeat seller bonus (up to 15pts)
        const historyScore = Math.min((postHistory - 1) * 5, 15);

        const total = photoScore + viewScore + historyScore;
        return { ...sale, _score: total };
      });

      // Only show sales that meet a minimum quality bar (at least 1 photo + some engagement)
      const qualified = scored.filter(s => (s.photos || []).length >= 1 && s._score >= 5);

      // Sort by score desc, take top 6
      qualified.sort((a, b) => b._score - a._score);
      return qualified.slice(0, 6);
    },
    staleTime: 180000
  });

  const userCount = 500; // Approximate community size

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Stooplify",
    "url": "https://stooplify.com",
    "description": "Discover amazing yard sales, garage sales, estate sales, and Brooklyn stoop sales near you. Find hidden treasures at unbeatable prices from local sellers in your neighborhood.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://stooplify.com/yard-sales?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Stooplify - Find Stoop Sales & Yard Sales in NYC and New Jersey"
        description="Discover stoop sales, yard sales, and garage sales across Brooklyn, Queens, Manhattan, the Bronx, and New Jersey. Browse live listings, find free items, and score unbeatable deals near you."
        keywords="brooklyn stoop sale, stoop sales NYC, yard sales near me, Queens yard sales, Manhattan garage sales, Bronx yard sales, New Jersey yard sales, Jersey City stoop sale, Hoboken yard sale, NYC stoop sale, garage sales NJ"
        structuredData={structuredData}
      />

      {/* HERO */}
      <HeroSection />

      {/* FIND SALES — Map CTA front and center */}
      <section className="py-14 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">🗽 NYC & NJ Sales Are Live</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>What's Happening in NYC & New Jersey</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Browse the live map across Brooklyn, Queens, Manhattan, the Bronx, and NJ — plan your weekend route before you leave home.</p>
          </div>

          {/* Browse shortcuts */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center mb-8">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">Filter by:</span>
            <DiscoveryDropdowns />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/yard-sales"
              onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'browse_map' } })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#14B8FF] text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#0da3e6] transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🗺️ Browse the Live Map
            </Link>
            <Link
              to="/free-items"
              onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'free_items' } })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-600 transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🎁 Free Items Near Me
            </Link>
          </div>
        </div>
      </section>

      {/* FREE ITEMS */}
      <FreeNearYou />

      {/* FEATURED SALES */}
      <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />}>
        <FeaturedSales sales={sales} />
      </Suspense>

      {/* WEEKEND ALERTS */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <WeekendAlertSignup variant="banner" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SPRING SELLING CTA */}
      <CTASection />

      {/* GUIDES */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">📚 NYC & NJ Seller Tips</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Yard Sale Guides</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Everything you need to host or find an amazing sale in NYC and New Jersey</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Advertise Your Sale', url: '/guides-advertise-yard-sale', emoji: '📣' },
              { label: 'Best Days & Times', url: '/guides-best-time-yard-sale', emoji: '📅' },
              { label: 'Permit Requirements', url: '/guides-permit-requirements-nyc', emoji: '📋' },
              { label: 'Pricing Your Items', url: '/guides-pricing-yard-sale-items', emoji: '💰' },
              { label: 'Guide for Seniors', url: '/guides-seniors-yard-sales', emoji: '👴' },
              { label: 'Finding Sales Near You', url: '/guides-find-yard-sales', emoji: '🗺️' },
            ].map((guide, i) => (
              <motion.div key={guide.url} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={guide.url} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-[#FF6F61]/10 hover:shadow-md transition-all text-center group border border-transparent hover:border-[#FF6F61]/30">
                  <span className="text-3xl mb-2">{guide.emoji}</span>
                  <span className="font-semibold text-[#2E3A59] dark:text-white text-sm group-hover:text-[#FF6F61] transition-colors text-center leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>{guide.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/guides" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6F61] text-white rounded-xl font-semibold hover:bg-[#e85d50] transition-colors shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
              View All Guides →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO text block */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Stoop Sales &amp; Yard Sales Across NYC &amp; New Jersey
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 space-y-4 text-center">
            <p>
              Stooplify is the easiest way to find <strong>stoop sales, yard sales, and garage sales</strong> across <strong>Brooklyn, Queens, Manhattan, the Bronx, Staten Island, Jersey City, Hoboken, and Newark</strong>.
            </p>
            <p>
              Neighbors across NYC and New Jersey set up sales every weekend — browse live listings in Williamsburg, Park Slope, Bushwick, Crown Heights, Bed-Stuy, Astoria, the Upper West Side, and beyond.
            </p>
            <p>
              Or <a href="/add-yard-sale" className="text-[#14B8FF] hover:underline">list your own stoop sale for free</a> and reach buyers already searching in your neighborhood.
            </p>
          </div>
          {/* Internal NYC borough links */}
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {[
              { label: '🏙️ Garage Sales NYC', url: '/garage-sales-nyc' },
              { label: '🌇 Stoop Sales NYC', url: '/stoop-sales-nyc' },
              { label: '🏘️ Brooklyn Garage Sales', url: '/garage-sales-brooklyn' },
              { label: '🗽 Manhattan Garage Sales', url: '/garage-sales-manhattan' },
              { label: '🌆 Queens Garage Sales', url: '/garage-sales-queens' },
              { label: '🏗️ Bronx Garage Sales', url: '/garage-sales-bronx' },
              { label: '🌉 Jersey City Sales', url: '/stoop-sales-jersey-city' },
            ].map(link => (
              <Link key={link.url} to={link.url} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-[#14B8FF] hover:text-[#14B8FF] transition-all shadow-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <SocialSection />

      {/* Final CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-500 to-[#14B8FF] py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🗽</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            The Best Stoop Sales in NYC & New Jersey
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Brooklyn, Queens, Manhattan, the Bronx, Jersey City, Hoboken — find the best local sales near you, updated every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
               href="/yard-sales"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-4 bg-white text-[#2E3A59] rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
               style={{ fontFamily: 'Poppins, sans-serif' }}
             >
               Find Sales Near Me 🗺️
             </motion.a>
             <motion.a
               href="/add-yard-sale"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Post Your Sale Free 🌱
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}