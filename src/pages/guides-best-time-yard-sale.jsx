import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuideBestTimeYardSale() {
  useEffect(() => {
    document.title = 'Best Days & Times for Yard Sales, Garage Sales & Stoop Sales in NYC | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'When should you host a yard sale, garage sale, or stoop sale in New York City? Learn the best days, times, and seasons for maximum turnout in Brooklyn, Queens, and Manhattan. Perfect timing for street sales and estate sales.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'best time for yard sale, best day for garage sale, when to host stoop sale, street sale timing NYC, yard sale hours, garage sale weekend, best season for yard sale, Brooklyn garage sale timing, Queens stoop sale schedule';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Days & Times to Host a Yard Sale, Garage Sale & Stoop Sale",
      "description": "Timing tips for hosting successful yard sales, garage sales, stoop sales, and street sales in NYC",
      "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14",
      "keywords": ["yard sale timing", "garage sale hours", "stoop sale schedule", "street sale best time", "when to host garage sale"]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="timing" 
          image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}