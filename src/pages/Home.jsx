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
  
  // Featured sales - defer with suspense boundary
  const { data: sales = [] } = useQuery({
    queryKey: ['featuredSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 50);
      const now = new Date();
      return allSales.filter(sale => {
        if (!sale.date) return false;
        const [y, m, d] = sale.date.split('-').map(Number);
        const saleDate = new Date(y, m - 1, d);
        return saleDate >= now;
      }).slice(0, 6);
    },
    staleTime: 180000 // Cache for 3 minutes
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
        title="Stooplify - Find Brooklyn Stoop Sales, Yard Sales, Garage Sales & Estate Sales Near You"
        description="Discover amazing deals at Brooklyn stoop sales, yard sales, garage sales, and estate sales in your neighborhood. Browse thousands of local sales, save favorites, and find hidden treasures at unbeatable prices."
        keywords="brooklyn stoop sale, stoop sales brooklyn, yard sales near me, garage sales, estate sales, local sales, secondhand shopping, thrift sales, neighborhood sales, treasure hunting, bargain shopping, NYC yard sales, NYC stoop sale"
        structuredData={structuredData}
      />

      {/* HERO */}
      <HeroSection />

      {/* FIND SALES — Map CTA front and center */}
      <section className="py-14 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">🌱 Spring Sales Are Live</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>What's Happening Near You</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Browse the live map and plan your weekend route before you leave home.</p>
          </div>

          {/* Browse shortcuts */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center mb-8">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">Filter by:</span>
            <DiscoveryDropdowns />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/yard-sales"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#14B8FF] text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#0da3e6] transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🗺️ Browse the Live Map
            </Link>
            <Link
              to="/free-items"
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

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SPRING SELLING CTA */}
      <CTASection />

      {/* GUIDES */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">📚 Spring Seller Tips</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Yard Sale Guides</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Everything you need to host or find an amazing sale this spring</p>
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
            Brooklyn Stoop Sales &amp; NYC Yard Sales
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 space-y-4 text-center">
            <p>
              Looking for a <strong>Brooklyn stoop sale</strong> this weekend? Stooplify is the easiest way to find stoop sales, yard sales, and garage sales across Brooklyn, Queens, the Bronx, Manhattan, and all of NYC.
            </p>
            <p>
              Spring is peak season — neighbors across the city are clearing out and setting up on their stoops every weekend. Browse live listings in Williamsburg, Park Slope, Bushwick, Crown Heights, Bed-Stuy, and beyond.
            </p>
            <p>
              Or <a href="/add-yard-sale" className="text-[#14B8FF] hover:underline">list your own stoop sale for free</a> and reach buyers already searching in your neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-500 to-[#14B8FF] py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🌸</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Spring Sales Are Happening Now
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Thousands of neighbors are clearing out this season. Don't miss the best deals in your neighborhood.
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