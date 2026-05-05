import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuideBestTimeYardSale() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="Best Time to Have a Yard Sale — Day, Hour & Season | Stooplify"
        description="Saturday 8–11am in spring is the sweet spot — here's why. Best days, times, and months to maximize foot traffic at your yard sale or stoop sale."
        keywords="best time to have a yard sale, best time for yard sale, best day for garage sale, when to host stoop sale, best time yard sale saturday"
        url="https://stooplify.com/guides-best-time-yard-sale"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Best Days & Times to Host a Yard Sale, Garage Sale & Stoop Sale",
          "description": "Timing tips for hosting successful yard sales, garage sales, stoop sales in NYC",
          "author": {"@type": "Organization", "name": "Stooplify"},
          "publisher": {"@type": "Organization", "name": "Stooplify"},
          "datePublished": "2026-01-14",
          "url": "https://stooplify.com/guides-best-time-yard-sale"
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="timing" 
          image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}