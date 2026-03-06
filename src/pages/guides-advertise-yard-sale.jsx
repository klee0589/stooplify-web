import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuideAdvertiseYardSale() {
  useEffect(() => {
    document.title = 'How to Advertise a Yard Sale, Garage Sale & Stoop Sale in NYC | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn how to advertise your yard sale, garage sale, or stoop sale in NYC for free. Reach local buyers in Brooklyn, Queens, and Manhattan without printed signs or Facebook groups. Best ways to promote your street sale.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'advertise yard sale, advertise garage sale, promote stoop sale, advertise street sale, NYC yard sale advertising, Brooklyn garage sale tips, Queens stoop sale, Manhattan street sale, free yard sale advertising, how to advertise garage sale';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Advertise a Yard Sale, Garage Sale & Stoop Sale in NYC (Free & Easy)",
      "description": "Learn how to advertise your yard sale, garage sale, stoop sale, or street sale in New York City for free and reach local buyers effectively",
      "image": "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14",
      "keywords": ["yard sale advertising", "garage sale promotion", "stoop sale NYC", "street sale marketing", "how to advertise garage sale", "yard sale tips"]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="advertise" 
          image="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}