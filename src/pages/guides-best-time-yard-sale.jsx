import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuideBestTimeYardSale() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="Best Days & Times for Yard Sales in NYC | Garage Sale Timing Guide | Stooplify"
        description="When should you host a yard sale in NYC? Learn the best days, times, and seasons for maximum turnout in Brooklyn, Queens, and Manhattan."
        keywords="best time for yard sale, best day for garage sale, when to host stoop sale, yard sale timing NYC, best season for yard sale"
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