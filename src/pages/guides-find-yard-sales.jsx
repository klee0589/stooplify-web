import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuideFindYardSales() {
  useEffect(() => {
    document.title = 'Find Yard Sales, Garage Sales & Stoop Sales Near Me This Weekend | Stooplify NYC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find yard sales, garage sales, and stoop sales near you in NYC this weekend. Browse local yard sales, garage sales, street sales in Brooklyn, Queens, Manhattan on a map. Discover estate sales, stoop sales, and garage sales near me today.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'find yard sales near me, garage sales near me, stoop sales NYC, street sales near me, yard sales this weekend, garage sales today, estate sales near me, find garage sales, yard sales in my area, Brooklyn stoop sales';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Where to Find Yard Sales, Garage Sales & Stoop Sales Near You This Weekend",
      "description": "How to discover local yard sales, garage sales, stoop sales, and street sales happening near you",
      "image": "https://images.unsplash.com/photo-1524661135-423995f22d0b",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14",
      "keywords": ["find yard sales", "garage sales near me", "stoop sales", "street sales", "yard sales this weekend", "local garage sales"]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="find" 
          image="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}