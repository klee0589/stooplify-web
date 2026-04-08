import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuideFindYardSales() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="Find Yard Sales, Garage Sales & Stoop Sales Near Me This Weekend | Stooplify"
        description="Find yard sales, garage sales, and stoop sales near you in NYC this weekend. Browse local yard sales in Brooklyn, Queens, Manhattan on a map."
        keywords="find yard sales near me, garage sales near me, stoop sales NYC, yard sales this weekend, garage sales today, find garage sales, Brooklyn stoop sales"
        url="https://stooplify.com/guides-find-yard-sales"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Where to Find Yard Sales, Garage Sales & Stoop Sales Near You This Weekend",
          "description": "How to discover local yard sales, garage sales, stoop sales happening near you",
          "author": {"@type": "Organization", "name": "Stooplify"},
          "publisher": {"@type": "Organization", "name": "Stooplify"},
          "datePublished": "2026-01-14",
          "url": "https://stooplify.com/guides-find-yard-sales"
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="find" 
          image="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}