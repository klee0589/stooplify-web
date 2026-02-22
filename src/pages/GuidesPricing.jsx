import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesPricing() {
  useEffect(() => {
    document.title = 'How to Price Items for Yard Sales, Garage Sales & Stoop Sales | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn how to price yard sale, garage sale, and stoop sale items to sell fast. Simple pricing rules for clothes, furniture, books, and more at NYC yard sales, garage sales, and street sales.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'yard sale pricing, garage sale prices, stoop sale pricing guide, how to price yard sale items, garage sale pricing tips, street sale prices, yard sale pricing strategy, pricing garage sale items, how much to charge at yard sale';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Price Items for a Yard Sale, Garage Sale & Stoop Sale",
      "description": "Simple pricing rules for yard sale, garage sale, and stoop sale items",
      "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14",
      "keywords": ["yard sale pricing", "garage sale prices", "stoop sale pricing", "how to price garage sale items", "yard sale pricing guide"]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="pricing" 
          image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}