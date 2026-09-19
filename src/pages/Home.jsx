import React, { useState, useEffect, Suspense } from 'react';
import StooplifyChat from '../components/StooplifyChat';
import { useTranslation } from '../components/translations';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEO from '../components/SEO';
import HeroSection from '../components/home/HeroSection';
import WeekendSales from '../components/home/WeekendSales';
import DiscoverBand from '../components/home/DiscoverBand';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedSales from '../components/home/FeaturedSales';
import CTASection from '../components/home/CTASection';
import FreeNearYou from '../components/home/FreeNearYou';
import TrendingNeighborhoods from '../components/home/TrendingNeighborhoods';
import SocialSection from '../components/home/SocialSection';
import GuidesGrid from '../components/home/GuidesGrid';
import SeoTextBlock from '../components/home/SeoTextBlock';
import HomeFaq from '../components/home/HomeFaq';
import FinalCta from '../components/home/FinalCta';
import { deferAnalyticsLoad } from '../components/AnalyticsLoader';

export default function Home() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useTranslation(language);

  useEffect(() => {
    deferAnalyticsLoad();
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => base44.analytics.track({ eventName: 'home_page_viewed' }));
    } else {
      setTimeout(() => base44.analytics.track({ eventName: 'home_page_viewed' }), 0);
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

      const sellerPostCount = {};
      allSales.forEach(s => {
        if (s.created_by) sellerPostCount[s.created_by] = (sellerPostCount[s.created_by] || 0) + 1;
      });

      const scored = upcomingSales.map(sale => {
        const photoCount = (sale.photos || []).length;
        const views = sale.views || 0;
        const postHistory = sellerPostCount[sale.created_by] || 1;
        const photoScore = photoCount === 0 ? 0 : photoCount === 1 ? 5 : photoCount === 2 ? 12 : 20;
        const viewScore = Math.min(views / 2, 30);
        const historyScore = Math.min((postHistory - 1) * 5, 15);
        return { ...sale, _score: photoScore + viewScore + historyScore };
      });

      const qualified = scored.filter(s => (s.photos || []).length >= 1 && s._score >= 5);
      qualified.sort((a, b) => b._score - a._score);
      return qualified.slice(0, 6);
    },
    staleTime: 180000
  });

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
    <div className="min-h-screen bg-background">
      <SEO
        title="Stooplify - Find Stoop Sales & Yard Sales in NYC and New Jersey"
        description="Discover stoop sales, yard sales, and garage sales across Brooklyn, Queens, Manhattan, the Bronx, and New Jersey. Browse live listings, find free items, and score unbeatable deals near you."
        keywords="brooklyn stoop sale, stoop sales NYC, yard sales near me, Queens yard sales, Manhattan garage sales, Bronx yard sales, New Jersey yard sales, Jersey City stoop sale, Hoboken yard sale, NYC stoop sale, garage sales NJ"
        structuredData={structuredData}
      />

      <HeroSection />
      <WeekendSales />
      <DiscoverBand />
      <TrendingNeighborhoods />
      <FreeNearYou />
      <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
        <FeaturedSales sales={sales} />
      </Suspense>
      <HowItWorks />
      <CTASection />
      <GuidesGrid />
      <SeoTextBlock />
      <HomeFaq />
      <SocialSection />
      <StooplifyChat />
      <FinalCta />
    </div>
  );
}