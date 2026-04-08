import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuideAdvertiseYardSale() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="How to Advertise a Yard Sale in NYC | Free Promotion Tips | Stooplify"
        description="Learn how to advertise your yard sale, garage sale, or stoop sale in NYC for free. Reach local buyers in Brooklyn, Queens, and Manhattan without printed signs."
        keywords="advertise yard sale, advertise garage sale, promote stoop sale, NYC yard sale advertising, Brooklyn garage sale tips, free yard sale advertising"
        url="https://stooplify.com/guides-advertise-yard-sale"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How to Advertise a Yard Sale, Garage Sale & Stoop Sale in NYC (Free & Easy)",
          "description": "Learn how to advertise your yard sale, garage sale, stoop sale, or street sale in New York City for free",
          "author": {"@type": "Organization", "name": "Stooplify"},
          "publisher": {"@type": "Organization", "name": "Stooplify"},
          "datePublished": "2026-01-14",
          "url": "https://stooplify.com/guides-advertise-yard-sale"
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="advertise" 
          image="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}